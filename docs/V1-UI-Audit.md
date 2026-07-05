# Plant Daddy HQ — V1 UI / UX Audit

**Audited against:** Product Bible v2.0 (§0 decisions, §4 principles, §12 IA, §15 design, §18 accessibility).
**Codebase:** `index.html` (235 lines, all CSS + shell), `js/app.js` (902 lines, whole controller), `js/{care,art,seed,db}.js`, `sw.js`.
**Scope:** audit only — no redesign. Grounded in the actual code, not memory.

**Legend.** Priority: **P0** = V1 blocker · **P1** = V1 important · **P2** = V1 polish · **P3** = V2+.
Difficulty: **S** ≤ half-day · **M** ~1–3 days · **L** = multi-day / architectural.

---

## How the app is actually built (context for the audit)

- **One controller, string-templated.** `app.js` renders every surface by building HTML strings and setting `innerHTML`. Almost every interaction calls `render()`, which rebuilds the *entire* app (top bar + tab body + nav + FAB + overlay) each time. Scroll position is manually preserved via `ST._renderKey`.
- **Two render paths on the detail sheet.** Slider/number drags use a targeted `detailRefresh()` (good, keeps focus), but chip/segment taps (medium, material, fertilizer, health, light, water, drainage) fall back to a full `render()`.
- **Navigation = 4 tabs + 2 hidden sheets.** Tabs: `today` ("The Sketchbook"), `plants` ("The Key"), `soil` ("Soil"), `build` ("The Plan"). Supplies and Settings are sheets reachable only from a Today banner / gear icon.
- **Data is local-only.** IndexedDB working copy + **manual** export/import JSON. There is **no automatic cloud backup** (the Bible v2 V1 requirement) and no telemetry or on-device analytics surface.
- **Design system is ~50% delivered.** The botanical-journal aesthetic exists (Fraunces / Caveat / Spline Sans, paper texture, `#wob` hand-wobble SVG filter, earthy tokens). But there is **no dark mode**, tokens aren't a documented system, and decorative fonts leak into critical UI.

---

## Per-screen audit

### 1. Today — "The Sketchbook" (`renderToday`)

- **Purpose:** the daily command center — what needs me now (water/feed due), collection pulse, entry to repot + supplies. Maps to Bible §12 **Home**.
- **What works well:** clear headline state ("Nothing thirsty today" vs "A few need you today"); 3-stat pulse (plants / water due / feed due); Due-now cards with inline 💧/🍽️ quick-log + Undo; a "Watching" section for unhealthy/rot plants; measurement-nudge banner. This is the strongest screen and closest to the Bible.
- **UX issues:** the primary **"Start a repot run" CTA is misleading** — `openrun` doesn't start a run; it switches to Plants, sets the "needs you" filter, and toasts "open a plant, then Run the repot protocol." A prominent button that doesn't do what it says. Repot windows *opening* and gnat re-checks are **not** surfaced here despite the Bible defining Home as showing them (§12).
- **UI issues:** two stacked banners (supplies + measurement) push Due-now below the fold; emoji glyphs (💧🍽️) as the main log affordance read casual against the premium aesthetic.
- **IA issues:** Supplies is a core "Care" object but is entered only via a Today banner. Stat cards aren't tappable (a "water due: 3" should filter to those 3).
- **Missing functionality:** on-device **collection-health readout** (Bible V1); tapping a stat to drill in; surfacing repot-window/gnat re-checks.
- **Accessibility:** quick-log buttons are 38×38 (< 44 target); emoji-only buttons have `title` but no accessible label; "Watching"/status conveyed partly by color.
- **Performance:** fine; re-renders whole app on quick-log, but the view is small.
- **Visual hierarchy:** good — headline → stats → actions → queue. The CTA's visual weight (sage filled) over-promises given its weak behavior.
- **Bible consistency:** strong on "fast daily" (§4.6) and "reference·ritual·record" eyebrow; diverges on Home's defined contents (repot/gnat surfacing) and the missing health readout.
- **Difficulty / Priority:** fix CTA **S/P1**; add health readout **M/P1**; surface repot+gnat **M/P2**.

### 2. Plants — "The Key" (`renderPlants`)

- **Purpose:** the specimen index — search, filter, group-by-room, open a plant. Bible §12 **Plants / The Collection**.
- **What works well:** 2-up specimen cards with evolving art or latest photo, page numbers, room labels, health dot; live search preserving caret; group-by-room; medium/attention/measured filters.
- **UX issues:** **no sort control at all** — Bible V1 and BACKLOG explicitly require sort (A→Z, room, due-soonest, health, recently added). Filter labels mix taxonomy ("aroid/general/gritty") with state ("needs you/done") in one scrolling row with no grouping; the meaning of raw medium codes isn't obvious to a non-founder.
- **UI issues:** filter chips render in **Caveat (hand font)** — decorative type on functional controls; active/inactive contrast is subtle.
- **IA issues:** "by room" is a filter toggle sitting next to content filters, conflating grouping with filtering.
- **Missing functionality:** sort; empty-search still shows the search box but a bare "Nothing matches"; no bulk/room actions.
- **Accessibility:** **health status is a color-only dot** (`.dot`) with no text/icon — direct violation of Bible §18 "don't rely on color alone"; card tap area good, but chips are ~26–30px tall (< 44).
- **Performance:** each keystroke triggers a full `render()` then re-focuses the input — works but wasteful; fine at 24, will still be fine at 100.
- **Visual hierarchy:** clean and on-brand; the filter row is the weak point.
- **Bible consistency:** good aesthetic match; **missing sort is the biggest V1 gap here.**
- **Difficulty / Priority:** add sort **M/P1**; restructure filters + label the mediums **M/P2**; status dot → dot+label **S/P1 (a11y)**.

### 3. Soil — "Soil & protocol" (`renderSoil`)

- **Purpose:** the mix/recipe reference + "your plants on this mix" + "would also thrive here" + gnat protocol summary. Partly Bible §12 **Care**.
- **What works well:** genuinely useful mix calculator (bucket × size → cups); cross-references the user's own plants onto mixes; soilless (LECA/Pon) feeding guidance; recommendations by archetype fit. High information value.
- **UX issues:** this tab is named "Soil" but is really the **Care** hub minus its other half — the **repot run lives on the plant page**, and **Supplies lives in a Today banner**. The three "Care" jobs are split across three entry points.
- **UI issues:** long single column of near-identical `.block` cards; the calculator's two native `<select>`s are the only non-card control and look system-default against the styled UI.
- **IA issues:** Care is fragmented (soil here, repot on plant page, supplies as a Today banner, gnat protocol duplicated here and in the repot flow).
- **Missing functionality:** no link from here into a repot run or supplies; no per-plant "make this mix" hand-off beyond opening the plant.
- **Accessibility:** native selects are actually a plus (accessible); muted body text (`--muted`, `--faint`) frequently fails contrast (see a11y section).
- **Performance:** fine.
- **Visual hierarchy:** flat — every block has equal weight; the calculator (the interactive heart) doesn't stand out.
- **Bible consistency:** content is on-mission; **IA placement contradicts the Bible's single "Care" hub.**
- **Difficulty / Priority:** re-home under a unified Care tab **M/P1**; elevate the calculator **S/P2**.

### 4. Build — "The Plan" (`renderBuild`)

- **Purpose:** currently a static roadmap + reminders explainer + "design layer" acquisition notes. Nominally Bible §12 **Grow / Field Guide**.
- **What works well:** honestly explains the three jobs and the iOS-notification caveat; the acquisition-steering idea aligns with the Bible's "curated, not accumulated."
- **UX issues:** this is **founder/dev-facing content, not user value** — it lists the *build* roadmap ("Build the app… Done. You're in it"), references the "Townhouse book" and "24 locked," and reads like project notes. A daily user has no reason to open it twice.
- **UI issues:** dense prose blocks; lowest daily utility of any tab yet occupies 25% of the nav.
- **IA issues:** it squats on the nav slot the Bible reserves for **Grow** (learning, collection roadmap, later local discovery). Reminders info is duplicated in Settings.
- **Missing functionality:** no actual learning/field-guide content; no per-plant "study/learn"; roadmap isn't the *user's* collection roadmap.
- **Accessibility:** wall-of-text; otherwise unremarkable.
- **Performance:** static, cheap.
- **Visual hierarchy:** undifferentiated.
- **Bible consistency:** **weakest alignment in the app** — occupies a primary tab with near-zero recurring value.
- **Difficulty / Priority:** replace concept **L/P1** (repurpose the slot; move reminders text to Settings).

### 5. Plant Detail — the "Study" page (`renderDetail` + `detailRefresh`)

- **Purpose:** the heart — full specimen page: art, vitals, place/light, medium, pot math, watering, feeding, repot window, gnat watch, photos, timeline, delete. Bible §12 **Study**.
- **What works well:** enormous, accurate function — live pot-volume drawing, unit-aware sliders with typeable number boxes, computed watering interval with snap-back to suggestion, honest "finger-check first" copy, remembered root condition, dated timeline with inline photos, prev/next paging. This is the product's substance.
- **UX issues:** **one very long scroll of ~11 stacked cards** with no in-page nav or collapsing — finding "feeding" means scrolling past pot math. **Photos card is first, above Vitals** — odd priority. Chip taps trigger full `render()` (brief flash / scroll juggle) rather than the lighter `detailRefresh()`.
- **UI issues:** heavy density; many similar cards; the todo/"still to finish" dashed card competes with content. Delete is a full card at the bottom (fine) but styled like every other block.
- **IA issues:** card order isn't grouped by the Bible's Reference/Ritual/Record model; Photos (Record) sits above Vitals (Reference).
- **Missing functionality:** no section jump/anchors; no AI health read (placeholder only, expected pre-V1); height auto-measure absent (acceptable).
- **Accessibility:** number inputs are good; but sliders lack visible labels tied via `for`; contrast of `.fac`/`.muted` helper text often < AA; segmented buttons ~30px tall.
- **Performance:** the targeted `detailRefresh` is well done; the concern is chip taps doing full app re-render, and **timeline photos inline as base64** in the DOM (heavy plants with many photos bloat the string).
- **Visual hierarchy:** within a card it's clear; across the page it's a uniform stack — nothing signals "the 3 things that matter today."
- **Bible consistency:** delivers §5 (Reference/Ritual/Record) in *content* but not in *structure*; aesthetic on-brand; needs the specimen-plate treatment (§15) and grouping.
- **Difficulty / Priority:** reorder + group into Reference/Ritual/Record **M/P1**; route chip taps through `detailRefresh` **S/P2**; section anchors **M/P2**.

### 6. Repot Run — bench mode (`renderRepot`, 5 steps)

- **Purpose:** the guided ritual — pot (same/new + shape + measure) → recommended mix → unpot & roots (+photo) → 4-step gnat kill → review & ink. Bible §5 **Ritual**, §12 Care.
- **What works well:** genuinely excellent — progress bar, plain-language BTI/nematode steps, realistic "prepare ~N cups" (headroom + root ball), writes pot/soil/root condition back to the plant and timeline, gated "next" until roots picked / steps checked. Best-designed flow in the app.
- **UX issues:** entered only from deep in the plant page (bottom of Study). "Back" within steps is a ghost button that's easy to miss; no way to abandon mid-run except the × (which drops progress silently).
- **UI issues:** step chrome is consistent; minor — the disabled "next" uses `ghost dim` which can read as tappable.
- **IA issues:** the ritual is invisible from the Care tab and from Today's (broken) CTA; discoverability is poor for the app's signature moment.
- **Missing functionality:** no "resume run"; no confirmation on abandon.
- **Accessibility:** checkrow targets are large (good); disabled-state relies on opacity + copy (acceptable), but no `aria-disabled`.
- **Performance:** fine.
- **Visual hierarchy:** strong and focused — a model for the rest of the app.
- **Bible consistency:** **high** — this is what "beauty with a job" looks like.
- **Difficulty / Priority:** add real entry points + abandon-guard **S–M/P2**; keep as the pattern to emulate.

### 7. Photo Check-in (`renderCheckin`)

- **Purpose:** snap → confirm health → note → attaches photo + timeline entry; the slot the AI health read drops into.
- **What works well:** clean 1-purpose flow; honest "AI coming soon, you have final say"; good scaffold.
- **UX issues:** two photo paths exist (check-in button vs the "＋ photo" tile) and the difference is explained in fine print — mildly confusing.
- **UI issues:** consistent with the sheet system; fine.
- **IA issues:** lives only on the plant page; reasonable.
- **Missing functionality:** the AI read itself (expected — V1); no multi-photo compare.
- **Accessibility:** health as a segmented control with labels (good, not color-only).
- **Performance:** compresses on capture (good).
- **Visual hierarchy:** clear.
- **Bible consistency:** good; this is the intended AI insertion point (§16).
- **Difficulty / Priority:** keep; clarify the two photo paths **S/P2**.

### 8. Add menu (`renderAddMenu`) + 9. Add plant (`renderAddPlant` / `createPlant`)

- **Purpose:** grow the library beyond the 24 — identify-by-photo (tap-to-pick now) or manual (name, type→archetype, room, toxicity).
- **What works well:** archetype picker sets art + starting care; sensible defaults (toxic=true is a safe default); photo pre-fills; fast.
- **UX issues:** "Identify by photo" implies auto-ID but currently just attaches a photo then you pick the type — the label over-promises (copy hedges it, but the entry name doesn't).
- **UI issues:** consistent; the archetype chips are unlabeled by example plants beyond the `read` line.
- **IA issues:** FAB is the only entry — fine.
- **Missing functionality:** no species search/database (the founder's 24 are hand-seeded; a stranger typing "Hoya" gets a generic archetype, not real constants) — the Bible's unspoken species-data gap surfaces here.
- **Accessibility:** segmented toxicity control labeled; inputs have placeholders but no `<label>`.
- **Performance:** fine.
- **Visual hierarchy:** clear.
- **Bible consistency:** matches "constants ship; variables entered" for the 24, but exposes the no-species-DB limitation for new plants.
- **Difficulty / Priority:** rename/reframe "Identify by photo" until AI ships **S/P1**; species lookup **L/P3**.

### 10. Supplies (`renderSupplies`)

- **Purpose:** collection-level totals — BTI/nematode doses, fertilizer used, mix components for a full-collection repot.
- **What works well:** derived entirely from logs + current pots; useful restock target; on-brand.
- **UX issues:** **buried** — only reachable from one Today banner; no low-stock thresholds/reminders (that's V2, correctly).
- **UI issues:** consistent block styling.
- **IA issues:** belongs in the Care hub, not a Today banner.
- **Missing functionality:** thresholds/restock (V2); manual stock counts.
- **Accessibility:** text-based, ok; contrast of `.amt`/muted text is the usual risk.
- **Performance:** fine.
- **Visual hierarchy:** flat block list.
- **Bible consistency:** content aligned; placement isn't.
- **Difficulty / Priority:** re-home into Care **S/P1**.

### 11. Settings & backup (`renderSettings`)

- **Purpose:** units (length/volume), manual backup export/import, reminders (honest iOS caveat), reset, build stamp.
- **What works well:** independent length/volume pickers; refreshingly honest reminders copy; visible build stamp for verification; reset warns to export first.
- **UX issues:** **backup is manual only** — the Bible v2 makes automatic cloud backup a V1 requirement; relying on the user to remember export is exactly the failure mode §20 now rejects. **No theme toggle** (light/dark is a V1 item). "Reset" is a foot-gun sitting one tap from a `confirm()`.
- **UI issues:** consistent; the primary/ghost button treatment is clear.
- **IA issues:** reminders explainer duplicates the Build tab's.
- **Missing functionality:** **auto Google-Drive backup + restore**; theme switch; opt-in anonymous telemetry toggle (V1); export success/restore confirmation beyond a toast.
- **Accessibility:** segmented unit controls labeled; buttons full-width (good targets); gear entry icon is 34px (< 44) and unlabeled.
- **Performance:** fine.
- **Visual hierarchy:** clear.
- **Bible consistency:** **the auto-backup gap is the single biggest V1 divergence in the whole app.**
- **Difficulty / Priority:** auto cloud backup **L/P0**; theme toggle **M/P1**; telemetry opt-in **S/P1**.

### Global chrome — top bar, bottom nav, FAB, toast

- **Top bar:** sticky, blurred, shows app name + tab subtitle + date + gear. Good. Gear is a 34px unlabeled icon button.
- **Bottom nav (4 tabs):** labels are `today / key / soil / plan` in **Caveat**, with line-art icons. The cutesy names ("key", "plan") and hand-font labels hurt scannability and diverge from the Bible's Home / Plants / Care / Grow. Nav is fixed, max-width 440, safe-area padded (good).
- **FAB:** positioned `left:calc(50% + 148px); bottom:78px`, with a `@media(max-width:452px)` fallback to `right:16px`. Between ~440–452px the absolute-left math can push it partly off-canvas or over content; it also floats just above the nav and can overlap the last card / the nav on short screens.
- **Toast + Undo:** single toast root, 5s Undo window, covers water/feed/delete. Excellent — directly answers the competitor "can't undo" complaint (Bible §8).

---

## Component decision table

| Current component | Keep | Modify | Replace | Delete | Reason |
|---|:--:|:--:|:--:|:--:|---|
| Bottom tab nav (4) | | ✅ | | | Rename to Home/Plants/Care/Grow; drop hand-font labels for legibility (§12, §18). |
| Today view | ✅ | ✅ | | | Strong bones; fix the CTA, add health readout, surface repot/gnat. |
| "Start a repot run" CTA | | ✅ | | | Misleading — must either start a run or be relabeled. |
| Plant index + cards | ✅ | ✅ | | | Add sort; status dot needs a label (a11y). |
| Filter chip row | | ✅ | | | Separate grouping from filtering; label mediums; drop hand font. |
| Soil tab | ✅ | ✅ | | | Content is gold; fold into a unified Care hub. |
| **Build / "The Plan" tab** | | | ✅ | | Dev/founder content on a primary tab; replace with Grow (learning/roadmap). |
| Plant Detail (Study) | ✅ | ✅ | | | Keep function; reorder into Reference/Ritual/Record, lighten re-renders. |
| Repot run flow | ✅ | | | | Best flow in the app; the pattern to emulate. Add entry points only. |
| Photo check-in | ✅ | ✅ | | | Keep; clarify vs the ＋ photo tile. |
| Add menu / Add plant | ✅ | ✅ | | | Reframe "Identify by photo" until AI ships. |
| Supplies sheet | ✅ | ✅ | | | Re-home into Care; keep the log-derived math. |
| Settings sheet | ✅ | ✅ | | | Add auto-backup, theme toggle, telemetry opt-in. |
| **Manual-only backup** | | | ✅ | | Replace with automatic cloud backup + manual export as the portable path (§20, P0). |
| Reminders explainer (Build) | | | | ✅ | Duplicate of Settings; remove from the tab. |
| Toast + Undo | ✅ | | | | Keep as-is; a signature strength. |
| Card / chip / segmented / slider kit | ✅ | ✅ | | | Keep visually; harden into a documented token-based library with a11y states. |
| `#wob` hand-wobble filter, paper texture | ✅ | | | | Core identity; keep. |
| Full-app `render()` on every action | | ✅ | | | Keep the model at this scale; scope re-renders on the detail sheet. |

---

## 1. V1 UI Audit (summary)

The app is a **functionally rich, aesthetically coherent v0.9** that already embodies the botanical-journal direction and nails the hard domain math and the repot ritual. It is held back for V1 by four things, in order: (1) **no automatic data safety** (manual backup only); (2) **IA drift from the Bible** — Care is fragmented and a primary tab ("Plan") carries dev notes; (3) **missing table-stakes UX** — no sort, a lying CTA; (4) **accessibility below the Bible's own AA release gate** — muted/faint text fails contrast, status is color-only, many targets < 44px, decorative fonts on controls, no dark mode, no reduced-motion handling. None require a rewrite; all are edits on solid bones.

## 2. Critical UX problems (ranked)

1. **No automatic backup** — years of records depend on the user remembering to export; iOS can evict storage. **P0.**
2. **"Start a repot run" doesn't start a run** — the most prominent action misleads. **P1.**
3. **No sort in the collection** — required by the Bible/BACKLOG; core to scale. **P1.**
4. **Care is fragmented** — soil (tab), repot (plant page), supplies (Today banner), gnat protocol (twice). One hub is missing. **P1.**
5. **"Plan" tab has no recurring user value** — a primary nav slot spent on dev/roadmap notes. **P1.**
6. **Detail page is an undifferentiated 11-card scroll** — no grouping, Photos above Vitals, no jump. **P1.**
7. **Accessibility fails the Bible's own gate** — contrast, color-only status, sub-44 targets. **P1.**

## 3. Highest-ROI improvements (effort → payoff)

1. **Fix the Today CTA** (S) — turn a lie into a working shortcut; instant trust. **P1.**
2. **Add sort to Plants** (M) — closes the biggest table-stakes gap. **P1.**
3. **Status dot → dot + label; lift muted/faint contrast to AA** (S–M) — unblocks the a11y gate cheaply. **P1.**
4. **Replace the "Plan" tab with a unified "Care" hub** (M) — de-fragments soil + repot + supplies + protocol and frees a nav slot. **P1.**
5. **Automatic Google-Drive backup** (L) — the one P0; biggest risk retired. **P0.**
6. **Reorder the Study page into Reference / Ritual / Record** (M) — makes the heart legible without new features. **P1.**
7. **Dark mode via the existing tokens** (M) — high perceived-premium payoff; the tokens already exist. **P1/P2.**

## 4. Technical debt

- **Monolithic 902-line `app.js`** — views, state, events, camera, notifications, backup in one file; will resist team work and testing. *(Refactor into modules; not urgent at N=1.)*
- **Full-app `innerHTML` re-render on most actions** — fine at 24 plants; the detail sheet already needed a targeted path and scroll-preservation hacks (`_renderKey`). Chip taps still full-render.
- **Base64 photos inline in the DOM and re-serialized on every `savePlant`** — memory/GC pressure as photo history grows; timeline embeds full data URLs.
- **No build/tokens pipeline** — CSS is one 200-line `<style>`; theming and reskin (Bible §15 "token-first") aren't a system yet.
- **Stray `_*.mjs` scratch files** in the repo root (git-ignored but present).
- **No tests** — care math is unit-verifiable (Bible §20 claims it) but nothing is codified.
- **Service worker cache versioning is manual** (`CACHE`/`BUILD` bumped by hand).

## 5. Design debt

- **Decorative fonts on functional UI** — Caveat on nav labels, filter chips, stat labels, eyebrows; Bible §18 restricts hand/serif to accents, data to the sans.
- **Contrast** — `--faint` (#a89d82) and often `--muted` (#7c7157) on paper fall below AA for body text; the journal palette is untuned against the Bible's own gate.
- **No dark mode** ("Nightfall") despite being a V1 design item and a token swap.
- **Color-only status** — plant-card health dot has no text/icon pairing.
- **Inconsistent naming metaphor** — "The Sketchbook / The Key / The Plan" vs the Bible's Home/Plants/Care/Grow; two vocabularies.
- **Uniform card weight** — every surface is the same `.block`/`.pcardb`; nothing signals hierarchy or "today's 3 things."
- **Study page not yet a "specimen plate"** (§15) — it's a functional stack, not the composed plate the design direction promises.
- **No motion layer** (intentional per §15 "motion later") — noted, not a defect.

## 6. Suggested component library (formalize what exists)

Keep the hand-drawn identity; promote the ad-hoc classes into a documented, token-driven kit with explicit states (default/hover/focus/active/disabled) and AA-checked colors:

- **Foundations:** color tokens (light + dark), type scale (display serif / hand accent / data sans with usage rules), spacing, radius (the irregular `5px 14px 6px 12px` "torn" radius is signature — keep, tokenize), elevation (the offset "sketch" shadow), the `#wob` filter, paper texture.
- **Primitives:** Button (primary/ghost/danger), IconButton (≥44px, labeled), Chip/Pchip (selectable), SegmentedControl, Slider+NumberField pair, TextField/TextArea with real labels, Select, Card (`block`/`pcardb`), Sheet/Overlay, Toast+Undo.
- **Domain components:** SpecimenCard (grid), QueueCard (with quick-log), StatCard (make tappable), PotDrawing (SVG), Timeline, RecipeRow, CheckStep (repot), StatusPill (dot **+ label**), Health/Due Badge, RoomHeader, ProgressSteps.
- **Delivery:** a single tokens file + a living component gallery page in `/design`. This is the concrete form of Bible §15 "token-first."

## 7. Revised navigation (proposed — audit view, not a redesign)

Align the nav to Bible §12 and free the wasted slot:

- **Home** (was "today/Sketchbook") — pulse + due + repot windows + gnat re-checks + health readout.
- **Plants** (was "key") — index with **sort** + filter + group.
- **Care** (new hub; absorbs "soil") — mix calculator/recipes **+** repot-run entry **+** supplies **+** gnat protocol in one place.
- **Grow** (replaces "Plan/Build") — learning/field-guide + the *user's* collection roadmap + (later) local discovery.
- **Global:** FAB (reposition to avoid the 440–452px overlap), top-bar gear → Settings, Study/Repot/Check-in/Add as sheets. Keep 4 tabs; just rename, re-home, and repurpose.

## 8. Updated screen inventory

**Tabs (4):** Home · Plants · Care · Grow.
**Primary sheets (7):** Plant Detail (Study) · Repot Run (5 steps) · Photo Check-in · Add menu · Add plant · Supplies *(moving into Care)* · Settings.
**Global components:** Top bar · Bottom nav · FAB · Toast/Undo · Camera input · Import input.
**Net changes for V1:** rename 4 tabs; **replace** Build→Grow; **create** a Care hub (re-homing Soil + Supplies + Repot entry); **add** sort, auto-backup, theme toggle, telemetry opt-in, health readout; **fix** the Today CTA, status-dot a11y, contrast, and FAB position.

---

*V1 UI Audit — grounded in the committed code as of build v12. Audit only; no redesign performed. Next step on your call: prioritize into a V1 execution plan.*
