# 🌿 Plant Daddy HQ — Product Bible

**The single source of truth for Plant Daddy HQ.**
Philosophy, product strategy, UX, technical direction, and long-term vision.

| | |
|---|---|
| **Document** | Plant Daddy HQ Product Bible |
| **Status** | Living document — update as decisions change |
| **Owner** | Dorian (Founder) · Head of Product |
| **Version** | 1.0 |
| **Last updated** | July 2026 |
| **Related docs** | `Houseplant-System-Master-Doc.md` (care models + collection), `design/brand-board.html` (visual system), `BACKLOG.md` (execution tracker), `WHATS-NEW.md` (release verification) |

> **How to use this document.** This is the constitution, not the changelog. It defines what is true and what we believe. When a feature, design, or business decision is proposed, it must be justified against this document. When reality forces a change, change it *here first*, then let it flow downstream. If a new team read only this file, they could rebuild Plant Daddy HQ and make it feel like itself.

---

## 1. Executive Summary

Plant Daddy HQ is a mobile-first, **local-first** houseplant-care companion built around a simple conviction: *plant care software should respect the grower's judgment and their privacy.* It replaces rigid, nagging, one-size-fits-all care apps with a system that computes real, per-plant guidance from the actual pot, medium, light, and season — then always defers to the human and the finger-check.

The product is an installable Progressive Web App (PWA). It ships **pre-seeded with a locked 24-plant collection** and their species constants, works **fully offline**, keeps all personal data **on the device**, and backs up to a **single file the owner controls**. There are no accounts, no servers required, and no dark patterns.

Its signature is a **living, hand-drawn field-journal aesthetic**: each plant is a botanical specimen whose illustration evolves with its growth and health, wrapped in a naturalist's journal of care data, rituals, and field notes.

The near-term product exists and works. This Bible governs the next phase: a **botanical-journal design system**, an **AI-assisted photo layer**, and expansion from a single home into a **multi-room, multi-property plant world** — without ever betraying the founding values of privacy, honesty, and craft.

**The strategic fork this document resolves:** Plant Daddy HQ is being built first as a tool the founder genuinely wants. This Bible is written so it can *also* become a product for others — but every "for others" decision is held to the same values. We do not compromise the personal tool to chase a market; we let the personal tool's integrity *be* the market position.

---

## The Ambition — The Operating System for Plant Ownership

**Plant Daddy HQ is not another plant-identification or watering-reminder app.** Those are features, not a product. The ambition is to become the **operating system for plant ownership** — the single, calm, intelligent home for everything a plant keeper thinks about, decides, and does.

It becomes that OS by fusing seven pillars into one coherent experience:

1. **AI** — vision-based identification and health reads, and (later) intelligent assistance that turns observation into guidance. An accelerant, never a dependency.
2. **Gardening science** — real horticulture: pot geometry and volume, soil chemistry and drainage, light and season, root behavior. Guidance is *computed from physics*, not looked up in a generic table.
3. **Houseplant management** — the system of record: inventory, rooms, logs, supplies, rituals. The operational core.
4. **Botanical journaling** — the soul: an evolving, hand-drawn specimen journal where care and memory live together beautifully.
5. **Weather intelligence** — local conditions (light, temperature, humidity, season, daylight) that modulate care in real time. Your plants live in *your* climate, not a database's.
6. **Analytics** — the collection as living data: health and growth trends, watering/feeding patterns, gnat-war progress, what's thriving and what isn't — Apple-Health-style, calm and insightful.
7. **Automation** — routines and intelligence that quietly do the busywork: batch actions, smart reminders, restock triggers, and eventually rules ("when the forecast turns hot and dry, tighten the Alocasias' schedule").

**The feel — five words that gate every decision:**
- **Calm** — never loud, never nagging, never cluttered.
- **Premium** — considered, high-craft, worth owning.
- **Tactile** — it responds to touch like a real instrument; controls feel physical.
- **Scientific** — precise, honest, grounded in real horticulture.
- **Deeply intentional** — nothing accidental; every element earns its place.

**Design & product DNA — what we borrow, and from whom:**

| Inspiration | What we take |
|---|---|
| **Apple Health** | A calm, trustworthy system-of-record for living data; trends and rings that make status glanceable; privacy as a feature, not a footnote. |
| **Things 3** | Effortless, joyful interaction with the *doing* — logging and rituals so smooth they feel like a pleasure, not a chore; restraint and delightful micro-interactions. |
| **Notion** | A flexible, structured personal database that reads like a beautiful document; your collection as a living, self-describing knowledge base. |
| **Arc Browser** | Opinionated, spatial navigation; the courage to reimagine the expected layout; playful-premium personality and a strong point of view. |
| **Lightroom** | A pro tool for a craft: non-destructive editing, tactile precision controls, and gorgeous presentation of visual assets (our photos + plates). |
| **Traditional botanical field journals** | The heart and the aesthetic: hand-drawn specimen studies, margin annotation, warmth, and the marriage of science and beauty. |

Everything downstream in this Bible — IA, design system, AI strategy, roadmap — serves this ambition. When a decision is unclear, ask: *does this make Plant Daddy HQ more like the calm, premium, tactile, scientific, intentional operating system for plant ownership — or just more like another plant app?* Choose the former.

---

## 2. Vision Statement

**To be the operating system for plant ownership — a world where keeping plants alive is calm, personal, and quietly joyful, and where your collection feels like a living journal you tend, not a chore list that nags you.**

We envision Plant Daddy HQ growing from a single windowsill into the connective tissue of a plant-filled life: plants that know their own science, rooms that understand their own light and weather, a home that understands its rooms, analytics that reveal how your collection is really doing, automation that quietly handles the busywork, and — eventually — a life that knows where to find the next plant, the right supplies, and the community around them. All while the data stays yours.

---

## 3. Mission

**To give every plant keeper a beautiful, honest, private system that turns plant care from guesswork and guilt into a repeatable, rewarding ritual.**

We do this by:
- Computing **real per-plant guidance** from physical reality (pot geometry, medium, material, light, season) instead of generic tables.
- Always treating the schedule as a **prompt, not a command**, subordinate to the grower's finger-check.
- Keeping the experience **local-first and private** by default.
- Making the everyday interaction **fast** and the occasional deep-dive **beautiful**.

---

## 4. Core Design Principles

These are non-negotiable. Every screen, feature, and interaction is tested against them.

1. **Respect the grower's judgment.** The app advises; the human decides. Every computed schedule is overridable with a one-tap snap-back to the suggestion. The finger-check of the top two inches of soil always overrides the number.
2. **Honesty over engagement.** We never invent urgency, never nag to drive "streaks," and never hide capability behind manufactured friction. If a platform limits us (e.g., iOS PWA notifications), we say so plainly rather than fake it.
3. **Local-first and private.** Personal data (photos, measurements, logs) lives on the device and backs up to the owner's own cloud. It is never required to touch our servers. Code lives in version control; plant data never does.
4. **Beauty with a job.** The aesthetic is not decoration. Every beautiful element (the evolving art, the specimen plate, the swatch strip) is load-bearing — it communicates growth, health, or care state.
5. **Calm, not clever.** Default to whitespace, clarity, and one obvious action. Cleverness is earned only when it removes work.
6. **Fast daily, rich occasionally.** The 5-second interactions (log a watering, glance at what's due) must be effortless. The 5-minute interactions (a repot, a check-in) can be immersive.
7. **Offline is a first-class state, not an error.** The app is fully usable with no connection. Anything that needs the network is an opt-in enhancement that degrades gracefully.
8. **Reversible by default.** Destructive or mistakable actions (log, delete) come with Undo, not scary confirmation dialogs.
9. **Teach as you go.** Care guidance explains its "why." The product should quietly make the owner a better, more confident plant keeper over time.

---

## 5. Product Philosophy

Plant Daddy HQ is **one artifact doing three jobs**. Keeping these distinct is the key to the whole product; they map to different parts of every plant.

- **Reference** — *what this plant needs.* Its mix, cadence, repot window, light, water quality, toxicity. The part you consult.
- **Ritual** — *the acts of care.* The repot run with the gnat protocol; the watering and feeding you log as you do them. The part you act with.
- **Record** — *the history that accrues.* The dated care timeline, field notes, photos, gnat counts. The part that flows back and becomes memory.

**Corollary philosophies:**
- **The plant is the source of truth, not the calendar.** Repot timing is a *window* ("check the roots in ~4–7 months"), never a hard date. The roots make the call.
- **Constants ship; variables are entered.** Species facts (mature ceiling, thirst tier, bucket, toxicity, sensitivity) are seeded. The owner only fills what's real about *their* plant.
- **The system remembers so you don't re-guess.** A root condition captured once at a repot keeps shaping care until the next repot overwrites it.
- **The collection is curated, not accumulated.** The product gently steers acquisitions toward what fits the owner's aesthetic and conditions.

---

## 6. User Personas

### Primary — "The Intentional Keeper" (Dorian)
A design-literate plant owner with a growing, characterful collection (24+). Cares about both the *health* of the plants and how they read *on camera / in the home*. Frustrated by generic apps that overwater and nag. Wants a system that is accurate, private, beautiful, and teaches. Comfortable with technology, values craft and control. **This is who we build for first, and whose taste sets the bar.**

### Secondary — "The Anxious New Parent"
Recently caught the plant bug, killed one or two, feels guilty and unsure. Needs confidence more than data: clear "what do I do today," gentle guidance, and forgiveness (undo, "it's okay, here's how to recover"). Terrified of overwatering. **We win them by being calm and non-judgmental where competitors are shrill.**

### Tertiary — "The Collector / Aesthete"
Dozens to hundreds of plants, possibly rare cultivars, active in the plant community, may create content. Wants organization at scale (rooms, search, sort, propagation tracking), a gorgeous interface worth showing off, and accuracy for finicky species. **They stress-test scale and beauty.**

### Anti-persona — "The Gamified Streak-Chaser"
Someone who wants points, badges, social leaderboards, and daily-login mechanics. **We are explicitly not for them.** Serving them would corrupt the calm, honest core.

---

## 7. Jobs To Be Done

Framed as "When ___, I want to ___, so I can ___."

1. **When I glance at the app in the morning,** I want to instantly see what needs me today, so I can act in seconds without hunting.
2. **When I water or feed a plant,** I want to log it in one tap (and undo if I mis-tap), so tracking never feels like work.
3. **When I'm unsure if a plant needs water,** I want guidance that respects my finger-check, so I don't over- or under-water.
4. **When I repot,** I want a guided ritual that tells me the exact mix and runs the gnat protocol, so I do it right every time and never breed fungus gnats.
5. **When I acquire a new plant,** I want to add it quickly (ideally by photo) and get its care baseline, so it's cared for from day one.
6. **When a plant looks off,** I want to record its condition (with a photo) and understand what's happening, so I can course-correct.
7. **When I want to understand a plant,** I want a beautiful, readable "study" of its needs, uses, and quirks, so caring for it feels like learning.
8. **When my collection grows,** I want to organize by room/location and find plants fast, so scale stays manageable.
9. **When I plan a repot run or shopping,** I want to know what supplies and quantities I need, so I don't stall mid-task.
10. **When I switch or lose a device,** I want my whole plant history to move with me, so years of records are never at risk.

---

## 8. User Pain Points (that we exist to solve)

Grounded in competitive review and the founder's lived experience.

| Pain | Where it comes from | Our answer |
|---|---|---|
| **Rigid schedules you can't change** | Market-leader apps lock watering frequency; growers in dry/wet climates fight the app and sometimes kill plants. | Every interval is computed *and* fully overridable, with snap-back to the suggestion. |
| **Can't edit the date you did a task; can't undo** | The #1 recurring complaint about competitors. | Editable last-watered/fed dates; **Undo on every log and delete.** |
| **Generic, one-size-fits-all care** | Same watering advice for every plant regardless of pot/medium/light. | Real per-pot **frustum volume math**, medium/material dryness, light, season, drainage penalty — per plant. |
| **Nagging that causes overwatering** | "Trigger-happy" reminders trained people to water on schedule, not on need. | Advisory reminders + **finger-check-first** doctrine + drainage/rot awareness. |
| **Paywalls on basics (even plant ID)** | Core value gated behind subscription. | Generous free core; only *genuinely costly* features (AI vision) are premium, and never required. |
| **Fungus gnats that never end** | No structured, repeatable protocol. | The **four-step gnat protocol on every repot**, built into the ritual. |
| **Fear of losing years of data** | Cloud lock-in, opaque storage. | **Local-first + one-tap export/import** to the owner's own cloud. |
| **Ugly, utilitarian interfaces** | Plant apps often look like spreadsheets. | A **botanical field-journal** aesthetic with evolving hand-drawn art. |

---

## 9. Success Metrics

Because we optimize for *honest utility*, not engagement-at-all-costs, our metrics are deliberately not "daily active users / streaks."

**North Star:** *Plants kept healthy over time per active keeper* — proxied by the share of a user's collection at "Healthy" or "Thriving" trending stable-or-up over 90 days.

**Primary (health & trust):**
- % of plants in Healthy/Thriving state (and trend).
- Repot-protocol completion rate (rituals finished vs started).
- Data-completeness: % of variable fields filled per plant.
- Backup adoption: % of active users who have exported at least once.

**Engagement — quality, not volume:**
- Log actions per active week (a *sufficiency* target, not "more is better" — we want enough to be useful, not addictive).
- Weekly return rate (opened in last 7 days) — calm, not compulsive.
- Time-to-log a watering (should trend toward < 5 seconds).

**Guardrail metrics (things we watch to *not* break):**
- Notification opt-out rate (spike = we're nagging).
- Override rate on schedules (healthy signal that people feel in control; we never suppress it).
- Rage-taps / undo usage on destructive actions.

**If/when monetized:** free→premium conversion, premium retention, and "value moments" (e.g., an AI ID that a user confirmed) — never conversion driven by crippling the free tier.

---

## 10. Competitive Analysis

| Product | Strength | Weakness we exploit |
|---|---|---|
| **Planta** (market leader) | Big plant DB, polished onboarding, broad features | Rigid schedules, can't edit task dates, generic care, "trigger-happy" reminders → overwatering, ~$36/yr and ID paywalled. **These complaints are our positioning.** |
| **Greg** | Strong community, adjusts to light/location, friendly | Community/social is central (not everyone wants it); still cloud-account centric; less "beautiful object." |
| **Vera / Blossom / Gardenia** | Simple care reminders, ID | Generic scheduling; ad-supported / subscription; forgettable design. |
| **PictureThis** | Best-in-class plant ID | ID-first, not a care *system*; aggressive monetization; not a daily companion. |
| **Analog (notebook / memory)** | Free, private, personal, beautiful | No computation, no reminders, no scale, no backup. |

**Whitespace we own:** the intersection of **(a) accurate, physics-based, override-friendly care**, **(b) local-first privacy with no forced accounts**, and **(c) a genuinely beautiful, evolving, journal aesthetic.** No incumbent holds more than one of these; none holds all three.

---

## 11. Product Positioning

**Positioning statement:**
> For the intentional plant keeper who is tired of apps that nag, oversimplify, and lock away their data, **Plant Daddy HQ** is a local-first plant-care journal that computes honest, per-plant guidance and always respects your judgment — wrapped in a living botanical field-journal you'll actually want to open. Unlike Planta and other reminder apps, we don't rent you your own data or bark schedules at you; we make care accurate, private, and beautiful.

**Tagline candidates:** *"The plant app that respects your judgment."* · *"Your collection, as a living journal."* · *"Care, computed. Judgment, yours."*

**Brand personality:** knowledgeable but never condescending; a little bit apothecary/naturalist; the friend who actually knows plants and hands you the trowel instead of lecturing. The experience must always feel **calm, premium, tactile, scientific, and deeply intentional** — the five words that gate every design and product decision (see *The Ambition*).

---

## 12. Information Architecture

**Navigation model:** a persistent bottom tab bar (mobile best practice) with four destinations, plus a global add action. Detail views open as slide-up sheets with prev/next and swipe-to-close.

- **Home** — the landing/dashboard. *What needs me now* (due to water/feed, repot windows opening, gnat re-checks) + a calm overview of the collection's state. Evolves into the living "home/rooms" dashboard.
- **Plants** ("The Collection" / index) — the specimen index. Search, sort (A→Z, room, due-soonest, health, recently added), filter (medium, room, attention). Tap → the plant's **Study** page.
- **Care** — the "how" hub. Soil mixes (as recipes computed to the pot), the gnat protocol, the repot run, and the **Supplies** view (totals + low-stock).
- **Grow** (Field Guide) — learning, roadmap of the collection, acquisition guidance, and later **local discovery** (events, nurseries).
- **＋ Add** — floating action: *Identify by photo* or *Add manually*.
- **Settings** — appearance (theme), reminders, units, backup/import, content-creator mode, about/build.

**Plant "Study" page (the heart)** mirrors a botanical specimen plate: title + Latin name, the evolving/portrait illustration captioned to its growth stage, care sections (light, water, placement, toxicity), feeding, repot window + root condition, gnat watch, photos, a dated timeline, handwritten field tips, and the option to launch the repot ritual or remove the plant.

**Future IA layer:** **Home → Property → Room → Plant.** Rooms belong to a property; the app scales from one home to several. Room-level light context (windows, orientation, sun hours) feeds the care math.

---

## 13. Feature Inventory

**Shipped / core (built):**
- Pre-seeded 24-plant collection with species constants.
- Care math: watering interval (species × light × material × medium × growth × volume × season × drainage), feeding schedule (season- and soilless-aware), repot window (range in months), pot **frustum volume** (round & square) → cups of mix, realistic "fresh mix to prepare."
- Evolving parametric plant art (growth × health).
- Repot ritual (pot → recommended mix → roots → four-step gnat protocol → review), writing pot size, soil, and root condition back to the plant + timeline.
- Rooms/location + group-by-room + filters; sort (planned).
- Add plants beyond the 24 (manual + photo-capture scaffold).
- Photo capture + per-plant photo timeline; **photo check-in** (photo + confirm health).
- Quick-log Watered/Fed from Home; **Undo** everywhere; delete a plant (with undo).
- Supplies view (fertilizer, mix components, BTI, nematodes from logs).
- Soil tab: mix calculator + "your plants on this mix" + "would also thrive here" recommendations.
- Independent length/volume units (cm/in · L/mL/gal), cups for mix.
- Local-first persistence (IndexedDB), offline PWA, one-tap export/import backup.
- In-app due/overdue states + limited device notifications (honest about iOS limits).

**Planned / near (see Roadmap):** sort/filter controls, botanical-journal reskin + light/dark, AI photo ID + health read, the living Home dashboard.

**Later (the OS pillars maturing):**
- **Weather intelligence:** local forecast/daylight/temperature/humidity that modulates watering, feeding, and light guidance in real time; seasonal shifts handled automatically.
- **Analytics:** an Apple-Health-style insights surface — collection health & growth trends, watering/feeding cadence, gnat-war progress, thriving vs. struggling, per-room and per-species patterns.
- **Automation & routines:** batch/room actions, smart reminders, restock triggers, and rule-based intelligence ("hot dry forecast → tighten the Alocasias"; "gnat count rising → resurface the protocol").
- Property/home layer with room light context; local events/nurseries discovery; propagation tracking; supplies thresholds/restock; automatic cloud sync; optional native wrapper.

---

## 14. Roadmap — MVP · V1 · V2 · Long-Term

**MVP (done / stabilizing) — "It works and it's honest."**
Core care engine, 24 plants, repot ritual, offline persistence, backup, camera, quick-log, undo, delete, rooms, supplies, units. Goal: the founder can run the whole collection on it.

**V1 — "It's beautiful and effortless." (next)**
- Botanical-journal **design system** + **Light/Dark/Auto**.
- **Study page** as specimen plate; **Home** as calm command center; sort/filter.
- **Photo ID + health read** (AI, opt-in, behind a serverless key-proxy; tap-to-pick fallback stays).
- Interaction polish: transitions, swipe gestures, accessibility pass.
- Goal: a stranger opens it and says *"whoa."*

**V2 — "It's a plant *world* with a brain, not a list."**
- The living **Home/rooms dashboard**.
- **Property/home layer** (multi-room, multi-home) + room light context feeding care.
- **Weather intelligence** — local conditions modulate care in real time.
- **Analytics** — the collection as living, insightful data (health/growth trends, patterns).
- **Automation (v1)** — batch/room actions, smart reminders, restock triggers.
- **Propagation** tracking; supplies **thresholds + restock**.
- Optional **automatic Google Drive sync**.
- Goal: scales gracefully to a large, multi-room collection and starts to feel *intelligent*.

**Long-Term additions — "It runs itself as much as you want it to."**
- **Rule-based automation** ("when X, do/suggest Y") — the OS quietly working in the background.
- Deeper **weather + seasonal modeling** and cross-plant insights.

**Long-Term — "It connects your plant life."**
- **Local discovery**: plant events + nearby nurseries stocking what you're low on.
- Community layer *(only if it can stay optional and non-toxic)*.
- Species/photo-match to auto-file photos to the right plant.
- Possible native wrapper for reliable notifications.
- Goal: the connective tissue of a plant-filled life.

Sequencing rule: **beauty and effortlessness (V1) before breadth (V2).** We earn the right to expand by first being the app people love to open.

---

## 15. Design System Philosophy

**Locked direction: the Botanist's Field Journal.** A naturalist's specimen journal — aged toned paper, elegant italic serif titles (Latin names), handwritten cursive margin notes, fine graphite/ink line + *selective* watercolor, watercolor swatch strips, specimen stamps; an earthy, muted palette; light and dark. See `design/brand-board.html`.

**Principles:**
- **Token-first.** Every color, type, and spacing value is a design token, so the entire app reskins (and switches light/dark) by changing variables, not markup.
- **The art is the system's soul.** Hybrid approach: **parametric line-and-wash** that evolves with growth/health for daily/at-a-glance art, plus an optional **AI watercolor "portrait plate"** per plant as the Study hero. AI generates the *drawing only*; all text/data stays real, legible UI.
- **Type as identity.** Display serif (e.g., Cormorant/Fraunces) for titles + italic Latin; a hand font (Caveat) for field notes; a clean sans (Inter/Spline) for data and controls.
- **Restraint = elegance.** Hairline dividers over heavy cards where possible; generous whitespace; one confident accent.
- **Motion later, and expressive.** Animation is its own layer, added after the static look is locked: gentle plant "breathing," a leaf unfurling as health rises, soft sheet transitions, a ripple on logging. Motion expresses an already-decided style; it never leads.
- **Two skins, one design.** Light ("Daylight") and dark ("Nightfall") are the same layout recolored; night keeps the plant art's glow.
- **Interaction DNA (borrowed on purpose).** The journal *look* carries a specific *feel*, drawn from our references (see *The Ambition*): **Apple Health's** glanceable trends and calm data, **Things 3's** frictionless, joyful logging and micro-interactions, **Notion's** structured-yet-document flexibility, **Arc's** spatial confidence and point of view, and **Lightroom's** tactile, precise, pro-grade controls and gorgeous asset presentation. The result should feel **calm, premium, tactile, scientific, deeply intentional** — a real instrument, not a form.

---

## 16. AI Strategy

**Doctrine: AI is an opt-in accelerant, never a dependency.** The app must be fully functional, private, and offline without any AI. AI removes friction; it never becomes a gate or a leash.

**Where AI earns its place:**
1. **Photo identification + health read** (V1). Snap a plant → suggest species, read visible condition, pre-fill care. Start with a **plant-specialist API (Plant.id / Kindwise)** for accuracy + a free tier; consider a general vision model later for richer, freeform recommendations. Always keep the **tap-to-pick fallback** so it works offline and privately.
2. **Illustrated portrait plates** — AI generates the watercolor *drawing* per plant (and per stage); the app supplies all text/data. (AI handwriting is unreliable → never trust AI for labels.)
3. **Future, opt-in:** photo-to-plant matching (file a new photo to the right specimen); natural-language digests/summaries; and eventually an **on-demand plant assistant** that turns your logs, analytics, and local weather into plain-language guidance ("why is my Calathea crisping?", "what should I prioritize this weekend?"). This is where AI meets the other pillars (weather, analytics, automation) — intelligence that *interprets* the system-of-record, never one that takes over care unbidden.

**Guardrails:**
- Any AI call requires the network and is clearly an *enhancement*; the UI states when it's used.
- API keys are **never** embedded in the static client — a tiny serverless key-proxy (Cloudflare/Netlify/Vercel/Supabase Edge) holds them.
- On-device/tap-to-pick remains the private default; cloud AI is opt-in and disclosed.
- We do not silently send the user's photos anywhere. Consent is explicit.

---

## 17. Notification Philosophy

**We inform; we do not nag.** Notifications exist to prevent harm (a thirsty plant), never to manufacture engagement.

- **In-app due/overdue is the source of truth**, always available, offline, on every platform.
- **Device notifications** fire where the platform *actually* supports them (foreground + background on Android/Chrome). **On iOS installed-PWAs they are limited/unreliable — we say so plainly** and lean on the in-app "Due now" list there. We never fake reliability.
- **One calm digest over many pings.** Prefer a single morning "here's what needs you" summary to scattered alerts.
- **User-controlled cadence and types.** Owners choose time-of-day and which categories (water, feed, repot window, gnat re-check) notify.
- **No streaks, no guilt, no "you're neglecting your plants!"** Tone is a helpful friend, never a scold.
- Success looks like a *low* opt-out rate — proof we're helping, not hounding.

---

## 18. Accessibility Standards

Target: **WCAG 2.1 AA**, verified each design pass.

- **Contrast:** text and meaningful UI meet AA (the muted earthy palette must be tuned so notes/labels aren't too low-contrast — a known risk of the journal aesthetic).
- **Touch targets:** ≥ 44×44 pt; generous spacing on primary actions.
- **Type:** respect Dynamic Type / user font scaling; never hard-lock tiny text. The decorative hand/serif fonts are for accents, not critical data (data stays in the readable sans).
- **Don't rely on color alone:** status uses icon + label + color together (e.g., "water due" text, not just a red dot).
- **Motion:** honor `prefers-reduced-motion`; all animation is decorative and skippable.
- **Semantics:** proper roles/labels, focus order, and screen-reader summaries; forms labeled; images have alt text.
- **Offline & error states** are legible and reassuring, never dead ends.

Accessibility is a **release gate**, not a nice-to-have: a design isn't done until it passes.

---

## 19. Monetization Strategy

**Principle: never paywall basic plant care, and never rent people their own data.** The thing competitors are hated for is exactly what we refuse to do. We only ever charge for features that *cost us real money* or deliver *disproportionate premium value* — and the free tier remains a genuinely great, complete app.

**Recommended model — "Free core, pay for what costs us":**
- **Free forever:** the full care engine, unlimited plants (within reason), rooms, repot ritual, photos, offline, **and full backup/export.** Your data is always yours and always portable — never held hostage.
- **Premium (optional, if/when we productize for others):**
  - **AI photo ID + health reads** (these cost per-call) — bundled credits or subscription.
  - **Automatic cloud sync** across devices (hosting cost).
  - **Multi-property / advanced scale** features.
  - **AI watercolor portrait plates** for the whole collection (generation cost).
- **Possible alternatives to weigh:** a **one-time purchase** ("buy the app, own it") which aligns beautifully with the anti-subscription ethos; or **keep it entirely free/personal** if this stays the founder's tool.

**Absolute no's:** ads, selling data, engagement-bait subscriptions, or gating core care behind a paywall.

**Open strategic decision (founder call):** Is Plant Daddy HQ a *personal masterpiece* (free, private, ours) or a *product for the world* (freemium)? The architecture supports both. This Bible recommends building it personal-first to the highest standard, then — only if it earns love — layering the ethical premium tier without ever degrading the free core.

---

## 20. Technical Considerations

**Architecture:** a lightweight, installable **PWA** in plain HTML/CSS/JS — no heavy framework unless something genuinely needs it. Static hosting (currently **GitHub Pages**).

- **Data:** **IndexedDB**, local-first. Plant records, logs, and compressed photos live on-device. **One-tap export/import** to a single portable JSON file (photos as compressed data URLs) is the backup and the migration path. **Plant data never enters the git repo.**
- **Domain layer:** the **care math is an isolated module** (`care.js`) — watering, feeding, repot window, frustum volume — so models are easy to tune without touching UI.
- **Art:** resolution-independent, theme-able **parametric SVG** generators; AI-generated raster plates are optional assets layered on top.
- **Design tokens:** all theming via CSS variables → light/dark and full reskin by swapping values.
- **Offline / updates:** **service worker, network-first for the app shell** (updates appear immediately when online; cache is the offline fallback), precache bypasses HTTP cache, and a visible **build stamp** in Settings for verification. Cache version bumps on release.
- **Separation of concerns (the data rule):** *app code* lives on GitHub (version-controlled, free host); *plant data* lives on the device + the owner's own cloud backup. Never mix them.
- **AI/cloud (future):** any API key sits behind a **tiny serverless proxy**, never in the client. Cloud sync and AI are additive services, not the app's spine.
- **Constraints to respect:** iOS PWA limits (notifications, storage eviction, home-screen removal can clear storage → *always export before resets*); image weight (compress on capture); no external runtime deps beyond the type fonts (cached by the SW).

**Quality bar:** care math is unit-verifiable against known values; every release is syntax-checked and spot-tested; docs (`WHATS-NEW.md`) record what changed and where to see it.

---

## 21. Future Expansion Opportunities

Captured, not committed — the adjacent possible. (The three OS pillars beyond today's app — weather, analytics, automation — are detailed in the roadmap; summarized here as expansion bets.)

- **Weather-driven care:** local forecast, daylight length, temperature and humidity dynamically tune each plant's watering/feeding/light guidance — care that lives in *your* climate.
- **Analytics & insights:** Apple-Health-style trends across the collection — health/growth over time, watering & feeding cadence, gnat-war progress, per-room and per-species patterns, "what's thriving / what needs attention."
- **Automation & routines:** batch and room-level actions, smart reminders, restock triggers, and rule-based intelligence that quietly runs the busywork.
- **Home dashboard as centerpiece:** an interactive, living view of the home; rooms with their plants as evolving sketches; tap-to-care; a "pulse band" of collection health.
- **Property / smart-home light context:** rooms carry windows, orientation, morning-vs-evening sun and rough sun-hours that *feed the care math* — a real accuracy edge no competitor has.
- **Local discovery:** plant events near you; nurseries/stores stocking exactly what your Supplies view says you're low on (maps/places API, opt-in "discover" tab).
- **Propagation & lineage:** track pups/cuttings without breaking the collection cap until they graduate to full specimens.
- **Design integration** with a broader home/"Townhouse" system (staging, aesthetics).
- **Community (conditional):** only if it can stay optional, kind, and non-gamified.
- **Content-creator mode:** an optional on-camera staging layer for those who film their collections.

---

## 22. Features We Explicitly Will NOT Build

Saying no is how the product stays itself.

- **Streaks, badges, points, or daily-login gamification.** Corrupts the calm, honest core.
- **Social feeds / leaderboards as a core requirement.** (Optional, opt-in community *maybe*; never the spine.)
- **Ads, or selling/monetizing user data.** Ever.
- **Forced accounts or forced cloud** for basic use. Local-first is sacred.
- **Paywalling core plant care** (including basic identification's fallback and backup/export).
- **Fake or exaggerated notification reliability** (e.g., pretending iOS PWA push is dependable).
- **Rigid, non-overridable schedules.** The exact thing we exist to replace.
- **Auto-executing irreversible actions** without Undo.
- **Feature bloat that dilutes the three jobs** (Reference / Ritual / Record). New features must strengthen one of them.
- **Photo-realistic auto-generated plant art that replaces the evolving illustration.** The living, hand-drawn quality is the identity; realism that can't evolve is off-brand.
- **Generic, one-size-fits-all care logic.** If we can't make it per-plant and honest, we don't ship it.

---

*Plant Daddy HQ — Product Bible v1.0. A living document. Change it here first, then let it flow downstream. Care, computed. Judgment, yours.*
