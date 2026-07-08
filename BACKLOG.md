# Plant Daddy HQ — Backlog & Implementation Source of Truth

Synced to **`docs/V1-Product-Decisions.md`** (approved) and Product Bible v2.0. This file is now the
build tracker: V1 is organized **P0 → P1 → P2**, each item an **Epic** with **Stories**,
**Acceptance Criteria**, and **Dependencies**. Everything cut from V1 lives in **V2** or **Not Now** —
nothing appears in more than one section. Plant *data* never lives here; only plans.

Status key: ✅ done · 🔨 in progress · ⬜ not started

**V1 gate to ship:** all P0 + P1 complete · a stranger says "whoa" · a phone reset loses zero data.

---

## Shipped (MVP baseline — done)

- ✅ Core care engine: watering interval, feeding schedule, repot window, frustum pot volume (round & square) → cups.
- ✅ 24-plant seeded collection with species constants; evolving parametric art (growth × health).
- ✅ Repot ritual (pot → mix → roots + photo → 4-step gnat kill → review), writes pot/soil/root back to plant + timeline.
- ✅ Rooms + group-by-room + medium/attention/measured filters.
- ✅ Add plants beyond the 24 (manual + photo-capture scaffold); photo timeline + photo check-in.
- ✅ Quick-log Watered/Fed from Home; **Undo** on log + delete; delete a plant (with undo).
- ✅ Supplies view (BTI, nematodes, fertilizer, mix components from logs).
- ✅ Soil tab: mix calculator + "your plants on this mix" + "would also thrive here."
- ✅ Independent length/volume units; local-first IndexedDB; offline PWA; **manual** export/import backup.
- ✅ Installable PWA on GitHub Pages; network-first service worker + visible build stamp.

## Design direction — LOCKED (Botanist's Field Journal)

Aged toned paper, elegant serif titles (Latin names), handwritten margin notes, fine ink line +
selective watercolor, earthy muted palette, light + dark. Flow: Index → Study (specimen plate) →
Care (recipe + gnat steps) → Grow. Art: parametric line-wash evolves for daily; optional AI portrait
plate as the Study hero (V2). AI generates the drawing only; all text/data stays real UI. Token-based
reskin, built screen by screen. **Governing docs: `docs/VISUAL-CONSTITUTION.md` (the visual law) + `design/brand-board.html` (the North Star) + Product Bible §15.** Every UI task below is validated against the Visual Constitution's Design Review Gate before it ships.

---

# V1 — approved scope

## P0 — release gates (V1 cannot ship without these)

### Epic P0-1 · Automatic cloud backup ⬜  *(effort: L · risk: ~~High~~ → Medium after spike)*
The one non-negotiable: years of records must survive a lost phone or iOS storage eviction. One-way
automatic backup to the owner's **own Google Drive**, plus restore. Manual export/import stays as the
offline/portable path.

**Spike result (T0.4 ✅ PASS):** client-side **Google Identity Services token flow** + Drive REST `appDataFolder` works end-to-end **from an installed iOS PWA** (verified on device: connect → back up → restore round-trip, no secret in client). **Decision: build on this; no serverless proxy needed** (Plan B retired → epic risk drops High→Medium; no extra week). Carry-forward for the build: verify silent token refresh (`prompt:''`) for unattended backups; decide `appDataFolder` (private) vs a visible `drive.file` folder; keep the OAuth app in Testing for now. See `spike/README.md`.

**Stories**
- As an owner, I connect my Google Drive once so backups happen without me thinking about it.
- As an owner, my data backs up automatically (periodically + on meaningful change) to my Drive app folder.
- As an owner, I can restore my whole collection (plants, logs, photos) onto a fresh install or new device.
- As an owner, I can see backup status (last backup time, success/failure) and trigger a manual backup.
- As an owner, I can disconnect Drive; the app keeps working fully local.

**Acceptance Criteria**
- Fresh install → connect Drive → restore reproduces every plant, log entry, and photo byte-for-byte.
- A device reset (clearing IndexedDB) followed by restore results in **zero data loss**.
- Backup runs without opening a modal each time; failures surface a clear, non-blocking status.
- API credentials never ship in the static client (thin serverless proxy or Google client-side OAuth to the user's Drive only).
- Backup writes to the user's Drive only; plant data never touches our servers or the git repo.
- Works when offline by deferring the next backup; no data lost in the meantime.

**Dependencies**
- Backup/restore serialization can reuse the existing `DB.exportAll` / `DB.importAll` JSON format.
- Should land after **P2-4 (care-math assertion script)** exists so restore correctness can be spot-checked. ✅ (shipped)
- **Data schema frozen (T3.3, Sprint 3)** — build against the locked shape in `docs/DATA-SCHEMA.md` (enforced by the schema-lock test); any shape change follows that doc's change-control rule. This precondition is now satisfied.

### Epic P0-2 · Accessibility pass to WCAG 2.1 AA ✅ *(shipped v13 · effort: M · risk: Low)*
AA is a Bible §18 release gate. Fix the audit's a11y failures across the existing UI (no redesign).
**Visual Constitution guardrail:** accessibility must *reinforce* the Brand Board, not flatten it — achieve AA with **darker warm ink, never colder gray**. Canonical values `--faint #685e49`, `--muted #655c46`, text ink → **Ink Green `#2f3d2c`**; status = **specimen/archive tags** (not SaaS pills); functional emoji → **hand-drawn ink glyphs**; keyboard focus ring in **Bloom Blue `#5b6b86`**. Validate against the Design Review Gate. (Preview: `a11y.preview.html`.)

**Stories**
- As a low-vision user, all text and meaningful UI meets AA contrast.
- As a screen-reader user, icon-only buttons announce their purpose.
- As any user, status is never conveyed by color alone.
- As a touch user, primary controls are comfortably tappable.
- As a motion-sensitive user, animation respects my system setting.

**Acceptance Criteria**
- `--muted` and `--faint` (and any body/label text) raised to ≥ 4.5:1 on their backgrounds; large text ≥ 3:1. Verified with a contrast check.
- Plant-card health **dot gains a text/icon label** (e.g., "Watching") — no color-only status anywhere.
- Interactive targets ≥ 44×44px (quick-log, nav items, gear/close/nav-arrow icon buttons, chips).
- All icon buttons have `aria-label`; form fields have real labels.
- Visible focus state on every interactive element; logical focus order in sheets.
- `prefers-reduced-motion` disables the sheet-rise and any decorative motion.
- Decorative hand/serif fonts removed from functional controls (nav labels, filter chips) in favor of the data sans.

**Dependencies**
- Contrast values are edited in the token layer — coordinate with **P1-1 (Tokenize)**; do token extraction first as the enabler so both agree on final values.

---

## P1 — ship-defining

### Epic P1-1 · Tokenize the design system (light) 🔨 *(effort: M · risk: Low — color/font/shadow tokens shipped; radius/spacing + inline-SVG tail carried to Sprint 5 / release cleanup, not a functional blocker)*
Formalize the ad-hoc `:root` CSS variables into a documented, single-source token set for light mode.
Enables the AA fix now and dark mode later (V2). No visual redesign.

**Status (T0.3):** ✅ stylesheet **colors, fonts, shadows/scrims** tokenized in `index.html` (46 tokens; 0 orphan literals; proven pixel-identical by token back-substitution; `npm test` + `npm run check` green), and **Ink Green `--ink-green #2f3d2c`** + **Bloom Blue `--bloom #5b6b86`** tokens added per `docs/VISUAL-CONSTITUTION.md` §6. 🔨 **Remaining tail — carried to Sprint 5 / release cleanup (schema-neutral, not a functional blocker):** radius/spacing tokens + the ~6 inline SVG color literals in `js/app.js`.

**Stories**
- As a builder, every color/type/spacing/radius value is a named token in one place.
- As a builder, changing a token restyles the whole app with no markup edits.

**Acceptance Criteria**
- All hardcoded colors/type/radius/shadow consolidated into named tokens; no stray literals in component CSS.
- Token names are documented (a short comment block or `/design` note) with usage rules (serif/hand = accents, sans = data).
- App renders visually identical to today except the AA contrast adjustments from P0-2.

**Dependencies** — Pairs with P0-2 (shared color layer). No other blockers.

### Epic P1-2 · IA consolidation → 3 tabs (Home / Plants / Care) ✅ *(shipped v24 · effort: M · risk: Med)*
Drop from 4 tabs to 3. Remove the "Build/Plan" dev-notes tab. Create a unified **Care** hub that
absorbs the Soil content, the Supplies view, and a Repot-run entry point. No new features — only
re-homing and routing. **Visual Constitution:** the nav + Care hub must read *editorial*, not dashboard (§3, §10) — compose, don't template; one hero; remove chrome.

**Stories**
- As a user, the bottom nav shows Home · Plants · Care (plus FAB add + gear Settings).
- As a user, Care contains the mix calculator/recipes, the gnat protocol, Supplies, and a way into a repot run.
- As a user, the retired "Plan" content is gone; its reminders explainer already exists in Settings.

**Acceptance Criteria**
- Nav renders exactly 3 tabs with plain-sans labels (Home, Plants, Care); no orphaned routes to `build`.
- Care surface reachable in one tap; Soil calculator, Supplies, and gnat protocol all present under it.
- Supplies is no longer reachable only via a Today banner (it lives in Care); the Today entry may link into Care.
- No duplicate reminders explainer (kept in Settings, removed from the retired tab).
- All prior deep links/actions (open plant, run repot, supplies) still function.

**Dependencies** — Enables **P2-2 (Repot entry point + abandon-guard)**. Touches the same nav/render path as P1-6/P1-7.

### Epic P1-3 · Sort in the Plants index ✅ *(shipped v25 · effort: S–M · risk: Low)*
Add a sort control alongside existing search/filter. Ship **3 modes only**.

**Stories**
- As a user with many plants, I can sort A→Z, by due-soonest, or by recently added.

**Acceptance Criteria**
- A visible sort control offering exactly: **A→Z**, **Due soonest**, **Recently added**.
- Sort composes with existing search, filters, and group-by-room without conflict.
- Default sort is defined and stable; selection persists within the session.

**Dependencies** — Shares the Plants view with **P2-1 (relabel medium filters)**; build together.

### Epic P1-4 · Study page reorder (Reference / Ritual / Record) ✅ *(shipped v15–v23 · effort: M · risk: Low)*
Reorganize the detail page's existing cards into the Bible's three-job order; lighten re-renders;
clarify the two photo paths. No new content. **Visual Constitution — this is the Brand Board reclamation moment:** compose the Study as an actual **specimen plate** (hero drawing + 2×2 care grid + health/season **swatch strip** + collection date + **stamp/seal** + handwritten margin note), not a uniform card stack (§2, §3, §5). The plant is the hero; the interface recedes. Highest-leverage screen for the botanical identity — hold it hard to the Design Review Gate.

**Stories**
- As a user, the plant page reads top-to-bottom as Reference → Ritual → Record.
- As a user, changing a chip updates the page smoothly without a jarring full re-render.
- As a user, I understand the difference between "Photo check-in" and the "＋ photo" tile.

**Acceptance Criteria**
- Card order groups as Reference (vitals, place/light, medium, pot, watering, feeding, repot window) → Ritual (repot entry, gnat watch) → Record (photos, timeline, remove). **Photos no longer above Vitals.**
- Detail chip/segment taps route through `detailRefresh` (targeted update), not a full app `render()`; scroll and focus are preserved.
- Copy distinguishes the check-in (photo + confirm health) from the plain photo-attach tile.

**Dependencies** — Benefits from **P2-4 (care-math assertions)** to guarantee no math regressions during refactor.

### Epic P1-5 · Fix the Today CTA ✅ *(shipped v14 · effort: S · risk: Low)*
The prominent "Start a repot run" button doesn't start a run. Make label match behavior. Relabel only.

**Stories**
- As a user, the primary Today action does exactly what it says.

**Acceptance Criteria**
- The button is relabeled to reflect its real behavior (routing to choose a plant to repot), or wired to a direct picker — no misleading "start a run" that only filters.
- The confusing follow-up toast is removed or aligned with the new label.

**Dependencies** — Minor overlap with P1-2 (Care entry to repot); keep independent/relabel-first.

### Epic P1-6 · Rename "Identify by photo" (honest label) ✅ *(shipped v14 · effort: S · risk: Low)*
AI auto-ID is deferred to V2; the entry currently implies auto-identification. Align the label with
what it does today (attach a photo, then tap-to-pick the type).

**Acceptance Criteria**
- Add-menu option no longer promises automatic identification; copy reflects tap-to-pick + "auto-ID coming later."
- Tap-to-pick add flow unchanged and fully functional offline.

**Dependencies** — None.

### Epic P1-7 · FAB reposition fix ✅ *(shipped v14 · effort: S · risk: Low)*
The floating add button mispositions between ~440–452px viewport (`left:calc(50% + 148px)`).

**Acceptance Criteria**
- FAB sits fully on-canvas and clear of content/nav across phone widths (test ~360, 390, 414, 440, 452px).
- No overlap with the bottom nav or the last card on short screens.

**Dependencies** — None (touches shell CSS; coordinate with P1-1 token/shell edits).

---

## P2 — include if cheap (won't block the gate)

### Epic P2-1 · Relabel medium filters to plain words ✅ *(shipped v26 · effort: S · risk: Low)*
Raw taxonomy ("aroid/general/gritty") is opaque to a non-founder keeper. Rename filter labels to human terms; keep the underlying buckets.

**Acceptance Criteria** — Filter chips read in plain language; underlying filtering unchanged; no structural filter re-architecture.
**Dependencies** — Build with **P1-3 (sort)** — same view.

### Epic P2-2 · Repot abandon-guard + Care entry point ✅ *(shipped v27 · effort: S · risk: Low)*
Prevent silent loss of an in-progress repot run; add a way into the run from Care.

**Acceptance Criteria** — Closing a run mid-way asks to confirm before discarding progress; Care surface offers an entry into the repot run.
**Dependencies** — Requires **P1-2 (Care hub)**.

### Epic P2-3 · Minimal collection-health line on Home ✅ *(shipped v28 · effort: S · risk: Low)*
One computed line summarizing collection health from existing health values (the Analytics seed). Not a new surface.

**Acceptance Criteria** — Home shows a single line (e.g., "N thriving · M watching") derived from current `hi` values; no new screen, no stored analytics.
**Dependencies** — None.

### Epic P2-4 · Care-math assertion script ✅ *(effort: S · risk: Low — DONE)*
A tiny script asserting known care-math outputs, protecting the moat during the V1 refactors.

**Acceptance Criteria** — A runnable node script checks a handful of known values (e.g., Monstera pot volume ≈ 7.67 L, interval, LECA fixed feed, pet-safe flags) and fails loudly on regression. ✅ **Shipped:** `tests/care.test.js` + `package.json` (`npm test`), **30 assertions, all passing**; also `npm run check` syntax-checks all JS.
**Dependencies** — None; recommended **before** P0-1, P1-2, and P1-4.

---

# V2 — earned after V1's gate

*All V2 UI work (Nightfall dark mode, the living dashboard, analytics surface, AI portrait plates) is bound by `docs/VISUAL-CONSTITUTION.md` — especially §6 (Nightfall is a deep-forest twilight, not an inverted gray dashboard), §5 (AI makes the drawing only), and §10 (never a busy dashboard).*

- AI photo ID + health read (opt-in, serverless key-proxy; tap-to-pick + check-in scaffold already shipped).
- Dark mode / "Nightfall" (built on the P1-1 token layer).
- Opt-in anonymous telemetry (off by default; event counts only).
- Surface repot-windows + gnat re-checks on Home.
- The real **Grow / Field Guide** tab (learning + the user's collection roadmap).
- Base64-photo DOM/storage optimization (thumbnails/lazy timeline images).
- Living **Home/rooms dashboard**; **weather intelligence**; **analytics** surface; **automation v1** (batch/room actions, smart reminders, restock triggers).
- **Propagation** tracking; supplies **thresholds + restock**; **automatic multi-device sync** (over the Drive backend); room light context feeding care.
- **Engineering debt to revisit when scaling:** modularize the monolithic `app.js`; base64-photo DOM/storage optimization; a formal component gallery/library doc; a fuller automated test suite. *(A11y state hardening already lands in P0-2; minimal care-math checks in P2-4 — not duplicated here.)*

## Not Now / Not Until Proven (frozen behind a trigger)

- **UX nice-to-haves rejected for V1** (revisit only if a real need appears): tappable stat cards · mix-calculator visual polish · Study-page section anchors · filter grouping re-architecture.

- **Species lookup / plant database** — until real plants outside the seeded archetypes demand true per-species constants.
- **Multi-property / multi-home layer** — until a user manages ≥2 homes and single-home strains.
- **Rule-based automation** ("when X do Y") — until Automation v1 is used enough that users ask by name.
- **On-demand AI assistant** — until photo ID is proven/trusted and weather+analytics exist to reason over.
- **Local discovery** (events / nurseries) — until the core loop is loved and retention is proven.
- **Community layer** — only if it stays optional, kind, non-gamified AND users ask. Default: probably not.
- **Content-creator mode** — until Collector/Aesthete demand is measured, not assumed.
- **Native wrapper** — until iOS notification unreliability is proven blocking and no lighter fix works.
- **Widening to the Anxious-Beginner audience** — until the Intentional Keeper wedge is won with real users.
- **Townhouse / broader home-system integration** — parked with multi-property.

---

### How we work
- I edit files in this connected repo → you Commit + Push in GitHub Desktop → live in ~1 min.
- One commit per logical change, clear message. Revert from GitHub Desktop History if needed.
- This file is the build source of truth; the Master Doc is the care-math brain; the Bible is the constitution.
- **Every feature must pass the twelve-gate `docs/DEFINITION-OF-DONE.md` before it's "done."**
- **Every UI change must pass the Design Review Gate in `docs/VISUAL-CONSTITUTION.md` before it ships** — the visual law, peer to the Product Bible. If it fails the gate (feels like software, plant not the hero, wouldn't belong on the Brand Board), it's reworked or cut.
- **Every sprint ends with the Sprint Review ritual** (demo → dogfood 2–3 days → record friction → remove one interaction → fix one annoyance) — see `docs/V1-Execution-Plan.md`.
- Sequencing, effort, and risk for V1 live in `docs/V1-Execution-Plan.md`.
- **Dev checks:** `npm test` (care-math golden assertions) and `npm run check` (syntax-check all JS) should be green before any commit.
- **Cutting a release (cache-bust):** bump the version in BOTH `sw.js` (`CACHE = "hps-vN"`) and `js/app.js` (`BUILD = "vN"`) to the *same* number, and add a `WHATS-NEW.md` entry. The network-first service worker serves fresh files when online; the "build vN" stamp in Settings confirms the running version. *(Scratch files match `.gitignore` patterns `_*.mjs` / `*.preview.html` and never get committed.)*
