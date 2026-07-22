# Plant Daddy HQ — Backup Integrity Verification Report (P0-1)

**Scope:** T4.1 (connect + manual backup/restore) · T4.2 (automatic silent backup) · T4.3 (restore hardening, validation, edge cases).
**Build:** v31. **Contract:** unchanged (`hps-backup` v1). **Schema:** unchanged (frozen, `docs/DATA-SCHEMA.md`).
**Purpose:** honestly define what the backup system guarantees — and where it stops.

---

## 1. What has been proven

- **Client-side Google OAuth works from an installed iOS PWA** (T0.4 spike, on-device): connect → write → read round-trip, no client secret, `drive.appdata` scope.
- **The backup contract is stable and enforced.** `validateBackup()` is the single gate before any write or restore; it is pure, synchronous, and unit-tested.
- **Restore is atomic.** `importAll` validates first (nothing touched on failure), then performs `clear()` + all `put()`s inside **one IndexedDB transaction**, so an interrupted restore rolls back instead of leaving a half-empty collection.
- **Photos cannot partially recover.** Photos are stored *inside* plant records, so a plant restores with all of its photos or the whole restore rolls back. There is no partial-photo state by construction.
- **An empty collection can never clobber a good backup automatically.** A silent backup of 0 plants is refused.
- **Foreign, corrupt, and future-version files are rejected** with plain-language errors before any local write.

## 2. What has been verified locally (automated)

`npm run check` clean across all six JS modules; `npm test` — **53 assertions, 0 failures**:

- 30 care-math golden values (unchanged; the math survived Sprint 4).
- 6 schema-lock assertions (the 35-field plant record, photo/log shapes) — the frozen shape is intact.
- **17 backup-envelope assertions**, each one a data-loss scenario forced to fail loudly: valid envelope counts (plants/photos/logs), settings optional, and rejection of `null`, a bare array, wrong `format`, missing `version`, a **newer** `version`, missing/non-array `plants`, a plant with no `id`, **duplicate plant ids**, a corrupted `photos` list, a corrupted `log`, and unreadable `settings`.

## 3. What has been verified on-device (founder, live deployment)

- **T4.1 — PASS.** Full connect → backup → restore flow succeeded on the real installed PWA.
- **T4.2 — PASS.** Automatic backup on change; on-open catch-up after a change made before closing; offline attempt surfaces a failed status and recovers on reconnect.
- **T4.3/T4.4 — PASS (v33). THE LAUNCH GATE PASSED.** App deleted, site data cleared, reinstalled, Drive reconnected, restored from Drive. Verified returned: **plant count matched · photos · timeline entries · room assignments · units · repot dates**. No duplicate plants; no missing data observed. The **resumable upload path completed with the larger photo payload** — Risk #1's fix is now proven in use, not just in code.
- **Popup regression (v32 → v33) — FOUND AND FIXED ON-DEVICE.** "Failed to open popup" on Connect/Back-up-now. Cause: `backupNow()` read IndexedDB before requesting the token, breaking Safari's user-gesture chain. Invisible to 53 passing tests and to code review; surfaced only because a fresh deploy cleared the in-memory token and a human tapped a real button. **This is the strongest evidence in this document for why the on-device gate exists.**

## 4. What assumptions remain

These are believed true but **not empirically verified in this environment**:

1. **Drive multipart uploads commit atomically.** An interrupted upload is assumed to leave the previous good file intact (the request never completes, so no revision is written). Not directly tested.
2. **`prompt:"none"` never surfaces UI.** Silent background refresh is assumed popup-free while a Google session is active. Observed working, not exhaustively probed.
3. **`appDataFolder` is scoped to the OAuth client.** Changing the Google Client ID / project is assumed to **orphan prior backups** (a new app-data folder). Not tested — but treat as true.
4. **IndexedDB is not evicted on an installed iOS PWA** in normal use. This is the risk the whole epic exists to defend against, and it is precisely what we cannot prove.
5. **Google keeps the consent grant valid** while the app stays in "Testing" with the founder as a test user. Test-user grants can expire (historically ~7 days for unverified apps in some flows).

## 5. Scenarios still requiring real-world validation

**✅ CLEARED — the launch gate.** Wipe → restore with zero data loss **passed on-device (v33)**; the photo-heavy resumable upload passed with it. Items 1 and 2 of the original list are closed.

**Remaining — none block V1.** These are robustness probes worth running opportunistically, not release gates:

1. **Kill the app mid-restore** → confirm atomic rollback leaves the collection intact. *(Argued from the single-transaction import; not force-tested.)*
2. **Revoke access** in the Google account → confirm honest degradation (status shows it, local data untouched, manual export still works).
3. **Long-offline period** (several days of edits) → reconnect → confirm the catch-up backup contains every edit.
4. **Restore an intentionally older backup** → confirm the "fewer plants" warning fires.

---

## Remaining Data-Loss Risks

Every realistic path to losing data or losing backup coverage. "Mitigation" = what is implemented today.

| # | Scenario | Current behavior | User impact | Mitigation implemented | Additional work |
|---|---|---|---|---|---|
| 1 | ~~**Backup exceeds 5 MB** (photos)~~ **RESOLVED (T4.4, v32)** | Uploads use `uploadType=resumable` — no practical size ceiling | None. Photo-heavy collections back up normally | Multipart (5 MB cap) replaced by a resumable session upload | **None.** Verify once on-device with a photo-heavy backup. |
| 1b | **Popup blocked by the browser** ("failed to open popup") — *found on-device at v32, fixed in v33* | Token request now happens **first**, inside the user-gesture chain; `loadGis()` is only awaited if the script isn't ready | Was: connect/backup failed outright — backups silently stopped | **Order is load-bearing:** `ensureToken()` must precede any `await` in `backupNow()`. Marked with a DO-NOT-MOVE comment | **None.** Regression risk only — do not reorder `backupNow()`. |
| 2 | **Google authorization revoked** | Token requests fail; silent backup fails; Settings shows the reason; retries on next change/open | Backups stop; user may not notice for weeks | Settings status + retry + manual export | **Recommended V1:** a passive "backup hasn't run in N days" notice somewhere the user actually looks. Can technically wait Post-V1. |
| 3 | **Expired Google session / test-user grant lapses** | Silent (`prompt:"none"`) refresh fails; status shows it; next interactive backup re-grants | Gap in coverage until the user opens the app and taps Back up now | Retry on change/open; honest status | Same as #2. Publishing the consent screen removes test-user expiry (Post-V1). |
| 4 | **Backup interrupted during upload** | Request never completes; previous good file assumed intact; dirty flag retained → retried | None expected — last good backup survives | Dirty flag survives reload; automatic retry | Verify assumption #1 on device. No code change expected. |
| 5 | **Restore interrupted** | Atomic single-transaction import → **rolls back** | None — collection unchanged | `importAll` clear+put in one IDB transaction | Verify by killing the app mid-restore. |
| 6 | **Corrupted backup file** | `validateBackup` rejects it; nothing local is touched | Cannot restore from that file | Validation before any write; local data untouched | **Post-V1:** backup rotation / Drive revisions. Today there is **one file** — a corrupt backup has no history to fall back on. Manual exports are the only versioning. |
| 7 | **Multiple devices → same Google account** | Last writer wins; device B's auto-backup overwrites device A's file | Newer data from A can be overwritten by older data from B | Restore shows counts + date + "fewer plants" warning (helps on *restore*, not on *overwrite*) | **V1: document the single-device assumption.** Multi-device sync is explicitly V2 (BACKLOG). Post-V1: compare Drive `modifiedTime` before upload and refuse/merge. |
| 8 | **Restoring an older backup over newer data** | Confirm dialog shows backup plants/photos/date vs. device count; ⚠️ warning when the backup has fewer plants | User can still confirm and lose newer edits | Explicit counts + date + loud warning | None required for V1. (Equal-count-but-older still relies on the user reading the date.) |
| 9 | **Future schema changes** | Envelope carries `version`; a **newer** backup is refused with "update the app"; change-control demands a migration | Old app safely refuses new files; new app must migrate old files | Version guard + `BACKUP_VERSION` constant + schema-lock test + change-control rule in DATA-SCHEMA | Write the migration **when** a change is actually made. Not now. |
| 10 | **Offline edits over an extended period** | Data stays in IndexedDB; dirty flag persists; backup runs on reconnect/change/open | No cloud copy until back online | Persistent dirty flag; catch-up on open | None for V1. Documented. |
| 11 | **Reinstall before first successful backup** | Nothing was ever backed up → data is gone | **Total loss** | Connect performs an immediate first backup; Settings reads "last backup never" | **By design** (local-first). Post-V1: a first-run prompt to set up backup. Document clearly. |
| 12 | **Drive storage quota exceeded** | Upload fails; Google's message surfaces in Settings; retries | Backups stop until space is freed | Error surfaced verbatim; retry | None for V1. |
| 13 | **Network failure during backup** | Upload throws; status shows it; dirty flag retained → retried | None — local data safe | Retry + status | None. |
| 14 | **Network failure during restore** | Fetch/validate happen **before** any local write → nothing is touched | None | Ordering: fetch → validate → confirm → import | None. |
| 15 | **Partial photo recovery** | Not possible — photos live inside plant records; restore is atomic | None | Structural (schema) + atomic import | None. A genuine strength. |
| 16 | **Rapid app termination with a pending backup** | The 5s debounce may not fire, but the **dirty flag is written synchronously** → catch-up on next open | Up to one change-batch unbacked until reopen | Persistent dirty flag + on-open/on-focus catch-up | Post-V1: attempt a flush on `pagehide`. Low value; async work on hide is unreliable. |
| 17 | **Client ID / Google project changes or is lost** | A different OAuth client gets a **different `appDataFolder`** — prior backups become unreachable | Cloud backups orphaned (data still local) | Client ID stored device-local; manual export is the portable escape hatch | **V1: document** ("keep the same Client ID; take an occasional manual export"). No code change. |
| 18 | **iOS evicts IndexedDB** | Local data lost; restore from Drive recovers it | The exact threat this epic defends against | Automatic backup + restore | None. This is why backup exists. |

### Honest summary

The backup system is **correct, validated, atomic on restore, and honest about failure** — and, as of **v33, proven end-to-end on a real device.** The launch gate passed: a wiped phone restored its entire collection, photos included. The one disqualifying defect (Risk #1, the 5 MB cap) was fixed in T4.4 and exercised for real during the gate. **P0-1 is closed.**

**What the gate actually bought us.** It caught a bug nothing else could: the v32 popup regression was invisible to 53 passing tests and to review, and only appeared when a human tapped a button on a freshly deployed build. Automated tests proved the *contract*; only the device proved the *product*. That asymmetry is the argument for keeping a human-run gate in front of anything data-critical.

Two risks are *recommended* (not required) for V1: a visible "backups have stopped" signal (#2/#3 — today a revoked grant fails only into a Settings line the user may never open), and documenting the **single-device** (#7) and **single-Client-ID** (#17) assumptions. Everything else can safely wait until Post-V1 — including the largest structural gap, **no backup rotation** (#6): there is exactly one file, so a corrupt backup has no history to fall back on. Occasional manual exports remain the real safety net.
