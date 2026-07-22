# Sprint 4 — Review & Retrospective

**Theme:** "Make the data unloseable." **Shipped (v29–v33):** T4.1 Drive connect + manual backup/restore · T4.2 automatic silent backup + on-open catch-up · T4.3 restore hardening, envelope validation, atomic import, +17 regression assertions · T4.4 resumable upload (5 MB ceiling removed) · v33 popup user-gesture fix.
**Reference points:** V1 Execution Plan · BACKLOG · DATA-SCHEMA · BACKUP-VERIFICATION · Definition of Done · Sprint Review ritual.
**The P0 release gate. Isolated by design, and it earned the isolation.**

---

## 1. Sprint 4 Review (demo — what shipped, vs. exit criteria)

| Exit criterion (from the plan) | Result |
|---|---|
| One-time Drive connect from Settings; no secret in the client | ✅ public Client ID only, device-local; token in memory, never persisted |
| Backup runs periodically **and** on meaningful change | ✅ debounced silent backup on every mutation + on-open catch-up via a persistent dirty flag |
| Settings shows last-backup time + success/failure | ✅ relative timestamp, explicit failure reason, retry promise |
| Offline defers safely with no data loss | ✅ verified on-device (airplane mode → failed status → recovery) |
| Disconnect leaves the app fully local | ✅ token revoked, flags cleared, manual export intact |
| **Fresh install → connect → restore reproduces every plant, log, photo** | ✅ **LAUNCH GATE PASSED (v33)** |
| **IndexedDB wipe → restore = zero data loss** | ✅ **PASSED** — count, photos, timelines, rooms, units, repot dates; no duplicates |
| Manual export/import still works as the offline path | ✅ retained and repositioned as the portable fallback |
| `npm test` green | ✅ **53/53** (30 care-math · 6 schema-lock · 17 backup-envelope) |

**Every Sprint 4 exit criterion met.** The Bible's launch-gate clause — *"a phone reset loses zero data"* — moved from assumed to **proven**.

## 2. Founder dogfood notes

- **Launch gate, run in full:** app deleted → site data cleared → reinstalled → Drive reconnected → restored. Plant count matched; photos, timeline entries, room assignments, units, and repot dates all returned; no duplicates; nothing missing. The **resumable path completed with a large photo payload** — the T4.4 fix proven in use, not just in code.
- **T4.1 and T4.2 each verified on-device before the next was built** — the checkpoint discipline that kept defects from stacking.
- **The v32 failure ("failed to open popup")** was caught the moment a real deploy met a real tap. Reported precisely, diagnosed to Safari's user-gesture rule, fixed in v33, re-verified.
- **First feature-branch cycle completed** — `feature/t4-4-popup-gesture-fix` → publish → merge, with Claude committing locally and the founder publishing.

## 3. Sprint 4 Retrospective

**What went well**
- **The spike paid for itself.** T0.4 proved the OAuth path on a real installed PWA *before* any production code, so the epic's High risk was retired at the cheapest possible moment. Plan B (serverless proxy, ~1 week) was never needed.
- **Isolating the sprint worked exactly as intended.** Nothing else competed with the riskiest epic; every build got its own device verification.
- **The frozen schema held.** Backup shipped with **zero** schema changes — Drive config lives in `localStorage`, deliberately outside the backup payload. The T3.3 freeze did its job.
- **Validation as a gate, not a hope.** `validateBackup()` + atomic single-transaction import mean a corrupt, foreign, or newer file can never touch local data — and 17 assertions hold that line.

**What we learned**
- **Green tests are necessary and nowhere near sufficient.** 53 passing assertions and a clean review both missed a total backup outage. The bug lived in *browser gesture semantics*, which no unit test in this stack can reach.
- **Ordering can be load-bearing and invisible.** `ensureToken()` before `await` reads like a stylistic choice and is actually a correctness constraint — hence the DO-NOT-MOVE comment. Non-obvious invariants need to be written down at the site, not just known.
- **"Nice-to-have" refactors can break hard requirements.** T4.3 reordered `backupNow()` to fail-fast on validation — a genuine improvement that silently disabled backup. Small, well-intentioned changes deserve the same suspicion as large ones.

**What slowed us down**
- **A self-inflicted repo mess.** Probing git permissions left lock files in `.git` that the sandbox couldn't delete, briefly blocking GitHub Desktop and costing founder time. The probe was the error, not the permissions.
- **Repeated wrong claims about git/credential access** (three in one session) sent the workflow discussion down blind alleys before being tested properly.
- **Indirect verification remains the tax** — every build closes on a manual on-device pass.

**Debt created** — the app now depends on an external Google script (`gsi/client`); one backup file with **no rotation** (Risk #6); `js/drive.js` is a new ~200-line module carrying the subtlest constraint in the codebase.

**Debt avoided** — no schema change; no client secret; no serverless backend; no partial-photo restore state (photos live inside plant records, so restore is all-or-nothing by construction); no silent overwrite of a good backup by an empty collection.

**Decisions we intentionally did NOT make** — did not add backup rotation/versioning (Post-V1); did not build multi-device sync (V2 — single-device is a documented assumption); did not publish the OAuth consent screen (stays in Testing); did not add a "backups have stopped" nag (recommended, still Post-V1); did not touch the frozen schema to make backup easier.

**One interaction to remove (ritual):** **the Client ID field.** Now that the founder's public Client ID is known and working, it can be baked into `BAKED_CLIENT_ID` — removing a paste step, a text field, and an entire class of setup error from first-run. Schema-neutral, ~1 line. **Sprint 5 candidate** (founder's call: it hardcodes a public identifier into the repo, which is safe but worth choosing deliberately).

**One annoyance to fix (ritual):** **a silent-failure blind spot.** If the Google grant lapses, backups stop and the only signal is a line in Settings the user may never open. Risks #2/#3 flagged this as *recommended for V1*. **Sprint 5:** surface a passive notice (e.g. on Home) when the last successful backup is older than N days.

## 4. Freeze Sprint 4

**Sprint 4 is frozen.** P0-1 is **closed** — automatic Drive backup and restore are shipped (v29–v33) and **proven on a real device by the launch gate**. The data-safety clause of the V1 gate is satisfied. `npm run check` clean, `npm test` 53/53, schema frozen and unchanged, no credentials in the repo.

**V1 gate status:** WCAG AA ✅ · "a stranger says whoa" ✅ · **zero data loss ✅ (proven)** · all P0+P1 complete — **P0-1 ✅ now closes; only P1-1's token tail remains**, carried to Sprint 5 as non-blocking cleanup.

**Next:** Sprint 5 — hardening, QA & launch. Carried in: the P1-1 token tail · the to-do-card affordance fix · the Home-Supplies subtraction · the July 10 medium corrections · the two ritual items above · then `v1.0.0`.

---

*Sprint 4 Retrospective. No scope added, no features, no roadmap change. Sprint 4 is complete and frozen. The hardest, highest-risk epic in V1 is done — and the one bug that mattered was found by a human with a phone, not by the test suite.*
