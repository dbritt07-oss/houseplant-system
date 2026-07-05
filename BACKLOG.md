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
- ✅ Rooms & location: per-plant Room field, group Plants tab by room, "by room" filter
- ✅ Add-a-plant: floating "+" button → menu (Identify by photo · Add manually); 9 archetypes; adds beyond the 24
- ✅ Fix: sheets keep scroll position on chip/toggle/date edits (no more jump to top)
- ✅ Repot flow redesign: pot (same/new + measure) → recommended mix (cups from real volume) → unpot & roots (photo + condition) → gnat-kill checklist → review & ink. Plain-language "Mosquito Bits (BTI)" copy. Writes pot size + soil + root condition back to the plant.
- ✅ Measurements & units: independent Length (cm/in) and Volume (L/mL/gal) pickers, cups always for mix. Default inches + gallons. Repot pot page labels its unit, shows the volume→cups readout, and a "leave headroom" note. Cleaner settings icon.
- ✅ Typeable number boxes on every slider (height, pot top/base/height, schedule, root-snug), 0.5-step sliders, unit-aware and synced to the slider.
- ✅ Soil tab: "Your plants on this mix" — selecting a bucket in the calculator lists your matching plants (tap to open), with LECA/Pon liquid-nutrient + watering guidance.
- ✅ Pot accuracy: Round/Square shape toggle (cone vs pyramid volume), diameter/side labels (measure across, not around), and a realistic "fresh mix to prepare" figure (full capacity minus headroom + root ball) so repot amounts aren't overstated.

## Next
- ⏭️ Photo-capture pre-fill UI: snap → review → accept/override screens (manual values for now), the scaffold auto-ID drops into
- ⏭️ Photo auto-ID (the AI piece). Decision recorded: start with **Plant.id** (plant-specialist, health detection, free tier) behind a tiny serverless key-proxy so the key stays private; add a general vision model later for freeform recommendations. Keep tap-to-pick fallback so it works offline. Auto-measure height needs a reference object or native AR — treat as rough/optional, not core.
- ⏭️ Alternate design directions: mock 2–3 visual looks to compare vs field-sketchbook, pick one
- ⏭️ Interaction polish: swipe-to-close sheets, smoother transitions, spacing pass
- ⏭️ On-phone acceptance test (camera / offline / reminder / backup round-trip)

## Queued
- 📋 Home / property layer (landing page): pick a home, filter by room, add another house/location.
      Rooms belong to a property; the app scales to multiple homes. North-star structure.
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
