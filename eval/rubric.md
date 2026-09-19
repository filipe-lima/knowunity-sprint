# Grading rubric

For grading this prototype (the voice active-recall feature). Seven
dimensions, each scored 1-10. Anchors below are written against this
project specifically — `docs/design-brief.md`'s hard constraints and
mandate, `docs/voice-ux-reference.md`'s six principles and states
table, and `docs/design-system.md`'s "Never do this" rules — not
generic design-review boilerplate.

---

## Scoring rules

- **"Looks good" is a 6, not a 9.** A 6 is a real, working, well-executed
  screen that a fast walkthrough wouldn't flag. A 9 is a screen that
  survives a **senior critique** untouched — someone deliberately
  looking for the seams and not finding load-bearing ones.
- **A dimension scores 8 or above only if it was verified by rendering,
  measuring, or testing — never from reading code.** Reading
  `RecordControl.tsx` and confirming it *should* animate is not
  verification. Loading the story, watching it animate, and confirming
  it reads as live is. If a dimension wasn't actually rendered/measured/
  tested, its ceiling is 7, regardless of how clean the source looks.

---

## Calibration reference

Hand-scored by the product owner against a real user test session
(Recall Hub → Loop's recording/verdict/correction-control flow →
Summary, 2026-09-19). **When a critic is unsure between two adjacent
scores, compare against this table before defaulting to the anchor
text alone** — it's the reference read, not a hypothetical.

| Dimension | Score | One-line reason |
|---|---|---|
| System fidelity | 7 | Consistent with Storybook and the components as designed. |
| Coherence | 6 | Convention isn't always the same — tapping the XP pill or "That's not what I said" acted like Try again, unexpected outside the real CTA. |
| Craft | 7 | States are all there; little to add. |
| UX judgment | 4 | Zoom/resolution hid the mic and the CTAs; Hub's two CTAs felt redundant when tapping the card should be enough. |
| Accessibility | 7 | Seemed fine; XP color on the dark background is occasionally low-contrast but held up. |
| Structure | 4 | Same root cause as UX judgment — CTAs should sit at the bottom without requiring a scroll. |

**Delivery-surface fidelity has no score in this table** — it didn't
exist as its own axis when this session was scored; its anchors below
are founded on this same session's mic/CTA-visibility finding, folded
out of Structure and UX judgment. Score the next real test session on
it explicitly and add the result here.

---

## Dimensions

### 1. System fidelity — High

**What it's scoring.** Does every colour/space/radius/type value trace
back to a real name in `tokens/tokens.json`, and does every component
instance map to a real entry in the Storybook library rather than a
hand-rolled equivalent? This is `CLAUDE.md`'s own hard rule ("never a
hand-typed value, never a CSS fallback") and `design-system.md` rules
1, 2, 5, 6, 9, 12.

- **4 —** Spot-checking a handful of files turns up hand-typed hex or
  pixel values, or a bespoke shape built from scratch where a real
  library component already covers it (a hand-rolled button instead of
  `Button`). `npm run check:tokens` would fail outright.
- **6 —** `check:tokens` passes and most values map to real tokens, but
  the discipline is inconsistent: a shape used identically on 2+ screens
  (a row anatomy, a header pattern) hasn't been promoted to a real
  `components/` entry despite the project's own stated rule for when
  that should happen, or a token substitution (nearest real match, not
  exact) is used without being flagged anywhere.
- **9 —** Every value traces to a named token, with every non-exact
  substitution explicitly logged, not silently absorbed; every shape
  repeated across 2+ screens has been promoted to a real, documented
  component; `check:tokens` passes and a manual pass across every
  component file confirms zero exceptions, not just the ones the script
  happens to catch.

### 2. Coherence — High

**What it's scoring.** Does the product read as one continuous thing —
one visual language, one set of interaction conventions applied the
same way everywhere — or as screens designed in isolation and stapled
together after the fact.

**Calibration note.** A single control silently doing something the
product's own convention forbids — e.g. a non-primary control (an
info pill, a correction button) triggering the same state change as
the one real CTA — is a real defect, but isolated to one flow it
reads as a **6**, not a 4. Reserve 4 for divergence that *repeats*
across the product with no stated reason.

- **4 —** The same job is solved differently in **more than one
  place** with no stated reason: two different "back" affordances, CTA
  priority that flips screen to screen without a documented rationale,
  an icon/color pairing that means one thing here and something else
  two screens later.
- **6 —** The product broadly reads as one thing — shared row anatomy,
  a consistent verdict color/icon language, a consistent CTA hierarchy —
  but a side-by-side comparison finds a few unreconciled seams: two
  structurally identical patterns built as separate one-offs before
  anyone noticed they were the same shape, a late addition (a new
  outcome type, a new state) that doesn't cleanly fit the taxonomy the
  rest of the product already established, **or one interactive
  control that silently breaks the product's own "only the real CTA
  advances state" convention in an otherwise-consistent flow** (the
  calibration reference's XP-pill/correction-control example is this
  tier, not a 4).
- **9 —** Every recurring pattern behaves identically everywhere it
  appears — verdict colors/icons, row anatomy, CTA hierarchy, the
  correction control's placement and timing, locked/disabled treatment —
  and every deliberate exception is stated as a deliberate exception,
  not left as an unexplained inconsistency. Flipping rapidly between
  every screen turns up nothing that contradicts the product's own
  established rules, and no control ever does something its own label
  doesn't promise.

### 3. Craft — High

**What it's scoring.** Spacing, rhythm, states, and the small
deliberate decisions — graded specifically against `voice-ux-
reference.md` Principle 1 ("show system status at every single moment
... design a distinct, unmistakable visual for each state ... color
alone isn't enough: pair it with a shape, icon, or motion") and
Principle 6 (the processing/wait state reads as "an answer is coming,"
not a dead spinner).

- **4 —** States exist but are visually interchangeable at a glance —
  a "processing" beat that's a static element differentiated from
  "recording" only by a caption string; a locked/disabled row signaled
  by a slightly duller label rather than a real visual treatment;
  inconsistent internal padding between rows that are supposed to be
  siblings.
- **6 —** Each state has its own real visual identity and spacing
  generally follows the token rhythm — motion exists somewhere genuine
  (an actually-live, non-repeating recording indicator, not a static
  snapshot) — but close inspection finds rough edges: a state
  distinguished by color alone where Principle 1 calls for a shape or
  icon too, an animation that pops rather than settles, minor
  inconsistency in padding between siblings that should match exactly.
- **9 —** Every state is unmistakable on first glance per Principle 1,
  with no reliance on color alone anywhere. Motion is purposeful and
  calm rather than decorative — a processing/waiting beat reads as "the
  system is working," not as noise. Spacing is rhythmically identical
  everywhere the same relationship repeats. A frozen state actually
  reads as frozen and a live state actually reads as live, confirmed by
  watching it, not by confirming the prop exists.

### 4. UX judgment — High

**What it's scoring.** Are the states handled, the hierarchy clear, and
the failure paths designed — graded against `design-brief.md`'s hard
constraints ("never trap the student," "judge generously") and
`voice-ux-reference.md`'s state-priority table (idle, recording,
processing, result, cancel-and-re-record, text fallback, permission
primer, permission-denied routing, skip are all **Must**).

- **4 —** A Must-priority state from the voice-ux table is missing or
  effectively undesigned (no distinct processing visual; a
  permission-denied path that doesn't actually route anywhere real);
  more than one action visibly competes for primary attention on a
  screen; a miss reads as punitive or final rather than generous, with
  no hint or contest path.
- **6 —** Every Must state exists and routes somewhere sensible, one
  clear primary action per screen holds in most places, recovery paths
  (hint, retry, skip, dispute) are present — but somewhere the "never
  trap the student" or "judge generously" principle is only partially
  honored: a button that technically leads somewhere but not back to
  where the student actually was (losing their in-progress context), or
  a state that's reachable in the underlying code but has no live
  trigger left to reach it from.
- **9 —** Every Must-priority state from the voice-ux checklist is built
  and behaves exactly as its principle describes — system status is
  always visible, the student is always in control of start/stop,
  permission is primed in context with a real denied-state path,
  generous judging demonstrably favors the kinder read on a close call.
  Every branch of the flow was actually walked, not just the happy
  path, and none of them dead-end. At most one primary action is ever
  on screen at once.

### 5. Accessibility — Medium

**What it's scoring.** Contrast, touch targets, and whether meaning
ever rests on color alone — `design-system.md` rule 10 explicitly:
"Success, error and info states need an icon or a word as well," and
two pairs it names as already risky at rest (an inactive `pro` chip vs.
an inactive `Primary` chip; a disabled primary button vs. an enabled
secondary one).

- **4 —** Multiple places where a state or verdict is distinguishable by
  hue alone; several controls measured under the 44pt target or under
  4.5:1 contrast; icon-only interactive controls without a real
  accessible name.
- **6 —** Most real components carry a proper accessible name and pass
  contrast under normal conditions, but scattered gaps remain — one
  spot relying on color alone, or a control sized correctly on paper but
  crowded enough in context to be a real mis-tap risk next to its
  neighbor.
- **9 —** Verified directly: no color-only signal anywhere in the
  product, every interactive control measured at ≥44pt, every body-
  text/background pairing measured at ≥4.5:1, every icon-only control
  carries a real accessible name — confirmed by an actual audit run
  (axe-core or equivalent, rendered and read back), not eyeballed from
  the design file.

### 6. Structure — Low

**What it's scoring.** Does the layout hold together and does the thing
actually render — `design-system.md` rule 8 ("never build a screen
outside the scaffold, and never put content outside the four slots").

**Calibration note.** A rule violation the project's own documentation
already admits to — a slot rule *stated* as broken in
`design-system.md`, not just suspected from reading the component —
is a *known* defect, not an *untested* one. It cannot be scored at
the 6-tier below on the reasoning that it "hasn't been confirmed to
break." Whether it's actually usable on a real device/viewport at
delivery size is a separate question — see "Delivery-surface
fidelity."

- **4 —** Visible breakage: content overflows its container, a screen
  fails to render, an element sits outside its intended frame, a slot
  renders empty where content was expected, **or a slot rule the
  project's own documentation already states is being broken** (not
  merely suspected).
- **6 —** Renders cleanly and everything lands where it should at
  realistic content lengths within the design canvas, but hasn't been
  stress-tested against genuine edge-case content (the longest
  realistic title, a 5-line summary, an empty state that's never
  actually been triggered).
- **9 —** Renders cleanly and holds up under real edge-case content,
  confirmed by actually rendering that content, not inferred from the
  markup. Every screen sits on a real scaffold root; nothing lives
  outside the four slots; no slot rule is left in a self-documented
  broken state.

### 7. Delivery-surface fidelity — Medium

**What it's scoring.** Does the screen actually work the way a real
person will see it — the real device/viewer at its real zoom level —
not just the idealized 390×844 design canvas `Scaffold` renders into.
Deliberately separate from Structure: a screen can honor every
scaffold/slot rule in the abstract and still be unusable in practice
if the delivered surface doesn't match the canvas 1:1.

- **4 —** A Must-priority control (the mic trigger, a primary CTA) is
  not visible without scrolling or zooming, on the actual device/
  viewer used to test — confirmed by watching a real person fail to
  find it, not inferred from the canvas dimensions.
- **6 —** Everything is reachable on the real delivery surface, but it
  takes an extra scroll or a moment of hunting the design canvas
  itself never shows — a real person gets there, but not on the first
  look.
- **9 —** Confirmed, on the actual device/viewer a real test uses,
  that every Must-priority control is visible without scrolling or
  zooming on first load — verified by watching someone reach it
  immediately, not by re-checking the 390×844 canvas.

---

## Combining scores

Weight order for judgment calls and tie-breaks: **System fidelity,
Coherence, Craft, and UX judgment (High) outweigh Accessibility and
Delivery-surface fidelity (Medium), which outweigh Structure (Low).**
A submission that's structurally flawless but fails on system fidelity
or UX judgment is a worse submission than one with minor structural
rough edges but real craft and judgment — score and discuss
accordingly, don't average the seven into a false equivalence.

---

## Hard gates

Independent of the seven dimensions above. Each is binary — pass or
fail, verified by measuring or testing, not read from source. **Any
failed gate fails the submission regardless of dimension scores.**

- [ ] **Contrast ≥ 4.5:1** for all body text against its real
      background.
- [ ] **Touch targets ≥ 44pt** on every interactive control.
- [ ] **No raw hex color in component source** — `npm run check:tokens`
      passes clean.
- [ ] **No two states that should differ ever render identically** —
      every state a screen can be in produces a visually distinguishable
      result from every other state it can be confused with.
