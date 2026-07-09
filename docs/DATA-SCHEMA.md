# Plant Daddy HQ — Data Schema (FROZEN)

**Status: FROZEN as of Sprint 3 close (build v28, 2026-07-08).** This is the canonical description of everything Plant Daddy HQ persists on the device. The automatic-backup work (P0-1, Sprint 4) serializes and restores **exactly this shape** — it is the contract the backup builds against.

> **Change control.** Once frozen, the persisted shape does **not** change casually. Any addition, removal, or rename of a persisted field requires: (1) a bump of the export envelope `version` + a written **migration** for older backups, (2) an update to this document and the schema-lock test (`tests/care.test.js`), and (3) explicit founder approval. A silent shape change would break restore for existing data. See the Product Bible's data-safety gate.

---

## 1. Storage engine

- **IndexedDB**, database name **`houseplant`**, version **`1`** (`js/db.js`).
- Two object stores:
  - **`plants`** — keyPath **`id`**. One record per plant.
  - **`settings`** — keyPath **`k`**. Key/value rows `{ k, v }`.
- Nothing else is persisted. Plant *data* never leaves the device except in the owner's own export file (below). Nothing is written to the repo or any server.

## 2. Plant record (`plants` store)

Every plant record has **exactly these 35 fields** (34 below + `id`). Seed records (`buildSeed()` in `js/seed.js`) carry all 34 and receive `id` when persisted; user-added records (`newPlant()`) carry all 35. This set is locked by `tests/care.test.js`.

**Identity & species constants** (set at seed/creation, rarely edited):

| field | type | notes |
|---|---|---|
| `id` | string | primary key. Seed ids are short slugs (`"mon"`, `"corn2"`); user plants are `"user_<base36>"`. |
| `name` | string | common name. |
| `latin` | string | botanical name (may be empty for user plants). |
| `art` | string | art-archetype key → `js/art.js` registry: `pMonstera, pShield, pSnake, pStrap, pVine, pPaddle, pBromeliad, pPalm, pTree`. |
| `pace` | string | `"fast" \| "moderate" \| "slow"`. |
| `thirst` | number | base watering cadence (days) before live factors. |
| `matureCm` | number | mature-height ceiling (cm), drives the art growth ratio. |
| `med` | string | growing medium: `aroid \| general \| gritty \| bark \| leca \| pon`. |

**Owner-variable care state** (edited on the plant page):

| field | type | notes |
|---|---|---|
| `hCm` | number | current height (cm). |
| `hi` | number | health index `0..3` → Critical / Stressed / Healthy / Thriving. |
| `light` | string | `low \| med \| bright`. |
| `water` | string | `tap \| filtered \| distilled`. |
| `wsens` | number | water sensitivity `0..2`. |
| `tox` | boolean | toxic to pets. |
| `drain` | boolean | pot has drainage holes. |
| `intv` | number | current watering interval (days). |
| `intvMan` | boolean | owner overrode the suggested interval. |
| `fert` | string | fertilizer key → `js/care.js` `FERTS` (e.g. `bgl`, `hydro`). |
| `lastW` | number | days since last watered. |
| `lastF` | number | days since last fed. |
| `snug` | number | root-snug percentage `0..100`. |
| `rootcond` | string \| null | last root check → `js/care.js` `ROOTS` key, or `null` if never checked. |
| `trapN` | number | gnat traps counted this week. |
| `trapL` | number | gnat traps last week. |
| `top` | number | pot top diameter / side (cm). |
| `bot` | number | pot base diameter / side (cm). |
| `ph` | number | pot height (cm). |
| `mat` | string | pot material → `js/care.js` `MATS` (e.g. `plastic`, `ceramic`, `terracotta`, `stone`). |
| `shape` | string | `round \| square`. |
| `loc` | string | free-text descriptive location. |
| `room` | string | assigned room label, or `"Unassigned"`. |
| `repotDate` | string \| null | last repot date as a `dstr` day-string, or `null`. |

**Records** (append-only histories):

| field | type | notes |
|---|---|---|
| `photos` | array | each: `{ id: "ph_<ts>", date: <dstr>, dataUrl: <compressed JPEG data URL> }`. Photos live **inside** the record, so export bundles them automatically. |
| `todo` | string[] | outstanding measurement prompts; items removed as completed. May be empty. |
| `log` | array | care timeline; each: `{ date: <dstr>, t: <string>, photoId?: <string> }`. `photoId` (optional) links a log entry to a `photos[].id`. |

**Date convention:** `date`/`repotDate` use `dstr()` from `js/care.js` (a day-string), not ISO timestamps. `photos[].id` uses `"ph_" + Date.now()`.

## 3. Settings store (`settings` store)

Rows are `{ k, v }`. Known keys:

| key `k` | value `v` | notes |
|---|---|---|
| `order` | string[] | canonical collection order — the plant ids in display sequence. |
| `seededAt` | string (ISO) | timestamp of first-run seeding. |
| `lenUnit` | string | `"in" \| "cm"`. |
| `volUnit` | string | `"gal" \| "L" \| "mL"`. |
| `notify` | boolean | device-notification opt-in. |

## 3b. Drive backup state — device-local, NOT part of the schema

Google Drive backup keeps its state in **`localStorage`**, deliberately *outside* the IndexedDB `settings` store, so it never travels inside a backup and the frozen schema stays unchanged:

| localStorage key | meaning |
|---|---|
| `pdhq_drive_cid` | the **public** OAuth Client ID (never a secret; never in the repo) |
| `pdhq_drive_connected` | `"1"` once Drive has been connected |
| `pdhq_drive_last` | ISO time of the last **successful** backup |
| `pdhq_drive_state` | `"ok"` or `"error:<message>"` for the last attempt |
| `pdhq_drive_dirty` | `"1"` if local data changed since the last successful backup (survives reload) |

The OAuth **access token is held in memory only** and is never persisted. Backup adds **no new IndexedDB settings keys** and **no new envelope fields** — the contract in §5 is untouched.

## 4. NOT persisted (session-only UI state)

The following live only in the in-memory `ST` object in `js/app.js` and are **deliberately not stored** — they reset on reload and are **out of scope for backup**: `tab`, `view`, `sel`, `q` (search), `filter`, `sortMode`, `groupByRoom`, `calcBucket`, `calcSize`, `soilRecipes`, `soilGnat`, and all transient repot-run state (`repotStep`, `repotChecks`, `root`, `note`, `potUsed`, `repotNewPot`, `repotPot`), plus `addDraft` / `checkinDraft`. (The sort and filter added in Sprint 3 are here by design — presentation, not data.)

## 5. Export / backup envelope (`DB.exportAll` / `DB.importAll`)

The portable backup file — and the shape Drive backup (Sprint 4) will read and write:

```json
{
  "app": "Plant Daddy HQ",
  "format": "hps-backup",
  "version": 1,
  "exportedAt": "<ISO timestamp>",
  "settings": { "order": [...], "seededAt": "...", "lenUnit": "in", "volUnit": "gal", "notify": false },
  "plants": [ { "id": "...", ... }, ... ]
}
```

- `settings` is an **object** (keyed by `k`); `plants` is an **array** of full plant records.
- **Validation (`validateBackup`, `js/db.js`)** runs before *any* write or restore and is unit-tested (`tests/care.test.js`). It rejects: a non-object/array root, a wrong `format`, a missing/non-numeric `version`, a **newer** `version` than this app understands, a missing/non-array `plants`, a plant without a string `id`, **duplicate plant ids**, a non-array `photos` or `log`, and non-object `settings`. It returns `{plants, photos, logs, exportedAt}` counts so the UI can show what is about to be overwritten.
- **Import is atomic:** `importAll` validates first (nothing is touched if it throws), then performs `clear()` + all `put()`s in a **single IndexedDB transaction**, so an interrupted restore **rolls back** rather than leaving a half-empty collection.
- **Backup is guarded:** an *automatic* backup of a **zero-plant** collection is refused, so a failed DB open can never overwrite a good Drive backup with an empty one. An explicit "Back up now" may still proceed.
- **Restore contract (the P0 launch gate):** a fresh install → import must reproduce every plant, log entry, and photo **byte-for-byte**, and a full IndexedDB wipe → restore must yield **zero data loss**.

## 6. What "frozen" means for Sprint 4

Backup/restore may rely on all of the above being stable: the two object stores, the 35-field plant record, the five settings keys, and the `hps-backup` envelope with `version: 1`. If Sprint 4 discovers a genuine need to change the shape, that is a **schema change** — follow the change-control rule at the top (version bump + migration + this doc + the test + founder sign-off), never a silent edit.
