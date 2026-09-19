# SPEC.md

Build spec for the voice active-recall prototype. Written from `sprint-context.md`,
`design-brief.md`, `voice-ux-reference.md`, the Figma screens under "COMMITED FLOW
FINAL USING COMPONENTS" (Final flow page), and the interview that closed the
remaining gaps. Where this spec and an earlier doc disagree, this spec is the
current answer — the earlier doc still holds the reasoning.

The same "Final flow" page also has a parallel "COMMITED FLOW FINAL WITHOUT
COMPONENTS" frame (node `13759:45169`) — the same 17 screens, built from raw
layers rather than the componentized library. Any correction below citing
that frame by node ID was checked live (Desktop Bridge, not the REST API)
against real button instances — variant, size, and label — not prose or a
screenshot; treat those as at least as authoritative as the USING-COMPONENTS
frame, and re-check both if they're ever found to disagree.

Component names below are real, from `docs-list` via the Storybook MCP tools —
not descriptions. File paths are real, under `components/`.

---

## What we're building

A student speaks a term out loud, Knowie judges it and answers in text only,
across a five-term loop with generous miss recovery and a scored, honest
summary — reachable from two doors (Home chip, plan step) that share one
completion record.

---

## Screen list, build order (easiest first)

1. **Cannot-speak sheet** — one component, one question, no branching logic.
2. **Summary** — mostly presentational; no recording or scripting to wire.
3. **Hub** — the real 7-row queue/picker, confirmed live 2026-09-16 (see
   § 3) — not the single-proposal confirm card this list described for
   most of this project's history.
3b. **Recall history** — reached only from Hub; restored 2026-09-16 after
   being wrongly deleted as believed out-of-scope (see § 3b).
4. **Loop** — everything else. One screen, most of the states, all the mock
   wiring, all the timing decisions.
5. **Home** — added 2026-09-16, on explicit request (not part of the
   original 4-screen list). The real entry point into Recall; see § 5.

---

## 1. Cannot-speak sheet

**File:** `components/Sheet/Sheet.tsx` · Storybook: `Sheet` → `Default`
("Can't speak right now?")

**States.** One. Not sticky-vs-not, not denied-vs-voluntary — the interview
settled that permission denial routes into this exact same sheet with the
same copy. **Updated 2026-09-19:** Hub's own "I can't speak right now"
door was removed once single-tap-start made it Hub's second/redundant CTA
— down to two doors into this one sheet now (Loop's escape control, an OS
permission denial), both still real and independently reachable.

**What the student can do.** Tap **"Yes, let me type"** (`Button`,
Primary/L, per `Sheet`'s real default Actions) → enters Loop in text mode,
sticky for the rest of the session, verdict logic unchanged. Tap **"Back to
Recall Hub"** (`Button`, Tertiary/M — relabeled 2026-09-19 from "No, back to
home," which didn't match its real `/hub` destination) → returns to Hub,
keeps any set already built (per `sprint-context.md`).

---

## 2. Summary

**Rewritten 2026-09-16, confirmed live** against `Summary 2 — All clear`
(node `13759:45704`) and `Summary 3 — Continued a learning goal` (node
`13759:45754`) via the Desktop Bridge — real `componentProperties` and
bound color variables, not prose or a screenshot. **Supersedes this
section's older content**: there is no fixed 5-bucket `listRow` list (a
prior build session's mistake, since reverted) and no "Try again" button
on either real instance (also a prior mistaken assumption, repeated
below in the old "Flagged" note this replaces).

`sessionHero`(align=Left, surface=None, **trailing = `xpPill`**) — real,
confirmed: `Left, None` story already has a `trailing` slot built for
exactly this. **Reversed 2026-09-18, on direct request, superseding this
line's own earlier "one row per resolved outcome (3–5, never a fixed 5)"
rule:** rows are grouped by outcome instead of by term — at most 4 rows
(one per outcome that actually occurred this session: unaided/hint/
flagged/skipped), each a bespoke `bucket / NEW` frame (not a real
`listRow` instance — see `docs/component-gaps.md`) with a leading status
`iconSlot`, an outcome title, a bare count subtitle ("2 terms," never a
term name), and that bucket's summed XP as the trailing number. Both real
Figma instances (`Summary 2`/`Summary 3`) still show one row per term —
a deliberate departure, pushed back into `COMMITED FLOW FINAL WITHOUT
COMPONENTS` too, same category as the button-order override below, not
left unreconciled. `mascotSlot`(XL, crop=Full) for the all-clear block.
`topBar`(Centered, "Results") — missing from every earlier build of this
screen.

**Files:** `components/SessionHero/SessionHero.tsx`,
`components/XpPill/XpPill.tsx`, `components/TopBar/TopBar.tsx`,
`components/MascotSlot/MascotSlot.tsx`, `components/Button/Button.tsx`,
`components/ButtonGroup/ButtonGroup.tsx`, `screens/Summary/Summary.tsx`'s
own inline `ResultRow`.

**Row icon/color, confirmed by resolving each real bound Figma
variable:** "Said it unaided" uses a check-circle icon on
`feedback/success/bold`; "Said it after a hint" uses a plain check on
`accent/blue/bold`; "Flagged for review" and "Skipped" both use
`text/secondary` (info-circle / skip-forward respectively). **Resolved
2026-09-18** (closing Open item #10, below): a hint-less retry scores and
reads identically to a hinted pass — "Said it after a retry" was never a
real fifth tier, just this same "Said it after a hint" bucket.

**States.**
- **Regular summary** — `SessionHero` headline + total-XP pill, one row
  per outcome that occurred (grouped, not per term — see above),
  `ButtonGroup` (Vertical, **L**) with "Back to
  Recall" (Primary) and "Keep going, N terms left" (Secondary).
  **Updated 2026-09-17, on direct request, overriding the real committed
  Figma frame** (`Summary 3`, node `13759:45754`, which has these the
  other way around — "Keep going" Primary, "Back to Recall" Secondary):
  a deliberate departure, pushed back into
  `COMMITED FLOW FINAL WITHOUT COMPONENTS` too, not a drift left
  unreconciled.
- **All-clear** — same shape, `MascotSlot` XL carries the one pose change
  in the whole flow (standby → approving; no visible transition on
  arrival, per the interview). Bottom action is **one** `Button`
  (Primary/L, "Back to Recall") — no `ButtonGroup`, no secondary at all;
  the real instance has exactly one button. **Updated 2026-09-17, on
  direct request:** the closing body line is no longer one fixed
  sentence — it now reacts to whether the session's own results contain
  any "Flagged for review" or "Skipped" rows (plain all-clear if neither;
  otherwise names the count of each), and the line "The dot on Recall is
  off until you study something new" was dropped outright, in every
  branch.

**What the student can do.** All-clear: tap **Back to Recall** →
returns Home/Hub, chip returns to plain (the all-clear state is what
turns the ready dot off). Partial: tap **Keep going, N terms left** →
`/loop`; tap **Back to Recall** → Home/Hub, keeping progress.
**Flagged 2026-09-17 (see Open #12):** "resumes Loop" undersells what
actually happens — no topic or partial-progress carries through, so this
always starts a fresh, full Research Methods session regardless of what
was actually in progress.

---

## 3. Hub

**Confirmed live** against `Hub C — The queue` (node `13759:45277`,
"Final flow" page), Desktop Bridge, 2026-09-16 — the real screen, not the
inferred single-proposal confirm card this section described for most of
this project's history. That inferred version was built once (superseding
this section briefly), on the reasoning that `sprint-context.md`'s "not a
picker" decision should override this frame — reverted at the user's
direct correction: the real Hub C screen is this 7-row list, it's what the
user expects, and `sprint-context.md`'s decision was the stale one (now
updated). Same "written decision vs. live Figma" pattern already found
and corrected this session for Loop's CTAs and Summary's rows.

**None of the 7 real rows are `ListRow` instances** — Figma's own layer
names are the bespoke `row / NEW` family (the same pattern as Summary's
result rows and Recall history's term rows), each with its own leading
icon/emoji and a trailing element that varies per row: a `chips` badge, a
real `button`, or a bare chevron. Built as one local `HubRow` component
with a flexible `trailing` slot — see `docs/component-gaps.md`.

**The 7 real rows, top to bottom:** Research Methods (leading: a brain
glyph, `chip / Recall / NEW (brain glyph pending library)` — no real
asset even in Figma's own source; trailing: `chips` "Up next", active) ·
Cell biology (🧬 emoji; trailing `chips` "1 of 6") · Legal studies (⚖️
emoji; trailing `chips` "0 of 4") · Terms you missed (🔁 emoji; trailing
`chips` "3 terms" — **made selectable 2026-09-16, on direct request**;
the real frame shows it informational-only, no chevron, but it's now a
4th real topic in the picker, same as the other three — see States,
below) · Statistics, section
3 (`graduation-hat-01` icon; **title greyed** — the real instance binds
this row's title alone to `text/disabled`, confirmed live by resolving
the bound variable directly (subtitle and the button stay at their normal
colors); a straight code bug, fixed 2026-09-16, no Figma change needed —
the real file already had this right; trailing a real `button` "Read the
lesson," Tertiary/S — present, no real destination in this sprint's
scope) · Start
a new Recall (`plus` icon; trailing chevron — present, no real
destination) · Everything you've said (`list` icon; trailing chevron) →
`/recall-history`, whose own real content ("47 terms across 5 topics") is
exactly Recall history's screen (§ below) — the two are directly
connected in the real file.

**Files:** `screens/Hub/RecallHub.tsx` (including its local `HubRow`),
`components/Chips/Chips.tsx`, `components/Button/Button.tsx`,
`components/ButtonGroup/ButtonGroup.tsx` (Vertical, **L**).

**States.** The four topic rows (Research Methods/Cell biology/Legal
studies/Terms you missed) are a real picker — tapping one moves the "Up
next" badge onto it and updates the bottom primary CTA's label/
destination. This exact toggle mechanic isn't provable from one static
Figma frame (only Research Methods' selected state is captured there)
but matches this screen's first-ever implementation in this codebase,
built with deeper access to the source file.

**What the student can do.** Tap a topic row → becomes the primary CTA's
target. Tap the primary CTA (`Start {topic}`) → enters Loop at
`/loop?topic=<slug>` — **wired for real 2026-09-16**; each of the 4
topics now has its own real 5-term script in `screens/Loop/script.ts`
(`app/loop/page.tsx` reads the `topic` param and passes it through,
defaulting to `research-methods` for any direct `/loop` link with none).
Previously Hub's selection didn't drive Loop's content at all — every
topic played the same fixed Research Methods script regardless of what
was tapped. Tap **"I can't speak right now"** → opens the Cannot-speak
sheet (§1). Tap "Everything you've said" → Recall history, whose own
"Say the N that are due" button now also routes to
`/loop?topic=terms-you-missed`, matching its real content. "Read the
lesson" and "Start a new Recall" are present but inert (no lesson or
upload flow in this sprint's scope).

**A deliberate choice, not an unresolved contradiction:** Hub C's real
screen instance genuinely does use a component named `appBar`
(`variant="leftIconButtonOnly"`) — `design-system.md`'s old claim of
"zero real instances" was itself wrong, corrected 2026-09-16/17.
Reproduced instead as the plain back-icon-plus-title row
`design-system.md` prescribes for static screens — `scaffoldHeader`,
promoted 2026-09-17 to `components/ScaffoldHeader/ScaffoldHeader.tsx`
(shared with Recall history) and added live to Figma too — matching that
documented rule rather than the real `appBar` instance's own left-aligned
layout.

---

## 3b. Recall history

Confirmed live against `Extra 6 — Your terms` (node `13759:45818`,
"Final flow" page). Reached only from Hub's "Everything you've said" row
(§ 3) — restored 2026-09-16 after being deleted in an earlier pass as
believed out-of-scope; that deletion broke Hub's own real content, since
the row pointing here (`"47 terms across 5 topics"`) is real, confirmed
Figma content, not an inference.

**Re-checked live 2026-09-16** (copy + type sizes, on direct request),
precisely this time — two corrections to the account below:

**Confirmed components:** a plain `<h3>` (real 21px Bold,
`--font-size-lg` — no real `TextBlock` variant hits this; checked all 4:
XL 76px, L 44px, M 18px SemiBold, S 15px SemiBold, see
`docs/component-gaps.md`) + `Chips` (count badges) for the 3 section
headers ("Skipped," "Said recently," "Never said out loud" — the first
section's real rendered text is "Skipped," not "Due again"; that's a
stale Figma *layer* name, not real content). **All three sections use
the same bespoke row** (a real `iconSlot` glyph + term + source line —
Figma's own layer name is the `bucket / NEW` un-componentized frame
family used elsewhere this session), not `ListRow` for the first two —
differentiated only by icon/color: "Skipped" → `Loader2` /
`accent/coral/bold`; "Said recently" → `CheckCircle2` /
`feedback/success/bold`; "Never said out loud" → `Mic` / `text/secondary`.
Row titles and subtitles are both real 12px (`--font-size-xs`),
differentiated by weight/color only, not size. `ButtonGroup` (Vertical,
M) with "Say the N that are due" (Primary) and "I can't speak right now"
(Secondary).

**What the student can do.** Tap **"Say the N that are due"** → Loop. Tap
**"I can't speak right now"** → Cannot-speak sheet (§1). Back → Hub.

---

## 4. Loop

One screen, one `RecallCard` (`components/RecallCard/RecallCard.tsx`)
instance per term, absorbing every state below (`sprint-context.md`: "the
loop absorbs every verdict, branch and text-mode variant on one screen").

### Session entry
**Not directly confirmed in Figma** as its own visual treatment — none of
the 17 audited screens is a distinct "session entry" state. Per the
interview, this is the *same state* as the richer first-ever intro
(`design-brief.md`'s F5), simplifying to "Today: N terms" every time after
the first. **Built and confirmed as `TextBlock`**
(`components/TextBlock/TextBlock.tsx`, `variant="L"`, `showCaption`) —
`screens/Loop/Loop.tsx`'s `!hasStarted` branch, title
`"Today: {terms.length} terms from {TOPIC_LABELS[topicSlug]}"`, caption
"About 3 minutes. Tap to start." No governing Figma frame still exists for
this state (there's nothing to confirm the component choice against), but
the component itself is decided and shipped, not a placeholder — resolves
the "not yet chosen" framing this line used to carry.

**What the student can do.** Nothing but proceed — no interaction, just
context before Idle.

### Idle
**Confirmed:** `RecordControl` (`Idle` story), `RecallCard`, `MascotSlot`
(2XL, crop=Full).

**What the student can do.** Tap the mic (`RecordControl`'s own control) →
Recording. Tap **"I can't speak right now"** (`RecordControl`'s real
`escape` slot, filled with a Tertiary/M `Button` per its own default
instance) → Cannot-speak sheet. Tap **Skip** — see below.

**First-ever tap only:** triggers the native OS mic permission dialog (not
the intro card, per the interview). On Allow, recording **auto-starts
immediately** — no second tap. On Deny, or on a later tap where permission
was already revoked (pre-checked, no failed-attempt beat) → Cannot-speak
sheet, identical copy either way.

### Recording
**Confirmed:** `RecordControl` (`Recording` story) — real Discard and
Submit actions, real amplitude bars. **Updated 2026-09-16, on direct
request, overriding the locked "no pause/resume" decision:** a third
control, Pause, sits between Discard and Submit — no real icon asset
exists for it in Figma (same gap category as the pencil on the
correction control), so it reuses Discard's real button shape with a
different label, both in code and in the live Figma variant. **Updated
2026-09-17, on direct request:** the amplitude bars now animate live
(a simulated per-bar wave, not a static snapshot) — code-only, since
Figma frames can't represent motion; see `docs/component-gaps.md`.

**What the student can do.** Tap **Discard** → rerolls to an alternate
scripted outcome for this term (see §5) and returns to Idle — no verdict
recorded (`sprint-context.md`: discard is a transition inside Idle, not a
state). Tap **Submit** (or the stop control) → Transcribing. Tap
**Pause** → Paused (below). **Skip is disabled** here (interview) — it
re-arms once the term reaches a pause point.

### Paused — new 2026-09-16, on direct request
**Confirmed:** `RecordControl` (`Paused` story) — added live to the real
Figma component set too (node `13734:32389`, alongside `Idle`/
`Recording`), not just built in code. Same layout as Recording, with
**Resume** replacing Pause (same no-real-icon resolution) and the
amplitude bars dimmed to read as frozen (opacity `0.4`, no governing
token — flagged in `docs/component-gaps.md`).

**What the student can do.** Tap **Resume** → back to Recording. Discard
and Submit stay available and unchanged.

### Transcribing — new state, not yet built
**Not in Storybook or Figma.** Per the interview: a third `RecordControl`
state alongside `Idle`/`Recording`, to be **added to the real Figma
component first**, then built here to match — same discipline as every
other component this session (never invent past what's designed).

**Spec for the addition:** amplitude bars stay visible but freeze (stop
animating); caption text changes; **Discard and Submit both disable** —
the take is locked the instant recording stops. Skip stays disabled
(re-arms only once Wait resolves).

**Bars-freeze half confirmed built, 2026-09-17:** this line was
unimplementable until Recording's meter actually animated (see above) —
now that it does, `screens/Loop/Loop.tsx`'s Transcribing beat passes
`RecordControl`'s new `amplitudeFrozen` prop, so the bars genuinely stay
visible-but-static rather than being static only by coincidence. The
rest of this state (a real Figma addition, Discard/Submit disabling)
remains unbuilt.

**What the student can do.** Nothing — this is a brief, non-interactive
beat.

### Wait (transcript carried)
**Confirmed:** `RecallCard`, `RecallBlock` (`Transcript` story), `MascotSlot`
(2XL). No separate loading/skeleton instance — this state itself *is* the
resolved transcript (`sprint-context.md`: "renders the resolved transcript
... not a typing indicator").

**What the student can do.** Read the transcript. Otherwise the judge
resolves and the screen moves to a Verdict state automatically
(§ Verdicts) — no tap required to leave Wait.

**Removed entirely 2026-09-19, on direct request** (superseding the two
updates below, kept for history): this state used to also offer a
**"that's not what I said"** correction control (`RecallBlock`'s `Actions`
slot). It never did true inline editing despite the "pencil-marked, edit
this answer" framing the updates below describe — tapping it always just
discarded the attempt and reset to Idle for a full re-record. Real inline
editing was considered and declined when this was revisited: no editable
text-input primitive exists anywhere in this codebase, and the verdict was
never actually derived from transcript content (`screens/Loop/script.ts`
picks it by a fixed index) — an edited transcript would have nothing real
to feed into without inventing new judging logic, against `CLAUDE.md`'s
"no model calls of any kind" rule. Every other mention of this control
elsewhere in this doc (Verdicts below, the text-mode section, the test
plan) describes now-removed behavior; not rewritten line by line, flagged
once here.

~~**Updated 2026-09-16, on direct request:** this control is no longer
Wait-only — every Verdict screen below that shows a `Transcript` block
now carries it too (pencil-marked, since it now doubles as "edit this
answer" once a verdict has already been shown). Added live to the real
Figma frames as well (cloned from this real instance, node
`13759:45381`), not just built in code.~~

~~**Refined same day, on direct request:** on Wait itself, this control no
longer appears at the same time as the "Checking" status — the real
Figma frame (`wait footer`, node `13759:45381`) had them as horizontal
siblings, shown together from the moment Wait begins, which is genuinely
how the screen was designed, not a bug. Split into two sequential
sub-phases instead: "Checking" shows alone first (~700ms of Wait's
~1200ms total window), then the correction control replaces it — never
both together. Figma is static and can't represent a timed sequence the
same way; the live frame was updated to match the **resting** phase
(Checking alone, no button) rather than fabricated as a second numbered
frame — see `docs/component-gaps.md`.~~

### Verdicts
**Confirmed, one screen per verdict, same shape:** `RecallCard`,
`VerdictBadge` (`Success` / `Almost` / `Miss` / `Flagged` stories),
`RecallBlock` (`Transcript` story).

- **Success (unaided pass)** — `VerdictBadge` `Success`. **Updated
  2026-09-16, on direct request, superseding this same day's earlier
  version of this line** (which had it auto-advancing after a beat): no
  auto-advance at all now, ever — a visible `Button` (Primary/L, "Next
  term") plus the persistent correction control (see Wait, above) are the
  only way to move on. Added live to the real Figma frame too (node
  `13759:45412`, Loop 5); the "Next term in a moment" caption that
  implied a timer is gone from both the app and the Figma frame.
  **Updated 2026-09-17, on direct request:** also carries an `XpPill`
  (size S) beside the badge, showing what this term just earned (real
  component, `components/XpPill/XpPill.tsx` — its own doc comment already
  names this exact placement, "the in-card pill beside a verdict... only
  where points were awarded"). Score is read from
  `screens/Summary/Summary.tsx`'s exported `OUTCOME_SCORE`, the same
  table Summary's own total is built from. **Not yet added live to the
  real Figma frame** — flagged in `docs/component-gaps.md`, pending the
  Figma connection being reachable again.
- **Almost there** — `VerdictBadge` `Almost`. **Reversed 2026-09-17, on
  direct request, superseding this doc's own earlier line** ("copy must
  state what was there and what was missing in one line," per
  `sprint-context.md`): the card now states only what the student said
  was there ("You had: ..."), never what's missing — see
  `sprint-context.md`'s matching decision for the full rationale (naming
  the gap hands over the recall answer).
  **Actions confirmed live against the committed Figma flow** (node
  `13759:45508`, Loop 8, 2026-09-16 — supersedes this doc's older "hint or
  skip only, no re-explain" line and `sprint-context.md`'s matching
  decision, which are now out of date): `Button` "Try again " (Primary/L)
  then `Button` "Hint " (Secondary/L), plus the dispute link. Not
  auto-advancing on its own — an explicit tap is required, same as Miss.
  **Updated 2026-09-16, on direct request:** also carries the persistent
  correction control — added live to the real Figma frame too (node
  `13759:45508`, Loop 8).
- **Miss (first)** — `VerdictBadge` `Miss`. **Actions confirmed live**
  (node `13759:45445`, Loop 6, 2026-09-16 — supersedes this doc's older
  "hint (...) or re-explain... no bare try-again" line and
  `sprint-context.md`'s matching decision): identical action pair to
  Almost — `Button` "Try again " (Primary/L) then `Button` "Hint "
  (Secondary/L), plus the dispute link ("My answer was right",
  Tertiary/S). There is no dedicated re-explain trigger in the committed
  flow. **Updated 2026-09-16, on direct request:** also carries the
  persistent correction control — added live to the real Figma frame too
  (node `13759:45445`, Loop 6). **Updated again same day:** a second miss
  no longer escalates to Reveal (see § Reveal, below, for why) — every
  scripted attempt after the first is guaranteed `success`, so Hint/Try
  again always resolve the term by the second attempt.
- **Flagged for review** — `VerdictBadge` `Flagged`. Reached via dispute
  (see below), 0 XP, moves the term to its own bucket rather than
  needs-practice. **Per the interview, the 1-per-session cap from
  `sprint-context.md` no longer applies** — dispute is available on any
  eligible (miss/almost-there) term, not capped across the session. This
  needs writing back into `sprint-context.md`. **Updated 2026-09-16, on
  direct request:** also carries the visible "Next term" button and the
  persistent correction control, same as Success — added live to the
  real Figma frame too (node `13759:45599`, Loop 13).

**Auto-advance — removed 2026-09-16, on direct request.** This section
used to describe a 1600ms timer (with a reduced-motion carve-out that
disabled it entirely). There is no timer anymore, on any verdict,
including a positive one — moving on is always an explicit action: the
visible "Next term" button, or tapping the card directly. The
reduced-motion carve-out is now moot (nothing auto-plays to disable), and
the "Next term in a moment" caption that implied a countdown is gone.
Transition between screens is still a **hard cut** — no slide, no
cross-fade, unrelated to this change.

### Hint revealed, awaiting try again
**Confirmed:** `RecallCard`, `VerdictBadge` `Miss`, `RecallBlock` (`Hint`
story), `Button`(Primary/L). **Corrected 2026-09-16 against the live
Figma node** (`13759:45475`, Loop 7): only one button exists here — this
doc's earlier `Button`(Tertiary/L) second action was never real.

**What the student can do.** Tap record again (one explicit try-again,
scoring below unaided) → Recording. **Updated 2026-09-16, on direct
request:** a second miss on this attempt no longer moves into Reveal —
every scripted variant's second attempt is guaranteed `success` (see
`screens/Loop/script.ts`'s own file-level rule), so this always resolves
the term instead of escalating anywhere.

### Reveal — removed entirely 2026-09-16, on direct request
This state (`RecallBlock`'s `Explanation` story, reached via a second
miss, mandatory next step Say it back) was never part of the committed
Figma flow at all — no "Loop 9" exists in the real 17-frame set, it was
this codebase's own inferred/mocked addition. Deleted from
`screens/Loop/Loop.tsx` (the `'reveal'` state, its case branch, the
routing into it) — not just the bare-retry path, every path. The real
Wait frame's correction control (§ Wait, above) already covers "that's
not what I heard" before a verdict fires; nothing else needed Reveal to
exist.

### Say it back — removed entirely 2026-09-18, on direct request
Was a real, confirmed screen (Loop 10 — `RecallCard`, `ButtonIcon`
Primary/L, notably *not* the full `RecordControl`, just a bare record
trigger), left in place but unreachable since Reveal (its only trigger)
was removed above. Carried as an open item in `docs/sprint-context.md`
and `docs/component-gaps.md` for a while, pending a real decision on
whether it ever got a new trigger — resolved now by removing it outright
instead: `VerdictBadge`'s `SaidBack` variant and `RecallBlock`'s
`Explanation` variant (this screen's only real consumers) are deleted
too, closing the open item rather than leaving it open indefinitely.

### Dispute confirm
**Confirmed:** `RecallCard`, `VerdictBadge` `Almost`, `Button`(Primary/M),
`Button`(Tertiary/M) — a plain confirm/cancel pair.

**Flagged:** `RecallBlock` has a real `Confirm` variant
(`components/RecallBlock/RecallBlock.stories.tsx` → `Confirm`) that reads
as purpose-built for exactly this moment, but the real Loop 12 screen
doesn't use it — it uses a bare `VerdictBadge` + button pair instead.
Worth reconciling; not decided here.

**What the student can do.** Confirm → Flagged verdict, 0 XP, term moves
to the flagged bucket. Cancel → back to the Almost/Miss verdict it came
from, no state change.

### Skip
**Placement confirmed:** `sprint-context.md` — lives in the top bar on
every loop screen, not the miss action stack. **Real component:** `TopBar`
(`components/TopBar/TopBar.tsx`), `Loop` variant, its real `trailing` slot.

**Flagged:** none of the 17 audited Loop screens actually instantiate
`TopBar` — each one places a bare `ButtonIcon`(Tertiary/M) + `Button`
(Tertiary/S) directly instead. `TopBar`'s `Loop` variant is designed for
this exact purpose (leading, a filling `Progress` slot for `TermPip`, and
trailing) but isn't yet wired into the real screens. Needs reconciling —
see Open.

**Behavior (interview):** disabled during Recording and Transcribing,
re-arms at pause points (Idle, Wait, any verdict, hint shown). Tapping it
closes the term with 0 XP and auto-advances.

### Text mode
**Decided (overrides Figma):** use `ChatInput`, not `Composer` + `Field`.
The real, committed Figma screens (`Loop 14 — Text mode, idle`, `Loop 15 —
Text mode, composing`) still show `Composer`(`Answer`) + `Field`, but
you've called this directly: build against `ChatInput` going forward.
`Composer` and `Field` stay in the library for now — not deleted, just not
the ones to reach for here.

**File:** `components/ChatInput/ChatInput.tsx` · Storybook: `ChatInput`

**Why this reads as the better fit, not just a preference:** `ChatInput`
already has `Loading` and `Long input` states that `Composer` + `Field`
don't — `Loading` covers text mode's own "short plain wait" beat
(`sprint-context.md`) for free, and `Long input` covers a typed answer
that grows past one line, neither of which `Field` handles today.

**What the student can do.** Type and send (`ChatInput`'s `Ready to send`
→ `Loading` → resolved). Per the interview, **content doesn't matter** —
sending anything replays the same fixed script that term would have
produced by voice (`sprint-context.md`: "verdict logic unchanged"). No
transcript-correction control anywhere in text mode — there's no
transcript to mishear. **Enforced in code 2026-09-16:** this held in
prose already, but once the correction control was made to persist onto
the verdict screens (§ Verdicts, above), it kept showing there in text
mode too until `renderCorrectionControl()` was gated on `textMode`
directly. Tap
**"Switch back to voice"** (`Button`, Tertiary/S — new 2026-09-16, on
direct request, next to the existing "Answering by text for this
session" row) → returns to the mic-based Idle state; `sprint-context.md`'s
"sticky for the session" text-mode decision is updated accordingly.
Confirmed neither real Figma text-mode screen (Loop 14/15) had this
control before — added live to both this session (nodes `13759:45627`,
`13759:45655`).

**Flagged, not yet reconciled:** `ChatInput`'s `status` values
(`Inactive`/`Typing`/`Ready to send`/`Recording`/`Loading`/`Long input`)
don't map cleanly onto this spec's separate `Idle`/`Recording`/
`Transcribing` states above — `ChatInput` has its own independent
`Recording`/`Loading` pair built for a different surface (Home's "Ask
Knowie"). Using it for Loop's text-only mode likely means only its
non-recording states apply here (`Inactive`, `Typing`, `Ready to send`,
`Long input`) and its own `Recording`/`Loading` stay unused in this
context — worth confirming rather than assuming when this gets built.

---

## 5. Home

Added 2026-09-16, on explicit request — not in the original screen list,
and beyond `sprint-context.md`'s original "3 screens + a sheet, not more"
decision (now updated). **Confirmed live** against `Home E — Knowie's
message` (node `13759:45221`, "Final flow" page), Desktop Bridge, screenshot
captured and reviewed.

**Deliberately excluded, on explicit request — not a gap:** the real
frame's "Continue studying" section (heading, "View all" button, the two
hardcoded material rows). Not built.

**Confirmed components:** header row ("Hi Filipe" + streak `chips`),
`knowieMessage` (its own real default `message`/`actions` already match
the real instance near-verbatim), chip row (`chips` ×4: Scan/Recall/Quiz/
Upload, `chipMarker` `Dot` overlaying Recall as the "ready" marker),
`chatInput` (status Inactive, built for exactly this surface per its own
doc comment), and two **new** components this session: `components/Navbar/
Navbar.tsx` and `components/Avatar/Avatar.tsx` (see their own doc
comments for what's confirmed vs. flagged — the Desktop Bridge connection
dropped mid-session before every detail, especially Avatar's per-size
pixel dimensions, could be fully confirmed).

**Touch target, 2026-09-17:** the Recall chip is the entry point into
this whole feature but `chips`' own `S` size (32px) sits under the 44pt
touch-target minimum, and `chips` is documented elsewhere as "not for
actions." Rather than resize the chip (breaking its visual match with
the other three) or drop the "not for actions" rule, the real tap target
is a real `<button>` padded to `control-600` (48px) around the
unchanged-looking chip — same invisible-padding technique `ButtonIcon`'s
own wrapper already uses. That taller wrapper initially broke the row's
vertical alignment against its bare 32px siblings (the row had no
`alignItems`, defaulting to `stretch`); fixed same day with
`alignItems: 'center'` on the row.

**Flagged, not resolved here:** the real Recall chip's own Figma layer
name is literally `chip / Recall / NEW (brain glyph pending library)` —
Figma's own source has no resolved brain asset either, not just this
codebase. The composer's real frame also shows a second "camera" icon
(`iconSlot / camera glyph missing`, also unresolved in Figma) that
`ChatInput` has no slot for — not reproduced.

**What the student can do.** Tap the Recall chip → Hub. **Updated
2026-09-17, on direct request:** tap **Start** on the Knowie message
(its own default action) → straight into `/loop?topic=research-methods`
(Loop's own entry screen — "Today: 5 terms from Research Methods," "About
3 minutes. Tap to start.") — not Hub; the message already names the
topic, so Hub would be a redundant stop. Tap **Not now** → the card is
dismissed for this visit (`middleContent` renders nothing). This last
part overrides the "No dismissal... on `KnowieMessage`" line in
`sprint-context.md`'s out-of-scope list, removed there the same day.
Scan/Quiz/Upload chips and the other 4 Navbar tabs are present but
inert — no real destination in this sprint's scope.

---

## Out of scope

Verbatim from `sprint-context.md`'s "Not building" — treat this list as
binding, not a starting point for debate. **Two items removed since this
list was first written:** "No pause/resume into one take" (2026-09-16,
on direct request) — `RecordControl` now has a real `Paused` state
(§ Idle/Recording confirms below; live Figma node `13734:32389`). "No
dismissal... on `KnowieMessage`" (2026-09-17, on direct request) — Home's
card now dismisses on "Not now" (§5). Both override lines that used to
sit below; see `docs/sprint-context.md`'s own updated decisions for why.

- No voice output, ever, anywhere in the flow.
- No auto-endpointing — push-to-talk with explicit send only.
- No tutoring branch — re-explain is capped, in-card only, no open
  composer or chat thread.
- No confidence-calibration step before the verdict.
- No second "targeted worst-terms" session type.
- No mid-answer language-switch handling.
- No mic-hardware-busy handling.
- No designed network/judge-error/timeout screens — a session can end on
  a named-gap error state, defensible in a mocked prototype, not an
  engineered one.
- No long-message handling on `KnowieMessage` (dismissal itself is no
  longer on this list — see above).

---

## How the mocked recall behaves

No real STT, no real judge. Per the interview:

- **Fixed script per term.** Each of the five terms carries a
  pre-written transcript + verdict, deterministic across runs.
- **The five-term set is curated, not uniform** — built so one full run
  tours every path: unaided, hinted, miss → reveal → say-it-back,
  almost-there, and skip. Every term's script is load-bearing.
- **Discard rerolls to an alternate scripted outcome** for the same term
  (not a replay of the identical result) — each term needs at least two
  scripted variants to support this.
- **Text mode ignores what's typed** — sending anything replays the same
  fixed script voice would have produced for that term.
- **Say-it-back is unconditional** — any recording credits the flat +5
  from `sprint-context.md`'s scoring table, no judgment applied.
- **Transcribing has no judgment either** — it's a timing beat, not a
  decision point; the verdict was already fixed the moment the term's
  script was chosen.

---

## Verification: how to check this is done and correct, end to end

1. **Every state has a Storybook story.** Run `npm run storybook`, and for
   each screen/state above marked "Confirmed" or newly built, open its
   story and check it against this spec's component list — the `docs-list`
   / `docs-show` MCP tools are the source of truth for what's actually
   documented, not source reading.
2. **Accessibility.** Re-run the axe-core scan pattern already used this
   session (`axe-core` against every story via Playwright) after any new
   component or state lands — `button-name` and `color-contrast` are the
   two rule categories that have actually caught real bugs here; treat a
   clean run as a gate, not a nice-to-have.
3. **One full scripted run, start to finish.** From Hub's proposal through
   all five curated terms to Summary, with no code edits between screens:
   confirm every terminal verdict (Success/Almost/Miss/Flagged) requires an
   explicit tap to move on — the visible "Next term" button or tapping the
   card directly — never an automatic transition, including on a positive
   result (auto-advance was removed entirely 2026-09-16; there is no timer
   or reduced-motion carve-out left to check). Confirm the hard-cut
   transitions don't leave any intermediate flash.
4. **Every escape hatch, deliberately.** Tap "I can't speak right now"
   from both Hub and Loop and confirm both land on the identical
   `Sheet` copy. Force a permission denial (or simulate revoked
   permission) and confirm it routes to the same sheet with no separate
   error state. Use Skip on at least one term and confirm it's disabled
   mid-Recording/Transcribing and re-arms after.
5. **Discard, twice, on the same term.** Confirm the second recording
   produces a different scripted outcome than the first, not a repeat.
6. **Dispute more than once in a session.** Confirm it's available on
   every eligible term, not just the first, and that each one lands in
   the flagged bucket at 0 XP.
7. **Resume a partial session.** Abandon mid-loop after answering at least
   one term, return via Hub, and confirm the entry state shows only the
   remaining term count, not the original five with completed ones marked.
8. **Chip state end to end.** Confirm the chip reaches the all-clear
   Summary and returns to plain — the dot should not still read "ready"
   afterward.
9. **Cross-check against Figma.** For any screen marked "Confirmed" above,
   the source of truth is the real instance data pulled from the "COMMITED
   FLOW FINAL USING COMPONENTS" frame, not this document's prose — re-pull
   it if the Figma file changes.

---

## Open

Things raised in this project that are not decided — build against the
working assumption noted, but don't treat any of these as settled:

1. **Composer/Field retirement timing.** `ChatInput` is now the decided
   component for Loop's text mode (see §4 Text mode) — `Composer` and
   `Field` stay in the library for now on your explicit call, not deleted,
   with deletion left for later. Figma itself hasn't been updated to match
   yet (the real screens still show `Composer` + `Field`); that's a
   pending Figma edit, not an open product decision.
2. ~~**Hub's real screen composition.**~~ **Resolved 2026-09-16:** it's
   `Hub C — The queue` for real, confirmed live — see § 3 above. The
   `SessionHero`/`ListRow`-`Locked` composition this item used to describe
   was itself the thing that turned out wrong, not an open question about
   it.
3. **Skip's actual placement.** Decided in prose (top bar, every loop
   screen) and a real component exists for it (`TopBar`, `Loop` variant,
   `trailing` slot), but no real Loop screen in Figma actually uses
   `TopBar` yet — they all use a bare `ButtonIcon` + `Button` pair instead.
4. ~~**`appBar` on Hub C.**~~ **Resolved 2026-09-17:** `design-system.md`'s
   "zero real instances" claim corrected to note the real Hub C exception.
   `screens/Hub/RecallHub.tsx` still doesn't reproduce the real `appBar`
   instance — it uses the plain back-icon-plus-title row `design-system.md`
   otherwise prescribes — a deliberate choice, not something left open.
5. **`RecallBlock`'s `Confirm` variant vs. the real Dispute confirm
   screen.** A variant exists for exactly this moment but isn't what the
   real Figma screen uses.
6. ~~**Summary's two Primary buttons.**~~ **Resolved 2026-09-16:**
   re-checked live — the real all-clear instance has exactly **one**
   button ("Back to Recall," Primary/L), not two. The "two Primary/L
   buttons" claim here was itself stale, not the real current file.
7. ~~**Session entry's real component.**~~ **Resolved:** built and
   confirmed as `TextBlock` (see § Session entry above) — still no
   governing Figma frame to check it against (none exists), but the
   component choice itself is decided and shipped, not open.
8. **Transcribing, in Figma.** You've said this should be added to the
   real `recordControl` component, not just built in code — that Figma
   edit hasn't happened yet. The bars-freeze half of this state's spec
   is now built in code (§ Transcribing above), independent of the Figma
   addition still pending here.
9. ~~**Dispute cap removal.**~~ **Resolved 2026-09-17:** written back into
   `sprint-context.md`'s dispute decision — no longer capped at 1 per
   session, matching the code (which never tracked a count) and the real
   committed Figma flow.
10. ~~**Bare-retry scoring tier.**~~ **Resolved 2026-09-18:** Miss and
    Almost's real committed-flow actions (Try again / Hint, confirmed
    against `13759:45445` / `13759:45508`) make a hint-less retry pass
    possible, but `sprint-context.md`'s scoring table had no tier for it.
    Direct decision: a hint-less retry scores and reads exactly like a
    hinted pass — "Said it after a hint," 8 XP — not a separate tier.
    `screens/Loop/Loop.tsx`'s `outcomeRow`/`successOutcomeLabel` and
    `screens/Summary/Summary.tsx`'s `OUTCOME_SCORE`/`OUTCOME_STYLE`
    updated to match; the old "Said it after a retry" label is gone.
11. **`/cannot-speak`'s standalone route is now orphaned.** Its own doc
    comment (`screens/CannotSpeak/CannotSpeakSheet.tsx`) says plainly:
    "once Hub is built, this stops being a standalone route and becomes a
    state of Hub's own Scaffold... flagged as a build-order decision, not
    a permanent route." Hub, Loop, and Recall history are all built now
    and each already embeds the real `Sheet` correctly via
    `bottomSheetOnly` — this route was never retired once its stated
    condition was met. Not fixed here (a route removal wasn't asked for);
    flagged so it doesn't keep reading as current.
12. **New finding, 2026-09-17: "Keep going, N terms left" doesn't actually
    resume the topic in progress.** Found auditing this doc against the
    real code for accuracy, not requested. `screens/Summary/Summary.tsx`
    has no `topic` prop and `app/summary/page.tsx` reads no `topic` from
    its URL — `Loop`'s own transition to Summary
    (`router.push(allClear ? '/summary?allClear=1' : '/summary')`,
    `screens/Loop/Loop.tsx`) never sends one either. So "Keep going"
    always routes to a bare `/loop`, which defaults to `research-methods`
    (`app/loop/page.tsx`) — a student practicing Cell biology, Legal
    studies, or Terms you missed who abandons mid-session and taps "Keep
    going" is silently bounced into a fresh Research Methods session
    instead. Separately, `termIndex` in `screens/Loop/Loop.tsx` always
    initializes to `0` — there's no mechanism anywhere to resume at a
    partial index either, so Verification step 7's expectation ("the
    entry state shows only the remaining term count") isn't actually
    built — every resume replays the full term set from term 1. This
    predates the 4-topic build (until 2026-09-16 every topic played the
    identical Research Methods script, so losing "which topic" silently
    resolved to the same content either way) but is a real, live bug now
    that Hub's 4 topics carry distinct content. Not fixed here — flagged,
    not silently patched, per this project's own convention.
