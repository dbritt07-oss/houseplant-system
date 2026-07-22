# Sprint 5 — Plan (hardening, QA & launch)

**Status: DRAFT — awaiting founder approval. No implementation has begun.**
**Goal:** ship a trustworthy `v1.0.0`. **Scope:** the approved remaining V1 work only — no new features, no Future Vision, no reopening frozen sprints.
**Entering state:** Sprints 0–4 frozen · P0-1 closed (launch gate passed on-device) · schema frozen · `npm test` 53/53 · build v33 on `main`.

**V1 gate standing:** WCAG AA ✅ · "a stranger says whoa" ✅ · zero data loss ✅ **proven** · all P0+P1 complete — **only P1-1's tail is open**, and it is explicitly non-blocking.

> **Revised by founder decision (2026-07-16).** Two reclassifications drive this plan:
> - **S5-5 (backup failure visibility) is now a RELEASE BLOCKER.** The destructive restore gate proved backup *works*; it did not prove the product stays *honest* if backup later stops. A system that silently ceases protecting the user, while the UI implies protection, is a data-safety failure — the same class of risk P0-1 exists to prevent.
> - **S5-1 (tokenization tail) is now explicitly optional**, addressed only if QA surfaces a real problem. Closing a ledger is not a reason to churn ~137 literals.
>
> **Final release blockers: S5-5 and S5-6 only.** S5-2, S5-3, and S5-4 are non-blocking; S5-1 is conditional cleanup.

---

## S5-1 · P1-1 tokenization tail — CONDITIONAL, NOT MANDATORY V1 WORK

**Exact purpose.** *(Reclassified by founder decision.)* Full radius/spacing/SVG tokenization is **no longer treated as mandatory V1 work.** It is **non-blocking cleanup**, addressed during V1 **only** if one of these is true:

1. **QA reveals a real visual inconsistency** traceable to a hardcoded literal;
2. a literal **creates maintainability risk for a release fix** (i.e. it obstructs a defect fix we must ship);
3. it can be corrected **safely and narrowly**, without broad churn, as part of a change already being made.

**Do not convert dozens of literals merely to close the ledger.** If no user-facing problem is found, the remaining tail is **preserved for Post-V1 technical cleanup** and P1-1 ships as-is.

*Measured current state (for reference, not a work order):* **57** `border-radius` literals · **~80** `padding`/`margin` px literals · **0** radius/space tokens defined today · **4** inline SVG color literals (`#5f7a4c`, `#f4ecd6` in `ICON`; `#e7dcbc`, `#f3ead2` in the pot drawing).

**Release-blocking status.** **NOT blocking.** Zero user-visible payoff by design. Its value is future reskin/dark-mode leverage (V2) — a V2 benefit does not justify V1 risk.

**Dependencies.** None. If touched at all, must **not** be interleaved with other CSS work — a mixed diff makes pixel-identity unreviewable.

**Verification method.** *Only if triggered:* `npm run check` + `npm test` green · token back-substitution proof (the T0.3 method — substitute each token's value back; the stylesheet must be byte-identical) · on-device visual spot-check of the affected screen only. **Caution if the SVG literals are ever touched:** SVG presentation attributes do **not** resolve `var()`; those values must move to `style="…"` or a CSS class, or the icons and pot drawing will silently render wrong.

**Recommended order: 7th — last, and only on demand.** Not scheduled. Triggered by observation during S5-6 QA, or deferred to Post-V1.

## S5-2 · Specimen-incomplete affordance clarification

**Exact purpose.** Make clear that the items listed under "Specimen incomplete" are **outstanding measurements**, not completed ones. *Current UI (for review, not a prescribed fix):* a dashed-border card headed "Specimen incomplete", containing pill-shaped `.titem` chips, each rendered with a **`::after` content `"✓"` in sage green**. Tapping a chip removes it (`data-act="todone"`). The green check reads as *done* while the chip in fact means *still needed*.

**Release-blocking status.** **NOT blocking.** A clarity defect, not a functional one — no data or care outcome is affected.

**Dependencies.** None. Do not combine with S5-1 (both touch `index.html` CSS).

**The problem, stated plainly** *(founder-confirmed framing)*: **the current glyph can read as completed even though the measurements remain outstanding.** That is the defect to correct — nothing more.

**Constraints on the fix** *(founder decision)*: choose the **smallest accessible correction**. **Do not redesign the card. Do not add new behavior.** Tap-to-complete stays exactly as it is. The correction must be legible to screen readers, not just sighted users — a purely visual glyph swap that leaves the announced text ambiguous is not sufficient.

**Verification method.** **Review the live UI on-device first** and confirm the misread occurs in context before changing anything — no solution is prescribed in advance. Then: on-device read-through confirming the meaning is unambiguous · VoiceOver check that each item announces as outstanding, not done · tap-to-complete still works · respects the Visual Constitution (no SaaS-style iconography) · `npm run check` / `npm test` green.

**Recommended order: 2nd.**

## S5-3 · Home Supplies banner — DECIDE FROM THE LIVE JOURNEY (removal not assumed)

**Exact purpose.** Supplies now lives in **Care** (P1-2, v24), but an identical banner remains on **Home** — `data-act="supplies"` appears at `js/app.js:124` (Home) and `:224` (Care), with identical copy. Removing the Home instance would make Home mean *"what needs me today"* and let Care own collection-level tools, honouring the Sprint 3 ritual mandate that complexity only goes down.

**Release-blocking status.** **NOT blocking.** A simplification, and a genuinely reversible one.

**Dependencies.** None (P1-2 already shipped the Care home for Supplies).

**Do not assume removal** *(founder decision)*. Review the **actual Home → Care → Supplies journey** on-device. Remove the Home banner **only if all three hold**:

1. it is **genuinely redundant** (adds no reach the user lacks);
2. **Care remains easily discoverable** as the home for Supplies;
3. removal **shortens or clarifies** the journey.

**The burden of proof sits on keeping it** *(tightened by founder decision)*. Removal is the default. **Keeping the Home Supplies entry requires positive evidence that it improves the primary care workflow** — the daily loop of *see what's due → water/feed → record*. Acceptable evidence is a concrete, observed journey where the Home entry measurably shortens or clarifies real care work (e.g. "checking supplies before starting a repot run is a recurring step, and routing via Care demonstrably interrupts it").

**Not acceptable as evidence:** "it might be handy," "it costs an extra tap," familiarity, or reluctance to change. Convenience alone does not justify a duplicated entry point — under **Restraint Is a Feature**, every additional interaction must earn its place.

**If kept, document the evidence** in the Sprint 5 retro. The ritual requires a **considered subtraction, not a forced deletion** — but "considered" now means *justified*, not merely *deliberated*.

**Counter-argument to test rather than assume:** supplies-checking may precede a repot, and the repot journey starts from Home. **Verify whether that sequence actually occurs in use** before treating it as justification.

**Verification method.** On-device walk of both journeys before deciding, evaluated against the **primary care workflow** (see what's due → water/feed → record). **If removed:** confirm Supplies is still reachable in one tap from Care, no dead handler or orphaned CSS remains, and `npm run check` / `npm test` stay green. **If kept:** record the specific evidence that it improves the primary care workflow; no code change.

**Recommended order: 3rd.**

## S5-4 · Google Drive Client ID setup — CONDITIONAL ON RELEASE AUDIENCE

**Exact purpose.** Evaluate baking the production **public** OAuth Client ID into `BAKED_CLIENT_ID` (currently `""` in `js/drive.js`), removing the paste-a-Client-ID step from first-run setup and an entire class of setup error.

**Security evaluation (must be confirmed before implementing):**
- The Client ID **is a public identifier**, not a secret — it is transmitted in every OAuth request and is visible in network traffic to anyone using the app.
- **No client secret exists in this flow** (GIS token flow, `drive.appdata` scope). Nothing confidential would enter git.
- It is **bound to the approved production origin** via Authorized JavaScript Origins; a copy used from any other origin is rejected by Google.
- **Confirm before committing:** the ID is the production one tied to the approved Pages origin, contains no secret material, and the founder accepts it living in a public repository.

**Release-blocking status. NOT blocking — conditional on audience** *(founder decision)*. **Which audience makes this necessary:**

| V1 release audience | Verdict |
|---|---|
| **Founder-only build** (status today) | **DEFER.** The founder's ID is already configured device-local and working. Embedding it changes nothing for the only user. |
| **Distributed to testers / other users** | **COMPLETE BEFORE RELEASE.** Without it, every tester must create their own Google Cloud project and paste a Client ID — a setup burden that would effectively make backup unreachable for anyone who isn't a developer. |

**In short: this item exists for other people, not for you.** It becomes necessary the moment a second person is expected to install the app — and only then.

**If proceeding, confirm before committing:** it is the correct **production web client ID** · it is **intentionally public** · **authorized JavaScript origins are restricted** to the approved production origin · **no client secret or private credential is present**.

**Dependencies.** The production Client ID + explicit founder sign-off on the public-repo question. **Must not** change the fallback path — a device-local ID must still override and work, so existing installs are unaffected.

**Verification method.** Confirm the value is a Client ID (`…apps.googleusercontent.com`), never a secret. Then on-device: a **fresh install shows no Client ID field and connects directly**; an existing install still works; disconnect/reconnect still works. Re-run the backup round-trip.

**Recommended order: 4th — decide first, implement only if the audience requires it.**

## S5-5 · Backup failure visibility — ⛔ V1 RELEASE BLOCKER

**Exact purpose.** Keep the product **honest** when automatic backup stops. The destructive restore gate proved backup *works*; it did not prove the product stays truthful if authorization later expires or another persistent failure occurs. *Current behaviour:* the failure is written to `localStorage` and surfaced **only** inside Settings → Back up to Google Drive, as a red line reading *"Last attempt: … It will retry on your next change."*

**The question, answered:** *Could a user reasonably believe backup is active when it is not?* — **Yes.** Backups are invisible by design, Settings is rarely opened, and the failure is silent. A user could go weeks believing they're protected while nothing is being saved. That is **Risks #2/#3** in `docs/BACKUP-VERIFICATION.md`.

**Release-blocking status.** ⛔ **BLOCKING** *(elevated by founder decision)*. Rationale: a backup system that silently ceases while the UI implies protection is a **data-safety failure of the same class P0-1 exists to prevent**. Proving restore works is only half the guarantee; the other half is never claiming protection that isn't there.

**Dependencies.** P0-1 (complete). Reads the existing `Drive.lastBackup()` / `Drive.lastState()` — **no schema change, no new persisted state, no new storage keys.**

### Acceptance criteria (define before implementation — all must hold)

1. **Distinguishes healthy from attention-required.** A clear, binary distinction between "backup is working" and "backup needs attention." No ambiguous middle state.
2. **Does not rely on opening Settings.** The attention state is visible in the normal flow of using the app.
3. **Provides a clear route to reconnect or retry** — reaching the fix must not require hunting.
4. **Not alarmist.** No push notifications, badges, modals, repeated nags, or red alarm styling. Calm, factual, and consistent with the Bible's *no urgency, no guilt* stance. **A new notification system is out of scope unless genuinely required** — and it is not.
5. **Silent when healthy.** Nothing appears while backups are succeeding. A working system stays invisible.
5b. **Self-clearing.** The attention state **clears automatically after the next verified successful backup** — no manual dismissal, and no lingering warning once the problem is genuinely fixed. "Verified" means a backup that completed and updated the last-successful timestamp; a *retry attempt* is not sufficient. The user must never have to dismiss a stale warning, and the state must never persist past the condition that caused it.
6. **Silent when Drive was never connected.** Users who deliberately stayed local-only are **never** nagged to connect. Local-first is a legitimate end state, not an incomplete setup.
7. **Never claims protection that isn't real.** No copy anywhere may imply backup is active when the last successful backup is stale or the last attempt failed.
8. **Preserves local-first operation.** No behaviour change to the app when offline or disconnected; the signal is informational only and never blocks a task.
9. **No regression:** `npm run check` + `npm test` green; no schema, envelope, or restore change.

**Verification method.** Revoke access in the Google account → confirm the attention state appears, is calm and truthful, and routes to the fix · **reconnect and complete one successful backup → confirm the attention state clears on its own, with no manual dismissal** · confirm nothing appears while healthy · confirm nothing appears when Drive was never connected · VoiceOver check that the state is announced meaningfully · re-run the backup round-trip.

**Recommended order: 1st — implement before anything else in Sprint 5.**

## S5-6 · Full V1 QA, hardening & release

**Exact purpose.** Execute the approved launch QA checklist in `docs/V1-Execution-Plan.md`, fix **only verified defects**, and cut `v1.0.0`.

**Coverage (per the approved checklist):** data safety (wipe→restore, auto-backup + status, airplane-mode deferral, corrupt-file handling, manual export/import) · accessibility (AA contrast, ≥44px targets, aria-labels, keyboard + VoiceOver on Home/Plants/Care/Study, reduced-motion, no colour-only status) · functional (every flow: quick-log + undo, add manual/photo, repot end-to-end + abandon-guard, photo check-in, delete + undo, sort/filter/group, units, settings) · cross-device (iOS Safari installed PWA + Android Chrome; 360/390/414/440/452px) · PWA (installs, offline, SW update lands, icons/manifest) · performance (~100 plants, photo-heavy plant, no chip-tap jank) · regression (`npm test` green) · the founder end-to-end slice.

**Release-blocking status.** ⛔ **BLOCKING — this is the release.** T5.3 (`v1.0.0` tag + deploy) may only proceed after every gate passes. **Fix only verified defects. No features, no Future Vision work, during QA.**

**Dependencies** *(founder decision)*: run the launch checklist **only after S5-2 is corrected, the S5-3 decision is made, and S5-5 is implemented.** S5-4 must also be settled (decided, even if deferred). S5-1 is not a prerequisite. QA must execute against final code, or its results are stale — *exactly the lesson of the v32 popup regression, where a late change invalidated prior verification.*

**Verification method.** The checklist is the verification. Defects found → fix within approved scope → **re-run affected checks**. Then: bump `BUILD`/`CACHE` → `v1.0`, update `WHATS-NEW.md`, tag `v1.0.0`, deploy, post-deploy smoke test on a fresh install.

**Recommended order: 6th — last, always.**

---

## Recommended implementation order

*Revised per founder decision (2026-07-16).*

| # | Item | Blocking? | Branch | Rationale |
|---|---|---|---|---|
| 1 | **S5-5 backup failure visibility** | ⛔ **YES** | `feature/s5-5-backup-visibility` | Protects the guarantee P0-1 just proved; define acceptance criteria first |
| 2 | S5-2 specimen-incomplete affordance | No | `feature/s5-2-specimen-affordance` | Review live UI → smallest accessible correction |
| 3 | S5-3 Home Supplies placement | No | `feature/s5-3-home-supplies` | **Decide from the live journey**; keeping it is a valid outcome |
| 4 | S5-4 Client ID embed | No — **conditional** | `feature/s5-4-client-id` | Decide by audience: defer if founder-only; do it if distributed |
| 5 | **S5-6 QA + verified-defect fixes** | ⛔ **YES** | `feature/s5-6-release` | Only after 1–4 are resolved |
| 6 | **S5-6 release prep + tag `v1.0.0`** | ⛔ **YES** | (same) | Only after every gate passes |
| 7 | S5-1 tokenization literals | No — **on demand only** | `feature/s5-1-token-tail` | Only if QA observes a real issue; else → Post-V1 |

**Sequencing logic:** the release blocker first (honesty is not a polish item), then the small clarity corrections, then the audience-dependent decision, then QA against a settled codebase, then release. Tokenization is no longer scheduled at all — it is triggered by observation or deferred. Each item gets its own feature branch; docs-only commits stay on `main`.

**Cut order if the sprint runs hot:** S5-1 is already unscheduled · then S5-4 (defer by audience) · then S5-3 (keeping the banner *is* the cheap outcome) · then S5-2. **Never cut S5-5 or S5-6** — both are release blockers.

---

## Governance note — "Progressive Disclosure" added to the Product Bible

*(Founder decision, 2026-07-16.)* **Progressive Disclosure** is now a corollary philosophy in **Product Bible §5**: *show what is needed now; keep depth one deliberate step away.* Depth is never deleted to achieve simplicity, and never surfaced by default to prove sophistication. When a screen feels crowded, the first question is not *what should we cut* but *what should be one step deeper*.

This is **governance for future work, not a Sprint 5 work item** — it changes no V1 scope. It is recorded here because it bears directly on two decisions in this sprint:

- **S5-3** — it reframes the Home Supplies question. Under progressive disclosure, Supplies living *one deliberate step deeper* in Care is the intended shape, not a loss of access. Duplicating it on Home is the exception that needs justifying.
- **S5-5** — it constrains the solution. Attention state belongs in the shallow layer only when action is genuinely required; the detail (why it failed, how to reconnect) stays one step deeper. This is why the criteria demand silence when healthy.

*Precedent already shipped:* the Soil recipes and Gnat protocol disclosures (v22), the Reference / Ritual / Record zoning on the plant plate (v17–v21), and the Settings Preferences / Your-data split (v23) were all progressive disclosure in practice. This entry names a principle the product had already been following.

## Explicit non-goals

No Future Vision · no new features · no reopening Sprints 0–4 · no schema or backup-envelope change · no changes to restore behaviour · nothing from `POST-V1-IDEAS.md` or `FUTURE-VISION.md`.

---

*Sprint 5 Plan — DRAFT, pending founder review and approval. Implementation begins only on explicit approval, per item, on its own feature branch.*
