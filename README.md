# Plant Daddy HQ — installable PWA

A mobile-first, installable app in the field-sketchbook aesthetic that manages the
locked 24-plant collection. Reference, Ritual, Record. Ported from
`houseplant-24-plants.html` (design + every calculation) and merged under the
sketchbook shell (Today / Plants / Soil / Build) with the bench-mode repot run.

Everything works fully offline after first load. Your plant data (photos,
measurements, logs) lives on the device in IndexedDB and backs up to a single file
you save to your own Google Drive. **No plant data is ever stored in this repo.**

## What's in the box

| File | Job |
|---|---|
| `index.html` | App shell + all styling (merged sketchbook + finalized page CSS) |
| `js/care.js` | The care-math module — watering, feeding, repot window, frustum pot volume, units. Tweak the models here. |
| `js/art.js` | The nine parametric SVG art generators, ported as-is |
| `js/seed.js` | The 24 plants + their constants (species facts, not personal data) |
| `js/db.js` | IndexedDB persistence + one-tap export/import + image compression |
| `js/app.js` | Controller: shell, plant page, repot run, camera, reminders, supplies, backup |
| `manifest.webmanifest`, `sw.js`, `icons/` | PWA install + offline |

## Deploy to GitHub Pages (your chosen path)

The app is static files. No build step.

1. Create a new repo on GitHub, e.g. `houseplant-system`. **Keep it free of any plant data** — that lives only on your phone and in your export file.
2. Upload the entire contents of this `houseplant-app/` folder to the repo root (so `index.html` sits at the top level of the repo).
   - Web way: repo → **Add file → Upload files** → drag everything in → Commit.
   - Or with git: `git init && git add . && git commit -m "Houseplant System PWA" && git branch -M main && git remote add origin <your-repo-url> && git push -u origin main`
3. Repo → **Settings → Pages** → Source: **Deploy from a branch** → Branch: `main` → Folder: `/ (root)` → **Save**.
4. Wait ~1 minute. Pages gives you a URL like `https://<you>.github.io/houseplant-system/`.
5. Open that URL on your phone. It must be **https** for camera, install, and offline to work — GitHub Pages is https, so you're set.

### Add to Home Screen
- **iPhone (Safari):** Share → *Add to Home Screen*. Launches full-screen, offline, with camera.
- **Android (Chrome):** menu → *Install app* / *Add to Home Screen*.

## The single-plant, full-stack gate for "done"

Per your call: 24 cards on screen is fine; the proof is one plant through the whole
stack on your actual phone. Run this once after installing:

1. **Camera** — open any plant → Photos → **＋ photo** → take a shot. It attaches to the plant and appears in the care timeline.
2. **Offline persistence** — turn on Airplane Mode, fully close the app, reopen from the Home Screen. Your photo, edits, and the unit toggle are all still there.
3. **Reminder** — Settings → *Turn on device reminders* → *Test a reminder now*. A notification fires with what's due. (On iPhone, PWA notifications are limited; the in-app **Due now** list on Today is always authoritative there.)
4. **Backup round-trip** — Settings → *Export a backup file* (save to Google Drive) → *Reset to a fresh sketchbook* → *Import a backup file* → your data, including the photo, is restored.

If those four pass, the app is trustworthy for the rest of the collection.

## Notes on the reminders honesty

- In-app due/overdue always works, everywhere, offline.
- Real device notifications fire when the app is open, and in the background on Android/Chrome.
- iPhone home-screen PWAs have limited, unreliable background notification scheduling. The app states this plainly rather than faking it. Treat the Today → **Due now** list as the source of truth on iOS.

## Optional, later: automatic Google Drive sync

The must-have (one-tap export/import file) is built. Automatic Drive sync needs Google
API credentials and OAuth, which is why it's deliberately kept out of the core app so it
can't block you. It can be added later without touching the care logic.
