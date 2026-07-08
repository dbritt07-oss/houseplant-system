# Plant Daddy HQ — Post-V1 Ideas (captured, not scheduled)

Ideas that are **out of V1 scope** but worth keeping. Captured per the founder's direction to hold beyond-V1 thinking separately without interrupting V1 implementation. **Nothing here is committed.** Evaluated after V1 ships, using real usage. Governed by the same rule: *does it reduce friction, or just add capability?*

## Immediate post-V1 polish (do soon after V1 ships)
- **Gnat Protocol as a guided workflow** — turn the checklist into a stepped "Run Gnat Protocol → Step 1 ✓ → Step 2 ✓…" flow (mirrors the repot run). *(Was V1 item #5; it's new capability/workflow, not friction reduction, so it moves just past V1.)*
- **Add-plant sheet → compact Apple-style bottom sheet** — if the light height trim in V1 isn't enough, make it a true short sheet.

## Post-V1 backlog
- **Plant Progress** — evolve health from a snapshot into a *story*: "Healthy ↑ · Growing · last photo 5 days ago · +1 new leaf." Turns the plate into a living record.
- **Long-press shortcuts (from The Key)** — press a plant card for Quick Water / Quick Feed / Add Photo / Repotted. Power-user speed.
- **Gnat trend visualization** — a small sparkline of trap counts over time, not just this week's number.
- **Live search** — filter The Key as you type.
- **Dashboard copy refinement** — warmer framing, e.g. "Help me learn your plants — 23 still need measurements" instead of "23 of 24 still need measurements." Low priority.

## Future concepts (not V1, not near-term)
- **Device-adaptive presentation** — grow beyond mobile-first into layouts that reformat per device: a genuinely responsive desktop/web view (multi-column, not a centered phone strip), an iPad layout (master–detail: The Key beside the open specimen plate), and eventually an Apple Watch surface (due-now glance + one-tap water/feed). *Ground rules when this is taken up:* the phone remains the primary, canonical experience; each surface reuses the same local-first data and care engine — no forked logic; the specimen-journal identity and the Visual Constitution hold on every screen; and the Apple Watch surface depends on the **native wrapper** already parked in "Not Now" (so it can't precede that decision). *(Noted 2026-07-08 from founder observation that the desktop browser shows the narrow mobile column. Confirmed out of V1 — V1 is deliberately mobile-first and renders acceptably as a centered phone-width column on desktop.)*
- **Focus Mode (repotting)** — while physically repotting, hide everything except pot size, soil recipe, root check, gnat protocol, notes, photo. A distraction-free workbench.
- **Broader gesture navigation** — after core V1 is stable, explore extending swipe gestures to the main tab pages, and consider **page-flip / editorial transitions** *only if* they reinforce the specimen-journal feel. Evaluate strictly with accessibility and `prefers-reduced-motion` preserved. (Confirmed post-V1; the V1 swipe is scoped to the plant detail only.)
- **Three complementary product surfaces** — as functionality grows, think in *workflows/modes*, not more pages:
  - **Reference** — plant encyclopedia, care guides.
  - **Operations** — watering, feeding, repotting, daily maintenance.
  - **Workbench** — soil mixing, gnat protocol, repot sessions.
  The design instinct going forward: add *modes*, not pages.

## Guardrail for evaluating any of these later
Favor **reducing friction over adding capability**. For interactions, favor **reliability over cleverness**. Anything that adds a page or a tap must earn it. When in doubt, it stays here.
