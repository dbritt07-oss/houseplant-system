# 🌿 Plant Daddy HQ — Visual Constitution

**The governing document for how Plant Daddy HQ looks, feels, and is made — the visual peer of the Product Bible.**
Where the Product Bible governs *what we build and why*, this governs *how it must feel to the eye and the hand*.

| | |
|---|---|
| **Status** | Permanent source of truth — living, but changed deliberately |
| **Owner** | Dorian (Founder) |
| **Companion law** | `docs/Plant-Daddy-HQ-Product-Bible.md` (product) · `design/brand-board.html` (the visual North Star this codifies) |
| **Authority** | Every UI change is validated against this document **before** implementation. If a change fails the Design Review Gate (§11), it does not ship — it is reworked or cut. |

> **How to use this document.** This is not a component library and not a style guide of pixels — those change. This is the *philosophy* beneath every visual decision, written so that if a stranger rebuilt the app from it, the result would still feel like Plant Daddy HQ. When a screen, control, illustration, color, or motion is proposed, it is justified against these principles. When the Brand Board and this document agree, that is law. When reality forces a change, change it *here first*, then let it flow into the build.

**The one sentence, above all else:** *A naturalist's journal for the modern plant keeper — warm, precise, and quietly alive.* If a decision makes the app less like that sentence, it is wrong, no matter how "usable" it tests.

---

## 1. Emotional Goals

Design serves feeling first, function through feeling.

**How the app should make someone feel:**
- **Calm.** Opening it should lower the heart rate, not raise it. It is a quiet room, not a control tower.
- **Cared-for, and caring.** The person feels tended-to, and feels themselves becoming a better, gentler keeper.
- **Reverence.** A small sense of wonder at living things — the feeling of a botanical plate in an old library.
- **Craftedness.** The sense that a real hand made this, that it is *owned*, not *used*. Tactile, considered, permanent.
- **Quiet pride.** Their collection, rendered beautifully, is something they want to open and show — without a single share button asking them to.

**Emotions we must never create:**
- **Guilt or alarm.** No nagging, no red-badge anxiety, no "you're neglecting your plants."
- **Urgency or pressure.** No manufactured scarcity, streaks, or countdowns.
- **Busyness or overwhelm.** No wall of metrics, no cockpit of numbers.
- **Cuteness or condescension.** Not a toy, not a game, not a mascot talking down to a beginner.
- **Sterility.** Never the cold, frictionless emptiness of a productivity dashboard.

If a screen produces any of the second list, it has failed regardless of how efficient it is.

---

## 2. Materiality

The app is made of **implied physical materials.** Every surface should suggest something you could touch. Digital flatness is the enemy; we fake matter, tastefully.

- **Paper.** The ground of everything is aged, toned rag paper — warm cream (`Paper #ece0c6`), with tooth and subtle unevenness, not a flat fill. Paper may shift tone gently with season and time of day. It should feel *pressed*, not *rendered*.
- **Linen & board.** Structural surfaces (headers, the "cover") may read as bookcloth or archival board — a heavier, matte weave beneath the paper.
- **Botanical ink.** Line and text are drawn in **Ink Green (`#2f3d2c`)** — a green-black, the color of a dip pen on a herbarium sheet — not neutral gray, never pure black. Ink has weight and the faint irregularity of a real nib.
- **Watercolor.** Color arrives as **washes**, not fills — soft, semi-transparent, bleeding just past the line. Health, season, and accents are painted, never plotted.
- **Specimen plates.** The organizing metaphor for a plant's page is a **mounted specimen** — the drawing, the binomial, hairline callout leaders, a swatch strip, a collection date, a stamp. Data *is* the plate's annotation.
- **Museum-archive influences.** Letterpress labels, herbarium mounts, field-journal margins, botanical lithographs, a wax seal or ink stamp, a specimen accession number. The reference is a natural-history collection, ca. 1890, seen through a modern, restrained lens.

**Guardrail:** if a surface could exist unchanged in a generic web app, it is under-designed. Add tooth, wash, or ink — or remove it.

---

## 3. Editorial Principles

We compose pages like a fine journal or exhibition catalog, not like a form.

- **White space is content.** Generous margins are a feature, not waste. Emptiness gives the eye rest and the subject reverence. When in doubt, remove, then add space.
- **Rhythm.** A page has a cadence — a bold opening, quiet passages, a single moment of emphasis. Uniform, evenly-weighted rows (a "stack of identical cards") are forbidden; they read as software.
- **Composition over templating.** Each key page is *composed*, not poured into a repeating card grid. The plant's page is a plate; the day's page is a masthead.
- **Hierarchy is dramatic, not flat.** One clear hero per screen, a clear second voice, then quiet detail. Everything the same size means nothing is important.
- **Asymmetry is encouraged** where it serves the eye — an off-center drawing, a margin note pulled to the edge, a caption hanging in the gutter. Asymmetry is how a page feels *drawn* rather than *generated*. Symmetry is for calm grids of specimens (the collection index); asymmetry is for the single specimen (the study).

---

## 4. Typography

Three voices, each with a job, a home, and a forbidden zone. Type is never decoration for its own sake; each face carries meaning.

- **Editorial serif (display) — the botanist's hand.** A high-contrast editorial serif with true italics, per the Brand Board: **Cormorant Garamond** (the current build ships Fraunces — an acceptable interim, but flagged for reconciliation toward the Brand Board face). *Allowed:* plant names, page titles, the specimen binomial (always italic), large editorial numerals. *Forbidden:* body data, buttons, dense UI.
- **UI sans — the label maker.** A clean, quiet sans (Brand Board: **Inter**; build currently: Spline Sans — either is acceptable). *Allowed:* all functional controls, data values, buttons, nav labels, filters, forms, anything a screen reader must read cleanly. *Forbidden:* pretending to be warmth. The sans is honest and invisible; it never tries to be charming.
- **Handwriting — the margin note.** **Caveat.** *Allowed, and only here:* genuine field notes, handwritten care tips, captions on a drawing, atmospheric annotations, the "essence" voice. *Forbidden:* navigation, buttons, filters, status, any functional control, or any load-bearing text. Handwriting is an accent seasoning; when it labels a button it becomes costume and cheapens the whole. The moment Caveat does a job the sans should do, we have drifted.

**Rule of thumb:** serif names the living thing, sans runs the machine, hand whispers in the margin. If those roles blur, correct them.

---

## 5. Illustration Philosophy

Illustration is the soul; it is never clip art and never a stock photo grid.

- **Botanical plates are primary.** The signature is a **living line-and-wash specimen drawing** — generated in-app, evolving with each plant's real growth and health, working offline. It should look *observed*, not *diagrammed*: varied line weight, a hint of vein and stipple, a soft wash bleeding past the ink, a cast shadow, a sense of a hand that loves the plant.
- **Scientific-illustration discipline.** Plates carry the honesty of natural-history illustration — proportion, structure, a scale sense, a collection date, a specimen number. Accuracy is part of the beauty.
- **AI-generated art has one job.** An optional **watercolor "portrait plate"** per plant may serve as the Study hero. **AI generates the *drawing only*.** Every name, label, number, and note is real, legible UI — never AI text (it lies and it looks wrong). AI augments the plate; it never runs the interface.
- **Photography is the keeper's record, framed with respect.** The owner's photos are memories, not marketing. They are mounted like prints in an album — with margin, caption, and date — never dumped into an edge-to-edge grid.
- **How they coexist:** the *drawing* is the identity (always present, offline, evolving); the *portrait plate* is the occasional lush hero (optional, online); the *photo* is the personal truth (the keeper's own eye). Line-art leads; watercolor elevates; photography grounds. They never compete on the same surface — one hero at a time.

**Forbidden:** cartoon mascots, flat vector "corporate Memphis" people, glossy 3D render blobs, emoji as illustration.

---

## 6. Color Philosophy

Color is drawn from a herbarium, not a screen. It is warm, muted, and *painted*. The palette is small on purpose.

- **Ink Green `#2f3d2c`** — the ink. Primary line and primary text. Our black. Signature. Restore it wherever the build has slid to neutral brown/black.
- **Paper `#ece0c6`** — the ground. Warm, toned, textured. The stage on which everything rests.
- **Sage `#5f7a4c`** — living green. Growth, health, the affirmative action. The primary "go" color.
- **Terracotta `#b0563a`** — warm clay. Attention, warmth, the pot. Used for *care needed*, never for alarm-red panic.
- **Ochre `#b79b4e`** — aged gold. Season, ripeness, a secondary warm accent.
- **Bloom Blue `#5b6b86`** — the single **cool** accent, a flower-blue from the Brand Board. Restrained: informational calm, water/hydration cues, focus, a quiet highlight — the cool counterweight to terracotta's warmth. Never a "tech blue" link color; it is a pressed-flower blue.
- **Warm neutrals** — the muted earth tones between (`--muted`, `--faint`, lines) carry quiet text and hairlines. They are *dulled ink*, never cold gray.

**Color rules:**
- Color is applied as **wash and tint**, not saturated fill. Prefer translucency and layering over solid blocks.
- **One accent moment per view.** Warm (terracotta/sage) for the living/active; Bloom Blue for the calm/informational. Don't shout in two colors at once.
- **Nightfall (dark mode)** is a deep-forest twilight (`#171d15` base, sage-glow, amber, chalk), not an inverted gray dashboard. Same herbarium, by lamplight.

**Accessibility is part of the palette, not opposed to it.** We meet **WCAG 2.1 AA** (4.5:1 normal text) by choosing *darker ink*, never colder ink. Canonical accessible values: text ink toward **Ink Green `#2f3d2c`**; quiet-secondary **`--muted #655c46`**; faintest **`--faint #685e49`**. Legibility is a premium quality, not a compromise — a well-set herbarium label is perfectly readable. If contrast and warmth seem to conflict, the answer is a darker warm, never a grayer one.

---

## 7. Motion Philosophy

Motion is breath, not performance.

- **Calm.** Everything eases gently; nothing snaps, bounces, or springs with personality. The pace is a slow exhale.
- **Intentional.** Motion exists only to explain a change — a sheet rising, a value settling, a leaf unfurling as health rises, ink blooming as a page is stamped. If an animation doesn't clarify or quietly delight, it is removed.
- **Never distracting.** No looping, no attention-grabbing, no motion that competes with reading or with the plant. Nothing moves while the eye is trying to rest.
- **Motion is the last layer.** It is added only after a static composition is right; it expresses an already-decided design, it never leads it.
- **Respect stillness.** `prefers-reduced-motion` is honored absolutely; all motion is decorative and fully skippable.

---

## 8. Interaction Philosophy

- **The plant is always the hero.** Every screen answers "where is the living thing?" first. Chrome, controls, and data orbit the plant; they never upstage it.
- **The interface should disappear.** The best moment is when the person forgets they're using software and feels they're tending a journal. Controls recede until needed, then are exactly where the hand expects.
- **Remove unnecessary chrome.** Toolbars, redundant headers, decorative dividers, and duplicate labels are debt. Default to *less*: could this control be a gesture, this header be implied, this card be air?
- **Every interaction feels deliberate.** One obvious action per moment. Fast where it's daily (a one-tap log), immersive where it's rich (a repot ritual). Nothing accidental, nothing busy.
- **Reversible and gentle.** Undo over confirmation dialogs; forgiveness over friction. The app never scolds and never blocks.
- **Restraint is the signature interaction.** Cleverness is earned only when it removes work. When unsure, do less.

---

## 9. Iconography

- **Handcrafted, not system.** Icons are drawn in the same botanical ink as the plates — line marks with the hand's slight irregularity, a family with the plant drawings, not a downloaded set.
- **No emoji as UI.** Emoji (💧🍽️🌱) are forbidden as functional controls or status. They are another company's cartoons wearing our clothes; they instantly cheapen the craft. Replace every functional emoji with a drawn ink mark.
- **Editorial, not playful.** Icons are quiet, precise, and few — closer to engraved catalog marks than to a colorful app-store icon set. Meaning first, personality through restraint.
- **Icon + word for anything that matters.** Never rely on a glyph (or color) alone for meaning; pair with a real label.

---

## 10. Design Guardrails — what we will never become

These are bright lines. Crossing one is a defect, not a trade-off.

- **A generic SaaS dashboard** — KPI cards, cockpit of metrics, sidebar-and-widgets. We are a journal, not an admin panel.
- **Neon, glow, or vivid gradients.** Our color is pressed and muted; nothing glows.
- **Glassmorphism / frosted-glass tech aesthetics.** Our surfaces are paper and board, not glass.
- **Gamification** — points, badges, streaks, levels, confetti. Corrupts calm and reverence.
- **Cartoon or mascot illustration.** No characters, no googly-eyed plants, no corporate-Memphis figures.
- **Decorative, attention-seeking animation.** No motion for delight-without-purpose, no loading theatrics.
- **Excessive metrics / busy dashboards.** Numbers are quiet annotations, never the main event.
- **Cold minimalism.** Empty ≠ sterile; our emptiness is warm paper, not white void.
- **Trend-chasing.** No adopting the current app-design fashion; the herbarium doesn't go out of style.

---

## 11. Design Review Gate

**Before any feature or UI change ships, it must pass this gate.** Answer honestly; a single wrong answer sends it back.

1. **Does this feel calmer** than what it replaces (or at least as calm)?
2. **Does the plant remain the hero** of the screen?
3. **Could this appear in the Brand Board** — would it belong on that page?
4. **Does it feel more like software than a botanical artifact?** (If yes → rework.)
5. **Did we introduce unnecessary chrome** — any control, header, or divider that could be implied or removed?
6. **Can anything disappear** and leave it stronger?
7. **Does this strengthen the botanical identity** — more ink, paper, wash, specimen; less generic UI?

Plus the standing materiality checks: *Is the ink green, not gray? Is color a wash, not a fill? Is Caveat only in the margin? Is any emoji doing a control's job? Is there exactly one accent moment?*

If a change is accessible, functional, and on-schedule but fails this gate, it is **not done.** Accessibility and craft are not in tension here — the gate exists precisely so that fixing one never sacrifices the other. Make it legible *and* make it feel drawn.

---

*Plant Daddy HQ — Visual Constitution v1. The permanent visual source of truth, peer to the Product Bible. Warm, precise, and quietly alive. Change it here first, then let it flow into every pixel.*
