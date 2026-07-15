/* ============================================================
   drive.js — automatic backup to the owner's OWN Google Drive.

   Client-side Google Identity Services (GIS) token flow, proven
   end-to-end from an installed iOS PWA in the T0.4 spike. Writes a
   single JSON file to the Drive `appDataFolder` (private, app-managed).

   Security / privacy:
   - NO secret in the client. The OAuth Client ID is PUBLIC.
   - The access token lives in memory only; it is never persisted.
   - Backup CONFIG/STATUS is device-local (localStorage) and never
     travels inside the backup payload, so the frozen export schema
     (docs/DATA-SCHEMA.md) is unchanged.
   - Plant data goes only to the user's Drive; nothing to our servers
     or the repo.
   ============================================================ */
import { DB, validateBackup } from "./db.js";

const SCOPE = "https://www.googleapis.com/auth/drive.appdata";
const FILENAME = "plant-daddy-hq-backup.json";

/* Uploads use `uploadType=resumable`, NOT `multipart` — multipart is capped at 5 MB and
   our backup embeds photos as base64, so a photo-heavy collection would silently stop
   backing up. Resumable has no practical size ceiling. (T4.4 — closes Risk #1 in
   docs/BACKUP-VERIFICATION.md.) */

/* Optional: hard-code the PUBLIC OAuth Client ID here once you have it.
   If left blank, the owner pastes it once in Settings (stored device-local). */
const BAKED_CLIENT_ID = "";

const LS = {
  cid:   "pdhq_drive_cid",        // the public Client ID (device-local)
  conn:  "pdhq_drive_connected",  // "1" once connected at least once
  last:  "pdhq_drive_last",       // ISO time of last successful backup
  state: "pdhq_drive_state",      // "ok" | "error:<message>"
  dirty: "pdhq_drive_dirty"       // "1" if local data changed since last successful backup (survives reload)
};

let _token = null;         // in-memory access token (never persisted)
let _tokenClient = null;   // GIS token client (built lazily)

/* ---------- config / status (device-local) ---------- */
function clientId() { return (BAKED_CLIENT_ID || localStorage.getItem(LS.cid) || "").trim(); }
export function hasClientId() { return !!clientId(); }
export function storedClientId() { return localStorage.getItem(LS.cid) || ""; }
export function setClientId(id) { localStorage.setItem(LS.cid, (id || "").trim()); _tokenClient = null; _token = null; }
export function isConnected() { return localStorage.getItem(LS.conn) === "1"; }
export function lastBackup() { return localStorage.getItem(LS.last) || null; }
export function lastState() { return localStorage.getItem(LS.state) || null; }
export function markDirty() { localStorage.setItem(LS.dirty, "1"); }
export function isDirty() { return localStorage.getItem(LS.dirty) === "1"; }
function markOk() { localStorage.setItem(LS.conn, "1"); localStorage.setItem(LS.last, new Date().toISOString()); localStorage.setItem(LS.state, "ok"); localStorage.removeItem(LS.dirty); }
function markErr(msg) { localStorage.setItem(LS.state, "error:" + (msg || "unknown")); }

/* ---------- GIS load + token ---------- */
function loadGis() {
  return new Promise((resolve, reject) => {
    if (window.google && google.accounts && google.accounts.oauth2) return resolve();
    let tries = 0;
    const iv = setInterval(() => {
      if (window.google && google.accounts && google.accounts.oauth2) { clearInterval(iv); resolve(); }
      else if (++tries > 60) { clearInterval(iv); reject(new Error("Google sign-in didn’t load. Check your connection and try again.")); }
    }, 100);
  });
}
function ensureTokenClient() {
  const cid = clientId();
  if (!cid) throw new Error("Add your Google Client ID first.");
  if (!_tokenClient) {
    _tokenClient = google.accounts.oauth2.initTokenClient({ client_id: cid, scope: SCOPE, callback: () => {} });
  }
  return _tokenClient;
}
/* Request an access token. prompt:"" shows consent on first grant, then stays
   silent while the Google session is active (per the T0.4 carry-forward note). */
function requestToken(prompt = "") {
  return new Promise((resolve, reject) => {
    let tc;
    try { tc = ensureTokenClient(); } catch (e) { return reject(e); }
    tc.callback = (resp) => {
      if (resp && resp.error) return reject(new Error(resp.error_description || resp.error));
      _token = resp.access_token; resolve(_token);
    };
    tc.error_callback = (err) => reject(new Error((err && err.message) || "Google sign-in was cancelled or blocked."));
    try { tc.requestAccessToken({ prompt }); } catch (e) { reject(e); }
  });
}
function gisReady() { return !!(window.google && google.accounts && google.accounts.oauth2); }
async function ensureToken(silent) {
  if (_token) return _token;
  // Only await if the script genuinely isn't up yet — awaiting when it IS ready would
  // needlessly push the popup out of the user-gesture chain (see backupNow).
  if (!gisReady()) await loadGis();
  // Background (silent) runs use prompt:"none" so they never surface a popup;
  // interactive runs use "" (consent on first grant, silent afterward).
  return requestToken(silent ? "none" : "");
}
function authFetch(url, opts = {}) {
  return fetch(url, Object.assign({}, opts, { headers: Object.assign({}, opts.headers || {}, { Authorization: "Bearer " + _token }) }));
}

/* ---------- Drive appDataFolder helpers ---------- */
async function findFileId() {
  const q = encodeURIComponent("name='" + FILENAME + "'");
  const r = await authFetch("https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&fields=files(id,name,modifiedTime)&q=" + q);
  const j = await r.json();
  if (!r.ok) throw new Error("Drive list failed: " + (j.error && j.error.message || r.status));
  return (j.files && j.files[0]) ? j.files[0].id : null;
}
async function errMessage(res, fallback) {
  try { const j = await res.json(); return (j.error && j.error.message) || fallback; }
  catch (e) { return fallback; }
}
/* Two-step resumable upload:
   1) open a session (metadata only) → Drive returns a session URI in the Location header
   2) PUT the whole body to that URI
   Sending the payload in one PUT keeps this simple; if it fails we retry the whole
   backup on the next change (the dirty flag persists), so nothing is lost. */
async function uploadJson(text) {
  const existing = await findFileId();
  const bytes = new TextEncoder().encode(text);          // byte length, not char length
  const initUrl = existing
    ? `https://www.googleapis.com/upload/drive/v3/files/${existing}?uploadType=resumable`
    : `https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable`;
  const meta = existing ? {} : { name: FILENAME, parents: ["appDataFolder"] };

  const init = await authFetch(initUrl, {
    method: existing ? "PATCH" : "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      "X-Upload-Content-Type": "application/json",
      "X-Upload-Content-Length": String(bytes.byteLength)
    },
    body: JSON.stringify(meta)
  });
  if (!init.ok) throw new Error("Could not start the upload: " + await errMessage(init, "HTTP " + init.status));
  const session = init.headers.get("Location") || init.headers.get("location");
  if (!session) throw new Error("Drive didn’t return an upload session. Try again.");

  // Content-Length is set by the browser; we must not set it ourselves.
  const put = await authFetch(session, { method: "PUT", headers: { "Content-Type": "application/json" }, body: bytes });
  if (!put.ok) throw new Error("Upload failed: " + await errMessage(put, "HTTP " + put.status));
  const j = await put.json();
  return { id: j.id, updated: !!existing, bytes: bytes.byteLength };
}

/* ---------- public API ---------- */
export async function connect() {
  if (!gisReady()) await loadGis();   // same gesture-chain rule as ensureToken()
  await requestToken("");             // shows the Google consent screen on first grant
  localStorage.setItem(LS.conn, "1");
  return true;
}
export function disconnect() {
  try { if (_token && window.google && google.accounts && google.accounts.oauth2) google.accounts.oauth2.revoke(_token, () => {}); } catch (e) {}
  _token = null;
  localStorage.removeItem(LS.conn);
  localStorage.removeItem(LS.last);
  localStorage.removeItem(LS.state);
  // Client ID is kept so reconnecting is one tap; the app is now fully local again.
}

/* Serialize the frozen export shape and write it to Drive. One silent token
   retry on an auth error. `silent` avoids surfacing a popup for background runs. */
export async function backupNow({ silent = false } = {}) {
  // ORDER MATTERS — DO NOT MOVE ensureToken() BELOW AN await.
  // Safari only opens the Google popup from inside the user-gesture chain. Any real
  // async work first (e.g. reading IndexedDB) breaks that chain and the popup is
  // blocked ("failed to open popup"). So: acquire the token FIRST, while the tap is
  // still live, then read + validate. Validation still runs before uploadJson(), so a
  // malformed payload can never reach Drive — we only gave up failing-fast on auth.
  await ensureToken(silent);
  const data = await DB.exportAll();
  const stats = validateBackup(data);
  // Integrity guard: an automatic run must NEVER overwrite a good Drive backup with an
  // empty collection (e.g. a failed DB open). An explicit "Back up now" may still do it.
  if (stats.plants === 0 && silent) {
    markErr("Collection is empty — automatic backup skipped to protect your Drive backup.");
    return { skipped: true, reason: "empty" };
  }
  const text = JSON.stringify(data);
  try {
    const res = await uploadJson(text);
    markOk();
    return res;
  } catch (e) {
    if (/\b(401|403|invalid|expired|auth)\b/i.test(e.message)) {
      try { _token = null; await requestToken(silent ? "none" : ""); const res = await uploadJson(text); markOk(); return res; }
      catch (e2) { markErr(e2.message); throw e2; }
    }
    markErr(e.message);
    throw e;
  }
}

/* Download the backup and hand the parsed object back. DB.importAll (which the
   caller invokes) validates the `hps-backup` envelope and replaces local data. */
export async function fetchBackup() {
  await ensureToken(false);
  const id = await findFileId();
  if (!id) throw new Error("No backup found in your Drive yet.");
  const r = await authFetch(`https://www.googleapis.com/drive/v3/files/${id}?alt=media`);
  const txt = await r.text();
  if (!r.ok) throw new Error("Drive download failed: " + r.status);
  let obj;
  try { obj = JSON.parse(txt); } catch (e) { throw new Error("The Drive backup file is corrupted and can’t be read. Your device data was not touched."); }
  validateBackup(obj);   // fail fast on a corrupt/foreign/newer file — before anything local changes
  return obj;
}
