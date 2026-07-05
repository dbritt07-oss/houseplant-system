/* ============================================================
   db.js  —  true local-first persistence (IndexedDB)
   The device is the source of truth. Nothing leaves the phone
   except the export file the owner saves to their own Drive.
   Photos live INSIDE the plant records (compressed dataURLs),
   so export bundles them automatically.
   ============================================================ */
import { buildSeed, SEED_ORDER } from "./seed.js";

const DB_NAME = "houseplant";
const DB_VER = 1;
let _db = null;

function open() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VER);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains("plants"))   db.createObjectStore("plants", { keyPath: "id" });
      if (!db.objectStoreNames.contains("settings"))  db.createObjectStore("settings", { keyPath: "k" });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
function tx(store, mode) { return _db.transaction(store, mode).objectStore(store); }
function done(t) { return new Promise((res, rej) => { t.transaction.oncomplete = () => res(); t.transaction.onerror = () => rej(t.transaction.error); }); }
function getAll(store) { return new Promise((res, rej) => { const r = tx(store, "readonly").getAll(); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); }); }
function getOne(store, key) { return new Promise((res, rej) => { const r = tx(store, "readonly").get(key); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); }); }

export const DB = {
  /* Open, seed on first run, and return { plants, order, settings }. */
  async init() {
    _db = await open();
    let rows = await getAll("plants");
    if (!rows.length) {
      const seed = buildSeed();
      const st = tx("plants", "readwrite");
      SEED_ORDER.forEach(id => st.put(Object.assign({ id }, seed[id])));
      await done(st);
      await this.setSetting("order", SEED_ORDER.slice());
      await this.setSetting("seededAt", new Date().toISOString());
      rows = await getAll("plants");
    }
    const order = (await this.getSetting("order")) || SEED_ORDER.slice();
    const plants = {};
    rows.forEach(r => { plants[r.id] = r; });
    // Guarantee ordered ids that actually exist
    const finalOrder = order.filter(id => plants[id]).concat(Object.keys(plants).filter(id => !order.includes(id)));
    const settings = {};
    (await getAll("settings")).forEach(s => { settings[s.k] = s.v; });
    return { plants, order: finalOrder, settings };
  },

  async savePlant(record) {
    const st = tx("plants", "readwrite");
    st.put(record);
    return done(st);
  },

  async getSetting(k) { const r = await getOne("settings", k); return r ? r.v : undefined; },
  async setSetting(k, v) { const st = tx("settings", "readwrite"); st.put({ k, v }); return done(st); },

  /* ---- backup / portability ---- */
  async exportAll() {
    const plants = await getAll("plants");
    const settingsRows = await getAll("settings");
    const settings = {};
    settingsRows.forEach(s => { settings[s.k] = s.v; });
    return {
      app: "Plant Daddy HQ",
      format: "hps-backup",
      version: 1,
      exportedAt: new Date().toISOString(),
      settings,
      plants
    };
  },

  /* Restore from an export object. Replaces all plant records + settings. */
  async importAll(obj) {
    if (!obj || obj.format !== "hps-backup" || !Array.isArray(obj.plants)) {
      throw new Error("Not a Plant Daddy HQ backup file.");
    }
    // wipe plants
    const clr = tx("plants", "readwrite"); clr.clear(); await done(clr);
    const st = tx("plants", "readwrite");
    obj.plants.forEach(p => st.put(p));
    await done(st);
    if (obj.settings) {
      const ss = tx("settings", "readwrite");
      Object.entries(obj.settings).forEach(([k, v]) => ss.put({ k, v }));
      await done(ss);
    }
    return true;
  }
};

/* Compress a File/Blob from the camera into a small JPEG dataURL for storage + export.
   Keeps the backup portable and the DB light. Max edge ~1280px, quality 0.82. */
export function compressImage(file, maxEdge = 1280, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (Math.max(width, height) > maxEdge) {
        const s = maxEdge / Math.max(width, height);
        width = Math.round(width * s); height = Math.round(height * s);
      }
      const cv = document.createElement("canvas");
      cv.width = width; cv.height = height;
      cv.getContext("2d").drawImage(img, 0, 0, width, height);
      resolve(cv.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Could not read that image.")); };
    img.src = url;
  });
}
