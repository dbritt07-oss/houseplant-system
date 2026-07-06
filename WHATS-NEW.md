# Plant Daddy HQ — What's New & Verify Checklist

A running checklist to confirm each update actually landed on your phone, and exactly
**where to look** for it. Updated every release.

**First, check your version:** open the app → **Settings** (gear, top-right) → scroll to the
bottom → it reads **"build vN."** If the number below matches the latest here, you're current.
If not, fully close and reopen 2–3 times; if still behind, do the one-time reset
(Settings → Export a backup → delete the home-screen icon → re-add from Safari → Import).

Tip: you can tick these boxes right here on GitHub (tap the checkbox in the rendered file).

---

## build v13 — accessibility pass + botanical polish (T1.1)
- [ ] **Sharper, more legible text** — quiet labels and captions are darker (now pass WCAG AA), and functional controls (nav, filters, stat labels, care readouts) moved from the handwritten font to the clean UI sans. Handwriting is kept for true margin notes.
- [ ] **Botanical ink** — primary text and titles now use the deep **Ink Green**; plant names on the detail page are set in italic serif (the specimen binomial).
- [ ] **Health shown as a specimen tag** — the color-only dot on each plant card is now a small letterpress **status tag** (Healthy / Stressed / Critical / Thriving) with a painted swatch — readable, and announced by screen readers.
- [ ] **Drawn ink glyphs, not emoji** — the 💧/🍽️ quick-log buttons on **Today** are now hand-style ink marks (water droplet in Bloom Blue, feed sprig in sage), and are larger (44px) to tap.
- [ ] **Comfortable taps + keyboard/focus** — nav arrows, gear, close, filter chips grew to 44px; a Bloom-Blue focus ring appears when using a keyboard; the active nav tab gets a Bloom-Blue underline.
- [ ] **Calmer motion** — if your phone has "Reduce Motion" on, the sheet slide-up animation is disabled.
- [ ] *(Where to see it: everywhere — most visibly the Today cards, the Plants grid tags, and any plant's page.)*

## internal — design tokens, phase 1 (no user-facing change; build stays v12)
- [ ] *(developer only)* `index.html` stylesheet now uses named CSS tokens for all colors, fonts, and shadows (46 tokens in `:root`). Proven **pixel-identical** — nothing changes on your phone. Groundwork for the accessibility contrast pass (P0-2) and dark mode (V2). Remaining: radius/spacing tokens + a few `app.js` inline colors.

## internal — care-math test harness (no user-facing change; build stays v12)
- [ ] *(developer only)* `npm test` runs `tests/care.test.js` — 30 golden assertions locking the care math (Monstera 7.67 L, intervals, LECA feed, pet-safe flags, repot windows, unit conversions). Nothing changes on your phone; this is a regression net for the V1 refactors.

## build v12 — quick-log, undo, delete a plant
- [ ] **💧 / 🍽️ quick-log buttons** — on the **Today** tab, right side of each "Due now" card.
- [ ] **Undo** — after tapping water/feed (or removing a plant), a toast shows an **Undo** link for ~5s.
- [ ] **Remove a plant** — open a plant → scroll to the bottom **"No longer have it?"** card → **Remove from collection**.
- [ ] **Live plant count** — the "plants" stat on Today updates when you add/remove (no longer stuck at 24).

## build v11 — soil recommendations + bigger check-in button
- [ ] **"Would also thrive on ___"** — **Soil** tab → pick a mix in the calculator → card below shows plants that would suit it but are on something else (e.g., Pineapple → bark).
- [ ] **Photo check-in button** is now a full-width green button — **plant page → Photos card** (first card, under the drawing).

## build v10 — photo check-in
- [ ] **📷 Photo check-in** — plant page → Photos card → snap → confirm health + note → it logs to the timeline.

## build v9 — reliable updates
- [ ] **"build vN" stamp** appears at the bottom of **Settings** (this is how you verify every future update).

## build v8 — accurate pots
- [ ] **Round / Square toggle** — repot flow **step 1**, and each plant's **"The pot"** card (by the drainage row).
- [ ] **"Full pot ≈ X cups · Prepare about Y cups"** — repot step 1, the realistic fresh-mix figure.
- [ ] Pot labels read **"Top ⌀ / Base ⌀"** (diameter), not circumference.

## build v7 — typeable numbers + soil matching
- [ ] **Number boxes next to every slider** — plant page: height, pot top/base/height, schedule, root-snug (type a value or drag; 0.5 steps).
- [ ] **"Your plants on this mix"** — Soil tab, under the calculator.

## builds v1–v6 — foundation (should already be visible)
- [ ] Independent **Length + Volume** unit pickers in Settings (inches / gallons default).
- [ ] **Rooms**: plant page → Place & light → Room field + chips; **▦ by room** toggle on the Plants tab.
- [ ] **＋ floating button** (bottom-right) → Add a plant (photo or manual).
- [ ] App name **Plant Daddy HQ** in the header and on the home-screen icon.

---

### How this list is maintained
Each push, the newest build gets a section here with **what changed** and **where to see it**,
so you never have to wonder whether an update landed or where it lives.
