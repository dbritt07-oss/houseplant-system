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
- ✅ Update reliability: service worker switched to network-first (updates appear as soon as you're online), precache bypasses HTTP cache, and a visible "build vN" stamp in Settings to confirm the running version. Slider drags frame-throttled for smoothness.
- ✅ Photo check-in (existing plant): "📷 Photo check-in" on the plant page → snap → confirm health + note → attaches photo, updates status, logs a timeline entry. This is the scaffold the AI health-read drops into. (New-plant photo-add already pre-fills via the add form.) Button made full-width/prominent on the Photos card.
- ✅ Soil tab recommendations: for the selected mix, "Would also thrive here" cross-references each plant's family-fit against what it's currently on (e.g., Pineapple → bark), with a plain "why this medium" note. Tap to open and switch. Learning + optimization.
- ✅ Quick-log from Today: 💧/🍽️ buttons on each Due-now card log Watered/Fed without opening the plant.
- ✅ Undo everywhere: tap-Undo toast after water/feed (from Today or the plant page) and after removing a plant — fixes the #1 competitor complaint.
- ✅ Delete a plant: "Remove from collection" on the plant page, with a 5-second Undo (no scary confirm; data also survives in exported backups). Plant counts now reflect adds/removes.
- ✅ Move rooms: already supported via a plant's Room field + quick chips (tap a room to move it).

## Next
- ⏭️ Sort & filter the Plants tab: sort A→Z, by room, by due-soonest, by health, by recently added;
      keep the existing search + medium/attention filters. A "sort" control next to the filter row.
- ⏭️ Process: maintain `WHATS-NEW.md` every release (feature + where to see it + checkbox) so updates are verifiable.
- ⏭️ Usability wins (remaining, from UX + competitive review):
      - "apply to room" batch actions (water everything in a room at once)
      - Today = command center: repot windows opening + gnat re-checks surfaced alongside due
      - Health at a glance: status color dots + due badges on plant cards
      - First-run onboarding: name/import → photo → in (instead of 24 pre-seeded strangers)
      - Reminders that respect iOS: one morning "check-in" summary, don't over-notify
      - Accessibility (with design pass): bigger tap targets, stronger contrast, consistent spacing
      - Swipe gestures (with design pass): swipe a card to quick-log / delete
- ⏭️ Photo auto-ID (the AI piece). Decision recorded: start with **Plant.id** (plant-specialist, health detection, free tier) behind a tiny serverless key-proxy so the key stays private; add a general vision model later for freeform recommendations. Keep tap-to-pick fallback so it works offline. Auto-measure height needs a reference object or native AR — treat as rough/optional, not core.
- ⏭️ Alternate design directions: mock 2–3 visual looks to compare vs field-sketchbook, pick one
- ⏭️ Interaction polish: swipe-to-close sheets, smoother transitions, spacing pass
- ⏭️ On-phone acceptance test (camera / offline / reminder / backup round-trip)

## Queued
- 📋 **Plant Daddy dashboard** (centerpiece of the design pass): an interactive, living home view.
      - Hand-drawn home / room tiles; each room shows its plants as little evolving sketches.
      - The scene is alive: plant art already reflects health + growth, so the dashboard changes as
        plants thrive/grow/wilt; season or time-of-day can tint the paper.
      - Interactive: tap a plant to water/log or open it; glowing "due" cues; drag/move between rooms.
      - A pulse band up top: # thriving, # need water, gnat status, supplies low.
      - Builds directly on what exists (parametric art + rooms) → dovetails with the property layer below.
- 📋 Home / property layer (landing page): pick a home, filter by room, add another house/location.
      Rooms belong to a property; the app scales to multiple homes. Room-level sun/light context
      (windows, orientation, morning vs evening sun) feeds the care math. Feeds the dashboard above.
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
