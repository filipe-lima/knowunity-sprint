# SPEC.md

Build spec for the voice active-recall prototype. Written from `sprint-context.md`,
`design-brief.md`, `voice-ux-reference.md`, the Figma screens under "COMMITED FLOW
FINAL USING COMPONENTS" (Final flow page), and the interview that closed the
remaining gaps. Where this spec and an earlier doc disagree, this spec is the
current answer — the earlier doc still holds the reasoning.

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
3. **Hub** — one proposal screen with precedence logic, no recording.
4. **Loop** — everything else. One screen, most of the states, all the mock
   wiring, all the timing decisions.

---

## 1. Cannot-speak sheet

**File:** `components/Sheet/Sheet.tsx` · Storybook: `Sheet` → `Default`
("Can't speak right now?")

**States.** One. Not sticky-vs-not, not denied-vs-voluntary — the interview
settled that permission denial routes into this exact same sheet with the
same copy, and Hub's own "I can't speak right now" opens this same sheet
rather than skipping straight to text. There's one sheet, three doors into
it (Hub's secondary, Loop's escape control, an OS permission denial).

**What the student can do.** Tap **"Yes, let me type"** (`Button`,
Primary/L, per `Sheet`'s real default Actions) → enters Loop in text mode,
sticky for the rest of the session, verdict logic unchanged. Tap **"No,
back to home"** (`Button`, Tertiary/M) → returns to Hub, keeps any set
already built (per `sprint-context.md`).

---

## 2. Summary

**Confirmed from Figma** (`Summary 2 — All clear`, `Summary 3 — Continued a
learning goal`): `sessionHero`(align=Left, surface=None), `listRow` ×3–5,
`mascotSlot`(XL, crop=Full), `button`(Primary/L) ×2.

**Files:** `components/SessionHero/SessionHero.tsx`,
`components/ListRow/ListRow.tsx`, `components/MascotSlot/MascotSlot.tsx`,
`components/Button/Button.tsx`

**States.**
- **Regular summary** — `SessionHero` (`Left, None (summary head)` story)
  stating the headline result, five `ListRow` buckets underneath (unaided,
  hinted, revealed + said-back, flagged, skipped — per `sprint-context.md`),
  Continue as primary action, Try again as secondary.
- **All-clear** — same shape, `MascotSlot` XL carries the one pose change
  in the whole flow (standby → approving). Per the interview, **no visible
  transition on arrival** — Summary just loads with the approving pose
  already showing.

**What the student can do.** Tap **Continue** (`Button`, Primary/L) →
returns Home/Hub, chip returns to plain (per `sprint-context.md`: the
all-clear state is what turns the ready dot off). Tap **Try again**
(`Button`) → new session.

**Flagged, not resolved here:** the real Figma screens show two
`Primary/L` buttons on Summary 2, not one Primary + one Secondary as
`design-brief.md` specifies ("Continue as the primary action, Try again as
secondary"). Worth a decision — see Open.

---

## 3. Hub

**Not directly confirmed in Figma** — the only Hub-named screen in the
audited frame is `Hub C — The queue` (`listRow` ×7, `buttonGroup`), which
is the plan/queue list, not the single-proposal confirm screen
`sprint-context.md` describes. The composition below is inferred from
`sessionHero`'s own real Figma variant descriptions and the component
library, not confirmed against a built Hub screen. Flagged under Open.

**Inferred components:** `SessionHero` (`Left, Card (proposal)` story —
its own Figma description literally is "the sheet's proposal" shape),
`ListRow` (`Locked` story, for a queued future plan step, shown as "one
quiet row, never a list" per `sprint-context.md`), `Button` (Primary/L
CTA), the quiet secondary that opens the Cannot-speak sheet.

**States.** One — a single already-decided proposal, not a picker
(`sprint-context.md`). Session entry copy ("Today: 5 terms from X") lives
inside Loop, not here.

**What the student can do.** Tap the primary CTA → enters Loop. Tap **"I
can't speak right now"** (quiet secondary) → opens the Cannot-speak sheet
(§1). Tap a locked step row → nothing; it's informational only.

**Flagged:** Hub C's real screen instance uses a component named `appBar`
(desktop, 1200px, zero real instances per `design-system.md`'s own
explicit guidance to leave it alone and use `TopBar` on mobile instead).
This has no Storybook counterpart and contradicts the design system's own
rule. Needs reconciling before Hub is built for real.

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
the first. Component not yet chosen — likely `TextBlock`
(`components/TextBlock/TextBlock.tsx`), unconfirmed. Flagged under Open.

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
Submit actions, real amplitude bars.

**What the student can do.** Tap **Discard** → rerolls to an alternate
scripted outcome for this term (see §5) and returns to Idle — no verdict
recorded (`sprint-context.md`: discard is a transition inside Idle, not a
state). Tap **Submit** (or the stop control) → Transcribing. **Skip is
disabled** here (interview) — it re-arms once the term reaches a pause
point.

### Transcribing — new state, not yet built
**Not in Storybook or Figma.** Per the interview: a third `RecordControl`
state alongside `Idle`/`Recording`, to be **added to the real Figma
component first**, then built here to match — same discipline as every
other component this session (never invent past what's designed).

**Spec for the addition:** amplitude bars stay visible but freeze (stop
animating); caption text changes; **Discard and Submit both disable** —
the take is locked the instant recording stops. Skip stays disabled
(re-arms only once Wait resolves).

**What the student can do.** Nothing — this is a brief, non-interactive
beat.

### Wait (transcript carried)
**Confirmed:** `RecallCard`, `RecallBlock` (`Transcript` story), `MascotSlot`
(2XL). No separate loading/skeleton instance — this state itself *is* the
resolved transcript (`sprint-context.md`: "renders the resolved transcript
... not a typing indicator").

**What the student can do.** Read the transcript. Tap **"that's not what I
said"** (`RecallBlock`'s real `Actions` slot control) → back to Idle for a
re-record, no verdict. Otherwise the judge resolves and the screen moves to
a Verdict state automatically (§ Verdicts) — no tap required to leave Wait.

### Verdicts
**Confirmed, one screen per verdict, same shape:** `RecallCard`,
`VerdictBadge` (`Success` / `Almost` / `Miss` / `Flagged` stories —
`SaidBack` is used at the Say-it-back moment, not here), `RecallBlock`
(`Transcript` story).

- **Success (unaided pass)** — `VerdictBadge` `Success`. Auto-advances to
  the next term after a beat (§ Auto-advance).
- **Almost there** — `VerdictBadge` `Almost`. Per `sprint-context.md`,
  copy must state what was there and what was missing in one line.
  Actions: hint or skip only, no re-explain. Auto-advances once resolved.
- **Miss (first)** — `VerdictBadge` `Miss`. Actions: hint (leads to Hint
  revealed, below) or re-explain (leads to a second attempt). No bare
  try-again with no hint.
- **Flagged for review** — `VerdictBadge` `Flagged`. Reached via dispute
  (see below), 0 XP, moves the term to its own bucket rather than
  needs-practice. **Per the interview, the 1-per-session cap from
  `sprint-context.md` no longer applies** — dispute is available on any
  eligible (miss/almost-there) term, not capped across the session. This
  needs writing back into `sprint-context.md`.

**Auto-advance.** Only on terminal verdicts (a resolved pass, a closed
second miss, a skip, a dispute) — not on in-term branches like a hint
appearing. Default pause, **tap-to-advance overrides it early**. Under
reduced motion, auto-advance is **disabled entirely** (same treatment as
the intro card) and every move requires an explicit tap. Transition
between screens is a **hard cut** — no slide, no cross-fade.

### Hint revealed, awaiting try again
**Confirmed:** `RecallCard`, `VerdictBadge` `Miss`, `RecallBlock` (`Hint`
story), `Button`(Primary/L), `Button`(Tertiary/L).

**What the student can do.** Tap record again (one explicit try-again,
scoring below unaided) → Recording. A second miss on this attempt closes
the term and moves into Reveal.

### Reveal (second miss / re-explain path)
**Confirmed component for this content shape:** `RecallBlock` (`Explanation`
story) — capped in-card follow-ups, no open composer, no retry after
(`sprint-context.md`). Mandatory next step: Say it back.

### Say it back
**Confirmed:** `RecallCard`, `ButtonIcon` (Primary/L) — notably *not* the
full `RecordControl`, just a bare record trigger.

**What the student can do.** Record anything. Per the interview, this is
**unconditional** — any recording resolves straight to the flat +5 credit
(`sprint-context.md`'s scoring), no separate pass/fail beat, no
acknowledgment screen.

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
transcript-correction control — there's no transcript to mishear.

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

## Out of scope

Verbatim from `sprint-context.md`'s "Not building" — treat this list as
binding, not a starting point for debate:

- No voice output, ever, anywhere in the flow.
- No auto-endpointing — push-to-talk with explicit send only.
- No tutoring branch — re-explain is capped, in-card only, no open
  composer or chat thread.
- No confidence-calibration step before the verdict.
- No second "targeted worst-terms" session type.
- No mid-answer language-switch handling.
- No pause/resume into one take.
- No mic-hardware-busy handling.
- No designed network/judge-error/timeout screens — a session can end on
  a named-gap error state, defensible in a mocked prototype, not an
  engineered one.
- No dismissal or long-message handling on `KnowieMessage`.

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
   confirm the auto-advance timing feels right, confirm tap-to-advance
   works, confirm reduced motion turns off every auto-advance, confirm the
   hard-cut transitions don't leave any intermediate flash.
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
2. **Hub's real screen composition.** Not present in the audited Figma
   frame at all — only the queue screen (`Hub C`) exists there. The
   `SessionHero` (`Left, Card (proposal)`) + `ListRow` (`Locked`)
   composition in this spec is inferred from component descriptions, not
   confirmed against a built screen.
3. **Skip's actual placement.** Decided in prose (top bar, every loop
   screen) and a real component exists for it (`TopBar`, `Loop` variant,
   `trailing` slot), but no real Loop screen in Figma actually uses
   `TopBar` yet — they all use a bare `ButtonIcon` + `Button` pair instead.
4. **`appBar` on Hub C.** The real screen uses a component
   (`appBar`) `design-system.md` itself says has zero real instances and
   should be left alone in favor of `TopBar`. Needs reconciling before Hub
   is built.
5. **`RecallBlock`'s `Confirm` variant vs. the real Dispute confirm
   screen.** A variant exists for exactly this moment but isn't what the
   real Figma screen uses.
6. **Summary's two Primary buttons.** `design-brief.md` calls for
   Continue (primary) / Try again (secondary); the real Figma screen shows
   two `Primary/L` buttons.
7. **Session entry's real component.** Not confirmed against any built
   Figma screen — likely `TextBlock`, not decided.
8. **Transcribing, in Figma.** You've said this should be added to the
   real `recordControl` component, not just built in code — that Figma
   edit hasn't happened yet.
9. **Dispute cap removal.** Needs writing back into `sprint-context.md`'s
   dispute decision (currently states "capped at 1 per session").
