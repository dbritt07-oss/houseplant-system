# Plant Daddy HQ — V1 Engineering Execution Plan

**Role:** Staff Engineering Manager / TPM. **Inputs only:** Product Bible v2.0, `docs/V1-Product-Decisions.md`, `BACKLOG.md`, `docs/V1-UI-Audit.md`, `docs/VISUAL-CONSTITUTION.md`.

> **Design law:** every UI-touching task below (T0.3, T1.1, T2.1, T3.1, T3.2) must pass the **Design Review Gate in `docs/VISUAL-CONSTITUTION.md`** before it's done — accessibility and craft are held together, never traded. If a change is functional but feels like software rather than a botanical artifact, it is reworked or cut.
**Assumptions:** one full-time solo founder-dev · existing codebase (extend, do not rebuild) · shipping V1 is the only objective · tech debt is touched only when it directly reduces implementation risk.
**No UI redesign. No scope change. No new features.**

**Capacity model:** 1 sprint = 1 week ≈ **25–30 focused dev hours** (a solo founder also does non-eng work). Estimates are in dev-hours.
**V1 launch gate (from the Bible):** all P0 + P1 done · a stranger says "whoa" · a phone reset loses zero data · WCAG AA passes.

---

## Task catalog (every task, fully specified)

Format per task: **Sprint · Epic · Story · Task — Why · Deps · Effort(h) · Risk · DoD · Testing · User-visible impact.**

### FOUNDATION

**T0.1 — S0 · P2-4 · "known care values are locked" · Write care-math assertion script**
- *Why:* the care math is the moat; upcoming refactors (IA, Study) must not silently break it.
- *Deps:* none. *Effort:* 4h. *Risk:* Low.
- *DoD:* a runnable `npm test` (node script) asserts ≥8 known outputs (e.g., Monstera `potVolL`≈7.67 L, its interval, LECA fixed feed, only Scarlet-star + Pineapple pet-safe, round vs square volume, inch round-trips) and exits non-zero on mismatch.
- *Testing:* the script itself is the test; run green before and after every later epic.
- *User-visible impact:* none (safety net).

**T0.2 — S0 · (repo hygiene) · "clean, buildable repo" · Remove scratch files, add scripts, verify SW versioning**
- *Why:* stray `_*.mjs` files and manual cache bumps add refactor risk.
- *Deps:* none. *Effort:* 3h. *Risk:* Low.
- *DoD:* `_*.mjs` removed; `package.json` with `test` + a syntax-check script; documented `CACHE`/`BUILD` bump step; `.gitignore` verified.
- *Testing:* `npm test` runs; app still loads; SW registers.
- *User-visible impact:* none.

**T0.3 — S0 · P1-1 · "one source of style" · Extract CSS into a documented light-mode token set**
- *Why:* enabler for the AA fix (P0-2) and all visual work; Bible §15 "token-first."
- *Deps:* none (do before P0-2). *Effort:* 10h. *Risk:* Low.
- *DoD:* every color/type/radius/shadow lives as a named `:root` token with a usage comment (serif/hand = accents, sans = data); no literals left in component CSS; app renders pixel-identical to today.
- *Testing:* visual diff of each screen before/after (screenshots); no functional change.
- *User-visible impact:* none yet (invisible refactor).

**T0.4 — S0 · P0-1 · "prove Drive backup is possible" · Technical spike: Google Drive OAuth + appDataFolder round-trip**
- *Why:* the P0 launch gate hinges on an unproven external integration; de-risk before committing to the full build. This is the single highest-risk unknown.
- *Deps:* none. *Effort:* 8h. *Risk:* **High**.
- *DoD:* a throwaway PoC connects a Google account **from an installed PWA on iOS Safari**, writes a JSON blob to the user's Drive `appDataFolder`, reads it back, and confirms key storage without shipping a secret in the client. A one-page findings note records the chosen auth path (client-side Google Identity Services vs. thin serverless proxy) and any iOS gotchas.
- *Testing:* manual round-trip on a real iPhone-installed PWA + one desktop browser.
- *User-visible impact:* none (spike code is discarded).

### ACCESSIBILITY & QUICK WINS

**T1.1 — S1 · P0-2 · "the app passes AA" · Accessibility pass across existing UI**
- *Why:* AA is a Bible §18 release gate; the audit found contrast, color-only status, small targets, missing labels.
- *Deps:* T0.3 (tokens hold the color values). *Effort:* 14h. *Risk:* Low (but may force minor palette tweaks).
- *DoD:* `--muted`/`--faint`/body text ≥ 4.5:1 (large ≥ 3:1); plant-card health **dot gains text/icon label**; all interactive targets ≥ 44×44; every icon button has `aria-label`; visible focus states; `prefers-reduced-motion` disables sheet-rise/decorative motion; hand/serif fonts removed from nav labels + filter chips.
- *Testing:* automated contrast check on the token palette; keyboard-only pass; VoiceOver spot-check of Home/Plants/Study; reduced-motion toggle.
- *Visual Constitution:* achieve AA with **darker warm ink, not gray** (`--faint #685e49`, `--muted #655c46`, ink → **Ink Green #2f3d2c**); status as **specimen tags** not SaaS pills; functional emoji → **ink glyphs**; focus ring in **Bloom Blue #5b6b86**. Preview: `a11y.preview.html`. Must pass the Design Review Gate.
- *User-visible impact:* legible text, labeled status, comfortable taps, calmer motion — the "premium" step-up, **warmer not flatter**.

**T1.2 — S1 · P1-7 · "the add button sits right" · Fix FAB position across widths**
- *Why:* `left:calc(50% + 148px)` mispositions at ~440–452px.
- *Deps:* T0.3. *Effort:* 2h. *Risk:* Low.
- *DoD:* FAB fully on-canvas, clear of nav/last card at 360/390/414/440/452px.
- *Testing:* responsive check at those widths.
- *User-visible impact:* the add button no longer clips or overlaps.

**T1.3 — S1 · P1-5 · "the main action is honest" · Relabel/repair the Today CTA**
- *Why:* "Start a repot run" doesn't start a run — a prominent lie erodes trust (§4.2).
- *Deps:* none. *Effort:* 3h. *Risk:* Low.
- *DoD:* the CTA label matches behavior (routes to pick a plant to repot); the misleading toast is removed/aligned.
- *Testing:* tap it; confirm destination matches the label.
- *User-visible impact:* the headline action does what it says.

**T1.4 — S1 · P1-6 · "no false AI promise" · Rename "Identify by photo"**
- *Why:* AI auto-ID is deferred to V2; the label over-promises (§4.2, §16).
- *Deps:* none. *Effort:* 1h. *Risk:* Low.
- *DoD:* add-menu copy reflects attach-photo + tap-to-pick, "auto-ID later"; flow unchanged and offline-capable.
- *Testing:* run the add-by-photo path; verify copy.
- *User-visible impact:* honest expectation on the add flow.

### IA CONSOLIDATION & COLLECTION

**T2.1 — S2 · P1-2 · "three clear tabs" · Consolidate nav to Home / Plants / Care; remove Build; build the Care hub**
- *Why:* Care is fragmented (soil tab, supplies banner, repot on plant page) and a primary tab holds dev notes; the audit calls for one Care hub and 3 tabs.
- *Deps:* T0.1 (assertions guard any care-path moves), T0.3. *Effort:* 14h. *Risk:* **Med** (touches the central render/router).
- *DoD:* nav renders exactly Home/Plants/Care with plain-sans labels; the `build` route and its dev content are gone; Care contains the mix calculator/recipes, gnat protocol, Supplies, and a repot-run entry; the Settings reminders explainer is the only copy of it; all prior actions (open plant, run repot, open supplies) still work.
- *Testing:* click every nav + deep action; `npm test` green; regression pass of Soil/Supplies content.
- *User-visible impact:* a simpler, coherent nav; Care is one place.

**T2.2 — S2 · P1-3 · "find any plant fast" · Add sort to the Plants index (3 modes)**
- *Why:* table-stakes at scale; required by Bible/BACKLOG.
- *Deps:* T2.1 recommended (same view churn), not hard. *Effort:* 6h. *Risk:* Low.
- *DoD:* a sort control with exactly A→Z, Due soonest, Recently added; composes with search/filter/group-by-room; default defined; persists in session.
- *Testing:* each sort × with a filter and with group-by-room.
- *User-visible impact:* the collection is orderable.

**T2.3 — S2 · P2-1 · "readable filters" · Relabel medium filters to plain words**
- *Why:* raw "aroid/gritty" is opaque to a non-founder keeper.
- *Deps:* build with T2.2 (same view). *Effort:* 2h. *Risk:* Low.
- *DoD:* chips read in plain language; buckets unchanged; no structural filter change.
- *Testing:* filter each bucket; confirm results unchanged.
- *User-visible impact:* filters make sense to a stranger.

**T2.4 — S2 · P2-2 · "don't lose a repot run" · Repot abandon-guard + Care entry point**
- *Why:* closing a run mid-way silently drops progress; and the ritual is hard to discover.
- *Deps:* **T2.1** (Care hub must exist for the entry). *Effort:* 4h. *Risk:* Low.
- *DoD:* closing an in-progress run asks to confirm before discarding; Care offers a path into a repot run.
- *Testing:* start a run, attempt to close, confirm guard; launch a run from Care.
- *User-visible impact:* the signature ritual is safer and easier to reach.

### STUDY PAGE & HOME

**T3.1 — S3 · P1-4 · "the plant page reads right" · Reorder Study into Reference/Ritual/Record + lighten re-renders + clarify photo paths**
- *Why:* the heart is an undifferentiated 11-card scroll with Photos above Vitals; chip taps do full re-renders; two photo paths confuse.
- *Deps:* T0.1 (assertions), T0.3. *Effort:* 12h. *Risk:* Low.
- *DoD:* cards grouped Reference → Ritual → Record (Photos no longer above Vitals); detail chip/segment taps route through `detailRefresh` (not full `render()`), preserving scroll+focus; copy distinguishes "Photo check-in" from the "＋ photo" tile.
- *Testing:* change every chip/segment and confirm no scroll jump + values persist; `npm test` green; verify timeline/photos intact.
- *Visual Constitution — Brand Board reclamation:* this is the highest-leverage screen for the botanical identity. Compose the Study as an actual **specimen plate** (hero drawing + 2×2 care grid + health/season **swatch strip** + collection date + **stamp/seal** + margin note), not a uniform card stack (VC §2/§3/§5). The plant is the hero; chrome recedes. Hold hard to the Design Review Gate.
- *User-visible impact:* a legible, smoother specimen page.

**T3.2 — S3 · P2-3 · "a glance at collection health" · Minimal collection-health line on Home**
- *Why:* the Analytics seed (Bible V1), shrunk to one computed line — no new surface.
- *Deps:* none. *Effort:* 3h. *Risk:* Low.
- *DoD:* Home shows one line (e.g., "N thriving · M watching") from current health values; nothing stored; no new screen.
- *Testing:* change a plant's health; confirm the line updates.
- *User-visible impact:* an at-a-glance pulse.

**T3.3 — S3 · (stabilization) · "no regressions before the gate" · Refactor-settle + regression buffer**
- *Why:* the data model must be stable before backup serializes it.
- *Deps:* T2.1, T3.1. *Effort:* 6h. *Risk:* Low.
- *DoD:* data shape (plants/logs/photos/settings) frozen and documented; full manual regression of all flows; `npm test` green.
- *Testing:* end-to-end manual pass; export a JSON and eyeball the schema.
- *User-visible impact:* none (stability).

### THE P0 GATE — BACKUP

**T4.1 — S4 · P0-1 · "connect my Drive once" · Google Drive auth + connection UI**
- *Why:* one-way automatic backup to the owner's own Drive is the data-safety gate.
- *Deps:* **T0.4 spike**, **T3.3 stable schema**. *Effort:* 8h. *Risk:* **High**.
- *DoD:* one-time connect from Settings using the spike's chosen path; no secret in the static client; disconnect leaves the app fully local.
- *Testing:* connect/disconnect on iOS-installed PWA + desktop; confirm no credentials in the bundle.
- *User-visible impact:* a "Back up to Google Drive" connection in Settings.

**T4.2 — S4 · P0-1 · "it backs up without me thinking" · Automatic backup + status**
- *Why:* manual export fails real humans; iOS can evict storage.
- *Deps:* T4.1. *Effort:* 8h. *Risk:* Med.
- *DoD:* backup runs periodically and on meaningful change to Drive `appDataFolder`; Settings shows last-backup time + success/failure; offline defers safely with no data loss.
- *Testing:* trigger changes, verify Drive writes; airplane-mode deferral; failure surfaces non-blocking status.
- *User-visible impact:* silent, visible-status auto-backup.

**T4.3 — S4 · P0-1 · "restore loses nothing" · Restore + zero-data-loss verification**
- *Why:* backup is only real if restore is byte-complete.
- *Deps:* T4.2. *Effort:* 8h. *Risk:* **High**.
- *DoD:* fresh install → connect → restore reproduces every plant, log, and photo; a full IndexedDB wipe followed by restore yields **zero data loss**; manual export/import still works as the offline path.
- *Testing:* the launch-gate test — wipe → restore round-trip on a real device, diffed against a pre-wipe export; corrupt-file handling.
- *User-visible impact:* a phone can die and the collection comes back.

### HARDENING & LAUNCH

**T5.1 — S5 · (QA) · "it holds up everywhere" · Full QA checklist pass** — Deps: all above. Effort: 10h. Risk: Med. DoD: the launch QA checklist (below) fully green. Testing: cross-device + a11y + data-safety + PWA. Impact: a trustworthy release.

**T5.2 — S5 · (hardening) · "fix what QA finds" · Bug-fix buffer** — Deps: T5.1. Effort: 10h. Risk: Med. DoD: all P0/P1 defects closed; no known data-loss or a11y-gate failures. Testing: re-run failed cases. Impact: stability.

**T5.3 — S5 · (release) · "ship it" · Version bump + release** — Deps: T5.2. Effort: 4h. Risk: Low. DoD: `BUILD`/`CACHE`→v1.0, manifest checked, `WHATS-NEW.md` updated, tagged `v1.0.0`, deployed via Pages, install verified. Testing: post-deploy smoke test. Impact: **V1 is live.**

---

## Sprint plan

### Sprint 0 — Foundation & de-risk
- **Goal:** make the codebase safe to change and prove the riskiest unknown (Drive backup) before committing to it.
- **Deliverables:** care-math assertion script; clean repo + npm scripts; tokenized light-mode styles; Drive OAuth spike findings note.
- **Exit criteria:** `npm test` green; app renders pixel-identical on tokens; spike has a documented, working auth+round-trip path (or a fallback decision).
- **Demo milestone:** "Run `npm test`; show the app unchanged on the new token layer; show a JSON blob written to and read from my Drive from the installed PWA."

### Sprint 1 — Accessibility gate + quick wins
- **Goal:** clear the AA release gate and land the cheap, high-trust fixes.
- **Deliverables:** full accessibility pass; FAB fix; honest Today CTA; renamed add-by-photo.
- **Exit criteria:** AA verified (contrast/targets/labels/focus/reduced-motion); FAB/CTA/label correct.
- **Demo milestone:** "VoiceOver reads the app; contrast checker passes; the FAB and CTA behave; add-by-photo is honestly labeled."

### Sprint 2 — IA consolidation + collection
- **Goal:** three coherent tabs and a findable collection.
- **Deliverables:** Home/Plants/Care nav; Care hub (soil + supplies + repot entry); Build removed; sort (3 modes); plain-language filters; repot abandon-guard.
- **Exit criteria:** 3 tabs, no `build` route, all prior actions work; sort+filter+group compose; abandon-guard fires; `npm test` green.
- **Demo milestone:** "Tour the 3 tabs; sort and filter the collection; start a repot run from Care and get guarded on close."

### Sprint 3 — Study page + Home + stabilize
- **Goal:** make the heart legible and freeze the data model for backup.
- **Deliverables:** Study reordered to Reference/Ritual/Record with smooth chip updates; collection-health line on Home; documented, frozen data schema; regression pass.
- **Exit criteria:** Study reads R/R/R with no re-render jumps; health line live; schema documented; full regression green.
- **Demo milestone:** "Scroll the new Study page, change chips with no jump; see the health line on Home."

### Sprint 4 — Automatic backup (the P0 gate)
- **Goal:** make data unloseable.
- **Deliverables:** Drive connect UI; automatic backup + status; restore with zero-data-loss verification.
- **Exit criteria:** wipe→restore round-trip loses nothing on a real device; auto-backup + status work; disconnect stays local.
- **Demo milestone:** "Wipe the app, restore from Drive, everything returns — plants, logs, photos."

### Sprint 5 — Hardening, QA & launch
- **Goal:** ship a trustworthy V1.
- **Deliverables:** full QA pass; bug fixes; v1.0.0 tagged and deployed.
- **Exit criteria:** launch QA checklist green; no P0/P1 defects; live and installable.
- **Demo milestone:** "Install v1.0.0 from the live URL on a fresh phone; run the end-to-end slice."

---

## Program analysis

**Critical path (longest chain to launch):**
`T0.4 spike` → `T2.1 IA` → `T3.1 Study` → `T3.3 schema freeze` → `T4.1 → T4.2 → T4.3 backup` → `T5.1 QA` → `T5.3 release`.
Backup is the long pole; it cannot be shortened by parallelism (solo dev) and depends on a stable schema, so the S2–S3 refactors gate it.

**Parallel / order-independent work (slot into gaps, move between sprints freely):** T1.2 FAB, T1.3 CTA, T1.4 rename, T2.3 filter relabel, T3.2 health line, T0.1 assertions. None block the critical path; use them to fill fatigue days.

**Tasks that must never begin early:**
- **T4.1–T4.3 backup build** — only after **T3.3 schema freeze**; building against a moving data shape guarantees rework.
- **T4.3 restore testing** — cannot start before backup *write* (T4.2) exists.
- **T1.1 accessibility** — after **T0.3 tokens**, or you tune colors twice.
- Anything in **V2/Not Now** (AI, dark mode, telemetry, Grow tab, dashboard) — do not touch during V1.

**Technical spikes:** T0.4 (Drive OAuth + `appDataFolder` round-trip on an installed iOS PWA) is the only true spike, and it is the highest-value hour in the plan. Fold the "does client-side Google auth survive an installed iOS PWA?" question into it explicitly.

**Nice-to-haves to postpone even if time allows:** the P2 tier is already "if cheap"; if a sprint runs hot, drop in this order — T2.3 filter relabel, T3.2 health line, T2.4 abandon-guard. Do **not** gold-plate: no Study anchors, no calculator polish, no tappable stats, no dark mode "while I'm in there." They are V2/Not Now for a reason.

---

## Totals, timeline, risk, and process

**Total estimated development hours:**
- Sprint 0: 25h · Sprint 1: 20h · Sprint 2: 26h · Sprint 3: 21h · Sprint 4: 24h · Sprint 5: 24h
- **≈ 140 dev-hours** (excludes founder non-eng time).

**Calendar for one full-time developer:** at ~25–30 dev-hours/week, **6 sprints ≈ 6 weeks of focused build; plan 7–8 calendar weeks** with real-life slippage and the high-risk backup work. If the T0.4 spike surfaces an iOS auth blocker, add up to a week.

**Highest-risk milestones (watch these):**
1. **T0.4 Drive auth on installed iOS PWA** — external, unproven; can invalidate the backup approach. *Mitigation:* spike first; fallback to a serverless proxy if client-side auth fails on iOS.
2. **T4.3 restore / zero-data-loss** — the launch gate; correctness-critical. *Mitigation:* diff restore against a pre-wipe export on a real device.
3. **T2.1 IA consolidation** — touches the central render/router. *Mitigation:* care-math assertions + full manual regression; small commits.
4. **T1.1 AA vs. the locked earthy palette** — contrast may force palette tweaks. *Mitigation:* tune token values, keep the design intent.

**Recommended commit strategy:** conventional-style, one logical change per commit, prefixed with the epic/task ID (e.g., `T2.1(P1-2): remove build route, add Care hub`). Commit at each story's DoD. Bump `BUILD`/`CACHE` in `sw.js` on any user-visible merge. Keep `WHATS-NEW.md` updated per sprint.

**Branch strategy (solo + Pages deploys from `main`):** trunk-with-short-branches. One `feature/Tx.y-*` branch per epic off `main`; merge only when that epic's DoD + `npm test` are green; **`main` stays always-deployable** because GitHub Pages serves it live. Tiny order-independent fixes (FAB, rename) may go straight to `main` behind a green test.

**Release strategy:** `main` = production (Pages). No user-facing feature flags needed at N=1; the *founder is the beta*. Ship internally each sprint (dogfood on the real phone), tag `v1.0.0` only when the launch gate passes. Bump the SW cache version every release; verify update via the build stamp.

**QA checklist before launch (all must pass):**
- *Data safety (gate):* wipe IndexedDB → restore from Drive → **zero data loss**; auto-backup writes + status; airplane-mode deferral; corrupt-file import handled; manual export/import still works.
- *Accessibility (gate):* contrast AA on all text/UI; targets ≥44px; every icon button labeled; keyboard + VoiceOver pass on Home/Plants/Care/Study; `prefers-reduced-motion` honored; no color-only status.
- *Functional:* every flow — quick-log + undo, add (manual + photo), repot run end-to-end + abandon-guard, photo check-in, delete + undo, sort/filter/group, units, settings.
- *Cross-device:* iOS Safari installed PWA + Android Chrome; widths 360/390/414/440/452; FAB clear everywhere.
- *PWA:* installs; fully offline; SW updates land (build stamp changes); icons/manifest correct.
- *Performance:* smooth at ~100 plants and a photo-heavy plant; no jank on chip taps (detailRefresh path).
- *Regression:* `npm test` (care-math assertions) green; spot-check known values.
- *Founder end-to-end slice (Bible done-gate):* on the real phone — capture a photo, survive an offline restart, a reminder appears in-app, export→import (and Drive restore) round-trips.

---

## Sprint Review ritual (hard gate at the end of every sprint)

Every sprint closes with this ritual before the next one may begin. It is the per-sprint complement to
the per-feature Definition of Done (`docs/DEFINITION-OF-DONE.md`), and it enforces the Bible's "calm,
not clever" principle by continuously *subtracting*.

1. **Demo the feature** — show the sprint's deliverables working on the real phone (not a description; a live run).
2. **Dogfood it for 2–3 days** — actually live on the build against the real 24-plant collection before calling the sprint done. No dogfood, no sign-off.
3. **Record friction** — keep a running note of every hesitation, misstep, or "ugh" during dogfooding (append to the sprint's notes).
4. **Remove one unnecessary interaction** — each sprint must *delete* at least one tap/step/field that dogfooding proved redundant. Complexity only goes down.
5. **Fix one annoyance before moving forward** — pick the single most-grating friction item and fix it now; do not carry it into the next sprint.

**Gate:** a sprint is not "exited" until its demo is shown, 2–3 days of dogfooding are logged, one interaction is removed, and one annoyance is fixed. Steps 4–5 are scoped to what dogfooding revealed — they are *simplifications and fixes to existing behavior, not new features or redesign*, so they never expand V1 scope.

---

*V1 Execution Plan — derived only from the Bible v2, V1 Product Decisions, BACKLOG, and the UI Audit. No redesign, no scope change, no new features. This is the engineering roadmap of record for shipping V1.*
