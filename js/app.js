/* ============================================================
   app.js  —  the controller. Merges the finalized 24-plant page
   under the sketchbook shell, wires the bench-mode repot run,
   and adds the app-only layer: camera + photo timeline, local
   reminders, offline persistence, a supplies view, and backup.
   ============================================================ */
import * as C from "./care.js";
import { ART } from "./art.js";
import { DB, compressImage } from "./db.js";
import { ARCHETYPES, newPlant } from "./seed.js";

/* ---------- state ---------- */
let ST = {
  tab: "today", plants: {}, order: [], units: "metric",
  q: "", filter: "all", groupByRoom: false,
  view: null,          // null | "detail" | "repot" | "run" | "supplies" | "settings" | "addmenu" | "addplant"
  sel: null,           // selected plant id
  repotStep: 0, repotChecks: [], root: "", note: "", potUsed: "Medium",
  repotNewPot: false, repotPot: { top: 18, bot: 15, ph: 16 },
  calcBucket: "aroid", calcSize: "Medium",
  addDraft: null,      // { photo, name, latin, type, room, tox } while adding a plant
  notify: false
};
const P = () => ST.plants[ST.sel];
const app = () => document.getElementById("app");
const ovRoot = () => document.getElementById("overlay-root");

/* ---------- icons ---------- */
const ICON = {
  today:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 5h16v15H4zM4 9h16M8 3v4M16 3v4" stroke-linecap="round"/></svg>',
  plants:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 21V10M12 12c0-4 3-6 7-6 0 4-3 6-7 6Z M12 14c0-3-3-5-7-5 0 3 3 5 7 5Z" stroke-linejoin="round"/></svg>',
  soil:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 9h14l-1.4 9.2a2 2 0 0 1-2 1.8H8.4a2 2 0 0 1-2-1.8L5 9Z" stroke-linejoin="round"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/></svg>',
  build:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 20V8l8-4 8 4v12" stroke-linejoin="round"/><path d="M9 20v-6h6v6"/></svg>',
  bug:'<svg viewBox="0 0 24 24" fill="none" stroke="#5f7a4c" stroke-width="1.6"><circle cx="12" cy="13" r="5"/><path d="M12 8V5M8.5 9 6.5 7M15.5 9l2-2M7 13H4M20 13h-3M8.5 17l-2 2M15.5 17l2 2" stroke-linecap="round"/></svg>',
  check:'<svg viewBox="0 0 24 24" fill="none" stroke="#f4ecd6" stroke-width="3"><path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  gear:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1"/></svg>',
  camera:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 8h3l2-2h6l2 2h3v11H4z" stroke-linejoin="round"/><circle cx="12" cy="13" r="3.5"/></svg>'
};

/* ---------- helpers ---------- */
const today = () => new Date().toLocaleDateString(undefined, { month: "numeric", day: "numeric" });
function plantArt(p) { const fn = ART[p.art] || ART.pSnake; const g = C.clamp(p.hCm / p.matureCm, 0, 1), h = C.HVAL[p.hi]; return fn(g, h); }
function latestPhoto(p) { return (p.photos && p.photos.length) ? p.photos[p.photos.length - 1].dataUrl : null; }
function thumb(p) { const ph = latestPhoto(p); return ph ? `<img src="${ph}" alt="">` : plantArt(p); }
function pushLog(p, t, photoId) { p.log.push({ date: C.dstr(0), t, photoId: photoId || null }); }
function needMeasureCount() { return ST.order.filter(k => (ST.plants[k].todo || []).length).length; }
function esc(s) { return (s || "").replace(/[&<>"]/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;" }[c])); }
function save(p) { DB.savePlant(p); }
function roomOf(p) { return (p.room && p.room.trim()) ? p.room.trim() : "Unassigned"; }
function roomsList() {
  const seen = new Set();
  ST.order.forEach(k => seen.add(roomOf(ST.plants[k])));
  ["Living room","Bedroom","Kitchen","Office","Bathroom","Hallway","Patio / Outside"].forEach(r => seen.add(r));
  const arr = [...seen].filter(r => r !== "Unassigned").sort();
  arr.push("Unassigned");
  return arr;
}
function persistOrder() { DB.setSetting("order", ST.order.slice()); }
function toast(msg) {
  const r = document.getElementById("toast-root");
  r.innerHTML = `<div class="toast">${esc(msg)}</div>`;
  clearTimeout(r._t); r._t = setTimeout(() => { r.innerHTML = ""; }, 2600);
}

/* Due-state computation (drives in-app badges and notifications). */
function waterDue(p) { return (p.intvMan ? p.intv : C.suggestIntv(p)) - p.lastW <= 0; }
function feedDue(p) {
  if (!C.MEDIA[p.med].soil) return waterDue(p);      // soilless feeds at every watering
  if (!C.season()) return false;                      // dormant: hold
  return 14 - p.lastF <= 0;
}
function dueList() {
  const w = [], f = [];
  ST.order.forEach(k => { const p = ST.plants[k]; if (waterDue(p)) w.push(p); if (feedDue(p)) f.push(p); });
  return { w, f };
}

/* ================= TAB VIEWS ================= */
function renderToday() {
  const { w, f } = dueList();
  const needM = needMeasureCount();
  const attention = ST.order.map(k => ST.plants[k]).filter(p => p.hi <= 1 || (p.rootcond === "rot"));
  const dueCards = [...new Set([...w, ...f])];
  return `<div class="pad">
    <p class="eyebrow">reference · ritual · record</p>
    <h1 style="font-size:26px">${w.length + f.length === 0 ? "Nothing thirsty today." : "A few need you today."}</h1>
    <div class="stats">
      <div class="stat"><div class="n">24</div><div class="l">plants</div></div>
      <div class="stat"><div class="n" style="color:var(--rust)">${w.length}</div><div class="l">water due</div></div>
      <div class="stat"><div class="n" style="color:var(--warn)">${f.length}</div><div class="l">feed due</div></div>
    </div>
    <div class="cta" data-act="openrun">Start a repot run <span class="arw">&rarr;</span></div>
    <div class="banner" style="margin-top:14px" data-act="supplies"><div class="ic">${ICON.bug}</div><div><div class="bt">Supplies &amp; gnat war</div><div class="bs">Totals for fertilizer, mix, BTI and nematodes from your logs.</div></div></div>
    ${needM ? `<div class="banner" style="margin-top:10px"><div class="ic">✎</div><div><div class="bt">${needM} of 24 still need measurements</div><div class="bs">Open a plant and fill height, pot, medium, dates.</div></div></div>` : ""}
    <div class="section-h"><h2>Due now</h2></div>
    ${dueCards.length ? dueCards.map(p => queueCard(p, [waterDue(p) ? "water" : "", feedDue(p) ? "feed" : ""].filter(Boolean).join(" + ") + " due")).join("")
      : `<p class="hand" style="font-size:18px;color:var(--sage)">All watered and fed. Nice.</p>`}
    ${attention.length ? `<div class="section-h"><h2>Watching</h2></div>${attention.map(p => queueCard(p, p.rootcond === "rot" ? "Soft roots · protocol on" : C.HEALTH[p.hi].toLowerCase())).join("")}` : ""}
  </div>`;
}
function queueCard(p, sub) {
  return `<div class="qcard" data-act="open" data-id="${p.id}"><div class="qthumb">${thumb(p)}</div>
    <div class="qbody"><div class="qname">${esc(p.name)}</div><div class="qlatin">${esc(p.latin)}</div>
    <div class="qaction">${esc(sub)}</div></div>${p.tox ? '<span class="chip warn">toxic</span>' : '<span class="chip ok">pet-safe</span>'}</div>`;
}
function renderPlants() {
  const query = ST.q.toLowerCase();
  const filters = [["all","all"],["aroid","aroid"],["general","general"],["gritty","gritty"],["attention","needs you"],["measured","done"]];
  const list = ST.order.map(k => ST.plants[k]).filter(p => {
    const m = (p.name + " " + p.latin + " " + p.loc).toLowerCase().includes(query);
    let fl = true;
    if (ST.filter === "attention") fl = p.hi <= 1 || (p.todo || []).length;
    else if (ST.filter === "measured") fl = !(p.todo || []).length;
    else if (["aroid","general","gritty"].includes(ST.filter)) fl = p.med === ST.filter;
    return m && fl;
  });
  const cardHtml = p => {
    const idx = ST.order.indexOf(p.id) + 1;
    return `<div class="pcard" data-act="open" data-id="${p.id}">
      <div class="panel"><span class="dot" style="background:${p.hi<=0?'var(--bad)':p.hi===1?'var(--warn)':'var(--ok)'}"></span>${thumb(p)}<span class="pageno">${String(idx).padStart(2,"0")}</span></div>
      <div class="info"><div class="cn">${esc(p.name)}</div><div class="ln">${esc(p.latin)}</div><div class="loc">${esc(roomOf(p))}</div></div></div>`;
  };
  let body;
  if (ST.groupByRoom) {
    const byRoom = {};
    list.forEach(p => { const r = roomOf(p); (byRoom[r] = byRoom[r] || []).push(p); });
    const rooms = roomsList().filter(r => byRoom[r]);
    body = rooms.map(r => `<div class="roomhead"><span class="rl">${esc(r)}</span><span class="rc">${byRoom[r].length}</span><span class="line"></span></div>${byRoom[r].map(cardHtml).join("")}`).join("");
  } else {
    body = list.map(cardHtml).join("");
  }
  return `<div class="pad"><p class="eyebrow">the key</p><h1 style="font-size:24px">Every plant, drawn</h1>
    <p class="hand" style="font-size:16px;color:var(--muted);margin:4px 0 14px">Tap for its full page: vitals, pot math, watering, feeding, repot window, photos, timeline.</p>
    <input class="search" placeholder="Search name, species, or spot" value="${esc(ST.q)}" data-inp="search">
    <div class="filters"><button class="fbtn ${ST.groupByRoom?'on':''}" data-act="grouproom">▦ by room</button>${filters.map(fb => `<button class="fbtn ${ST.filter===fb[0]?'on':''}" data-act="filter" data-f="${fb[0]}">${fb[1]}</button>`).join("")}</div>
    <div class="grid">${body || '<p class="hand" style="font-size:18px">Nothing matches.</p>'}</div><div style="height:8px"></div></div>`;
}
function renderSoil() {
  const r = C.RECIPES[ST.calcBucket], total = { "Small":4,"Medium":8,"Large":16,"Extra large":32 }[ST.calcSize];
  const calcRows = r.parts.map(pt => `<div class="recipe"><span>${pt[0]}</span><span class="amt">${(pt[1]/100*total).toFixed(1)} cups · ${pt[1]}%</span></div>`).join("");
  const recipeCards = Object.entries(C.RECIPES).map(([k,v]) => `<div class="block"><h3><span class="k">${v.name}</span></h3>${v.parts.map(pt=>`<div class="recipe"><span>${pt[0]}</span><span class="amt">${pt[1]}%</span></div>`).join("")}${v.note?`<div class="tweak">${v.note}</div>`:""}</div>`).join("");
  return `<div class="pad" style="padding-bottom:0"><p class="eyebrow">no guessing</p><h1 style="font-size:24px">Soil &amp; protocol</h1>
    <p class="hand" style="font-size:16px;color:var(--muted);margin:4px 0 0">Buckets are the start. Each plant's page builds the exact mix from its real pot volume.</p></div>
    <div class="block"><h3><span class="k">Mix calculator</span></h3><div class="calc">
      <select data-inp="calcBucket">${Object.entries(C.RECIPES).map(([k,v])=>`<option value="${k}" ${ST.calcBucket===k?'selected':''}>${v.name}</option>`).join("")}</select>
      <select data-inp="calcSize">${["Small","Medium","Large","Extra large"].map(s=>`<option ${ST.calcSize===s?'selected':''}>${s}</option>`).join("")}</select></div>${calcRows}</div>
    ${recipeCards}
    <div class="block"><h3><span class="k">Gnat protocol · every repot</span></h3>${C.PROTOCOL.map((s,i)=>`<div class="recipe"><span>${i+1}. ${s.t}</span></div>`).join("")}<div class="tweak">Do all of it. One layer alone will not end it.</div></div>`;
}
function renderBuild() {
  const ROADMAP = [
    ["1","Reconcile","Fix the marginata name, add Rubber, Ginseng Ficus, second Corn.","Done. 24 locked"],
    ["2","Roll the 24","Finalized page across every plant, seeded from the Master Doc.","Done. In this app"],
    ["3","Build the app","Installable PWA: camera, photos, reminders, offline, backup.","Done. You're in it"],
    ["4","Walk the collection","Photo + variable fields, plant by plant, inside the app.","Your turn"],
    ["5","Design integration","Repeat-pot tiered staging into the Townhouse book. Add ZZ + Kentia.","Queued"]
  ];
  const ADDS = [["ZZ plant","Glossy, architectural, gnat-resistant in grit. Best MCM fit."],["Kentia palm","The forgiving palm. Majestic replacement."],["Olive tree","Organic modern. Bright window only."],["Ficus Audrey","Calmer statement tree. Japandi-friendly."]];
  return `<div class="pad"><p class="eyebrow">what this is</p><h1 style="font-size:26px">A sketchbook you repot alongside.</h1>
    <p class="lede" style="margin-top:12px">Three jobs in one app. <b>Reference</b>: what each plant needs. <b>Ritual</b>: bench mode walks the four-step gnat kill, hands dirty. <b>Record</b>: photos, field notes and logs stamp with the date and stay on your phone. Everything works offline. Your data backs up to a file you save to your own Drive.</p></div>
    <div class="block"><h3><span class="k">Roadmap</span></h3>${ROADMAP.map(p=>`<div class="phase"><div class="pn">${p[0]}</div><div><div class="pt">${p[1]}</div><div class="ps">${p[2]}</div><div class="pstat">${p[3]}</div></div></div>`).join("")}</div>
    <div class="block"><h3><span class="k">Reminders on this phone</span></h3>
      <p class="muted" style="font-size:13px;line-height:1.55">In-app due and overdue states always work. Real device notifications fire when the app is open, and in the background on Android/Chrome. <b style="color:var(--rust)">On iPhone, installed-PWA notifications are limited</b> and background scheduling isn't reliable, so treat the in-app Due-now list as the source of truth there. Manage it in Settings.</p></div>
    <div class="block"><h3><span class="k">Design layer · repeat the pot, vary the height</span></h3>
      <p class="muted" style="font-size:13px;margin-bottom:10px">Cohesion comes from repeated planters, not matched plants. Steer new buys toward dry-loving sculptural species.</p>
      ${ADDS.map(a=>`<div class="add"><div class="ab"></div><div><div class="at">${a[0]}</div><div class="as">${a[1]}</div></div></div>`).join("")}</div>`;
}

/* ================= SUPPLIES ================= */
function renderSupplies() {
  // Fertilizer usage from feed logs; repot consumables from repot logs; mix components across current pots.
  const fertUse = {}, mix = {};
  let repots = 0;
  ST.order.forEach(k => {
    const p = ST.plants[k];
    (p.log || []).forEach(e => {
      if (/^Fed /.test(e.t)) { const name = e.t.replace(/^Fed /, ""); fertUse[name] = (fertUse[name] || 0) + 1; }
      if (/^Repotted/i.test(e.t) || /Root check/i.test(e.t)) {} // handled by repotDate below
    });
    if (p.repotDate) repots++;
    // planning: mix components if you repotted this plant now
    const r = C.RECIPES[p.med]; if (r && C.MEDIA[p.med].soil) {
      const cups = C.lCup(C.potVolL(p));
      r.parts.forEach(pt => { mix[pt[0]] = (mix[pt[0]] || 0) + cups * pt[1] / 100; });
    }
  });
  const bti = repots, nema = repots;
  const fertRows = Object.keys(fertUse).length ? Object.entries(fertUse).map(([n,c]) => `<div class="recipe"><span>${esc(n)}</span><span class="amt">${c} feeding${c>1?'s':''} logged</span></div>`).join("") : `<div class="recipe"><span class="muted">No feedings logged yet</span></div>`;
  const mixRows = Object.entries(mix).sort((a,b)=>b[1]-a[1]).map(([n,c]) => `<div class="recipe"><span>${esc(n)}</span><span class="amt">${c.toFixed(1)} cups</span></div>`).join("");
  return `<div class="grab"></div><div class="close" data-act="back">×</div>
    <div class="pad"><p class="eyebrow">collection level</p><h1 style="font-size:23px">Supplies</h1>
    <p class="hand" style="font-size:16px;color:var(--muted);margin:4px 0 0">Totalled from your logs and current pots, so you restock before a repot run stalls.</p></div>
    <div class="block"><h3><span class="k">Gnat-war consumables</span></h3>
      <div class="recipe"><span>Mosquito Bits (BTI) doses used</span><span class="amt">${bti}</span></div>
      <div class="recipe"><span>NemaKnights nematode apps used</span><span class="amt">${nema}</span></div>
      <div class="tweak">One BTI dose and one nematode app per repot. ${repots===0?"Nothing repotted in-app yet.":`${repots} repot${repots>1?'s':''} logged.`} Keep both stocked before a run.</div></div>
    <div class="block"><h3><span class="k">Fertilizer used</span></h3>${fertRows}</div>
    <div class="block"><h3><span class="k">Mix components — full collection repot</span></h3>${mixRows}<div class="tweak">Cups needed if every soil plant were repotted at its current pot size. A stocking target, not a to-do.</div></div>
    <div style="height:10px"></div>`;
}

/* ================= SETTINGS / BACKUP ================= */
function renderSettings() {
  const perm = ("Notification" in window) ? Notification.permission : "unsupported";
  return `<div class="grab"></div><div class="close" data-act="back">×</div>
    <div class="pad"><p class="eyebrow">it's your data</p><h1 style="font-size:23px">Settings &amp; backup</h1></div>
    <div class="block"><h3><span class="k">Units</span></h3>
      <div class="seg">${[["metric","cm · L"],["imperial","in · gal"]].map(o=>`<button data-act="units" data-v="${o[0]}" class="${ST.units===o[0]?'on':''}">${o[1]}</button>`).join("")}</div>
      <div class="read" style="font-size:14px">Remembered across sessions and used everywhere.</div></div>
    <div class="block"><h3><span class="k">Backup — export &amp; import</span></h3>
      <p class="muted" style="font-size:13px;line-height:1.5">Your plants, logs and photos live only on this phone. Export bundles everything into one file to save on your Google Drive. Import restores it here or on another device.</p>
      <button class="btn primary" data-act="export" style="width:100%;margin:12px 0 8px">Export a backup file</button>
      <button class="btn ghost" data-act="import" style="width:100%;margin:0">Import a backup file</button></div>
    <div class="block"><h3><span class="k">Reminders</span></h3>
      <p class="muted" style="font-size:13px;line-height:1.5">Permission: <b>${perm}</b>. In-app Due-now always works. Device notifications fire when the app is open, and in the background on Android/Chrome. On iPhone they're limited.</p>
      <button class="btn ${perm==='granted'?'ghost':'primary'}" data-act="notifask" style="width:100%;margin:12px 0 8px">${perm==='granted'?'Test a reminder now':'Turn on device reminders'}</button></div>
    <div class="block"><h3><span class="k">Reset</span></h3>
      <p class="muted" style="font-size:13px;line-height:1.5">Re-seed the 24 from constants. Wipes your entered data on this device. Export first.</p>
      <button class="btn ghost" data-act="reseed" style="width:100%;margin:12px 0 0;color:var(--rust);border-color:#cf9d8b">Reset to a fresh sketchbook</button></div>
    <div style="height:10px"></div>`;
}

/* ================= PLANT PAGE (finalized, ported) ================= */
function renderDetail() {
  const p = P(); if (!p) return "";
  const idx = ST.order.indexOf(ST.sel);
  if (!p.intvMan) p.intv = C.suggestIntv(p);
  const sug = C.suggestIntv(p);
  const soilless = !C.MEDIA[p.med].soil;
  return `<div class="grab"></div><div class="close" data-act="back">×</div>
  <div class="navrow" style="margin-top:46px"><button class="navb" data-act="prev">‹</button><div class="navname">${esc(p.name)}<small>${idx+1} of 24</small></div><button class="navb" data-act="next">›</button></div>
  <div class="badges"><span class="badge">${esc(p.latin)}</span>${p.tox?`<span class="badge tox">Toxic to pets</span>`:`<span class="badge">Pet-safe</span>`}</div>
  ${(p.todo||[]).length?`<div class="todo"><div class="th">Still to finish</div>${p.todo.map((t,i)=>`<span class="titem" data-act="todone" data-i="${i}">${esc(t)}</span>`).join("")}</div>`:""}
  <div class="phero" id="stage"></div>
  <div class="cap" id="growcap"></div>

  <div class="pcardb"><h3><span class="ic"></span>Photos</h3>
    <div class="photos" id="photos"></div>
    <div class="fac">Camera shots attach to this plant and its timeline, and travel in your backup.</div>
  </div>

  <div class="pcardb"><h3><span class="ic"></span>Vitals</h3>
    <div class="row"><label>Height</label><input type="range" id="s_h" min="8" max="${p.matureCm}" value="${p.hCm}"><span class="val" id="v_h"></span></div>
    <div class="row"><label>Health</label>${seg("health",C.HEALTH.map((n,i)=>[i,n]),p.hi)}</div>
  </div>

  <div class="pcardb"><h3><span class="ic"></span>Place &amp; light</h3>
    <div class="read" style="margin:0 0 8px">${esc(p.loc)}${p.tox?". Toxic, keep out of reach if staged low near pets or kids.":". Pet-safe."}</div>
    <div class="row"><label>Room</label><input class="nfld" style="margin:0" id="roomi" list="roomlist" placeholder="e.g. Living room" value="${esc(roomOf(p)==='Unassigned'?'':p.room||'')}"></div>
    <datalist id="roomlist">${roomsList().map(r=>`<option value="${esc(r)}">`).join("")}</datalist>
    <div class="pick" style="margin-top:6px">${roomsList().slice(0,5).map(r=>`<span class="pchip ${roomOf(p)===r?'on':''}" data-room="${esc(r)}">${esc(r)}</span>`).join("")}</div>
    <div class="row" style="margin-top:8px"><label>Light</label>${seg("light",[["low","Low"],["med","Medium"],["bright","Bright"]],p.light)}</div>
    <div class="read" id="lightnote"></div>
  </div>

  <div class="pcardb"><h3><span class="ic"></span>Growing medium</h3>
    <div class="pick">${Object.entries(C.MEDIA).map(([k,m])=>`<span class="pchip ${k===p.med?'on':''}" data-med="${k}">${m.label}</span>`).join("")}</div>
    <div class="read" id="mednote"></div>
  </div>

  <div class="pcardb"><h3><span class="ic"></span>The pot</h3>
    <div class="pick" style="margin-bottom:8px">${Object.entries(C.MATS).map(([k,m])=>`<span class="pchip ${k===p.mat?'on':''}" data-mat="${k}">${m.label}</span>`).join("")}</div>
    <div class="between" style="margin-bottom:8px"><span style="font-size:12px;color:var(--muted)">Drainage holes</span>${seg("drain",[["y","Yes"],["n","No (cachepot)"]],p.drain?"y":"n","sm")}</div>
    <div class="potwrap"><div class="potdraw" id="potdraw"></div><div class="potnums" id="potnums"></div></div>
    <div class="row"><label>Top</label><input type="range" id="s_top" min="8" max="45" value="${p.top}"><span class="val" id="v_top"></span></div>
    <div class="row"><label>Base</label><input type="range" id="s_bot" min="6" max="40" value="${p.bot}"><span class="val" id="v_bot"></span></div>
    <div class="row"><label>Height</label><input type="range" id="s_ph" min="8" max="45" value="${p.ph}"><span class="val" id="v_ph"></span></div>
    <div class="read" id="matnote"></div>
    <div class="fac" id="potsize"></div>
  </div>

  <div class="pcardb"><h3><span class="ic"></span>Watering</h3>
    <div class="between"><div><div style="font-size:12px;color:var(--muted);margin-bottom:4px">Last watered</div><input type="date" class="datei" id="lastwd" value="${C.dstr(p.lastW)}"></div><button class="mini go" data-act="watered">Watered today</button></div>
    <div class="read" id="waternext" style="margin-top:10px"></div>
    <div class="row"><label>Schedule</label><input type="range" id="s_iv" min="2" max="30" value="${p.intv}"><span class="val" id="v_iv"></span></div>
    <div class="between" style="margin-top:-2px"><span class="fac" id="sugline"></span>${p.intvMan&&p.intv!==sug?`<span class="pchip sug" data-act="matchsug">use ${sug}d</span>`:''}</div>
    <div class="row" style="margin-top:6px"><label>Water</label>${seg("water",[["tap","Tap"],["filtered","Filtered"],["distilled","Distilled"]],p.water,"sm")}</div>
    <div class="read" id="wqnote"></div>
    <div class="fac" id="waterfac"></div>
  </div>

  <div class="pcardb"><h3><span class="ic"></span>Feeding log</h3>
    <div class="pick" style="margin-bottom:8px">${Object.entries(C.FERTS).map(([k,f])=>`<span class="pchip ${k===p.fert?'on':''}" data-fert="${k}">${f.label}</span>`).join("")}</div>
    <div class="between"><div><div style="font-size:12px;color:var(--muted);margin-bottom:4px">Last fed</div><input type="date" class="datei" id="lastfd" value="${C.dstr(p.lastF)}"></div><button class="mini go" data-act="fed">Fed today</button></div>
    <div class="read" id="feednote" style="margin-top:10px"></div>
  </div>

  <div class="pcardb"><h3><span class="ic"></span>When to check for repotting</h3>
    <div class="row"><label>Root-snug</label><input type="range" id="s_snug" min="0" max="100" value="${p.snug}"><span class="val" id="v_snug"></span></div>
    <div class="read" id="repotwin"></div><div class="pnote" id="repotnote"></div><div class="fac" id="repotfac"></div>
    <div style="margin-top:11px;font-size:12px;color:var(--muted)">Root check at last repot (remembered)</div>
    <div class="pick" style="margin-top:6px">${Object.entries(C.ROOTS).map(([k,r])=>`<span class="pchip ${k===p.rootcond?'on':''}" data-root="${k}">${r.label}</span>`).join("")}</div>
    <div class="read" id="rootnote"></div>
    <button class="btn primary" data-act="repot" data-id="${p.id}" style="width:100%;margin:14px 0 0">Run the repot protocol &nbsp;&rarr;</button>
  </div>

  <div class="pcardb"><h3><span class="ic"></span>Gnat watch</h3>
    <div class="step"><button data-act="tminus">–</button><input type="number" id="trapc" class="cnum" min="0" value="${p.trapN}"><button data-act="tplus">+</button><span style="font-size:12px;color:var(--muted)">traps this week</span></div>
    <div class="read" id="gnatline"></div>
  </div>

  <div class="pcardb"><h3><span class="ic"></span>Care timeline</h3>
    <ul class="tl" id="timeline"></ul>
    <div class="addnote"><input id="noteinput" placeholder="Log a note..."><button class="mini" data-act="lognote">Add</button></div>
  </div>
  <div style="height:14px"></div>`;
}

function seg(id, opts, cur, cls) { return `<div class="seg ${cls||''}">${opts.map(o=>`<button data-seg="${id}" data-v="${o[0]}" class="${o[0]===cur?'on':''}">${o[1]}</button>`).join("")}</div>`; }

/* live refresh of the currently-rendered detail sheet (no full re-render, keeps slider focus) */
function detailRefresh() {
  const p = P(); if (!p || ST.view !== "detail") return;
  const u = ST.units;
  const g = C.clamp(p.hCm/p.matureCm,0,1), h = C.HVAL[p.hi], soilless = !C.MEDIA[p.med].soil;
  const $ = id => document.getElementById(id);
  if ($("stage")) $("stage").innerHTML = plantArt(p);
  if ($("photos")) $("photos").innerHTML = (p.photos||[]).map((ph,i)=>`<div class="ph"><img src="${ph.dataUrl}" alt=""><button class="del" data-act="delphoto" data-i="${i}">×</button></div>`).join("") + `<div class="addphoto" data-act="capture">＋<br>photo</div>`;
  const stage = g<0.35?"a young start":g<0.7?"filling in":"near its mature form";
  if ($("growcap")) $("growcap").innerHTML = `Drawn at <b>${Math.round(g*100)}% to its ${C.len(p.matureCm,u)} ceiling</b>, ${stage}, reading ${C.HEALTH[p.hi].toLowerCase()}.`;
  if ($("v_h")) $("v_h").textContent = C.len(p.hCm,u);
  if ($("lightnote")) $("lightnote").innerHTML = p.light==="bright"?"Bright. Dries faster, grows faster, water sooner.":p.light==="low"?"Low. Slower growth, dries slowly, ease off water.":"Medium. Steady pace.";
  const m = C.MEDIA[p.med];
  if ($("mednote")) $("mednote").innerHTML = m.soil?`<b>${m.label}.</b> Feeds through its amendments, normal dry-down watering.`:(p.med==="leca"?`<b>LECA, semi-hydro.</b> No food in the medium. Feed through the water, keep a shallow reservoir, flush every couple weeks, never bone dry.`:`<b>Pon, inorganic.</b> Drains and dries fast, feeds nothing. Top-water often with dilute nutrients.`);
  const L = C.potVolL(p), cups = C.lCup(L), sc = 52/Math.max(p.top,p.ph,10), tw = p.top*sc, bw = p.bot*sc, hh = p.ph*sc, cx = 60, topY = 110-hh, botY = 110;
  if ($("potdraw")) $("potdraw").innerHTML = `<svg viewBox="0 0 120 120"><g filter="url(#wob)" stroke="var(--pen)" stroke-width="1.2" fill="#e7dcbc"><path d="M${(cx-tw/2).toFixed(1)},${topY.toFixed(1)} L${(cx-bw/2).toFixed(1)},${botY} Q${cx},${botY+5} ${(cx+bw/2).toFixed(1)},${botY} L${(cx+tw/2).toFixed(1)},${topY.toFixed(1)} Z"/><ellipse cx="${cx}" cy="${topY.toFixed(1)}" rx="${(tw/2).toFixed(1)}" ry="3.2"/>${p.drain?`<circle cx="${cx}" cy="${botY-2}" r="1.6" fill="#f3ead2"/>`:""}</g></svg>`;
  if ($("potnums")) $("potnums").innerHTML = `<div class="n"><span>Top circ.</span><b>${C.len(Math.PI*p.top,u)}</b></div><div class="n"><span>Base circ.</span><b>${C.len(Math.PI*p.bot,u)}</b></div><div class="n"><span>Soil volume</span><b>${C.vol(L,u)}</b></div><div class="n"><span>Mix needed</span><b style="color:var(--sage)">${cups.toFixed(1)} cups</b></div>`;
  if ($("v_top")) $("v_top").textContent = C.len(p.top,u);
  if ($("v_bot")) $("v_bot").textContent = C.len(p.bot,u);
  if ($("v_ph")) $("v_ph").textContent = C.len(p.ph,u);
  if ($("matnote")) $("matnote").innerHTML = p.drain?`<b>${C.MATS[p.mat].label}, draining.</b> ${C.MATS[p.mat].note}`:`<b>${C.MATS[p.mat].label}, no drainage.</b> Water sparingly, tip out any that pools, never let the roots sit wet. This is where rot and gnats start.`;
  const bracket = C.potBracket(p.top);
  if ($("potsize")) $("potsize").innerHTML = `Top is ${C.len(p.top,u)}, a <b>${bracket}</b> pot. Small 10-15 cm / 4-6 in, medium 15-25 cm / 6-10 in, large 25 cm+ / 10 in+. Pot up one size at a time, about 5 cm / 2 in wider, never two.`;
  const due = p.intv - p.lastW;
  if ($("waternext")) $("waternext").innerHTML = due<=0?`<b>Water due now.</b> Last watered ${p.lastW===0?'today':p.lastW+' days ago'}.`:`Next water <b>in ${due} day${due===1?'':'s'}</b>. Last ${p.lastW===0?'today':p.lastW+'d ago'}.`;
  if ($("v_iv")) $("v_iv").textContent = "every "+p.intv+"d";
  const sug = C.suggestIntv(p);
  if ($("sugline")) $("sugline").textContent = p.intvMan?`Suggested ${sug} days. You set ${p.intv}.`:`Suggested ${sug} days from the factors below.`;
  if ($("wqnote")) $("wqnote").innerHTML = (p.water==="tap")?C.WSENS[p.wsens]:(p.wsens>=1?`${p.water.charAt(0).toUpperCase()+p.water.slice(1)} water. Good call for a sensitive one.`:`${p.water.charAt(0).toUpperCase()+p.water.slice(1)} water is fine.`);
  if ($("waterfac")) $("waterfac").textContent = `Built from: ${p.pace} pace, ${C.MEDIA[p.med].label.toLowerCase()}, ${C.MATS[p.mat].label.toLowerCase()} pot ${p.drain?"with drainage":"with no drainage"}, ${C.vol(C.potVolL(p),u)} of it, ${p.light} light, ${Math.round(g*100)}% grown, ${C.season()?"growing season":"dormant"}. Finger-check the top two inches first.`;
  const f = C.FERTS[p.fert];
  if ($("feednote")) { if (soilless) $("feednote").innerHTML = `Soilless, so the water is the only food. Add ${f.label} at every watering, ${f.str}. Ease back in winter, don't stop, there's no soil reserve.`; else if (!C.season()) $("feednote").innerHTML = `Dormant. Hold ${f.label} until spring. Last fed ${p.lastF}d ago.`; else { const fdue = 14-p.lastF; $("feednote").innerHTML = `Growing season. ${f.label} at ${f.str} every 2 weeks. ${fdue<=0?"<b>Feed due now.</b>":"Next feed <b>in "+fdue+"d</b>."} Last fed ${p.lastF===0?'today':p.lastF+'d ago'}.`; } }
  const snug = p.snug/100;
  if ($("v_snug")) $("v_snug").textContent = snug<0.33?"roomy":snug<0.66?"cosy":"bursting";
  if (p.med==="leca") { if ($("repotwin")) $("repotwin").innerHTML = `In semi-hydro. Root-check on sight, not schedule.`; if ($("repotnote")) $("repotnote").textContent = "Watch the water level and rinse the LECA."; if ($("repotfac")) $("repotfac").textContent = ""; }
  else { const win = C.repotWindow(p); if ($("repotwin")) $("repotwin").innerHTML = `Check the roots in about <b class="big">${win[0]} to ${win[1]} months</b>.`; if ($("repotnote")) $("repotnote").textContent = "This narrows when to look. Roots circling the pot or out the drainage holes make the call. Loose and roomy means wait."; if ($("repotfac")) $("repotfac").textContent = `Moved by: ${p.pace} grower, ${$("v_snug")?$("v_snug").textContent:''} in the pot, watered every ${p.intv} days, ${C.MATS[p.mat].label.toLowerCase()}.`; }
  if ($("rootnote")) $("rootnote").innerHTML = p.rootcond?C.ROOTS[p.rootcond].note:"Not checked yet. Pick what you found at the last repot and it sticks, feeding ongoing care.";
  const dir = p.trapN<p.trapL?"down":p.trapN>p.trapL?"up":"flat";
  if ($("gnatline")) $("gnatline").innerHTML = `Last week ${p.trapL}. Trend <b>${dir}</b>. ${dir==="down"?"You're winning. Keep the protocol on.":dir==="flat"&&p.trapN===0?"Clean. Hold the line.":"Re-drench with BTI and keep the top dry."}`;
  const tl = [...(p.log||[])].sort((a,b)=>b.date<a.date?-1:1);
  if ($("timeline")) $("timeline").innerHTML = tl.map(e=>{ const ph = e.photoId && (p.photos||[]).find(x=>x.id===e.photoId); return `<li><span class="d">${C.fmt(e.date)}</span><span class="x">${esc(e.t)}${ph?`<img class="tlimg" src="${ph.dataUrl}" alt="">`:""}</span></li>`; }).join("") || `<li><span class="x" style="color:var(--faint)">No entries yet.</span></li>`;
}

/* ================= REPOT RUN (bench mode) ================= */
/* Plain-language kill-layer checklist for the repot bench flow. */
const REPOTKILL = [
  { t: "Repot at the same depth — holes required", s: "Use the mix from the last step. Same depth as before, and the pot must have drainage holes. No rock layer at the bottom — drainage comes from the chunky mix, not from rocks." },
  { t: "Mix Mosquito Bits (BTI) through the soil", s: "Work a scoop of the little Mosquito Bits granules into the fresh mix. That's kill layer one — the BTI kills gnat larvae living in the soil." },
  { t: "Bottom-water with the Bits drench, add nematodes", s: "Soak from below using the watering can where your Mosquito Bits have been steeping, then sprinkle NemaKnights nematodes on top. Kill layer two." },
  { t: "Top-dress dry", s: "A thin layer of perlite or grit plus a dusting of cinnamon, so the surface stays dry and gnats can't breed in it." }
];
function effectivePot(p) { return ST.repotNewPot ? ST.repotPot : { top: p.top, bot: p.bot, ph: p.ph }; }

function renderRepot() {
  const p = P(); if (!p) return "";
  const r = C.RECIPES[p.med], u = ST.units, rootKeys = Object.keys(C.ROOTS), STEPS = 5;
  const bar = Array.from({ length: STEPS }, (_, i) => `<div class="s ${i<=ST.repotStep?'on':''}"></div>`).join("");
  const head = `<div class="grab"></div><div class="close" data-act="back">×</div>
    <div class="navrow" style="margin-top:16px"><div class="navname">Repotting ${esc(p.name)}<small>${esc(p.latin)} · ${r.name}</small></div></div>
    <div class="steps">${bar}</div><div class="rstep"><div class="k">Step ${ST.repotStep+1} of ${STEPS}</div></div>`;

  // Step 0 — the pot
  if (ST.repotStep === 0) {
    const rp = ST.repotPot, L = C.potVolL(effectivePot(p)), cups = C.lCup(L);
    return head + `
      <div class="pcardb"><h3><span class="ic"></span>The pot</h3>
        <div class="between" style="margin-bottom:10px"><span style="font-size:12px;color:var(--muted)">Same pot, or moving up?</span>
          <div class="seg sm"><button data-act="repotpot" data-v="same" class="${!ST.repotNewPot?'on':''}">Same pot</button><button data-act="repotpot" data-v="new" class="${ST.repotNewPot?'on':''}">New pot</button></div></div>
        ${ST.repotNewPot ? `
          <div class="fac" style="margin-bottom:6px">Enter the new pot — drag the slider or type the number. Pot up one size (about 5 cm / 2 in wider), never two.</div>
          <div class="row"><label>Top</label><input type="range" id="rp_top" min="6" max="50" value="${rp.top}"><input type="number" id="rp_topn" class="cnum" value="${rp.top}"></div>
          <div class="row"><label>Base</label><input type="range" id="rp_bot" min="5" max="45" value="${rp.bot}"><input type="number" id="rp_botn" class="cnum" value="${rp.bot}"></div>
          <div class="row"><label>Height</label><input type="range" id="rp_ph" min="6" max="50" value="${rp.ph}"><input type="number" id="rp_phn" class="cnum" value="${rp.ph}"></div>
          <div class="read" id="rp_vol">New pot holds <b>${C.vol(L,u)}</b> of mix (${cups.toFixed(1)} cups).</div>`
        : `
          <div class="read">Reusing the current pot — <b>${C.vol(L,u)}</b> of mix (${cups.toFixed(1)} cups). Fresh mix in the same size is fine while the roots aren't circling yet.</div>`}
      </div>
      <button class="btn primary" data-act="rnext">Next: your mix &rarr;</button><div style="height:16px"></div>`;
  }
  // Step 1 — the recommended mix
  if (ST.repotStep === 1) {
    const cups = C.lCup(C.potVolL(effectivePot(p)));
    return head + `
      <div class="pcardb"><h3><span class="ic"></span>Your mix — recommended for ${esc(p.name)}</h3>
        <div class="fac" style="margin-bottom:6px">${r.name}, measured to this pot's ${cups.toFixed(1)} cups. Mix it up before you unpot.</div>
        ${r.parts.map(x=>`<div class="recipe"><span>${x[0]}</span><span class="amt">${(x[1]/100*cups).toFixed(1)} cups · ${x[1]}%</span></div>`).join("")}
        ${r.note?`<div class="tweak">${r.note}</div>`:""}</div>
      <button class="btn ghost" data-act="rback">Back</button>
      <button class="btn primary" data-act="rnext">Next: the roots &rarr;</button><div style="height:16px"></div>`;
  }
  // Step 2 — unpot & roots
  if (ST.repotStep === 2) {
    const rootPhoto = (p.photos||[]).slice(-1)[0];
    return head + `
      <div class="pcardb"><h3><span class="ic"></span>Unpot &amp; check the roots</h3>
        <div class="read" style="margin-top:0">Slide it out of its pot and knock off the wet top inch — that's the gnat nursery. Keep your Mosquito Bits (BTI) drench steeping in the watering can while you work.</div>
        <button class="mini" data-act="rootphoto" style="margin-top:10px">📷 Photo the roots (optional)</button>
        ${rootPhoto?`<img src="${rootPhoto.dataUrl}" style="width:100%;max-width:150px;border-radius:6px;border:1.5px solid var(--line);margin-top:8px;display:block">`:""}
        <div class="hand" style="font-size:16px;color:var(--muted);margin:14px 0 6px">What do the roots look like?</div>
        <div class="chips">${rootKeys.map(k=>`<span class="rchip ${ST.root===k?'on':''}" data-act="rootchip" data-v="${k}">${C.ROOTS[k].label}</span>`).join("")}</div>
        ${ST.root?`<div class="read">${C.ROOTS[ST.root].note}</div>`:`<div class="fac">Pick one — it saves to the plant and shapes its ongoing care.</div>`}
      </div>
      <button class="btn ghost" data-act="rback">Back</button>
      <button class="btn ${ST.root?'primary':'ghost dim'}" data-act="rnext">${ST.root?'Next: repot &amp; kill the gnats &rarr;':'Pick a root condition to continue'}</button><div style="height:16px"></div>`;
  }
  // Step 3 — repot & gnat kill
  if (ST.repotStep === 3) {
    const rows = REPOTKILL.map(st => { const on = ST.repotChecks.includes(st.t); return `<div class="checkrow ${on?'on':''}" data-act="check" data-k="${st.t}"><div class="box">${ICON.check}</div><div><div class="ct">${st.t}</div><div class="cs">${st.s}</div></div></div>`; }).join("");
    const allChecked = REPOTKILL.every(st => ST.repotChecks.includes(st.t));
    return head + `<div style="margin:8px 16px 0">${rows}</div>
      <button class="btn ghost" data-act="rback">Back</button>
      <button class="btn ${allChecked?'primary':'ghost dim'}" data-act="rnext">${allChecked?'Next: finish &rarr;':'Check each step as you go'}</button><div style="height:16px"></div>`;
  }
  // Step 4 — review & finish
  const L = C.potVolL(effectivePot(p)), cups = C.lCup(L);
  return head + `
    <div class="pcardb"><h3><span class="ic"></span>Review &amp; ink the page</h3>
      <div class="recipe"><span>Pot</span><span class="amt">${ST.repotNewPot?'New · ':'Same · '}${C.vol(L,u)} (${cups.toFixed(1)} cups)</span></div>
      <div class="recipe"><span>Mix</span><span class="amt">${r.name}</span></div>
      <div class="recipe"><span>Roots</span><span class="amt">${ST.root?C.ROOTS[ST.root].label:'not noted'}</span></div>
      <div class="hand" style="font-size:16px;color:var(--muted);margin:12px 0 6px">Anything to remember</div>
      <textarea id="noteField" class="nfield" placeholder="e.g. split from the combo pot, gave it the deep terracotta, cinnamon top-dress...">${esc(ST.note)}</textarea>
    </div>
    <button class="btn ghost" data-act="rback">Back</button>
    <button class="btn ${ST.root?'primary':'ghost dim'}" data-act="finish" data-id="${p.id}">Ink this page ✓</button><div style="height:16px"></div>`;
}
function repotPotRefresh() {
  const rp = ST.repotPot, u = ST.units;
  ["top","bot","ph"].forEach(k => {
    const s = document.getElementById("rp_"+k), n = document.getElementById("rp_"+k+"n");
    if (s && document.activeElement !== s) s.value = rp[k];
    if (n && document.activeElement !== n) n.value = rp[k];
  });
  const L = C.potVolL(rp), cups = C.lCup(L);
  const v = document.getElementById("rp_vol"); if (v) v.innerHTML = `New pot holds <b>${C.vol(L,u)}</b> of mix (${cups.toFixed(1)} cups).`;
}
function finishRepot() {
  const p = P(); const rootKey = ST.root || "snug";
  if (ST.repotNewPot) { p.top = ST.repotPot.top; p.bot = ST.repotPot.bot; p.ph = ST.repotPot.ph; if (!p.intvMan) p.intv = C.suggestIntv(p); }
  p.rootcond = rootKey;
  p.repotDate = C.dstr(0);
  // side effects per Master Doc Section 11
  if (rootKey === "bound" && !(p.todo||[]).includes("Pot up one size next repot")) p.todo = [...(p.todo||[]), "Pot up one size next repot"];
  if (rootKey === "rot") { p.intvMan = false; }
  const L = C.potVolL(effectivePot(p));
  const noteBits = [`Repotted into ${ST.repotNewPot?'a new':'the same'} pot (${C.vol(L, ST.units)}), ${C.RECIPES[p.med].name} mix. Roots: ${C.ROOTS[rootKey].label}. Gnat protocol run.`];
  if (ST.note.trim()) noteBits.push(ST.note.trim());
  pushLog(p, noteBits.join(" — "));
  save(p);
  ST.view = "detail"; ST.repotStep = 0; ST.repotChecks = []; ST.root = ""; ST.note = ""; ST.repotNewPot = false;
  render();
  toast("Page inked. Pot, mix, and roots saved to the plant.");
}

/* ================= RENDER + OVERLAY ================= */
function render() {
  const views = { today: renderToday, plants: renderPlants, soil: renderSoil, build: renderBuild };
  const titles = { today: "The Sketchbook", plants: "The Key", soil: "Soil", build: "The Plan" };
  app().innerHTML = `<div class="topbar"><span class="t">Plant Daddy HQ<span style="font-family:'Spline Sans';font-weight:500;font-size:11px;color:var(--muted);display:block;line-height:1;margin-top:2px">${titles[ST.tab]}</span></span>
    <span style="display:flex;gap:8px;align-items:center"><span class="d">${today()}</span><button class="iconbtn" data-act="settings">${ICON.gear}</button></span></div>
    ${views[ST.tab]()}
    <button class="fab" data-act="fab" aria-label="Add a plant">+</button>
    <div class="nav">${[["today","today"],["plants","key"],["soil","soil"],["build","plan"]].map(t=>`<button class="${ST.tab===t[0]?'on':''}" data-act="tab" data-v="${t[0]}">${ICON[t[0]]}<span>${t[1]}</span></button>`).join("")}</div>`;
  const ov = ovRoot();
  // Preserve the open sheet's scroll position across in-place edits (chips, toggles,
  // steppers, dates). Navigation actions call ovScrollTop() after render() to reset to 0.
  const prevSheet = document.querySelector(".sheet");
  const prevScroll = prevSheet ? prevSheet.scrollTop : 0;
  const sameContext = ST._renderKey === (ST.view ? ST.view + ":" + (ST.sel || "") : "");
  if (ST.view) {
    const inner = ST.view==="detail"?renderDetail():ST.view==="repot"?renderRepot():ST.view==="supplies"?renderSupplies():ST.view==="settings"?renderSettings():ST.view==="addmenu"?renderAddMenu():ST.view==="addplant"?renderAddPlant():"";
    ov.innerHTML = `<div class="overlay"><div class="scrim" data-act="back"></div><div class="sheet">${inner}</div></div>`;
    if (ST.view === "detail") detailRefresh();
    const newSheet = document.querySelector(".sheet");
    if (newSheet && sameContext) newSheet.scrollTop = prevScroll;
  } else ov.innerHTML = "";
  ST._renderKey = ST.view ? ST.view + ":" + (ST.sel || "") : "";
}

/* ================= ADD A PLANT ================= */
function renderAddMenu() {
  return `<div class="grab"></div><div class="close" data-act="back">×</div>
    <div class="pad"><p class="eyebrow">grow your library</p><h1 style="font-size:23px">Add a plant</h1>
    <p class="hand" style="font-size:16px;color:var(--muted);margin:4px 0 14px">Beyond the seeded 24 — however you like.</p></div>
    <div class="addopt" data-act="addbyphoto"><span class="ai">📷</span><div><div class="ot">Identify by photo</div><div class="os">Snap it, attach the photo, then pick the type. Auto-ID is coming; tap-to-pick works now and offline.</div></div></div>
    <div class="addopt" data-act="addmanual"><span class="ai">🌱</span><div><div class="ot">Add a plant manually</div><div class="os">Name it, pick a type, choose a room. Fill the rest on its page.</div></div></div>
    <div style="height:14px"></div>`;
}
function renderAddPlant() {
  const d = ST.addDraft || (ST.addDraft = { name: "", latin: "", type: "aroid", room: "Unassigned", tox: true, photo: null });
  return `<div class="grab"></div><div class="close" data-act="back">×</div>
    <div class="navrow" style="margin-top:46px"><div class="navname">New plant<small>added to your library</small></div></div>
    ${d.photo ? `<div class="phero" style="margin-top:6px"><img src="${d.photo}" style="width:100%;height:100%;object-fit:cover" alt=""></div>` : ""}
    <div class="pcardb"><h3><span class="ic"></span>Name</h3>
      <input class="nfld" id="np_name" placeholder="Common name (e.g. ZZ plant)" value="${esc(d.name)}">
      <input class="nfld" id="np_latin" placeholder="Latin name (optional)" value="${esc(d.latin)}"></div>
    <div class="pcardb"><h3><span class="ic"></span>Type — sets the art &amp; starting care</h3>
      <div class="pick">${Object.entries(ARCHETYPES).map(([k, a]) => `<span class="pchip ${k === d.type ? 'on' : ''}" data-atype="${k}">${a.label}</span>`).join("")}</div>
      <div class="read">Starts as a ${ARCHETYPES[d.type].pace} ${ARCHETYPES[d.type].med} plant. You tune every field after.</div></div>
    <div class="pcardb"><h3><span class="ic"></span>Room</h3>
      <input class="nfld" id="np_room" list="np_roomlist" placeholder="e.g. Living room" value="${esc(d.room === 'Unassigned' ? '' : d.room)}">
      <datalist id="np_roomlist">${roomsList().map(r => `<option value="${esc(r)}">`).join("")}</datalist></div>
    <div class="pcardb"><h3><span class="ic"></span>Toxic to pets?</h3>
      <div class="seg">${[["y","Toxic"],["n","Pet-safe"]].map(o => `<button data-atox="${o[0]}" class="${(d.tox ? 'y' : 'n') === o[0] ? 'on' : ''}">${o[1]}</button>`).join("")}</div></div>
    <button class="btn primary" data-act="createplant">Add to my library</button><div style="height:16px"></div>`;
}
function createPlant() {
  const d = ST.addDraft || {};
  if (!d.name || !d.name.trim()) { toast("Give it a name first."); return; }
  const rec = newPlant({ name: d.name.trim(), latin: (d.latin || "").trim(), type: d.type || "aroid", room: (d.room && d.room.trim()) || "Unassigned", tox: d.tox, photoDataUrl: d.photo || null });
  ST.plants[rec.id] = rec;
  ST.order.push(rec.id);
  save(rec); persistOrder();
  ST.addDraft = null; ST.sel = rec.id; ST.view = "detail";
  render(); ovScrollTop();
  toast(`${rec.name} added to your library.`);
}

/* ================= CAMERA ================= */
let _captureMode = "plant";   // "plant" = attach to current plant | "add" = new-plant draft
function startCapture(mode) { _captureMode = mode || "plant"; document.getElementById("cameraInput").click(); }
async function onCameraFile(file) {
  if (!file) return;
  try {
    const dataUrl = await compressImage(file);
    if (_captureMode === "add") {
      ST.addDraft = Object.assign({ name: "", latin: "", type: "aroid", room: "Unassigned", tox: true }, ST.addDraft || {}, { photo: dataUrl });
      ST.view = "addplant"; render(); ovScrollTop();
      return;
    }
    if (_captureMode === "root") {
      const rp = P(); if (!rp) return;
      const rid = "ph_" + Date.now();
      rp.photos = rp.photos || [];
      rp.photos.push({ id: rid, date: C.dstr(0), dataUrl });
      pushLog(rp, "Root photo at repot", rid);
      save(rp);
      render();  // stays in the repot flow
      toast("Root photo saved.");
      return;
    }
    const p = P(); if (!p) return;
    const id = "ph_" + Date.now();
    p.photos = p.photos || [];
    p.photos.push({ id, date: C.dstr(0), dataUrl });
    pushLog(p, "Photo added", id);
    // clear a matching "current pic" todo if present
    p.todo = (p.todo||[]).filter(t => !/current pic|condition pic/i.test(t));
    save(p);
    render();
    toast("Photo saved to this plant.");
  } catch (e) { toast(e.message || "Could not save that photo."); }
}

/* ================= NOTIFICATIONS ================= */
async function askNotify() {
  if (!("Notification" in window)) { toast("This browser has no notification support."); return; }
  if (Notification.permission === "granted") { fireDueNotification(true); return; }
  const perm = await Notification.requestPermission();
  if (perm === "granted") { await ST_setNotify(true); toast("Reminders on. In-app Due-now still leads on iPhone."); fireDueNotification(true); render(); }
  else toast("Reminders stay in-app. Check the Due-now list.");
}
async function ST_setNotify(v) { ST.notify = v; await DB.setSetting("notify", v); }
function fireDueNotification(force) {
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  const { w, f } = dueList();
  if (!force && w.length + f.length === 0) return;
  const body = [w.length ? `${w.length} to water` : "", f.length ? `${f.length} to feed` : ""].filter(Boolean).join(" · ") || "Nothing due — all good.";
  try {
    if (navigator.serviceWorker && navigator.serviceWorker.ready) {
      navigator.serviceWorker.ready.then(reg => reg.showNotification("Plant Daddy HQ", { body, icon: "icons/icon-192.png", badge: "icons/icon-192.png", tag: "hps-due" }));
    } else { new Notification("Plant Daddy HQ", { body, icon: "icons/icon-192.png" }); }
  } catch (e) {}
}
function maybeNotifyOnOpen() {
  if (ST.notify && "Notification" in window && Notification.permission === "granted") {
    // Only nudge if something is actually due
    const { w, f } = dueList(); if (w.length + f.length) fireDueNotification(false);
  }
}

/* ================= BACKUP ================= */
async function doExport() {
  const data = await DB.exportAll();
  const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const stamp = new Date().toISOString().slice(0,10);
  a.href = url; a.download = `plant-daddy-backup-${stamp}.json`;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
  toast("Backup file downloaded. Save it to your Drive.");
}
function doImportPick() { document.getElementById("importInput").click(); }
async function onImportFile(file) {
  if (!file) return;
  try {
    const text = await file.text();
    const obj = JSON.parse(text);
    await DB.importAll(obj);
    const loaded = await DB.init();
    ST.plants = loaded.plants; ST.order = loaded.order;
    if (loaded.settings && loaded.settings.units) ST.units = loaded.settings.units;
    ST.view = null;
    render();
    toast("Backup restored.");
  } catch (e) { toast(e.message || "That file could not be restored."); }
}

/* ================= EVENTS ================= */
document.addEventListener("click", e => {
  const el = e.target.closest("[data-act],[data-med],[data-mat],[data-fert],[data-root],[data-seg],[data-atype],[data-atox],[data-room]");
  if (!el) return;
  // add-plant draft chips
  if (el.dataset.atype) { (ST.addDraft = ST.addDraft || {}).type = el.dataset.atype; render(); return; }
  if (el.dataset.atox) { (ST.addDraft = ST.addDraft || {}).tox = (el.dataset.atox === "y"); render(); return; }
  if (el.dataset.room) { const p = P(); if (p) { p.room = el.dataset.room; save(p); render(); } return; }
  // chip groups on the detail page
  if (el.dataset.med) { P().med = el.dataset.med; if (!C.MEDIA[P().med].soil) P().fert = P().fert==="bgl"?"hydro":P().fert; save(P()); render(); return; }
  if (el.dataset.mat) { P().mat = el.dataset.mat; save(P()); render(); return; }
  if (el.dataset.fert) { P().fert = el.dataset.fert; save(P()); render(); return; }
  if (el.dataset.root) { P().rootcond = el.dataset.root; pushLog(P(), "Root check: " + C.ROOTS[el.dataset.root].label); save(P()); render(); return; }
  if (el.dataset.seg) { const id = el.dataset.seg, v = el.dataset.v; if (id==="health") P().hi=+v; else if (id==="light") P().light=v; else if (id==="water") P().water=v; else if (id==="drain") P().drain=(v==="y"); save(P()); render(); return; }
  const a = el.dataset.act;
  switch (a) {
    case "tab": ST.tab = el.dataset.v; ST.view = null; render(); window.scrollTo(0,0); break;
    case "open": ST.sel = el.dataset.id; ST.view = "detail"; render(); ovScrollTop(); break;
    case "filter": ST.filter = el.dataset.f; render(); break;
    case "back": readNote(); ST.view = null; render(); break;
    case "openrun": ST.tab = "plants"; ST.filter = "attention"; ST.view = null; render(); toast("Open a plant, then Run the repot protocol."); break;
    case "supplies": ST.view = "supplies"; render(); ovScrollTop(); break;
    case "settings": ST.view = "settings"; render(); ovScrollTop(); break;
    case "fab": ST.addDraft = null; ST.view = "addmenu"; render(); ovScrollTop(); break;
    case "addmanual": ST.addDraft = { name:"", latin:"", type:"aroid", room:"Unassigned", tox:true, photo:null }; ST.view = "addplant"; render(); ovScrollTop(); break;
    case "addbyphoto": ST.addDraft = { name:"", latin:"", type:"aroid", room:"Unassigned", tox:true, photo:null }; startCapture("add"); break;
    case "createplant": readAddFields(); createPlant(); break;
    case "grouproom": ST.groupByRoom = !ST.groupByRoom; render(); break;
    case "prev": { const i = ST.order.indexOf(ST.sel); ST.sel = ST.order[(i-1+ST.order.length)%ST.order.length]; render(); ovScrollTop(); break; }
    case "next": { const i = ST.order.indexOf(ST.sel); ST.sel = ST.order[(i+1)%ST.order.length]; render(); ovScrollTop(); break; }
    case "watered": P().lastW = 0; pushLog(P(), "Watered"); save(P()); render(); break;
    case "fed": P().lastF = 0; pushLog(P(), "Fed " + C.FERTS[P().fert].label); save(P()); render(); break;
    case "matchsug": P().intvMan = false; save(P()); render(); break;
    case "tplus": P().trapN++; save(P()); render(); break;
    case "tminus": P().trapN = Math.max(0, P().trapN-1); save(P()); render(); break;
    case "todone": P().todo.splice(+el.dataset.i,1); save(P()); render(); break;
    case "lognote": { const inp = document.getElementById("noteinput"); if (inp && inp.value.trim()) { pushLog(P(), inp.value.trim()); save(P()); render(); } break; }
    case "capture": startCapture(); break;
    case "delphoto": { const p = P(); p.photos.splice(+el.dataset.i,1); save(p); render(); break; }
    case "repot": ST.sel = el.dataset.id; ST.view = "repot"; ST.repotStep = 0; ST.repotChecks = []; ST.root = ""; ST.note = ""; ST.repotNewPot = false; ST.repotPot = { top: P().top, bot: P().bot, ph: P().ph }; render(); ovScrollTop(); break;
    case "repotpot": ST.repotNewPot = (el.dataset.v === "new"); render(); break;
    case "rootphoto": startCapture("root"); break;
    case "check": { const k = el.dataset.k; ST.repotChecks.includes(k) ? ST.repotChecks = ST.repotChecks.filter(x=>x!==k) : ST.repotChecks.push(k); render(); break; }
    case "rnext": {
      if (ST.repotStep === 2 && !ST.root) { toast("Pick what the roots looked like first."); break; }
      if (ST.repotStep === 3 && !REPOTKILL.every(st => ST.repotChecks.includes(st.t))) { toast("Check each step to continue."); break; }
      ST.repotStep = Math.min(4, ST.repotStep + 1); render(); ovScrollTop(); break;
    }
    case "rback": readNote(); ST.repotStep = Math.max(0, ST.repotStep-1); render(); ovScrollTop(); break;
    case "rootchip": readNote(); ST.root = ST.root===el.dataset.v?"":el.dataset.v; render(); break;
    case "finish": readNote(); if (!ST.root) { toast("Pick what the roots looked like first."); break; } finishRepot(); break;
    case "units": ST.units = el.dataset.v; DB.setSetting("units", ST.units); render(); break;
    case "export": doExport(); break;
    case "import": doImportPick(); break;
    case "notifask": askNotify(); break;
    case "reseed": reseed(); break;
  }
});
document.addEventListener("input", e => {
  const el = e.target;
  if (el.dataset && el.dataset.inp) {
    const k = el.dataset.inp;
    if (k==="search") { ST.q = el.value; const pos = el.selectionStart; render(); const ni = document.querySelector('[data-inp="search"]'); if (ni){ni.focus(); ni.setSelectionRange(pos,pos);} return; }
    if (k==="calcBucket") { ST.calcBucket = el.value; render(); return; }
    if (k==="calcSize") { ST.calcSize = el.value; render(); return; }
    if (k==="potUsed") { ST.potUsed = el.value; if (ST.view==="repot") { const mini = document.querySelector('.pcardb'); render(); } return; }
    return;
  }
  // new-plant draft fields (no re-render, keep focus)
  if (el.id==="np_name" || el.id==="np_latin" || el.id==="np_room") {
    ST.addDraft = ST.addDraft || {};
    if (el.id==="np_name") ST.addDraft.name = el.value;
    else if (el.id==="np_latin") ST.addDraft.latin = el.value;
    else ST.addDraft.room = el.value;
    return;
  }
  // repot new-pot dimensions (slider + number synced, no re-render)
  if (el.id && /^rp_(top|bot|ph)n?$/.test(el.id)) {
    const base = el.id.replace(/^rp_/, "").replace(/n$/, "");
    ST.repotPot = ST.repotPot || { top: 18, bot: 15, ph: 16 };
    ST.repotPot[base] = C.clamp(Math.round(+el.value || 0), 4, 60);
    repotPotRefresh();
    return;
  }
  const p = P();
  if (!p) return;
  if (el.id==="roomi") { p.room = el.value; saveDebounced(p); return; }
  if (el.id==="s_h") { p.hCm = +el.value; }
  else if (el.id==="s_iv") { p.intv = +el.value; p.intvMan = true; save(p); render(); return; }
  else if (el.id==="s_top") { p.top = +el.value; if (!p.intvMan) { save(p); render(); return; } }
  else if (el.id==="s_bot") { p.bot = +el.value; }
  else if (el.id==="s_ph") { p.ph = +el.value; if (!p.intvMan) { save(p); render(); return; } }
  else if (el.id==="s_snug") { p.snug = +el.value; }
  else if (el.id==="trapc") { p.trapN = Math.max(0, +el.value||0); }
  else if (el.id==="lastwd") { p.lastW = C.daysAgo(el.value); }
  else if (el.id==="lastfd") { p.lastF = C.daysAgo(el.value); }
  else return;
  saveDebounced(p); detailRefresh();
});
function readNote() { const n = document.getElementById("noteField"); if (n) ST.note = n.value; }
function readAddFields() {
  ST.addDraft = ST.addDraft || {};
  const n = document.getElementById("np_name"); if (n) ST.addDraft.name = n.value;
  const l = document.getElementById("np_latin"); if (l) ST.addDraft.latin = l.value;
  const r = document.getElementById("np_room"); if (r) ST.addDraft.room = r.value;
}
function ovScrollTop() { const s = document.querySelector(".sheet"); if (s) s.scrollTop = 0; }
let _saveT; function saveDebounced(p) { clearTimeout(_saveT); _saveT = setTimeout(() => save(p), 250); }

async function reseed() {
  if (!confirm("Reset to a fresh sketchbook? This wipes your entered data on this device. Export first if you want to keep it.")) return;
  indexedDB.deleteDatabase("houseplant");
  setTimeout(() => location.reload(), 300);
}

/* ================= FILE INPUTS ================= */
document.getElementById("cameraInput").addEventListener("change", e => { const f = e.target.files[0]; e.target.value = ""; onCameraFile(f); });
document.getElementById("importInput").addEventListener("change", e => { const f = e.target.files[0]; e.target.value = ""; onImportFile(f); });
document.addEventListener("visibilitychange", () => { if (!document.hidden) maybeNotifyOnOpen(); });

/* ================= BOOT ================= */
(async function boot() {
  const loaded = await DB.init();
  ST.plants = loaded.plants; ST.order = loaded.order;
  if (loaded.settings) { if (loaded.settings.units) ST.units = loaded.settings.units; if (loaded.settings.notify) ST.notify = loaded.settings.notify; }
  render();
  maybeNotifyOnOpen();
  if ("serviceWorker" in navigator) {
    try { await navigator.serviceWorker.register("sw.js"); } catch (e) {}
  }
})();
