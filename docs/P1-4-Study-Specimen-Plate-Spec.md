# 🌿 P1-4 — The Study Specimen Plate — Design Specification

**The flagship screen. The one that defines Plant Daddy HQ.**
This is the turnkey build spec for Sprint 2, task **P1-4 / T3.1**. When Sprint 2 opens, implementation starts from this document — no exploration, no re-deciding. It composes the *existing* plant data into a mounted botanical specimen plate, replacing today's uniform 11-card scroll.

**Governed by:** `docs/VISUAL-CONSTITUTION.md` (visual law) · `design/brand-board.html` (North Star, "Specimen plate" section) · validated at build time against the Design Review Gate (VC §11). **No new data model, no new features** — pure composition and materiality over data that already exists.

**North-star sentence:** opening a plant should feel like *sliding a mounted specimen out of a museum drawer* — not scrolling a form.

---

## 0. Scope split — V1 (build now) vs V2 (hooks only)

Build the **composition, materiality, and all data** in V1. Leave clean seams for the two expensive pieces.

| Element | V1 (Sprint 2) | V2 (later) |
|---|---|---|
| Plate composition, header, callouts, care grid, swatch strip, stamp (static), margin notes, mounted photos, measurements, ritual, record | ✅ build | |
| Living **line-and-wash** hero art (evolves w/ health) | ✅ reuse `art.js`, add wash layer | |
| **AI watercolor portrait plate** hero | seam only (a slot the drawing lives in) | ✅ swap in |
| **Motion** (leaf unfurl, ink-bloom stamp, leader-line draw-in) | static first; `prefers-reduced-motion` respected | ✅ expressive layer |

If time is tight in Sprint 2, ship the composition + swatch strip + stamp + callouts static; motion and AI plate are explicitly deferable without redesign.

---

## ★ Art Direction — Elevation Pass (toward timeless / museum quality)

*The governing lens over everything below. It adds no features — it refines composition, material, type, and atmosphere so the Study page could hang in a gallery. **Where this section and a zone spec differ, this section wins.***

**North star for the screen:** *a page you would frame.* The first viewport should read as a **mounted botanical specimen**, not an app screen — screenshot it and it looks like a plate from a 19th-century flora, quietly modernized.

**The defining tension — name it, design to it: *a personal museum.*** The plate is *institutional* (printed labels, catalog numbers, registration marks, a collector's stamp); the margins are *personal* (a keeper's handwritten note, a dated observation). Timelessness lives in that tension — reverent and warm at once. Neither side wins; they coexist on one sheet.

**1 · Editorial composition.** Lay the whole plate on an **invisible modular grid with a true baseline rhythm** — nothing floats arbitrarily; everything snaps, as if set by a compositor. **One screen, one specimen:** the first viewport is the *plate* (binomial · drawing · determination label · a whisper of swatch) with almost no UI; measurements, ritual, and record live *below the fold*, revealed by scrolling like turning to the notes behind a mounted sheet. Asymmetry with **tension, not just offset** — anchor the drawing to a strong vertical (the left third-line), hang the names against it, and leave the opposing space *deliberately empty*.

**2 · Museum quality.** Mount the drawing on a **toned mount board** inset within the sheet, with a **hairline keyline** and **registration corner marks** (⌐ ¬) — a matted print. Adopt a **determination label**: a small off-white bordered label (as glued to herbarium sheets) holding *name · family · det. [keeper] · collection date* — authentic museum grammar for the identity block. Set a **plate number** like a folio (`Pl. 05`), and a discreet reduction note (`drawn ~⅓ life`) where scaled. Banish anything that looks like an app control from the plate.

**3 · Visual rhythm.** A **strict typographic scale (4 sizes, one musical ratio)**. A single **printer's ornament** (a small engraved leaf) as the section divider — used once per movement, never as filler. Density rhythm: **airy hero → measured data → intimate record**; alternate breath and detail on purpose.

**4 · Negative space.** Give the hero **luxurious** space — the drawing floats, the top of the sheet is mostly paper. **Three callouts, not four**, each with long thin leaders and air. Empty gutter is *rest*, not waste. When unsure, remove, then add space.

**5 · Materiality.** **Replace the dot-grid with laid paper** — the single highest-impact change. A dot-grid reads as graph paper / engineering; **laid paper** (fine horizontal laid lines, faint chain lines, soft rag tooth) reads as *herbarium* and is instantly timeless. (Laid paper satisfies Visual Constitution §2's "aged rag paper with tooth" for the **whole app** — P1-4 leads the migration off the dot-grid, not a one-screen exception.) Add a faint **deckle / soft edge vignette**, a **letterpress deboss** on the collector's stamp (pressed, not printed), and ink with slight weight variation + a touch of bleed at terminals.

**6 · Typography.** **Resolve the display serif to Cormorant Garamond** (the Brand Board face) — Fraunces is characterful but contemporary; Cormorant is the timeless botanical-folio voice. Per Visual Constitution §4, Fraunces is only an *interim*, so **P1-4 initiates the app-wide swap to Cormorant — it is not a one-screen fork** (avoid two display serifs coexisting). **True small caps** (`font-feature-settings:"smcp"`) for family + section labels — never faux-uppercased tracking. **Old-style figures** (`onum`) for dates and inline numbers (they sit like text — deeply editorial); lining/tabular figures only in the measurement table. Binomial always italic, genus capitalized, a hair of tracking, hung punctuation. Four sizes, generous leading — *discipline is the luxury*.

**7 · Botanical storytelling.** Compose a **narrative arc**, not a data dump: *specimen → identity → nature → life-with-you.* Drawing (specimen) → determination label (identity) → growth caption + one evocative field line, from existing copy (nature) → the record (life with you). Each scroll is a page-turn. The growth caption is **narration**, not a stat, in the keeper's hand.

**8 · Specimen-plate language.** Real herbarium grammar as *visual language*: determination label, plate number, registration marks, an optional **scale bar**, the collector's stamp. These organize with authority and age well.

**9 · Field-journal atmosphere.** **Restraint in the hand** — one or two Caveat notes on the entire plate, no more; timeless journals are sparse. The keeper's presence via a dated note and an initial — quiet, never cute.

**What to resist (the line between *timeless* and *twee*):**
- **No literal props** — no coffee rings, taped/paper-clipped corners, faux-torn edges. Atmosphere comes from paper, ink, type, and space, not costume.
- **No dot-grid, decorative drop shadows, gradients, or glass.**
- **No second hero and no second accent color** on the plate at once.
- **No faux-vintage photo filters** — age the *materials*, never the *photo*.

**Amendments to the sections below (this pass overrides them):** paper = **laid, not dot-grid**; display serif = **Cormorant** for this screen; callouts = **3**; add **mount board + keyline + registration marks + determination label + plate number**; first viewport = **plate only, data below the fold**; type gains **true small caps + old-style figures**.

---

## 1. Information Hierarchy (what matters, in order)

The plate answers three questions in the Bible's order — **Reference → Ritual → Record** — but *composed*, not stacked.

1. **Identity (hero):** which living thing is this? → name, binomial, the drawing, its health-at-a-glance.
2. **Reference (the annotation):** what does it need? → light, water, place, toxicity; the measurements.
3. **Ritual (the acts):** what do I do? → log water/feed, the repot window + protocol, gnat watch.
4. **Record (the memory):** what has happened? → photo plates, dated log, field notes, the stamp.

Visual weight, high → low: **the drawing** > the name > health swatch > care callouts > measurements > ritual actions > record. Exactly one hero per screen (VC §3). Everything else recedes.

---

## 2. Editorial Composition (VC §3)

- **Asymmetry for the specimen.** The hero drawing sits **off-center** (weighted left, ~62% width), binomial and callouts hanging in the right gutter — a plate, not a centered card. (Symmetry is for the *collection index*; the single specimen is asymmetric.)
- **Generous margins.** The plate breathes: ~20px outer margin, air between zones, hairline rules instead of boxed cards where possible (VC §3 "hairline dividers over heavy cards").
- **Rhythm:** a bold masthead → a quiet hero with fine annotation → compact data → quiet record. One dramatic moment (the drawing), then calm.
- **Rules, not boxes.** Replace the current stack of `.pcardb` boxes with **thin ink-green rules** and section labels; keep boxes only where an editable control genuinely needs containment.
- **Paper is continuous.** The whole plate is one toned sheet (no card-on-card); zones are separated by rules and space, so it reads as a single mounted page.

---

## 3. Wireframe — full plate (mobile, ≤440px column)

```
┌───────────────────────────────────────────────┐
│  ‹        M O N S T E R A                    ›  │  ← plate nav (prev/next, 44px)
│           deliciosa                             │  ← binomial, italic serif, ink-green
│           SWISS CHEESE PLANT · ARACEAE          │  ← common + family, sans caps, muted
│           [ TOXIC — KEEP UP ]        ╭──────╮   │  ← specimen tags + collector stamp
│  ═══════════════════════════════════ │ PDHQ │   │     (2px ink-green rule under head)
│                                      │No.05 │   │
│                                      │ '26  │   │
│   ┌───────────────────────╮         ╰──────╯   │
│   │                        │· · · · fenestration│  ← hairline callout leaders → labels
│   │      [ LINE + WASH     │                    │
│   │        DRAWING ]       │· · · · aerial root │
│   │                        │                    │
│   │                        │· · · · growth point│
│   └───────────────────────╯                    │
│   ~ drawn at 53% to its 2.1 m ceiling ~         │  ← growth caption, Caveat, muted
│                                                 │
│   �damp▪▪▪▪▪ health · late summer ▪▪▪▪▪          │  ← health/season SWATCH STRIP (painted)
│  ─────────────────────────────────────────────  │
│   CARE                                          │  ← section label, sans caps
│   ┌────────────┬────────────┐                   │
│   │ ☼ LIGHT    │ ◍ WATER     │                  │  ← 2×2 care grid (ink glyphs + sans)
│   │ Bright,    │ every 6 d   │                  │
│   │ indirect   │ (finger 1st)│                  │
│   ├────────────┼────────────┤                   │
│   │ ⌂ PLACE    │ ⚠ PETS      │                  │
│   │ Living room│ Toxic       │                  │
│   └────────────┴────────────┘                   │
│  ─────────────────────────────────────────────  │
│   MEASUREMENTS            [ specimen · editable ]│  ← archival data block
│   Height   ├──────●───────┤  1.12 m              │  (sliders reskinned as fields)
│   Pot      ⌀24 · base 18 · h22 · terracotta      │
│            [pot inset drawing]  ≈ 7.7 L · 32 cups │
│  ─────────────────────────────────────────────  │
│   RITUAL                                         │
│   ◍ Watered  ▸ next in 3 d      [ Watered today ]│  ← ink glyph actions
│   ✿ Fed      ▸ every 2 wks      [ Fed today ]    │
│   ⟳ Repot    ▸ check roots in 4–7 months          │
│              roots: snug (remembered)             │
│              [ Run the repot protocol → ]         │
│   ✷ Gnats    ▸ 0 traps this week · trend flat     │
│  ─────────────────────────────────────────────  │
│   RECORD                                         │
│   [photo]  [photo]  [＋]     ← mounted prints     │
│   Jul 5 · Photo check-in — Healthy               │  ← dated field-journal log
│   Jun 28 · Repotted, aroid mix, roots snug  ⊛     │  ← stamp mark on repot entries
│   ~ field note: give it a moss pole to climb ~   │  ← Caveat margin note + input
│  ─────────────────────────────────────────────  │
│   Specimen No. 05 · collected in your care        │  ← quiet provenance footer
│   [ No longer have it? · remove ]                 │
└───────────────────────────────────────────────┘
```

### Zoom — hero plate + callouts

```
      off-center drawing (62% col)        right gutter (hairline leaders)
   ┌──────────────────────────╮
   │            ╱│╲            │·············· fenestration
   │          leaf│wash        │
   │        line + │watercolor  │·············· aerial root
   │              │            │
   │            stem            │·············· growth point
   └──────────────────────────╯
     leader = 0.5px ink-green dotted, ending in a 2px node at the label
     labels = sans 10px, muted; ALWAYS real text (never leaders alone)
```

---

## 4. Specimen Plate Layout — zone by zone

Each zone lists: **content · data source · type · VC/Brand refs**.

**A. Plate header (masthead).**
- Common name — `p.name` — serif 28px ink-green. · Binomial — `p.latin` — italic serif 18px, ink-green. · Family — derived per archetype (static map, e.g. Araceae) — sans 10px caps muted.
- Prev/next specimen — `‹ ›`, 44px, aria-labelled (already in build).
- Toxicity tag — `p.tox` → `[TOXIC — KEEP UP]` (terra) or `[PET-SAFE]` (sage) — **specimen tag** styling (Brand `.antag`).
- 2px ink-green rule beneath (Brand Board `.head` border).
- *Brand:* the `.wm` masthead + `.stamp`. *VC:* §3 hierarchy, §4 type roles.

**B. Collector stamp (accession seal).**
- Circular, ~64px, rotated −8°, clay/terra ink, `opacity .8`. Content: `PLANT DADDY HQ · No. {index} · {first-seen year}`.
- Sits top-right of header. On repot completion it **stamps onto the page** (V2 motion; V1 static presence).
- *Brand:* `.stamp` "Brand No. 01". *VC:* §2 materiality (wax seal / accession), §7 motion.

**C. Hero illustration.**
- The living **line-and-wash** drawing — `plantArt(p)` from `art.js`, scaled by `hCm/matureCm` × `HVAL[hi]` (already implemented) — placed off-center on a toned panel with paper tooth.
- Add a **watercolor wash layer** behind/within the line (semi-transparent sage/season tint; VC §5, Brand "living line-and-wash").
- **Growth caption** below — derived (existing `growcap` copy) — Caveat 16px muted.
- **V2 seam:** the panel is the exact frame an AI watercolor **portrait plate** drops into (same aspect, same margins).
- *Brand:* "Plant art — hybrid" + specimen `.st-draw`. *VC:* §5 illustration.

**D. Callout labels (botanical anatomy).**
- **3** hairline **leader lines** (0.5px dotted ink-green) from the drawing to **text labels** in the right gutter, each with generous air (see Elevation §4). Points are **static per art archetype** (new small map):
  - Monstera/aroid: fenestration · aerial root · growth point
  - Shield (Alocasia): midrib · petiole · corm
  - Snake: leaf tip · rhizome · variegation margin
  - Strap (Dracaena): cane · leaf node · crown
  - Vine (Pothos): node · aerial root · new leaf
  - Paddle (Strelitzia): midrib · petiole · fan base
  - Bromeliad: central cup · rosette · pup
  - Palm: spear · frond · crown
  - Tree (Ficus): apex · leaf · trunk
- Labels are **sans 10px muted**, always real text (a11y — never leader-only).
- *Brand:* the `.antag` callout tags ("common + Latin name", "drawing + growth stage"). *VC:* §5, §2 (museum plate).

**E. Health / season swatch strip.**
- A painted band of **5 watercolor cells**. Encodes **health** (cell lit/ringed = current `HEALTH[hi]`: Critical→terra, Stressed→ochre, Healthy→sage, Thriving→deep sage/ink-green) plus a **season tint** wash overlaid (growing = warmer, dormant = cooler/bloom).
- Caption beside it: `health · {season word}` — sans 10px caps muted. **Not color-only** (word present, a11y).
- *Brand:* `.swstrip` "health / season swatches". *VC:* §5, §6, §2.

**F. Care grid (2×2 annotation).**
- Compact grid: **Light / Water / Place / Pets** — `p.light`, `suggestIntv(p)`, `p.room`/`p.loc`, `p.tox`. Small **ink glyphs** (VC §9) + sans 13px values. Water cell includes the "finger-check first" honesty line (Bible).
- *Brand:* `.care` grid. *VC:* §4 (sans data), §9 (ink glyphs).

**G. Measurements (field data block).**
- The existing editable controls (height slider+number, pot top/base/height, medium, material, drainage, shape) **reskinned as an archival measurements table** — hairline rows, sans labels, serif numerals for the big values. Pot **inset drawing** + volume→cups readout (existing `potdraw`/`potnums`).
- Keep every existing control and binding (`detailRefresh`); only the *dress* changes.
- *VC:* §4, §8 (interface recedes; controls feel like instrument fields).

**H. Ritual.**
- Water / Feed / Repot / Gnats — existing data (`lastW`, `feedState`, `repotWindow`, `rootcond`, `trapN`). Ink-glyph rows; "Watered today"/"Fed today" actions; **Run the repot protocol →** launches the existing bench flow. Root condition shown as remembered field note.
- *VC:* §8 interaction, §9 glyphs. *Bible:* §5 Ritual.

**I. Record.**
- **Photos as mounted prints:** `p.photos` in a row with print margins/corner marks and dates — not an edge-to-edge grid (VC §5 "photos framed like prints"). `＋` and check-in entry points preserved.
- **Care timeline** — `p.log` — dated field-journal rows, **Caveat dates** (atmospheric), sans body. Repot/stamp entries carry a small **⊛ stamp mark**.
- **Margin field note** input — the existing note field, Caveat, styled as a handwritten margin.
- *Brand:* handwritten field tip. *VC:* §5, §4 (Caveat = margins).

**J. Footer.** Quiet provenance line + the low-key "remove from collection" (existing, with undo).

---

## 5. Watercolor Placement (VC §5, §6)

- **Behind the line drawing:** one soft sage/season wash, `fill-opacity` ~.3–.4, bleeding just past the ink (Brand "living line-and-wash"). Never a hard fill.
- **The swatch strip:** the only place color appears as discrete painted cells.
- **Paper tint:** the hero panel is a hair warmer/toned than the surrounding paper, like a mounted plate on a sheet.
- **Nowhere else.** Care grid, measurements, ritual, record stay ink-on-paper. One accent moment (VC §6): the drawing's wash + the swatch strip. Terra/sage warm; Bloom Blue only for water/hydration + focus.

## 6. Botanical Illustration Placement (VC §5)

- **Hero:** the parametric line-and-wash, off-center, ~62% column width, the single largest element on the screen (it *is* the hero).
- **Pot inset:** the small technical pot drawing lives inside Measurements (secondary, diagrammatic — this one *may* be plain line, it's an instrument reading).
- **Timeline thumbnails:** photos only (the keeper's record); the *drawing* is not repeated in the record.
- **One drawing, one hero.** Never two illustrations competing on one surface (VC §5).

## 7. Margin Notes (VC §4)

- **Voice:** Caveat, muted/clay, 16–18px. **Only** genuine field notes: the growth caption, a per-archetype field tip (static, e.g. "give it a moss pole & wipe the leaves monthly"), and the user's own note input.
- **Mobile adaptation:** true side-margins don't exist at 440px — margin notes become **inset handwritten lines** hanging beneath their zone, slightly indented, as if scrawled in the gutter. On wide viewports (future tablet) they may float to a real margin.
- **Never load-bearing** — anything a screen reader must rely on is sans, not Caveat.

## 8. Typography Hierarchy (VC §4)

| Role | Face | Size | Color | Where |
|---|---|---|---|---|
| Common name | **Cormorant Garamond** (Elevation §6 — Fraunces is the interim until the app-wide swap) | 28px | ink-green | header |
| Binomial | serif **italic** | 18px | ink-green | header, callout title |
| Section labels / family | sans caps, letterspaced | 10px | muted | zone headers |
| Care values, measurements, ritual | sans | 13px | ink | data everywhere |
| Callout labels | sans | 10px | muted | leaders |
| Big numerals (height, volume) | serif | 19px | sage/ink | measurements |
| Growth caption, field tips, note input | **Caveat** | 16–18px | muted/clay | margins only |

Serif names the living thing; sans runs the machine; hand whispers in the margin. No exceptions.

**Elevation refinements (per Art Direction §6):** display serif → **Cormorant Garamond** for this screen; **true small caps** (`smcp`) for family/section labels (not tracked uppercase); **old-style figures** (`onum`) for dates/inline numbers, lining/tabular only in the measurement table; hung punctuation on the binomial; hold to **four sizes** on one ratio.

## 9. Motion Ideas (VC §7 — expressive, last layer, all reduced-motion-safe)

- **Leader lines draw in** on first open (`stroke-dashoffset` 0.4s ease), then hold.
- **The drawing breathes** — a barely-perceptible scale/opacity idle (≤2%), off by default, on only if motion allowed.
- **New leaf unfurls** when health rises a step (a line path draws on).
- **Ink-bloom stamp:** finishing a repot presses the collector seal onto the page with a soft ink spread — the "ink the page" moment made physical.
- **Swatch wash bleeds in** when health/season changes.
- **Sheet rise** on open (existing).
- All gated by `prefers-reduced-motion: reduce` → instant, no idle, no bloom. Motion never leads; it expresses an already-correct static plate.

## 10. Accessibility (VC §6, Bible §18 — a release gate)

- **Reading order (screen reader):** name → binomial → toxicity → illustration `alt` (species + growth stage + health, e.g. "Line drawing of Monstera deliciosa, ~53% grown, reading healthy") → care grid → swatch caption → measurements → ritual → record. The visual off-center composition must linearize to this order in the DOM.
- **Callouts are real text** (leaders are decorative `aria-hidden`; labels are readable).
- **Swatch strip is not color-only** — the `health · season` caption carries the meaning in words.
- **Contrast AA:** ink-green 8.9:1, muted `#655c46` 5.1:1, faint `#685e49` 4.9:1 (all verified in T1.1).
- **Targets ≥44px**, **Bloom-Blue focus ring**, **reduced-motion** honored — inherit the T1.1 foundation.
- **All existing editable controls keep labels + slider/number pairing**; the reskin is visual only.

## 11. Visual Constitution references

- **§2 Materiality** — paper tooth, botanical ink, watercolor wash, specimen plate, museum archive, wax seal.
- **§3 Editorial** — asymmetric composition, white space, rhythm, hairline rules over boxes, one hero.
- **§4 Typography** — serif names / sans machine / Caveat margins.
- **§5 Illustration** — line-and-wash hero, AI portrait plate seam, photos as mounted prints, one hero.
- **§6 Color** — ink green, sage, terra, ochre, Bloom Blue accent, wash-not-fill, one accent moment.
- **§7 Motion** — calm, intentional, reduced-motion-safe, last layer.
- **§8 Interaction** — the plant is the hero, the interface disappears, remove chrome.
- **§9 Iconography** — ink glyphs, no emoji.
- **§11 Gate** — the plate must pass all seven questions before ship.

## 12. Brand Board references (`design/brand-board.html`)

- **"Specimen plate — the app data, in the design"** — the exact template: `.st-t` binomial, `.st-c` family, `.st-draw` drawing, `.care` 2×2 grid, handwritten field tip, `.swstrip` swatch strip, `.antag` callout tags. **This zone of the Brand Board is the literal blueprint for the plate.**
- **`.stamp`** ("Brand No. 01") — the collector seal.
- **`.head` / `.wm`** — the masthead + 2px ink-green rule.
- **Palette + type** — ink-green, sage, ochre, terra, bloom; Cormorant/Caveat/Inter roles.
- **"Before → after"** — this screen *is* the "after: refined · alive · warm."

## 13. Implementation notes (turnkey for Sprint 2)

- **Replaces** the body of `renderDetail()` (the `.pcardb` stack) with the zoned plate; **keeps** every data binding and the `detailRefresh()` live-update path (chip taps already route there post-T1.1... *note:* the chip-tap→`detailRefresh` routing is itself part of P1-4 per the execution plan — do it here).
- **New static maps** (small, additive): family names per archetype; callout anatomy points per archetype; per-archetype field tip. Put beside `ARCHETYPE_FIT` in `app.js`.
- **New CSS** for plate zones, callouts, swatch strip, stamp, mounted-print photos — token-based, extends the T1.1 system (ink-green, bloom, specimen-tag already exist).
- **Reuse:** `plantArt`, `potVolL`/`potnums`, `suggestIntv`, `repotWindow`, `feedState`, timeline render, photo render — all unchanged in logic.
- **No data model change. No new features.** Composition + materiality only.
- **Effort:** the execution plan budgets T3.1 at ~12h; this spec is scoped to fit V1 (composition + static swatch/stamp/callouts) with motion + AI plate as V2.
- **Definition of Done + Design Review Gate** apply as normal; this is the screen we hold hardest to the Gate.

---

*P1-4 Study Specimen Plate — design specification v1.1 (+ Art-Direction Elevation Pass). The flagship. Build from this in Sprint 2; do not re-explore. A page you would frame — a personal museum. Warm, precise, and quietly alive — the screen that defines Plant Daddy HQ.*
