# Plant Daddy HQ — Definition of Done (DoD)

**A feature is not complete until all twelve gates pass.** No exceptions, no "I'll circle back."
This is the release contract referenced by `BACKLOG.md` and `docs/V1-Execution-Plan.md`. Every task's
own Acceptance Criteria are *in addition to* this baseline.

| # | Gate | What it means here | How to verify |
|---|---|---|---|
| 1 | **Code written** | The story's acceptance criteria are implemented in the real files (no stubs left behind). | Read the diff; criteria met. |
| 2 | **Unit tests pass** | The care-math assertion script (and any added checks) is green. | `npm test` exits 0. |
| 3 | **Manual testing complete** | The feature's happy path + obvious edge cases exercised by hand in the app. | Walk the flow on desktop + the real phone. |
| 4 | **Accessibility checked** | AA contrast, ≥44px targets, `aria-label` on icon buttons, visible focus, no color-only status, `prefers-reduced-motion` honored. | Contrast check + keyboard pass + VoiceOver spot-check of the changed screens. |
| 5 | **Responsive verified** | Layout holds and nothing clips/overlaps across phone widths. | Check at 360 / 390 / 414 / 440 / 452px. |
| 6 | **No console warnings** | Clean console — no errors, no new warnings introduced. | DevTools console clean on load + through the flow. |
| 7 | **Undo works** | Any create/destroy/mutate action the feature adds is reversible (or provably N/A). | Trigger the action → Undo → state restored. State "N/A" explicitly if the feature has no mutation. |
| 8 | **Backup unaffected** | Data shape stays exportable/importable; a round-trip still restores everything. *(Until auto-backup ships in Sprint 4, this means export→import.)* | Export a backup JSON → reset/import → data intact. |
| 9 | **Documentation updated** | Any doc the change touches (Bible, BACKLOG status, README, code comments) is current. | Relevant doc reflects reality; no stale claims. |
| 10 | **Changelog updated** | `WHATS-NEW.md` gets a line: what changed + where to see it + a checkbox. | Entry present under the new build. |
| 11 | **Git commit made** | One logical change, message prefixed with the task ID (e.g., `T2.1(P1-2): add Care hub`). | Commit exists on the feature branch. |
| 12 | **Merged to main** | The epic's DoD is fully green, then merged; `main` stays always-deployable (Pages serves it live). SW `BUILD`/`CACHE` bumped so the update lands. | On `main`; build stamp incremented; post-deploy smoke test passes. |

## Per-feature checklist (paste into each PR / commit note)

```
Feature/Task: __________  (Epic: ____)
[ ] 1. Code written — acceptance criteria met
[ ] 2. Unit tests pass — `npm test` green
[ ] 3. Manual testing complete — desktop + real phone
[ ] 4. Accessibility checked — contrast / 44px / aria / focus / reduced-motion
[ ] 5. Responsive verified — 360/390/414/440/452px
[ ] 6. No console warnings — clean console
[ ] 7. Undo works — reversible (or N/A: ______)
[ ] 8. Backup unaffected — export→import round-trip intact
[ ] 9. Documentation updated — ____
[ ] 10. Changelog updated — WHATS-NEW.md line added
[ ] 11. Git commit made — ID-prefixed message
[ ] 12. Merged to main — build stamp bumped, deploy smoke-tested
```

## Notes for the solo-founder workflow

- **Gates 7 & 8 can be "N/A" only with a written reason.** A pure copy/label change (e.g., renaming the CTA) mutates no data — mark Undo N/A explicitly rather than skipping the gate.
- **Gate 12 = release.** Because GitHub Pages serves `main` live, merging *is* shipping. Never merge a half-green feature to `main`; that's why epics live on `feature/Tx.y` branches until all twelve pass.
- **Gates 4–6 are cheap when done continuously** and expensive when deferred to launch — run them per feature, not in a Sprint-5 pile.

---

*Definition of Done — the completion contract for every Plant Daddy HQ task. If a gate can't be met, the feature isn't done; either finish it or cut it, but don't ship it half-green.*
