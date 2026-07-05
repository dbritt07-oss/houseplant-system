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

## Design direction — LOCKED (botanist's field journal)
The whole app reskins to a naturalist's botanical journal: aged toned paper, elegant italic serif
titles (Latin names), handwritten cursive margin notes, fine graphite/ink line + SELECTIVE
watercolor washes, watercolor swatch strips, specimen stamps, earthy muted palette (sage, olive,
ochre, terracotta, flower blues), light + dark. Flow: Index (landing = specimen collection) →
Study (plant detail as a specimen plate) → Care (soil mix as a recipe + gnat protocol as field
steps) → Field Guide (learn/roadmap). Art approach: TBD between parametric line-wash (evolves,
offline), AI watercolor plates (static, gorgeous), or hybrid (recommended: parametric for daily,
AI portrait plate per plant for the Study hero). AI generates the drawing only; all text/data
stays in the real UI (AI handwriting is gibberish). Fonts: add an elegant serif (e.g. Cormorant)
alongside Caveat (hand) + a clean label sans. Reskin is token-based → build screen by screen.

> **Aligned to Product Bible v2.0 (§0 Resolved Decisions + §14 Roadmap).** Buckets are now
> MVP → V1 → V2 → Not Now, gated by phase, not dated. Decisions: local-first **cloud-backed**;
> measurement = on-device insight + opt-in anonymous telemetry; it's a **product** (personal-first
> as method); build target = the **Intentional Keeper** only, through V1.

## V1 — "Beautiful, effortless, and safe" (next)
Theme: a joy to open *and* data that can't be lost. Scoped to be solo-buildable.
- ⏭️ **Automatic backup to the owner's Google Drive** + one-tap restore (silent periodic backup).
      *V1's most important non-visual feature* — the fix for iOS storage eviction. Manual export/import stays.
- ⏭️ Botanical-journal **design system** + **Light/Dark/Auto** (token-based), built screen by screen.
- ⏭️ **Study page** as specimen plate; **Home** as calm command center (due + repot windows + gnat re-checks).
- ⏭️ Sort & filter the Plants tab: A→Z, room, due-soonest, health, recently added; keep search + medium/attention.
- ⏭️ **Opt-in AI photo ID + health read** — start with **Plant.id** behind a serverless key-proxy; tap-to-pick
      fallback always present; fully skippable. (Auto-measure height stays rough/optional.)
- ⏭️ **Minimal on-device "collection health" readout** (Analytics seed; Layer-1 metrics made visible).
- ⏭️ **Opt-in anonymous telemetry** (OFF by default; event counts only, never plant data/photos/location).
- ⏭️ Health-at-a-glance: status dots + due badges on plant cards.
- ⏭️ **Accessibility pass** (release gate): AA-tuned palette, ≥44pt targets, contrast, spacing, reduced-motion.
- ⏭️ Interaction polish: swipe-to-close sheets, swipe-to-quick-log/delete, transitions.
- ⏭️ Process: maintain `WHATS-NEW.md` every release; on-phone acceptance test (camera / offline / reminder / backup round-trip).
- ⏭️ **Exit gate:** a stranger says *"whoa,"* AND a phone can be reset with zero data loss.

## V2 — "A plant world with a brain" (earned after V1's gate)
- 📋 Living **Home/rooms dashboard**: hand-drawn room tiles, plants as evolving sketches, pulse band
      (# thriving / need water / gnat status / supplies low), tap-to-care, drag between rooms.
- 📋 **Weather intelligence** — local forecast/daylight/temp/humidity modulates care (first server-dependent pillar).
- 📋 **Analytics** — fuller insights surface (health/growth trends, cadence, per-room/species patterns).
- 📋 **Automation v1** — batch/room actions ("water this room"), smart reminders, restock triggers (no rule engine yet).
- 📋 **Propagation** ("pup") tracking per Master Doc; **Supplies** low-stock thresholds + restock reminders.
- 📋 **Automatic multi-device sync** — additive layer over the same Drive backend as V1 backup.
- 📋 Room light context (windows, orientation, sun hours) feeding the care math.
- 📋 **Exit gate:** stays calm and fast at 100+ plants across multiple rooms.

## Not Now / Not Until Proven (frozen behind a trigger, not a date)
- 🚫 **Multi-property / multi-home layer** — until a real user manages ≥2 homes and single-home strains.
- 🚫 **Rule-based automation** ("when X do Y") — until Automation v1 is used enough that people ask by name.
- 🚫 **On-demand AI assistant** — until photo ID is proven/trusted and weather+analytics exist to reason over.
- 🚫 **Local discovery** (events / nurseries) — until the core loop is loved and retention is proven.
- 🚫 **Community layer** — only if it stays optional, kind, non-gamified AND users ask. Default: probably not.
- 🚫 **Content-creator mode** — until Collector/Aesthete demand is measured, not assumed.
- 🚫 **Native wrapper** — until iOS notification unreliability is proven blocking and no lighter fix works.
- 🚫 **Widening to the Anxious-Beginner audience** — until the Intentional Keeper wedge is won with real users.
- 🚫 **Townhouse / broader home-system integration** — parked with multi-property.

## Ideas (unsorted — triage into the buckets above)
- 💡 (add yours here)

## Owner amendment notes (drop quick notes here; we triage into the lists above)
- (add yours here)

---

### How we work
- I edit files directly in this connected repo → you Commit + Push in GitHub Desktop → live in ~1 min.
- One commit per logical change, clear message. Revert any commit from GitHub Desktop History if needed.
- This file + `Plant-Daddy-HQ-Roadmap.md` are the shareable scope. The Master Doc stays the brain.
