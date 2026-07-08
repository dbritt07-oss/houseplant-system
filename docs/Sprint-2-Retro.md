# Sprint 2 — Retrospective

**Theme:** "The Study specimen plate + friction-reduction polish." **Shipped (v15→v23):** T3.1/P1-4 in full — Cormorant + laid-paper foundation (v15), in-place `detailRefresh` + one photo path (v16), the specimen-plate rewrite of `renderDetail` (v17), and the polish pass: stamp/close placement (v18–v19), swipe navigation (v20), museum treatment + leader anchoring (v21), Soil hierarchy + compact Add (v22), Settings grouping + lighter plate top-nav + FAB clearance (v23).
**Reference points:** completed implementation (v23) · Sprint 2 Design Review (**PASS WITH POLISH**) · Founder Review · Product Bible · Visual Constitution · Design Governance · Definition of Done · P1-4 Spec.
**Concise, practical. No new scope. No roadmap change in this document — resequencing is handled separately in the V1 Execution Plan.**

## 1. What went well
- **The flagship landed.** P1-4 — the highest-leverage, most subjective screen — shipped as an actual specimen plate and cleared the Design Review across all six references (PASS / PASS WITH POLISH). The botanical identity is now real, not themed utility.
- **Small revertible commits held.** Nine builds, each one logical change with a file-count + summary confirmation and a bumped build stamp; every step was individually reversible.
- **Controls survived the rewrite.** ~40 control IDs and all bindings/accessibility/`detailRefresh` dependencies were preserved through a full `renderDetail` rewrite — grep-verified, `npm test` 30/30 green throughout.
- **The V1/V2 line held under pull.** Deferred-Beyond-V1 items (deboss, deckle, motion, AI plate) stayed deferred; no gilding leaked into the build.

## 2. What surprised us
- **The corner was the stubborn part, not the plate.** The ×/›/seal cluster took three passes (v18→v19→v23) to feel calm; the specimen composition itself landed cleanly the first time. Small-object placement, not big composition, was the real cost.
- **Museum treatment made the page *simpler* to reason about.** Removing card borders in favor of hairline rules reduced CSS and cognitive load at once — subtraction improved both.
- **"Looks the same" flipped to "whoa" at exactly P1-4,** as predicted in the Sprint 1 retro — confirming that the visible identity was always going to arrive on this screen, not the foundation ones.

## 3. What we learned
- **Compose-don't-template works.** Treating the plant as the hero and letting chrome recede (VC §2/§3) produced a screen that reads as an artifact — the reusable pattern for every future surface.
- **End-of-gesture deltas + control-start exclusion** is a reliable recipe for adding swipe without stealing slider/scroll intent. Bank it.
- **Governance-as-filter paid off:** the Design Review Gate turned "is this timeless?" into a repeatable check, and the answer was yes without a redesign loop.

## 4. What slowed us down
- **Corner micro-placement churn** (stamp covering the ›, then the ×/›/seal crowding) — three builds on one small region.
- **Indirect verification, still.** No live screenshots in-environment means each build closes on a manual on-device founder pass; morale and pace depend on that loop.
- **`app.js` and the plate CSS both grew** substantially; larger files mean slower, more careful edits.

## 5. What should change before the next sprint
- **Close the DoD on the real phone first.** v23's on-device confirmation (responsive widths + console-clean) is the one open gate; run it before opening new work.
- **Take the two approved Founder-Review follow-ups in-sprint,** not later: the "to-do card reads as done" affordance fix, and the v23 device pass. Both are small and close existing work.
- **Resume at IA, not more plate polish.** The Founder Review and the five-changes analysis both concluded further plate refinement fails the friction test — the next value is structural (IA/backup), not aesthetic.

## 6. Risks entering the next sprint
- **IA consolidation (P1-2) touches the central render/router** — the riskiest structural refactor left. *Mitigant:* care-math tests + full manual regression + small commits.
- **The plate rewrite grew `app.js`;** the IA work threads the same monolith. *Mitigant:* preserve IDs/routes exactly, grep-verify, lean on `npm test`.
- **Schema must be frozen before backup** — any data-shape churn from IA must settle first. *Mitigant:* T3.3 schema freeze closes the IA sprint, not the backup sprint.
- **P0 backup is still unbuilt** (only the spike passed) — the single highest-risk V1 epic still lies ahead.

## 7. Decisions we intentionally did NOT make
- Did **not** anchor callout leaders to real per-plant anatomy (decorative leaders accepted for V1; deferred).
- Did **not** refine the swatch strip into painted/watercolor cells (deferred with the V2 watercolor pass).
- Did **not** add the expressive motion layer (unfurl / ink-bloom stamp / leader draw-in — Deferred Beyond V1).
- Did **not** tighten figure/micro-typography discipline (sub-perceptual; deferred).
- Did **not** pull the first-run/empty-state composition into scope (it's an onboarding *product* decision, not polish).
- Did **not** invent a "V1.5" branch or a Developer Mode (both rejected in the Founder Review).

## 8. Technical debt created
- **`renderDetail` ballooned** into the specimen plate, as predicted — the largest function in `app.js`.
- **A large appended plate CSS block** in `index.html` rather than folded into a structured stylesheet.
- **The Close ×** remains a `role="button"` div on the global keydown shim, not a native `<button>` (carried from Sprint 1).
- **Decorative callout leaders** are approximate placements, not data-anchored — cosmetic debt, deferred by decision.
- **Scratch files** (`_*.mjs`, `*.preview.html`) still linger on disk (gitignored; sandbox can't delete).

## 9. Technical debt avoided
- **Care-math test net** guarded the full `renderDetail` rewrite — zero silent math regressions across nine builds.
- **`detailRefresh` targeting** avoided a full-app re-render on every chip tap — no scroll/focus loss, no flash.
- **Token layer** made the Cormorant + laid-paper reskin variable swaps, not markup surgery.
- **Museum treatment scoped to `.sheet.plate`** — other sheets stayed boxed; no accidental global restyle.
- **Swipe designed to exclude control-starts** — avoided a class of gesture-vs-slider bugs before they existed.

## 10. Product debt avoided
- **One photo path**, not two — executed the Sprint 1 subtraction mandate inside P1-4's Record zone.
- **FAB overlap resolved by clearance**, guaranteeing reachability rather than hiding controls.
- **Held the friction test** as the gate — no capability was added to the plate; every change reduced friction or improved legibility/hierarchy.
- **Deferred items captured, not lost** — `POST-V1-IDEAS.md` holds them so nothing leaks into V1 yet nothing is forgotten.

## 11. Visual debt avoided
- **The specimen plate closed the "themed utility" gap** the Sprint 1 review exposed — the Brand Board's richer half is now implemented, not aspirational.
- **Boxes → hairline rules** removed the SaaS-card look on the heart screen.
- **Ink glyphs, specimen tags, collector's seal, registration marks** kept the page in botanical-artifact language, out of category-generic UI.
- **The Design Review Gate ran and passed** — visual drift was caught-by-construction, not after the fact.

## 12. One unnecessary interaction to remove (Sprint Review mandate)
**The "to-do card" false affordance.** The "Specimen incomplete" card uses a ✓ that reads as *done* while the items are outstanding measurements — a small but real misread flagged in the Founder Review. **Fix the glyph/label so it reads as "needed," not "complete."** It's a relabel/reglyph on an existing surface — no new functionality — and it's the single approved Founder-Review follow-up. Take it as an opening subtraction next sprint.

## 13. One annoyance to fix before the next sprint proper
**The unclosed v23 DoD.** The build is complete but the Definition of Done isn't formally closed — v23's on-device responsive/console pass is still pending. **Run the on-device dogfood and record it** as the first act of the next sprint, so the flagship's gates are provably closed before structural work (IA) begins on top of it. In-scope housekeeping, not new work.

---

*Sprint 2 Retrospective. No scope added, no features, no roadmap change in this document. Sprint 2's build is complete and reviewed (PASS WITH POLISH); its DoD closes on the v23 on-device dogfood (§13). The V1 Execution Plan's remaining sprint sequence is re-evaluated separately, and the next sprint opens at IA consolidation (P1-2) — starting with the to-do affordance fix (§12) and the DoD close (§13).*
