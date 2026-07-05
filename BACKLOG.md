# Plant Daddy HQ — Backlog & Tracker

Single place for what's done, in progress, and queued. Lives in the repo so it's versioned
with the code and shareable with collaborators. Plant *data* never lives here — only plans.

Status key: ✅ done · 🔨 in progress · ⏭️ next · 📋 queued · 💡 idea

---

## Shipped
- ✅ Core app: 24-plant care engine, evolving art, repot ritual, camera, offline, backup, export/import
- ✅ Installable PWA, deployed to GitHub Pages
- ✅ Renamed to Plant Daddy HQ
- ✅ Fix: sheet close (×) button no longer overlaps the next-plant (›) button

## In progress
- 🔨 Rooms & location: per-plant Room field, group the Plants tab by room, filter by room
- 🔨 Add-a-plant entry point: floating "+" button → menu (Identify by photo · Add manually)

## Next
- ⏭️ Photo auto-ID: use a vision model to identify species + read condition and pre-fill care
      (keep tap-to-pick fallback so it works offline; opt-in internet call)
- ⏭️ Alternate design directions: mock 2–3 visual looks to compare vs field-sketchbook, pick one
- ⏭️ Interaction polish: swipe-to-close sheets, smoother transitions, spacing pass
- ⏭️ On-phone acceptance test (camera / offline / reminder / backup round-trip)

## Queued
- 📋 Home-dashboard integration: rooms carry windows, orientation, sun hours (morning vs evening);
      feed that into the watering/light math. Bridge to the Townhouse app.
- 📋 Delete / archive a plant; propagation ("pup") state per Master Doc
- 📋 Supplies: low-stock thresholds + restock reminders

## Ideas (not scheduled)
- 💡 Find local plant events near me
- 💡 Find nearby nurseries/stores that stock what my Supplies view says I'm low on (maps/places API)
- 💡 Optional community/social layer (decide if that's our lane vs "private, honest, beautiful")
- 💡 Native wrapper for reliable iPhone notifications

## Owner amendment notes (drop quick notes here; we triage into the lists above)
- (add yours here)

---

### How we work
- I edit files directly in this connected repo → you Commit + Push in GitHub Desktop → live in ~1 min.
- One commit per logical change, clear message. Revert any commit from GitHub Desktop History if needed.
- This file + `Plant-Daddy-HQ-Roadmap.md` are the shareable scope. The Master Doc stays the brain.
