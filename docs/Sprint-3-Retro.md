# Sprint 3 — Review & Retrospective

**Theme:** "Three tabs, a findable collection, and a frozen data model." **Shipped (v24–v28 + T3.3):** IA consolidation to Home/Plants/Care + Care hub (v24) · sort (v25) · plain-language filters (v26) · repot abandon-guard (v27) · Home collection-health line (v28) · **T3.3 schema freeze** (`docs/DATA-SCHEMA.md` + schema-lock tests) · Execution-Plan resequencing/close + BACKLOG sync.
**Reference points:** V1 Execution Plan · BACKLOG · DATA-SCHEMA · Definition of Done · Sprint Review ritual.
**Focused on what actually shipped in Sprint 3. No new scope, no roadmap change.**

---

## 1. Sprint 3 Review (demo — what shipped, vs. exit criteria)

| Exit criterion (from the plan) | Result |
|---|---|
| Exactly 3 tabs (Home / Plants / Care), no `build` route | ✅ nav is Home·Plants·Care; Plan/Build tab and its dev content removed |
| Care hub holds soil calculator, Supplies, gnat protocol, repot entry | ✅ Care gathers mixes, recipes, gnat protocol, a Supplies shortcut, and a "Run a repot protocol" entry |
| All prior actions still work (open plant, run repot, supplies) | ✅ verified on-device across v24–v28 |
| Sort composes with search, filters, group-by-room | ✅ A→Z / Due soonest / Recently added; default A→Z (founder call); session-persistent |
| Plain-language filter chips; buckets unchanged | ✅ Aroid mix / General mix / Gritty mix / Needs care / Measured; keys + logic untouched |
| Repot abandon-guard fires | ✅ confirm on × / scrim when a run is in progress; untouched step-1 closes cleanly |
| Home collection-health line, computed, nothing stored | ✅ "N thriving · N healthy · N watching" from live `hi` values |
| Data schema documented & frozen | ✅ `docs/DATA-SCHEMA.md` (35-field record, settings, order, `hps-backup` envelope) |
| `npm test` green | ✅ **36/36** (30 care-math + 6 schema-lock); `npm run check` clean |

**Every Sprint 3 exit criterion met.** The riskiest item (P1-2 IA, central router) landed with all ~40 control IDs and routes preserved and the care/schema tests as the net.

## 2. Founder dogfood notes

- **All five builds (v24–v28) were confirmed on-device by the founder**, which also carries the outstanding v23 DoD close forward (the plant plate + Settings render correctly at real width). No functional regressions reported.
- **Desktop-browser observation:** opened on a computer, the app shows a narrow, centered phone-width column. *Disposition:* not a Sprint 3 defect — V1 is deliberately mobile-first. Captured as **Post-V1 "device-adaptive presentation."** No V1 action.
- **Health-line discoverability:** the new v28 line is subtle and was easy to miss on first look ("what updated?"). *Disposition:* working as designed (a quiet summary by intent); a possible future copy/placement nudge, not a V1 change.
- **No data-loss or math anomalies** surfaced; the schema-lock test now guards the shape going into backup.

## 3. Sprint 3 Retrospective

**What went well**
- Small, single-epic, revertible commits — `npm run check` + `npm test` green at every step.
- The IA consolidation (the structural risk) extended the existing render/router cleanly; nothing regressed.
- **The freeze is enforced, not just written** — the schema-lock test fails loudly on any field drift, the strongest guarantee going into the backup build.
- The **admission rule did its job**: it deferred the to-do affordance fix and correctly held the P1-1 tail out, protecting the milestone.
- A newly discovered idea (device-adaptive) was captured to Post-V1 without disturbing the sprint.

**What we learned**
- Freezing a schema is a *documentation + test* act as much as a code one — turning "don't change this" into an enforced contract.
- Deferring zero-user-value refactors (the P1-1 SVG/spacing tail) away from a milestone, into release slack, is the disciplined call.

**What slowed us down**
- Indirect verification (no live screenshots in-environment) — each build closed on the founder's on-device confirm.
- The health-line discoverability confusion cost one clarifying round.

**Debt created** — health-line uses an inline style rather than a class (tiny); the **P1-1 token tail** remains open (S5); `app.js` continues to grow (Care hub + sort + guard + pulse).

**Debt avoided** — the schema-lock test prevents silent shape drift before backup; the care-math tests guarded the IA refactor; the risky SVG-`var()` refactor was *not* attempted next to the freeze.

**Decisions we intentionally did NOT make** — did not change the sort default (kept A→Z per founder); did not implement any device-adaptive work (Post-V1); did not pull the P1-1 tail or the to-do fix into the freeze; did not touch the frozen schema.

**One interaction to remove (ritual):** the **redundant Supplies entry.** Supplies now lives in Care, yet Home still carries its own Supplies banner. Candidate subtraction: drop the Home banner so Home = "what's due today" and Care owns collection-level tools. Schema-neutral; **scheduled for Sprint 5 release cleanup** (or kept as a deliberate shortcut — founder's call). Named here so the ritual's "complexity only goes down" holds.

**One annoyance to fix (ritual):** the **to-do-card affordance** — the ✓ reads as *done* while items are outstanding. Already the approved fix **slated for Sprint 5**.

## 4. Freeze Sprint 3

**Sprint 3 is frozen.** IA/Care hub, sort, plain-language filters, abandon-guard, and the Home health line are shipped and confirmed on-device (v24–v28); the **data schema is locked** (`docs/DATA-SCHEMA.md`, enforced by the schema-lock test, regression 36/36); the Execution Plan and BACKLOG reflect the completed work. **Carried forward, by decision (not blockers):** the P1-1 token tail and the to-do affordance fix → Sprint 5; the Home-Supplies subtraction → Sprint 5.

**Next:** Sprint 4 — the isolated automatic-backup build (P0-1), which builds against this frozen schema. Note: its Google OAuth connect/restore steps require the live device and can't be exercised in this non-interactive session, so Sprint 4 will lean on the founder for on-device connect + wipe→restore verification.

---

*Sprint 3 Retrospective. No scope added, no features, no roadmap change. Sprint 3 is complete and frozen; the schema it froze is the contract Sprint 4 builds on.*
