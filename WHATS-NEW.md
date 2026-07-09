# Plant Daddy HQ — What's New & Verify Checklist

A running checklist to confirm each update actually landed on your phone, and exactly
**where to look** for it. Updated every release.

**First, check your version:** open the app → **Settings** (gear, top-right) → scroll to the
bottom → it reads **"build vN."** If the number below matches the latest here, you're current.
If not, fully close and reopen 2–3 times; if still behind, do the one-time reset
(Settings → Export a backup → delete the home-screen icon → re-add from Safari → Import).

Tip: you can tick these boxes right here on GitHub (tap the checkbox in the rendered file).

---

## build v31 — Sprint 4: proving the backup can be trusted (no new features)
- [ ] **Restore now shows you what it will overwrite** — before replacing anything it says *"Backup: N plants · M photos, saved <date>. This device: N plants."* and makes you confirm. *(Settings → Restore from Drive.)*
- [ ] **Loud warning on an older backup** — if the Drive backup has **fewer plants** than your device, it warns you may be restoring an older backup over newer data before you confirm.
- [ ] **Corrupt or foreign files are refused** — a damaged backup, someone else's file, or one made by a *newer* app version is rejected with a plain-English reason, and **your device data is never touched.**
- [ ] **An interrupted restore no longer half-empties your collection** — the wipe-and-rewrite now happens in one atomic step that rolls back if it fails.
- [ ] **Empty-collection guard** — an automatic backup will never overwrite your good Drive backup with an empty one (e.g. if the database fails to open).
- [ ] **Clearer failures** — Settings now tells you *why* the last attempt failed, and that it will retry.
- [ ] **Verify on device (the launch gate):** with data on the phone, back up → delete the app / reset the browser data → reinstall → Connect → **Restore** → confirm every plant, log entry, and photo returns.

## build v30 — Sprint 4: backups now happen automatically
- [ ] **Automatic backup** — once Drive is connected, the app backs itself up **on its own** a few seconds after you change something (water, feed, repot, edit a plant, add/remove, change units), and again when you reopen the app if anything changed while it was closed. No button needed. *(Runs quietly in the background.)*
- [ ] **Silent + non-blocking** — automatic backups never pop up a sign-in and never interrupt you; if one can't run (offline, sign-in expired), **nothing is lost** — Settings shows "last attempt failed" and it simply retries on the next change or reopen.
- [ ] **A change made right before you close** still gets backed up the next time you open the app (a device-local "needs backup" flag remembers).
- [ ] **Verify on device:** with Drive connected, water a plant → wait ~10s → Settings shows **"last backup just now."** Then change something, force-close, reopen → it backs up on open. Turn on Airplane Mode, make a change → Settings shows a failed attempt; turn Wi-Fi back on, make another change → it recovers.

## build v29 — Sprint 4: back up to your own Google Drive (connect + manual)
- [ ] **New "Back up to Google Drive"** in **Settings → Your data**. One-time setup (paste a public Google Client ID — steps in `docs/BACKUP-SETUP.md`), tap **Connect**, and your plants/logs/photos back up to **your own** Drive. Nothing goes to any other server. *(Settings.)*
- [ ] **Back up now** and **Restore from Drive** buttons, plus a **last-backup** status line and **Disconnect**. Restore asks to confirm before it replaces this device's data. *(Settings, once connected.)*
- [ ] The **manual export/import file** is still here as the offline/portable fallback.
- [ ] *(This build adds the connect + manual backup/restore mechanism. Automatic-on-change backup and restore hardening land in the next builds.)*
- [ ] **Verify on device:** Settings → Back up to Google Drive → paste Client ID → Connect → approve → "last backup just now"; tap Back up now; tap Restore from Drive → confirm → data returns.

## build v28 — Sprint 3: a glance at collection health
- [ ] **Collection-health line on Home** — under the plants / water-due / feed-due stats, one quiet line summarizes how the whole collection is doing, e.g. **"3 thriving · 19 healthy · 2 watching."** It's computed live from each plant's current health — nothing new is stored, and it's not a new screen. *(Home tab, under the stats.)*

## build v27 — Sprint 3: don't lose a repot run
- [ ] **Abandon-guard on the repot run** — if you're partway through a repot (past the first step, or you've noted a root condition or checked a kill-step) and tap **×** or outside the sheet to close, it now asks **"Leave this repot run?"** before discarding, so you don't lose your progress by accident. Closing an untouched run (still on step 1) still just closes. *(Any plant → Run the repot protocol.)*

## build v26 — Sprint 3: plain-language filters
- [ ] **Clearer filter chips** on Plants — the medium filters now read **Aroid mix · General mix · Gritty mix** (the same names you see when assigning a plant's medium), and the status chips read **Needs care** and **Measured**. Same filtering, friendlier words. *(Plants tab, the chip row under Sort.)*
- [ ] Filters, Sort, and ▦ by room all still work together.

## build v25 — Sprint 3: sort your collection
- [ ] **Sort control on Plants** — a **Sort** dropdown above the filter chips offers **A → Z**, **Due soonest**, and **Recently added**. It works together with search, the filter chips, and ▦ by room. Your choice sticks until you close the app. *(Plants tab, under the search box.)*
- [ ] The specimen numbers (01, 02…) stay with each plant like catalog numbers, so they won't renumber when you re-sort.

## build v24 — Sprint 3: three tabs, one Care hub
- [ ] **The bottom nav is now three tabs — Home · Plants · Care.** The old **Plan** tab (developer roadmap/notes) is gone. *(Bottom of any screen.)*
- [ ] **New Care tab** gathers everything hands-on in one place: a **Run a repot protocol** shortcut (pick a plant, then walk the steps), a **Supplies & gnat war** shortcut, the **Mix calculator** + "your plants on this mix" + "would also thrive," and the **Soil recipes** and **Gnat protocol** lists. *(Care tab.)*
- [ ] Nothing was removed from your plants or data — this is a re-homing of where things live, not a change to what they do. Supplies is still reachable from Today too.

## build v23 — final Sprint 2 polish
- [ ] **Settings grouped** — **Preferences** (units, reminders) is now separated from **Your data** (backup, reset) with section labels, so the two kinds of settings read distinctly. *(Settings.)*
- [ ] **Lighter plate top** — the plant page's ‹ › arrows are now bare editorial glyphs (no heavy boxes) and the × has a softer shadow — calmer, still easy to find and tap, still accessible. *(Any plant page.)*
- [ ] **No more button-under-＋** — added bottom clearance so any card's controls can sit clear of the floating ＋ button; nothing gets trapped underneath it. *(Today / lists.)*

## build v22 — Soil page: your plants first, reference tucked away
- [ ] **Shorter, calmer Soil page** — the Mix calculator, **Your plants on this mix**, and **Would also thrive** stay visible at the top; the long **Soil recipes** and **Gnat protocol** lists are now behind **▸ show** disclosures you open only when you need them. *(Soil tab.)*
- [ ] **Add sheet** is a little more compact (tighter header). *(＋ button.)*

## build v21 — museum treatment: one continuous plate
- [ ] **The plant page reads as one mounted sheet, not stacked cards** — the boxed sections (Vitals, Place & light, Pot, etc.) lost their borders/shadows and are now separated by fine **hairline rules** on the laid paper, under the Reference / Ritual / Record headings. Calmer, more editorial. *(Any plant page.)*
- [ ] **Callout leaders anchored** — the drawing's labels (fenestration, aerial root…) now have longer dotted leaders with a small node pointing toward the illustration. *(Any plant page, the mounted drawing.)*
- [ ] Visual only — every control, value, and action is unchanged.

## build v20 — flip through plants with swipes
- [ ] **Swipe left / right** on a plant's page to move to the **next / previous** plant — like flipping through specimen plates, no need to return to The Key. *(Open a plant, swipe sideways.)*
- [ ] **Swipe down from the top** of a plant's page to **close** it. *(Open a plant, pull down while at the very top.)*
- [ ] The ‹ › arrows stay for keyboard/accessibility; swipe is an extra. Dragging a slider or scrolling up/down is never mistaken for a swipe.

## build v19 — plate polish: uncrowd the corner + small refinements
- [ ] **Un-crowded top corner** — the collector's seal moved **off the header and onto the specimen plate** (stamped in the drawing's corner), so the top-right is no longer cluttered with the ×, the ›, and the stamp all at once. *(Any plant page.)*
- [ ] **Determination label** now reads "observed · [room]" (cleaner than the old "det. keeper").
- [ ] **＋ button** sits a little higher above the tab bar (clears the safe-area on notched phones).
- [ ] **Soil recipe rows** have a touch more breathing room between ingredients.

## build v18 — plate fixes: stamp position + always-reachable close
- [ ] **Stamp no longer covers the ›** — the collector's seal moved down beside the binomial, clear of the next-plant arrow. *(Any plant page, top-right.)*
- [ ] **Exit without scrolling up** — the **×** close now stays pinned to the top-right of the screen while you scroll a plant's page, so you can leave from anywhere. *(Any open card.)*

## build v17 — Sprint 2, chunk 2b: the Study specimen plate 🌿
- [ ] **A plant's page is now a mounted specimen plate.** Open any plant: it opens **plate-first** — the name in the botanical serif, the italic *binomial*, a family line, a collector's stamp, and the drawing **mounted** with registration corner marks. Below it: a **determination label**, a **health/season swatch strip**, then everything grouped under **Reference · Ritual · Record**. *(Any plant → tap to open.)*
- [ ] Everything still works exactly as before — all sliders, chips, dates, the repot run, photos, timeline — just re-composed as a specimen sheet. Nothing was removed.
- [ ] *(Known follow-ups, within V1: the section cards may become hairline rules, and the callout leaders/scale are a first pass. Content + data are final.)*

## build v16 — Sprint 2, chunk 2a: smoother plant page + one photo path
- [ ] **No more flicker when tuning a plant** — changing a plant's medium, pot material, health, light, water, drainage, room, or pot shape now updates **in place** (the chip highlight moves and the readouts refresh) instead of rebuilding the whole page and jumping. *(Any plant's page — tap the chips/segments.)*
- [ ] **One way to add a photo** — the separate "Photo check-in" button is gone; tapping the **＋ photo** tile now snaps a photo *and* lets you confirm how it's looking, in one flow. *(Plant page → Photos.)*

## build v15 — Sprint 2, chunk 1: botanical foundation (P1-4)
- [ ] **New display type** — titles and plant names now set in **Cormorant Garamond** (the botanical-folio serif from the Brand Board), replacing Fraunces app-wide. *(Everywhere — most visible on Today's headline and any plant name.)*
- [ ] **Laid paper** — the background is now fine **laid-paper** lines (like a herbarium sheet) instead of the dot-grid. Subtle, but it's the ground the specimen plate will sit on. *(Whole app.)*
- [ ] *Foundation for the Study specimen plate (coming next). No layout or data changed.*

## build v14 — Sprint 1 fixes (T1.2–T1.4)
- [ ] **Add button (＋) sits correctly** — it now hugs the right edge of the app on every screen width (no more drifting off-canvas on some phones). *(Bottom-right, any screen.)*
- [ ] **Honest Today button** — the big green button now reads **“Find a plant to repot →”** and takes you to your Plants so you can open one and run the protocol (it no longer implies it starts a run by itself). *(Today tab.)*
- [ ] **Clearer add-with-photo label** — the “＋ → photo” option now reads **“Add with a photo”** (no false promise of automatic ID yet). *(＋ button → Add a plant.)*

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
