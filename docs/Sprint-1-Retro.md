# Sprint 1 — Retrospective

**Theme:** "Accessibility gate + quick wins." **Shipped:** T1.1 (a11y pass, v13), T1.2 FAB, T1.3 Today CTA, T1.4 add-photo rename (v14). **Also delivered (unplanned):** the design-governance system — Visual Constitution, Design Governance, materiality guardrails — plus the P1-4 flagship spec written in parallel.
**Reference points:** Product Bible · Visual Constitution · Design Governance · Definition of Done · BACKLOG · V1 Execution Plan.
**Concise, practical, no new scope. No roadmap change — nothing here is a blocker.**

## 1. What went well
- **Preview-before-apply** (`a11y.preview.html`, token back-substitution proof) caught the sterilization risk *before* it shipped and proved T0.3 pixel-identity. This is now our default for visual work.
- **The P0 risk was retired early:** the Drive-backup spike PASSED on a real installed iOS PWA — the scariest unknown, gone before any backup code.
- **Safety rails held:** care-math tests, network-first SW + build stamp, and the commit ritual (file count + summary) kept every change verifiable and the tree clean.
- **Governance now exists:** every future visual decision has an authority and a Gate.

## 2. What surprised us
- T1.1 shipped and looked "the same" to the founder — **accessibility/polish is invisible by design.** Healthy, but an expectations gap.
- The design review exposed that the build had quietly drifted to **"themed utility"** — the Brand Board's richer half (specimen plate, materiality) was never implemented. Only surfaced by comparing against the Board.
- **Environment limits** shaped verification: can't run the installed PWA, render PDFs, delete files, or screenshot live — so we verify by math, grep, and preview, not live capture.

## 3. What we learned
- **Accessibility and craft are not opposed:** darker *warm* ink cleared AA *and* strengthened the botanical identity. The materiality guardrail is the reusable insight.
- **Polish sprints don't "wow";** the visible identity lands at P1-4. Set that expectation up front.
- **Governance-as-code** (a written Constitution + Design Review Gate) turns taste into a repeatable filter — the antidote to drift.

## 4. What slowed us down
- **The mid-sprint governance detour** (Visual Constitution + Design Governance + materiality preview) — genuinely necessary, but it moved sprint hours from code to docs.
- **Environment friction:** sandbox restarts, no file deletion, the "read-before-edit" gate forcing re-reads, MCP connect/disconnect noise.
- **Indirect verification** (no live screenshots) adds a manual on-device step we can't automate.

## 5. What should change before Sprint 2
- **State the payoff up front:** P1-4 is the visible win; T1.x was foundation. Avoids the "looks the same" morale dip.
- **Keep governance frozen.** It's done — resist further doc expansion (already frozen by decision).
- **Formalize the on-device dogfood** as the closing step of every visual sprint, since automated screenshots aren't possible here.
- **Hold P1-4 to its V1/V2 split** in the spec — build composition now, defer AI plate + expressive motion.

## 6. Risks entering Sprint 2
- **P1-4 is the highest-rework screen** — biggest, most visible, most subjective. *Mitigant:* the written spec + the Design Review Gate.
- **Gilding temptation** on the flagship. *Mitigant:* the spec's explicit V1/V2 scope split.
- **Render-path regression:** P1-4 rewrites `renderDetail` and routes chip taps through `detailRefresh`. *Mitigant:* care-math tests + manual pass.
- **Sprint 1's DoD isn't fully closed:** manual/responsive/console/screenshot gates await the on-device dogfood — an open gate carried into Sprint 2.
- **`app.js` is growing;** P1-4 adds substantially to it. Accepted at N=1, watched.

## 7. Decisions we intentionally did NOT make
- Did **not** switch Fraunces → Cormorant (flagged for reconciliation, deferred).
- Did **not** replace all functional emoji (only the Today quick-log; add-menu 📷/🌱 deferred).
- Did **not** force every control to 44px (secondary steppers, segmented buttons, selection chips deferred).
- Did **not** pull P1-4 forward despite the morale pull — held the plan.
- Did **not** tokenize radius/spacing or refactor `app.js` (P1-1 remainder / rejected).
- Did **not** open Sprint 2 with exploration — wrote the build-ready spec instead.

## 8. Technical debt created
- A small **appended T1.1 CSS block** (spectag/focus/reduced-motion) rather than folded into base styles.
- **`.pcard .dot`** CSS is now orphaned (unused).
- The **Close ×** is a `role="button"` div leaning on a global keydown shim, not a native `<button>`.
- **Scratch files** (`_*.mjs`, `*.preview.html`) linger on disk (gitignored; sandbox can't delete).
- **`renderDetail` will balloon** in P1-4.

## 9. Technical debt avoided
- **Care-math test net** guards the P1-4 render refactor from silent regressions.
- **Tokenization** makes the reskin variable swaps, not markup surgery.
- **The backup spike** avoided building the whole P0 epic on an unproven OAuth path (no dead-end rework).
- **Network-first SW + build stamp** avoids stale-cache debugging.
- **Skipped the premature `app.js` refactor** — avoided churn before P1-4 reshapes it anyway.

## 10. Product debt avoided
- Fixed the **lying CTA** and the **false "Identify by photo"** promise — no dishonest UI shipped (Bible §4).
- **Froze scope + governance** — sidestepped the everything-app drift.
- **Kept AI + dark mode out of V1** — avoided cost/latency/QA debt on the critical path.

## 11. Visual debt avoided
- The **materiality guardrail** stopped the a11y pass from flattening the app into a SaaS dashboard.
- **Specimen tags** (not SaaS pills) and **ink glyphs** (not emoji) kept us out of category-generic patterns.
- **Retired Caveat from controls** — removed the "handwriting-as-UI cheapens craft" debt.
- The **Visual Constitution + Gate** now prevent future visual drift structurally.

## 12. One unnecessary interaction to remove (Sprint Review mandate)
**The two photo paths.** "📷 Photo check-in" (button) and the "＋ photo" tile do nearly the same thing, separated by fine print. **Merge them** — fold the ＋ tile into the check-in so there is *one* way to add a photo. Lands naturally in **P1-4's Record zone** (already scoped as "clarify the two photo paths" → make it "one path"). No new scope; a subtraction.

## 13. One annoyance to fix before Sprint 2 proper
**The plant-page chip-tap full re-render flash.** Changing a chip (medium/material/health/light) triggers a whole-app `render()` — a visible flash + scroll juggle. It's already the first item of **P1-4/T3.1** (route detail chip taps through `detailRefresh`). Recommend making it **the opening commit of Sprint 2** so the flagship work begins on a smooth detail page. In-scope, small, high-felt — not new work.

---

*Sprint 1 Retrospective. No scope added, no features, no roadmap change. Sprint 1's build is complete; its DoD closes on the on-device dogfood. Sprint 2 opens at P1-4 implementation — starting with the chip-tap fix (§13) and the photo-path merge (§12).*
