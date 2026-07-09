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

/* Google Drive's `uploadType=multipart` is capped at 5 MB. Our backup embeds photos as
   base64, so a photo-heavy collection will cross it. We refuse loudly rather than let
   Drive fail opaquely. Lifting this needs `uploadType=resumable` — see
   docs/BACKUP-VERIFICATION.md → Remaining Data-Loss Risks. */
const MULTIPART_LIMIT = 5 * 1024 * 1024;

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
async function ensureToken(silent) {
  if (_token) return _token;
  await loadGis();
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
async function uploadJson(text) {
  const existing = await findFileId();
  const meta = { name: FILENAME, parents: ["appDataFolder"] };
  const boundary = "pdhq" + Date.now();
  const body =
    `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n` +
    JSON.stringify(existing ? {} : meta) +
    `\r\n--${boundary}\r\nContent-Type: application/json\r\n\r\n` +
    text +
    `\r\n--${boundary}--`;
  const url = existing
    ? `https://www.googleapis.com/upload/drive/v3/files/${existing}?uploadType=multipart`
    : `https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart`;
  const r = await authFetch(url, { method: existing ? "PATCH" : "POST", headers: { "Content-Type": `multipart/related; boundary=${boundary}` }, body });
  const j = await r.json();
  if (!r.ok) throw new Error(j.error && j.error.message || ("upload failed " + r.status));
  return { id: j.id, updated: !!existing };
}

/* ---------- public API ---------- */
export async function connect() {
  await loadGis();
  await requestToken("");     // shows the Google consent screen on first grant
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
  // Build + self-check the payload BEFORE authenticating, so a malformed export can
  // never reach Drive. (Cheap, offline, and no token needed to fail fast.)
  const data = await DB.exportAll();
  const stats = validateBackup(data);
  // Integrity guard: an automatic run must NEVER overwrite a good Drive backup with an
  // empty collection (e.g. a failed DB open). An explicit "Back up now" may still do it.
  if (stats.plants === 0 && silent) {
    markErr("Collection is empty — automatic backup skipped to protect your Drive backup.");
    return { skipped: true, reason: "empty" };
  }
  const text = JSON.stringify(data);
  if (text.length > MULTIPART_LIMIT) {
    const mb = (text.length / 1048576).toFixed(1);
    markErr(`Backup is ${mb} MB — past the 5 MB upload limit (mostly photos). Export a file for now.`);
    throw new Error(`Your backup has grown to ${mb} MB, past the 5 MB limit of the current upload method (photos take the space). Your data is safe on this device — use “Export a backup file” until this is lifted.`);
  }
  await ensureToken(silent);
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
