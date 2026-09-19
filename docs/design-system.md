# Knowie design system: rules

File: `Yummy__Knowie Design System` (`u3BZUg8k5p3mrOrKAnYO5c`). Companion to
`tokens/tokens.json`, which holds every value. This file holds none. Where a number,
colour, size or type step is needed, name the token and look it up there.

Scope for this sprint: mobile, 390px, dark only. The system has one colour mode.

---

## Which component to reach for

### Structure

**scaffold** is the only correct root for a screen. Every screen starts as a
scaffold instance at `size=iPhone 13`. Nothing is placed on a bare frame.

**appBar** goes in the scaffold's `topNavigation` slot, and only where content
scrolls underneath it. Its fill is a gradient scrim, not a solid bar, so it
separates by fade rather than by a border. If the header sits on a static
screen, use a plain row in the slot instead. Its six variants describe the
action layout, not the screen it belongs to. **Corrected 2026-09-16:** this
used to say "zero instances anywhere in the file" — false. `Hub C — The
queue`'s own real instance (node `13759:45277`) genuinely uses `appBar`
(`variant="leftIconButtonOnly"`), confirmed live. `screens/Hub/RecallHub.tsx`
still doesn't reproduce it — it uses the plain back-icon-plus-title row this
paragraph otherwise prescribes for static screens (`scaffoldHeader`,
promoted 2026-09-17 to `components/ScaffoldHeader/ScaffoldHeader.tsx`,
shared with Recall history — see its own section below) — a deliberate
choice, not a contradiction resolved by editing code; see `docs/SPEC.md`
§3. The mobile top bar for this
feature is `topBar` (below), not this component.

### Actions

**button** for anything with a text label. Primary is the one action the screen
is asking for, and there is at most one on screen. Secondary supports it.
Tertiary is the inline, link-shaped action inside content.

**buttonIcon** for a glyph-only action with no label. Never as a substitute for
a labelled button when the icon's meaning is not already obvious from context.

**buttonGroup** for the bottom action block, in the `bottomContent` slot. It is
the only sanctioned way to put two actions side by side. Horizontal holds a
buttonIcon then a button. Vertical holds two buttons, primary above secondary.
Do not assemble a group by hand out of loose buttons.

**chips** for filters, selectable options and small counters. Not for actions:
a chip that performs something rather than selecting something is a button.

### Content

**textBlock** for a heading with an optional caption beneath it. Its four
variants change role, not just scale: XL and L are screen titles, M and S are
row and card titles. The jump from L to M is a role change, so do not treat the
four as one smooth ladder.

**iconSlot** for every icon, always, including icons nested inside other
components. There is no other route to a glyph.

**mascotSlot** for every Knowie placement in product UI. Two axes: `size`
(XL / 2XL / 3XL / 4XL) and, as of 11 September, `crop` (Full / Peek). `Peek` is
the clipped window used when Knowie sits above the recall card mid-loop (what
`knowie peek / NEW` used to be as its own hand-built frame — it no longer needs
to exist separately). The pose is still an instance-level swap that no property
tracks: a `pose` property was attempted and could not be wired through this
session's tooling (see the 11 September section below), so if a screen depends
on a specific expression, say so in the annotation rather than assuming the
component carries it. One caveat: `size=XL, crop=Peek` is currently a no-op —
XL's native height already equals the crop height, so there's nothing to crop.
If XL needs a real peek effect, that's a design decision still to make, not a
build gap.

**progressIndicator** for step or session progress that lands on a quarter. It
is a horizontal bar, not a ring, and it has five discrete steps. Anything
continuous, indeterminate, or off those steps is not this component. Note that
`progress=0` still renders a visible nub, so it does not read as empty. For
countable n-of-m progress (this feature's session progress), use `termPip`
instead — see below.

**snackbar** for transient confirmation or error after an action. Not for
anything the student must act on, and not for anything that must persist.

### When nothing fits

Say so. Do not stretch a component past its axes, and do not detach one to make
it fit. An unmet need is a system gap to write down, not a local override.

---

## The scaffold

One vertical auto-layout root, sized by its `size` variant, with four slots.
All four slots stretch their child on insert, none declare a minimum or
maximum, and none restrict what can be dropped in. The file does not enforce
any of what follows, which is why it is written down.

**Removed 2026-09-17: the Panel Header region (a fixed, non-slot 48px strip
holding a mocked status bar — time, signal, Wi-Fi, battery).** Built, then
briefly removed, then reversed back in on the reasoning that this prototype
was reviewed as phone-shaped screenshots inside a desktop browser, where
nothing shows a status bar unless the app draws one itself. Reversed again,
for good, once actually tested on a real smartphone: there, the phone's own
OS status bar already sits above the browser viewport, so the fake one
directly duplicated it. Removed the whole region, not just its content, since
an empty filled strip with a divider and nothing in it would have been just
as wrong an assumption to keep. `components/StatusBar/StatusBar.tsx` (the
component that lived here) is deleted; see `docs/component-gaps.md` for the
full history. Every screen now starts flush at the scaffold's own top rounded
corner.

**`topNavigation`.** Back and close actions, the screen title, streak and
counter chips, right-hand actions. Hugs its content, so it grows with what you
put in it. Gate it with `showTopNavSlot`; do not delete the contents to hide it.

**`middleContent`.** The screen body, and the only slot that scrolls. It carries
the screen's horizontal margins and a vertical rhythm between its direct
children, both from `tokens/tokens.json`. Children therefore fill the width and add no
horizontal padding of their own. Anything that must run edge to edge is a
deliberate exception and needs a negative-space token, not a hand-typed offset.

**`bottomContent`.** The thumb zone: the primary CTA (as a buttonGroup), the
bottom navigation bar, or the chat input. One of those three, never two. It hugs
its content and carries its own generous vertical padding, so do not add spacers
above or below it. Gate it with `showBottomNavSlot`.

**`bottomSheetOnly`.** Sheet content and the home indicator region. Pair it with
`showBottomSheetBackground` when the sheet needs a scrim behind it. Leave it
empty on ordinary screens.

Two warnings. The scaffold's main component set is not on any page in the file;
it survives only because instances point at it. Duplicate an existing screen
rather than hunting for it in the assets panel. And the slots' preferred-value
lists are a convenience, not a constraint, so a wrong component will drop into a
slot without complaint.

---

## Components built 11 September

Fifteen components (thirteen new, `field` and `composer` counted separately,
plus `buttonTimed`), built through figma-console / the Figma Desktop Bridge from
`claude/component-specs.md`, on a page called `New components`. They are **not
yet filed into `Component library > Components`** — they live in their own
wrapper frames on that page, pending your review and the move. `mascotSlot`,
covered above, is the one exception: it's a live edit to the existing shared
component, already in place wherever it's instantiated.

Where a value below names a token, look it up in `tokens/tokens.json` as usual. Where
a number is given as a literal, it's because the file has no governing token
for it yet — that's flagged inline, matching how each build doc flagged it,
rather than invented as a new token.

Each entry below quotes the description you wrote for the component, unedited.
Where a component has no written description yet (`buttonTimed`), that's said
plainly rather than filled in.

### `listRow`

**States and options.** Sixteen variants: `state` (Default / Selected / Locked
/ Pressed) × `size` (M / S) × `surface` (Surface / Stacking).

**Other properties.** `title` TEXT, `subtitle` TEXT, `showSubtitle` BOOLEAN.
Two slots, `Leading` and `Trailing`, both left empty by default (no default
content baked in).

**What each state means.** `size=M` is a row that owns a screen (Hub queue,
Home continue, picker, plan steps), title at `Greed/Headline XXS Bold`.
`size=S` summarises inside a screen (session buckets, coverage, next in plan,
Your terms), title at `Greed/Caption M Bold`. `state=Selected` adds a
heavy-weight `accent/brand/bold` stroke. `state=Locked` dims the title to
`text/disabled` but keeps the subtitle on `text/secondary` — see the Don't
below. `state=Pressed` fills `interactive/pressed` regardless of the `surface`
axis, which makes `surface` inert whenever a row is pressed; that's an open
question below, not a resolved rule. `surface=Surface` binds
`background/surface`, `surface=Stacking` binds `background/stacking`.

**When to reach for it.**

> Any list. Hub rows, Home continue rows, picker rows, plan steps, session
> summary buckets, Your terms, suggested questions.

**Don't.**

> Don't dim the subtitle in `state=Locked`. The title goes to `text/disabled`
> and the subtitle stays on `text/secondary` on purpose, because the subtitle
> is the line that names what unlocks the row. A locked row with a dimmed
> subtitle stops explaining itself and starts just refusing.

**Reversed since the above was written, on your own explicit decision:** an
axe-core accessibility scan found `state=Locked`'s title on `text/disabled`
failing contrast at 3.69:1 against `background/surface` (under the 4.5:1 AA
minimum) — on the row's primary, load-bearing label, not the subtitle. Given
the choice between fixing it in place or accepting the trade-off the Don't
above describes, you chose to flip it: the title now stays on
`text/secondary` (legible, still one step down from Default's
`text/primary`) and the subtitle takes the dim (`text/disabled`) treatment
instead. The reasoning in the original Don't still holds as a real
trade-off — a locked row with a dimmed subtitle does explain itself less —
it was just weighed against a real contrast failure on the title and lost.
Treat this note as the current rule; the blockquote above is kept for the
record, not as live guidance.

**Two open questions, not yet decided:** whether `Pressed` should keep its
`surface` fill and gain a separate overlay layer (right now Pressed and
Stacking-when-pressed are pixel-identical, silently collapsing 4 of the 16
variants into 2); and whether `surface=Stacking` should mean anything when a
row sits directly on `background/page` — composited, `Stacking` on `page`
currently renders identical to `Surface` on `page`, and only differs once a row
sits inside something already on `background/surface`.

### `recallCard`

**States and options.** None — a single component, not a set. The plan is
explicit that the card itself never changes; only its content slot does.

**Other properties.** `provenance` TEXT, `instruction` TEXT, `term` TEXT. One
slot, `Content`, uncapped — it holds a stack (badge, aside, transcript,
correction button can all sit in it at once), not a single child.

**What it means.** N/A — no states. The card's own geometry pays a small,
expected cost for the slot mechanism: with nothing in `Content`, the base
component measures 16px taller than a real hand-built card with no third
block, because the slot node is still present as a child even empty. Not a
defect.

**When to reach for it.**

> Every screen in the loop, voice or text. If a screen shows a term to answer,
> it is this card.

**Don't.**

> Don't turn the loop states into variants of the card. The moment a verdict
> becomes a card variant, every new state costs a variant, the set stops being
> readable, and the card can never be used for anything but this feature.

### `recallBlock`

**States and options.** Four variants exist in the real Figma component set,
on one axis, `variant`: Transcript / Hint / Explanation / Confirm. Only three
are implemented in code — Transcript / Hint / Confirm. `Explanation` (a
re-explanation shown on a second miss, before a mandatory "say it back") was
removed 2026-09-18 along with the "Reveal" flow it exclusively served; not
built around, deliberately not reproduced now that it has nowhere to appear.

**Other properties.** `label` TEXT, `body` TEXT. One slot, `Actions` — meant to
hold the "That's not what I said" dispute control; left empty by default and
collapses when unused.

**What each state means.** Transcript and Confirm fill `background/stacking`;
only Hint takes a colour, `accent/blue/subtle`, because a coloured Transcript
would read as an early verdict during the judging wait (see the Don't).
Confirm additionally swaps to a heavier label style (`Headline XXS Bold` on
`text/primary`) and a lighter body (`Caption M Regular` on `text/secondary`)
than the others, since it's a decision prompt rather than a read-back.
Padding, gap and radius are normalised to `Space/300` / `Space/200` /
`Radius/400` — the real `dispute confirm` reference instances in the file use
a heavier `Space/400`/`Space/300` box; this was normalised deliberately
rather than carried forward, per the plan's own instruction. Worth a second
look if the heavier Confirm box was actually meant to stay.

**When to reach for it.**

> Anything inside the recall card that needs a label over a body.

**Don't.**

> Don't give Transcript a colour. The block that shows a student their own
> words has to stay on `background/stacking`, because the moment it takes a
> feedback tint it reads as the verdict and the wait starts feeling like
> judgement before the judging has happened. That is the whole reason the
> transcript is on screen during the wait.

### `verdictBadge`

**States and options.** Five variants exist in the real Figma component set,
on one axis, `variant`: Success / Almost / Miss / SaidBack / Flagged. Only
four are implemented in code — `SaidBack` was removed 2026-09-18 along with
the "Say it back" screen it exclusively served, once that screen's only
trigger (the "Reveal" flow) was confirmed gone for good; deliberately not
reproduced now that it has nowhere to appear.

**Other properties.** `label` TEXT, one shared property across all variants,
defaulting to each variant's real copy (see table). No exposed icon swap —
the glyph is baked into each variant at build time and cannot be changed
independently, which is deliberate: this system's rule that colour is never
the only carrier of meaning means word, glyph and colour have to move
together, and an overridable glyph would let someone break that pairing.

**What each state means.**

| variant | fill | glyph | label |
|---|---|---|---|
| Success | `feedback/success/subtle` | check-circle | "Got it" |
| Almost | `accent/blue/subtle` | info-circle | "Almost" |
| Miss | `accent/coral/subtle` | alert-circle | "Not yet" |
| Flagged | `background/stacking` | info-circle | "Flagged for review" |

**When to reach for it.**

> Once per term, at the top of the card's content, the moment a verdict lands.

**Don't.**

> Don't move Miss onto `feedback/error`. It sits on `accent/coral` deliberately:
> the student has not failed, they have not got there yet, and error red says
> the opposite. Same reason Flagged is neutral rather than a warning.

There is no `Skipped` variant yet, though the summary screen counts skipped
terms — flagged as a gap, not built around.

### `termPip`

**States and options.** Three variants on one axis, `state`: Done / Current /
Upcoming. A single filled frame with no children — do not add one.

**Other properties.** None. No properties, no slots. Width is deliberately not
tokenised: the master's own resting width is a literal, unbound 24px, purely
so a standalone component has some size to exist at — every real instance sets
`layoutSizingHorizontal: FILL` inside a row instead. The row itself
(`Term Pips`) is documented as a plain auto-layout pattern, not a component: a
HORIZONTAL frame, gap bound to `Space/150`, children set to FILL. That trade
was made on purpose — no component can offer "3 to 10 pips" as a properties-
panel setting this way, but a `termPips` variant set would have needed 88
variants for a 6px bar.

**What each state means.** `Done` fills `accent/magenta/bold`, `Current` fills
`text/primary`, `Upcoming` fills `background/stacking`. There's an open,
unresolved question about the magenta: it's also the colour behind the
`recordControl` amplitude bars, while `progressIndicator` uses
`accent/brand/bold` for essentially the same "progress" idea. Worth deciding
whether magenta is deliberately this feature's progress colour or drift.

**When to reach for it.**

> Any n-of-m progress in this feature, where `progressIndicator` cannot go
> because it steps in quarters.

**Don't.**

> Don't use it for a percentage. `progressIndicator` owns continuous progress;
> this owns countable steps. If both end up representing the same thing, the
> student sees two progress languages in one product.

No `Skipped` or `Flagged` state exists yet, so a skipped or flagged term
currently reads as `Done` on the pip row — a gap, not a decision.

### `recordControl`

**States and options.** Three of the plan's four states are built:
`state=Idle`, `state=Recording`, and `state=Paused`. `Submitting` and
`Disabled` were never drawn anywhere in the file (no real content to
build from) and were deliberately left out rather than invented — add
them to this same set once they're designed. **`Paused` added
2026-09-16, on direct request, overriding this project's earlier "no
pause/resume" decision** — added live to the real component set (node
`13734:32389`), not just built in code, since no Figma reference existed
either: cloned from `Recording`, with a third `Pause`/`Resume` control
between Discard and Submit (no real icon asset for either in this file's
library — reuses `Discard`'s real button shape with a different label,
same resolution as the correction control's own missing pencil icon) and
the amplitude bars dimmed (opacity `0.4`, no governing token in
`tokens/tokens.json` — a hand-typed value, flagged in
`docs/component-gaps.md` rather than inventing a token for one use).

**Other properties.** `caption` TEXT (defaults "Tap to answer" /
"Listening" / "Paused"). One slot, `Escape` — holds the tertiary "I can't
speak right now" button by default in Idle, and is meant to collapse in
Recording/Paused. All three variants share a fixed height (215) so
switching state doesn't reflow the screen around it.

**What each state means.** Idle shows a 56px primary mic button
(`buttonIcon`, `Primary`/`L`) plus the caption and the Escape slot.
Recording replaces the mic with an amplitude meter (11 bars — each bar's
literal height is Figma's own snapshot of one real waveform, used as its
resting/max height, not a meaningful exact value on its own) and a
Discard/Pause/Submit action row, and widens the outer spacing from
`Space/300` to `Space/400`. **Updated 2026-09-17, on direct request:**
Recording's meter now animates live — a simulated per-bar wave, code-only
since Figma frames can't represent motion (there's no live audio signal
in this app to actually react to; see the "recall is mocked" hard rule).
Paused is the same layout with `Resume` in place of `Pause` and the
amplitude bars dimmed to read as frozen (both faded and static — distinct
from the new `amplitudeFrozen` prop, which freezes without fading, used
by Loop's Transcribing beat).

**When to reach for it.** The description below still names four states; only
two exist today. Treat "Submitting" and "disabled" in the text as intent, not
as something you can select yet.

> The answer control at the bottom of the loop. One component across four
> states: a 56px mic at rest, an amplitude meter with discard and submit while
> recording, a submitting state, and disabled.
>
> The only voice input in the product. Not for the chat composer's mic, which
> is a `buttonIcon` inside the composer field.

**Don't.**

> Don't grow the mic past `Control/700`. 56px is the top of the control scale,
> and going bigger is a new size token rather than a resized instance. If the
> record button has to be bigger than every other control in the product, that
> is a token decision to take deliberately.

### `field`

**States and options.** Three of the plan's four states are built: `state=Empty`
/ `Filled` / `Focused`. `Disabled` has neither a real reference instance nor a
binding instruction and was not built, same policy as `recordControl`.

**Other properties.** `value` TEXT (defaults "Ask Knowie..." for Empty/Focused,
"Type your answer" for Filled). One slot, `Trailing`.

**What each state means.** Empty and Focused both show placeholder-style copy
on `text/secondary`; Filled shows real content on `text/primary`. Focused adds
a 1px `border/focus` stroke; nothing else changes.

**A real inconsistency, not resolved.** Every real single-line field uses
`Radius/Full`; the one real multiline field in the file uses `Radius/600`
instead, and visibly looks different because of it. `field`'s only axis is
`state`, not line count, and the plan's own binding table only specifies
`Radius/Full`. Built to that literal instruction. If a multiline `field` gets
designed properly, this needs a real decision, not a guess.

**When to reach for it / Don't.** `field` shares its description with
`composer` below — see there. There is no separate written description for
`field` alone.

### `composer`

**States and options.** Two variants on one axis, `variant`: Chat / Answer.

**Other properties.** Two slots, `Leading` and `Trailing`. `field` is
instantiated directly inside `composer` (not a slot) — it's a real
component-inside-a-component relationship. Chat's `Leading` holds a `plus`
`buttonIcon`; Chat's own field carries camera and mic icons in its own
`Trailing` (the camera glyph doesn't exist in the icon library yet — a
pre-existing gap, not something this build introduced). Answer's `Trailing`
holds a `send`/`arrow-right` `buttonIcon`.

**What each state means.** Chat is the Home composer: plus, a field, camera
and mic. Answer is the loop's text-mode input: a field, then send.

**When to reach for it.**

> The input row. `Chat` is plus, field with camera and mic, on Home. `Answer`
> is field with send, inside the loop's text mode. The field itself is its own
> component and carries the four input states.
>
> Anywhere the student types.

**Don't.**

> Don't stack a chip row, a composer and a nav bar in the same `bottomContent`.
> The scaffold's documented rule is that `bottomContent` holds one of the CTA,
> the nav or the chat input. Home already breaks it; do not build the break
> into the component.

### `topBar`

**States and options.** Three variants on one axis, `variant`: Loop / Title /
Centered.

**Other properties.** `title` TEXT, `subtitle` TEXT, `showSubtitle` BOOLEAN —
exposed only on `Title` and `Centered`. `Loop` does not expose them at all: no
real `loop top bar` instance, ever, shows a title, so they were deliberately
scoped off that variant rather than left present but unused. Three slots:
`Leading`, `Progress` (Loop only, holds the term pip row, collapses on the
first screen of a session), `Trailing`.

**What each state means.** `Loop` is space-between with a filling centre
(close, progress, skip). `Title` has a leading action, a filling title/subtitle
column, and a 48px spacer so the title stays optically centred. `Centered` is
a centred title alone, no actions, and a shorter 40px height than the other
two (72px).

**A structural note, not a token gap.** Width is a hardcoded, unbound 390 on
all three variants — there's no screen-width token in the file to bind to.
This was flagged and you said to hardcode it; it's the one dimension of
everything built this session most worth revisiting if a mobile screen-width
token gets added later, since Loop and Title's centre-filling layout only
works because the bar has a real fixed width to stretch the middle against.

**When to reach for it.**

> Every screen at 390 in this feature.

**Don't.**

> Don't reach for the library's `appBar` instead. It is a 1200 wide desktop
> scrim built on `App Bar Button` components, with no instances anywhere in
> the file. Using it here means resizing and re-slotting every single
> instance.

### `sessionHero`

**States and options.** Four variants on two axes: `align` (Left / Center) ×
`surface` (None / Card).

**Other properties.** Text properties for `eyebrow`, `headline`, `body`,
`footnote`. Two slots: `Mascot` and `Trailing` (the latter holds the xpPill
pattern on the summary-head shape).

**What each state means.** `Left`/`surface=Card` is the "proposal" shape and
is the one variant using `Greed/Headline XL`; the other three use
`Greed/Headline L`. `Center`/`surface=None` was built to match the "entry"
pattern's tighter spacing (`Space/300` gap, `Space/400` top/bottom padding)
rather than the "intro" pattern's looser spacing (`Space/400` gap, `Space/600`
padding) — both patterns map to this same variant coordinate in the file and
disagree with each other; entry was chosen because more real instances follow
it and because you'd already stated a preference for `Headline L` as the
default elsewhere. Worth revisiting deliberately if intro's wider spacing is
actually the one you want live. The Eyebrow on the Card/proposal shape was
built as plain text with no icon, even though the real reference instance has
one — that icon is an ungoverned glyph already flagged elsewhere in the
project as not a real token or component, so it wasn't pulled in.

**When to reach for it.**

> Session entry, the first-run intro, the sheet's proposal, the summary head,
> the all-clear state.

**Don't.**

> Don't use it for a card the student answers into. This block only ever
> states something. The moment it needs an input it is a `recallCard`.

### `xpPill`

**States and options.** Two variants on one axis, `size`: S / M.

**Other properties.** `label` TEXT.

**What each state means.** `S` is the in-card pill beside a verdict
(`Caption M Bold`). `M` is the summary-head pill (`Headline XXS Bold`, larger
padding).

**When to reach for it.**

> Only where points were awarded.

**Don't.**

> Don't use it for the zero cases. Flagged and skipped terms currently say
> "No points" as plain text, and a brand-tinted pill there would read as an
> award.

There's no "no points" pill yet — an open decision, not built.

### `chipMarker`

**States and options.** Two variants on one axis, `variant`: Dot / Label.

**Other properties.** `label` TEXT, defaulting to "NEW". The absence of the
marker (a chip with no marker at all) is handled by simply not placing an
instance, not by a third variant.

**What each state means.** `Dot` is a bare 8×8 filled circle — the recurring
"ready" signal. `Label` is a text pill reading "NEW" by default — meant to
appear once, ever, per chip. Note: the one real Label instance in the file uses
`Greed/Caption S Regular`, not the `Bold` the plan's prose specified — built to
match the real instance, since only one real reference exists this is worth
double-checking if you actually intended Bold.

**When to reach for it.**

> Only on the Recall chip.

**Don't.**

> Don't show both. Precedence is NEW, then dot, then none, and no component
> can enforce that, so it is a rule the screen has to keep.

### `knowieMessage`

**States and options.** None — a single component, not a set.

**Other properties.** `message` TEXT. A nested `mascotSlot` instance (`size=XL`)
sits to the left, not a generic slot — it keeps the mascot component's own
lowercase name as its layer name, per house convention. One true slot,
`Actions`, which now defaults to a Primary/S "Start" button plus a
Tertiary/S "Not now" button (matching what every real instance actually places
there), rather than sitting empty.

**What it means.** N/A — no states.

**When to reach for it.**

> Home and Hub, where Knowie proposes a session, and the all-clear states.

**Don't.**

> Don't use it inside the loop. In the loop Knowie is the peek above the card
> and the card does the talking. A bubble there gives the student two places
> to read from at exactly the moment they are trying to speak.

### `sheet`

**States and options.** None — a single component, not a set.

**Other properties.** `title` TEXT, `body` TEXT, `footnote` TEXT,
`showFootnote` BOOLEAN. One slot, `Actions`, now defaulting to a Primary/L
"Yes, let me type" button above a Tertiary/M "Back to Recall Hub" button
(matching real content — relabeled 2026-09-19 from "No, back to home,"
which didn't match any real screen's actual `/hub` destination), rather
than sitting empty.

**What it means.** N/A — no states.

**When to reach for it.**

> A single question that interrupts the flow, like the text-mode offer.

**Don't.**

> Don't build the scrim into it. The scaffold owns the scrim through
> `showBottomSheetBackground`, and a sheet carrying its own gives you two.

### `buttonTimed`

**States and options.** Five variants on one axis, `progress`: 0 / 25 / 50 /
75 / 100 — the same five-step convention as `progressIndicator`. Built as its
own component, deliberately not as a new axis on `button` (which would have
meant 180 variants for one first-run screen).

**Other properties.** None exposed. The visible label ("Start") is hardcoded,
not a component property — a deliberate scope limit to stay inside what was
actually asked for this round, not an oversight. If it needs to be editable
per surface, that's a one-line follow-up, not yet done.

**What each state means.** The fill (`accent/brand/bold`) grows left to right
against a `background/surface` base as `progress` increases — this inverts the
usual Primary-button colour relationship on purpose, matching the one real
reference instance in the file. The fill width itself is not a token; it's
computed geometry (0, 90, 179, 269, 358px against the 358-wide frame), the same
category of value as `termPip`'s row width.

**When to reach for it / Don't.** No description has been written for this
component yet, here or in Figma. Nothing is filled in below in its place —
write one when you're ready, following the same "what it is / when to reach
for it / don't" shape as the rest of this file.

---

## Components built 16 September

Both built for the Home screen — the first screen in this codebase that
needed either of them.

### `navbar`

**States and options.** `tabs`, an array of `NavigationButtonProps`
(`icon`, `state`: Active/Inactive, `label`, `hasLabel`, `color` override).
`avatar`, a trailing slot. The real Figma component also carries `Scrim`,
`# of tabs`, and `Border` properties — only the confirmed 5-tab, no-scrim,
no-border real instance is built; other counts aren't confirmed.

**What each state means.** `Active` uses `interactive/primary` (mapped to
this codebase's `--color-interactive-primary-default`, the closest real
match — the Figma variable name itself has no exact token counterpart).
`Inactive` uses `text/secondary`. One real tab resolved to a Figma
variable (`palette/blue/tint`) with no match in this codebase's tokens at
all — exposed as a per-tab `color` override rather than baked in, since
it may be an authoring mistake rather than a deliberate signal (see
`docs/component-gaps.md`).

**When to reach for it.**

> The bottom-most element of a full app screen.

### `avatar`

**States and options.** `type` (Image/Initial) × `size` (Large/Medium/
Small) × `shape` (Circle — the only real shape, no Square variant exists
in the component set).

**What each state means.** `Image` takes real photo content via
`children` (no real asset exists in this codebase, same resolution as
every other image/glyph slot). `Initial` renders `initials` as plain
text. Per-size pixel dimensions aren't fully confirmed — the Desktop
Bridge connection dropped mid-session before each variant's own intrinsic
size could be checked; only `Large` (24px, in the Navbar) was confirmed
directly (see `docs/component-gaps.md`).

**When to reach for it.**

> `Navbar`'s trailing slot, for the signed-in student.

### `scaffoldHeader`

**States and options.** None — a single component, not a set, and not a
real Figma component at all: promoted 2026-09-17 from
`screens/Hub/ScaffoldHeader.tsx` once a second real screen
(`RecallHistory`) needed the identical shape, per `docs/component-gaps.md`'s
own promotion rule.

**Other properties.** `title` TEXT, `onBack` a click handler on the
leading back control (a real `buttonIcon`, Tertiary/M).

**What it means.** A back icon, absolutely positioned at the leading
edge, plus a title centered independent of it — not left-aligned next to
the icon. **Live-checked against Hub C's real `appBar` instance on
promotion:** its real back icon (`arrow-left`) sits in a real 48×48
button, exactly `ButtonIcon` Tertiary/M's own real size, and its real
title text is 15px SemiBold — both already exact matches for this
component's own type and icon before promotion, nothing corrected. The
one real, deliberate divergence: appBar's own real layout is
left-aligned (icon then text), not centered — this component
intentionally does not reproduce that, matching this file's own rule
above that a static (non-scrolling) screen gets a plain row instead of
`appBar`. Added live to Figma's "New components" page on promotion too,
reusing the real `arrow-left` icon cloned from Hub C's own appBar
instance rather than redrawing it — see that component's own
description for exactly what's reused vs. recomposed.

**When to reach for it.**

> A static (non-scrolling) screen's top navigation needing a back action
> plus a centered title — confirmed real usage: `RecallHub`,
> `RecallHistory`.

---

## Naming and structure conventions used building these components

These are the patterns actually applied on 11 September, confirmed against
what's really in the file (not just the plan), so anything reading this file
and building a new component follows the same ones.

**Component names** stay camelCase, no separators — `listRow`, `recallCard`,
`verdictBadge`, `buttonTimed`, matching the original ten.

**Axis names** stay lowercase (`state`, `size`, `surface`, `variant`, `align`,
`progress`, `crop`); **axis values** stay Capitalised words or bare numbers
(`Default`, `Loop`, `S`, `0`..`100`), also matching the original ten.

**Text properties** are lowercase camelCase throughout the new work — `title`,
`subtitle`, `caption`, `message`, `value`, `label`, `provenance`, `term`,
`body`, `footnote`, `eyebrow`, `headline` — with no exceptions this time.
**Boolean properties** stay `showX` — `showSubtitle`, `showFootnote`.

**Slot layer names are Title Case with spaces** — `Leading`, `Trailing`,
`Actions`, `Escape`, `Progress`, `Content`, `Mascot` — **not** the lowercase
camelCase the scaffold's own slots use (`topNavigation`, `middleContent`).
This is a real divergence from the rule recorded for the scaffold and the
original ten sets. It's what actually got built across all fifteen
components, so treat Title Case as the convention for a component-level slot,
and lowercase camelCase as specific to the scaffold's four named regions.

**Internal layer names** (anything that isn't a slot or a nested component
instance) are also Title Case with spaces — `Copy`, `Provenance`, `Prompt`,
`Control`, `Amplitude`, `Bar`, `Record Actions`, `Title Column`, `Spacer`,
`Bubble`, `Grabber`, `Fill Elapsed`.

**A nested instance of another named component keeps that component's own
lowercase name as its layer name.** `knowieMessage`'s mascot child is named
`mascotSlot`, not `Mascot`; `composer`'s field child is named `field`, not
`Field`. Slots are the exception — a slot is named for the region, not for
whatever's dropped into it.

**A component with no real axis in the file is built as a single component,
not a one-variant set.** `recallCard`, `knowieMessage`, `sheet` and `buttonTimed`
(well, `buttonTimed` does have an axis) all followed this — where the plan
gives no meaningful axis, don't force `combineAsVariants` for the sake of it.

**Component properties are added to the base component before
`combineAsVariants`, not after.** Doing it this way means the resulting set
carries them as one merged property rather than per-variant duplicates.

**Only build states with real content to check against.** Every undesigned
state this session (`recordControl`'s Submitting/Disabled, `field`'s Disabled)
was left out rather than invented, and flagged in its build note instead. Add
them once someone actually designs them.

**When a written plan and the real file disagree, build to the real file and
record the conflict.** This happened repeatedly — `verdictBadge`'s single
`iconSlot` versus the plan's "mirrors chips" prose, `chipMarker`'s Regular
label weight versus the plan's Bold, `topBar` scoping title/subtitle off the
Loop variant, `sessionHero`'s entry-versus-intro spacing pick. None of these
were silently decided; all are written down above and in the individual build
notes under `claude/*-build-state.md`.

**A dimension with no governing token is hardcoded as a literal and flagged,
not invented as a new token.** `topBar` and `recordControl`'s 390/358 widths,
`termPip`'s 24px resting width, `sheet`'s 390 width — none of these have a
`tokens/tokens.json` entry, and none should be treated as one.

**Two things to check on any component built through this same Desktop Bridge
tooling, both of which caused real, reported bugs today:**

1. Clear an empty slot's fill and resize it away from Figma's 100×100 default.
   `slotSettings` (`displayEmptyByDefault`, `allowPreferredValuesOnly`,
   `maxChildren`) cannot be set from this tooling — every attempt throws
   `object is not extensible` — so every slot in every component this session
   runs on Figma's raw defaults instead of the tuned, appBar-matching settings
   the plan calls for. Left unaddressed, an empty slot paints a visible white
   100×100 box. This was the direct cause of `knowieMessage`'s missing
   buttons and `sheet`'s stray white square.
2. Make sure the frame or page a component sits on is actually bound to
   `background/page`, not left at Figma's default light canvas colour. Every
   token in this system assumes a dark ground — `background/stacking` and
   `interactive/pressed` are both a 10% white overlay, and `text/primary` is
   near-white — so a component that is correctly built and correctly bound
   can still render as invisible or illegible if the surface under it is
   wrong. This was the cause behind every other "component looks broken"
   report on 11 September, not a binding defect.

**Three narrower runtime gotchas worth keeping in mind for future scripted
builds:** swapping an icon inside an `iconSlot` instance needs the target
component's raw id, not its key, or the swap fails without visibly erroring;
a paint built on a placeholder colour and then bound to a variable keeps
rendering the placeholder; a paint's colour should be resolved through its
full alias chain before the bind call, not after. And a multi-side stroke
(as on `field`'s Focused state) needs each side's weight set individually —
`strokeWeight` alone silently does not bind.

---

## Naming

**Components** are camelCase, no spaces: `appBar`, `buttonIcon`,
`progressIndicator`, `scaffold`. Private base components carry a leading dot
(`.mascotSlotBase`) and are never instantiated directly.

**Properties** are camelCase and describe the thing, not its appearance:
`variant`, `size`, `state`, `color`, `active`, `progress`, `thickness`.
Booleans are `show` plus the thing shown: `showLeftIcon`, `showCaption`,
`showTopNavSlot`. Existing exceptions (`Slot`, `Instance`, `Text`, `CTA`,
`title`, `caption`) predate this rule and should not be copied into new work.

**Variant values** are Title case (`Primary`, `Default`, `Pressed`, `S`, `M`,
`L`, `2XL`), or a bare number where the axis is numeric (`16`, `25`, `200`).
`chips` has one lowercase value, `pro`, which is a defect, not a pattern.

**Slots** are camelCase and name the region, not what happens to be in them
today: `topNavigation`, `middleContent`, `bottomContent`. See "Naming and
structure conventions used building these components" above for how this
differs from the slots built on 11 September, which are Title Case at the
component level.

**Tokens.** Primitives are named for what they are (`color/navy/950`,
`Space/400`). Semantic tokens are named for the job (`background/surface`,
`interactive/primary/hover`, `accent/pro/subtle`), in the shape
`group / subject / modifier`, where the modifier is a state (`hover`, `active`,
`pressed`) or a pairing (`on`, `onBold`, `onSubtle`). A token whose name reads
`on<Something>` is the content colour for that fill and is never used as a fill
itself.

Two live inconsistencies to be aware of, not to imitate: colour and typography
tokens are lowercase while the Size collection is Title case, and the numeric
step scales run on two different rhythms, so the same step number is not the
same pixel value across families. Look the value up in `tokens/tokens.json`; never
infer it from the number in the name.

**Text styles** are `Greed / Role Size Weight`, for example `Greed/Body M Regular`.
Role, size and weight are all part of the name, so `Body M Bold` and
`Headline XS Bold` are different styles even where they share a font size.

---

## Never do this

1. **Never invent a value that is not in `tokens/tokens.json`.** If the thing you need
   has no token, stop and say the token is missing. A hand-typed number is a
   silent fork of the system.

2. **Never write a CSS fallback value**, as in `var(--token, #333)`. A token
   that resolves to nothing is a bug in the token pipeline. The fallback hides
   it, ships the wrong colour, and moves the failure to a screenshot review
   weeks later. Let it break loudly.

3. **Sentence case on every label, button and heading.** Capitals only for
   proper nouns. "Start recall", not "Start Recall". "Ask Knowie", because
   Knowie is a name.

4. **Never put an appearance word in a semantic name.** `blue`, `coral`,
   `dark2`, `lightGrey` and their kind belong in the primitive layer only. A
   semantic token is named for the job it does, so that the colour can change
   without the name lying.

5. **Never read a primitive directly.** Components consume the semantic layer;
   the semantic layer references the primitives. A component bound to
   `color/violet/500` cannot be re-themed and does not show up when you audit
   what uses the brand colour.

6. **Never detach an instance.** Detaching removes it from every future fix. If
   the component cannot do what the screen needs, that is a gap to record.

7. **Never hand-resize a component wrapper** to reach a size between two steps.
   iconSlot in particular has six fixed steps and no in-between.

8. **Never build a screen outside the scaffold**, and never put content
   outside the four slots.

9. **Never mix a documented component set with its library twin on one screen.**
   The twins fork on variant axes (iconSlot's size axis is named differently in
   each), so a swap between them silently drops settings.

10. **Never use colour alone to carry meaning.** Success, error and info states
    need an icon or a word as well, and several pairs in this system are
    already visually identical at rest: an inactive `pro` chip and an inactive
    `Primary` chip, a disabled primary button and an enabled secondary one.

11. **Never rely on hover.** Mobile only this sprint. Anything that exists only
    on hover does not exist.

12. **Never add a token to make one component work.** A one-off layout width is
    not a scale step, and a family of arbitrary numbers is pollution. Leave it
    raw, flag it, and take the decision to standardise separately.

13. **Never leave a component's page or frame off `background/page`.** This
    system has one colour mode and every semantic token assumes a dark
    ground. A component built and bound correctly can still render invisible
    or illegible sitting on Figma's default light canvas — verify what's
    behind it, not just what's on it.

14. **Never leave an empty slot at Figma's default fill and footprint.** Clear
    the fill and resize it to match its real collapsed content. `slotSettings`
    is not reliably settable through every tool this project has used to
    build components, so this has to be done by hand, every time, or an
    unused slot paints a visible white box.

15. **Never trust that a screenshot composited onto a plain export background
    tells you whether a component is legible.** Exporting a component as an
    isolated node composites it onto white regardless of what it's designed to
    sit on, which can hide exactly the kind of invisible-on-dark bug this
    system is prone to. Check it in place, on `background/page`.
