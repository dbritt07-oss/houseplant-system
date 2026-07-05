# Plant Daddy HQ — V1 Product Decisions

**Decision mode, not exploration.** Sources of truth (and the only inputs): Product Bible v2.0, `BACKLOG.md`, `docs/V1-UI-Audit.md`.
**Lenses applied:** Apple Product Design · YC Partner · Senior UX Designer · Staff PM.
**Objective:** ship the best possible V1. Reduce complexity. No redesign, no new features.

**The shaping call:** **AI photo-ID and dark mode come OUT of V1.** Both are listed as V1 in the Bible, but the Bible's own V1 gate is *"a stranger says whoa AND a phone survives a reset with zero data loss."* Neither serves that gate, and §16/§0 make AI an "accelerant, never a dependency." Cutting them removes the two highest-cost, highest-risk workstreams (serverless proxy + per-call cost + accuracy/liability; doubled QA surface) so V1 can be what it must be: **beautiful, effortless, and safe.**

---

## Executive Product Decision Log

Verdict on every audit recommendation. Effort: S ≤ half-day · M 1–3 days · L multi-day.

| # | Audit recommendation | Verdict | Why (4-lens) |
|---|---|---|---|
| 1 | Automatic Google-Drive backup | **Accept** | The P0 gate. Data safety > local purity (Bible §0/§20). Non-negotiable for "zero data loss." |
| 2 | Accessibility pass (contrast, dot+label, ≥44px, focus, reduced-motion, aria) | **Accept** | AA is a Bible §18 *release gate*, not a nice-to-have. Blocks ship until met. |
| 3 | Tokenize the design system (light only) | **Accept** | Prerequisite for AA and the "whoa"; §15 "token-first." Scope to CSS variables, no build tooling. |
| 4 | Unified Care hub + rename nav | **Modify** | Accept consolidation; **cut to 3 tabs** (Home / Plants / Care). Fold Soil + Supplies + Repot-entry into Care. 3 strong tabs beat 4 with a weak one. |
| 5 | Replace "Build/Plan" with a real "Grow" tab | **Modify → V2** | *Remove* the dev-notes tab now; don't *build* Grow in V1 (an L with no gate value). |
| 6 | Sort in Plants | **Accept (reduced)** | Table-stakes at scale (Bible + BACKLOG). Ship **3 sorts** (A→Z, due-soonest, recently added), not 5. |
| 7 | Status dot → dot + label | **Accept** | Color-only status fails §18; part of the a11y gate. |
| 8 | Reorder Study into Reference/Ritual/Record | **Accept** | Makes the product's heart legible (§5). Bundle chip-tap→`detailRefresh` + photo-path clarity. |
| 9 | Fix "Start a repot run" CTA | **Accept (relabel)** | A prominent button that lies erodes trust. Relabel to what it does; don't build a launcher. |
| 10 | Rename "Identify by photo" | **Accept** | Honesty (§4.2) — matters more now that AI is deferred. |
| 11 | FAB reposition | **Accept** | Real layout bug at 440–452px viewport. |
| 12 | Relabel medium filters to plain words | **Accept (reduced)** | Cheap clarity for the not-founder keeper. Reject the structural filter re-architecture. |
| 13 | On-device collection-health readout | **Modify** | Shrink to one computed line on Home from existing health values; not a new surface. |
| 14 | Repot entry point + abandon-guard | **Accept (reduced)** | Entry comes free with the Care hub; add confirm-on-abandon. Skip "resume run." |
| 15 | Route detail chip taps through `detailRefresh` | **Accept** | Bundled into Study work; perf/polish, S. |
| 16 | Clarify the two photo paths | **Accept** | Bundled into Study work, S. |
| 17 | Care-math assertion script | **Accept (small)** | Protects the moat during refactors; hours of work. |
| 18 | AI photo ID + health read | **Modify → V2** | Highest cost/risk; not the gate. Keep tap-to-pick + check-in scaffold. |
| 19 | Dark mode / Nightfall | **Modify → V2** | Doubles QA; the "whoa" is the light specimen plate first. |
| 20 | Opt-in anonymous telemetry | **Reject → V2** | Nothing to measure at N=1 (§9 says off); premature plumbing. |
| 21 | Surface repot-windows + gnat re-checks on Home | **Reject → V2** | Adds Home complexity; data already lives on the plant page. |
| 22 | Tappable stat cards | **Reject** | Nice-to-have interaction surface; cut. |
| 23 | Elevate the calculator visually | **Reject** | Cosmetic; cut. |
| 24 | Study section anchors | **Reject** | Reorder handles most of the pain; anchors add complexity. |
| 25 | Filter grouping re-architecture | **Reject** | Relabel is enough for V1; structural change deferred. |
| 26 | Full `app.js` refactor | **Reject** | Tech debt, not ship-defining at N=1; allow only incremental extraction forced by backup/tokens. |
| 27 | Component gallery / library doc | **Reject → V2** | Harden a11y states now; formal gallery later. |
| 28 | Base64-photo DOM optimization | **Reject → V2 (monitored)** | Real but not gate; revisit if it bites. |
| 29 | Full test harness | **Reject** | Over-scoped; the small care-math assertions (#17) cover the crown jewel. |
| 30 | Species lookup / plant database | **Reject → Not Now** | P3, an L with no V1 trigger. |

---

## Final V1 Scope (accepted items)

**V1 gate to ship:** all P0 + P1 complete; a stranger says "whoa"; a phone reset loses nothing.

| Item | Priority | Effort | User value | Tech risk | Business value |
|---|---|---|---|---|---|
| Automatic Drive backup + restore (one-way) | **P0** | L | High | High | High (the trust story) |
| Accessibility pass to AA (release gate) | **P0** | M | High | Low | Med |
| Tokenize design system (light) | P1 | M | Med | Low | Med |
| IA consolidation → Home / Plants / Care (remove Build; Care absorbs Soil + Supplies + Repot-entry) | P1 | M | High | Med | Med |
| Sort in Plants (3 modes) | P1 | S–M | High | Low | Med |
| Study page reorder (R/R/R + chip perf + photo-path clarity) | P1 | M | High | Low | Med |
| Fix Today CTA (relabel) | P1 | S | Med | Low | Med (trust) |
| Rename "Identify by photo" (honest label) | P1 | S | Med | Low | Med |
| FAB reposition | P1 | S | Med | Low | Low |
| Relabel medium filters to plain words | P2 | S | Med | Low | Low |
| Minimal collection-health line on Home | P2 | S | Med | Low | Low |
| Repot abandon-guard + Care entry point | P2 | S | Med | Low | Low |
| Care-math assertion script | P2 | S | Low | Low | Med (protects moat) |

**Shape:** 13 items, two P0. Nav drops 4 tabs → 3. No AI, no dark mode, no telemetry in V1.

---

## Features removed from V1 (rejected outright)

Tappable stat cards · calculator visual polish · Study section anchors · filter re-architecture · full `app.js` refactor · component-gallery/library doc · full test harness.

## Features moved to V2

AI photo ID + health read (scaffold kept) · dark mode / Nightfall · opt-in anonymous telemetry · surface repot-windows + gnat re-checks on Home · the real Grow / Field Guide tab · base64-photo optimization · (already V2: living Home/rooms dashboard, weather intelligence, analytics surface, automation v1, multi-device sync, propagation, supplies thresholds).

## Features moved to Not Now / Not Until Proven

Species lookup / plant database (P3) — joins the existing Not-Now set: multi-property, rule-based automation, AI assistant, local discovery, community, content-creator mode, native wrapper, widening to the beginner audience.

---

*V1 Product Decisions — derived only from Product Bible v2.0, BACKLOG, and the V1 UI Audit. No redesign performed. Next step on the founder's call: sequence into a build plan (P0 backup spike first).*
