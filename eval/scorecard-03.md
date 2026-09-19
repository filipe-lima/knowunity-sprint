# Scorecard 03

Screens graded: Cannot-speak sheet, Summary, Hub (+ Recall history), Loop, Home.
Rubric: `eval/rubric.md`. Method: same protocol as `eval/scorecard-01.md` and
`eval/scorecard-02.md` — a live render pass (this session, Chrome DevTools MCP,
390×844 dark mode, every reachable state, done in parallel with the critics this
round) followed by four critic agents run in isolated contexts — `critic-system`,
`critic-craft`, `critic-ux` (adversarial, each blind to the others' output, to
this render pass, and to `scorecard-01.md`/`scorecard-02.md`) and
`critic-ambition` (non-adversarial). No critic saw another critic's findings,
this render pass, or a score from anyone. All four ran as background agents
launched in parallel; the render pass ran concurrently in this session rather
than before or after, since scorecard-02 already established that ordering
doesn't affect independence.

Graded against the working tree as it sits right now, uncommitted changes
included — `components/Scaffold/Scaffold.tsx`, `screens/CannotSpeak/
CannotSpeakSheet.tsx`, `screens/Hub/RecallHistory.tsx`, `screens/Hub/
RecallHub.tsx`, `screens/Loop/Loop.tsx`, `screens/Summary/Summary.tsx`,
`scripts/check-contrast.mjs`, `package.json`, and a new `components/BucketRow/`
— which read, from their own history, as an attempt to fix round 2's findings
(the `BucketRow` promotion and contrast fix are both explicitly cited in-file as
responses to `eval/scorecard-01.md`/`-02.md`).

**One methodological note on this round:** the render pass hit the identical
blocker scorecard-02 already documented — a stale `chrome-devtools-mcp` browser
profile lock, this time from a session that had been orphaned since 2026-09-17
23:59, one day old. Same fix: killing the orphaned process (PID 1257) and its
Chrome instance required explicit user authorization, granted, after which the
render pass ran clean. Also worth recording: to reach real live-voice states
(Recording, the correction control, the Success/Flagged verdict card in voice
mode), this pass injected a `navigator.mediaDevices.getUserMedia` stub via
Chrome DevTools' page-navigation `initScript` — the automated browser has no
real microphone and getUserMedia auto-denies, which itself is a real, useful
signal (see UX judgment) but would otherwise have made voice mode entirely
unreachable. The stub resolves with a fake `MediaStream` and stops immediately,
exactly mirroring what `screens/Loop/Loop.tsx:136-137` already does with a real
stream — nothing downstream of that point depends on real audio (the whole
recall is mocked, per `CLAUDE.md`), so every state reached this way is a
genuine render of real app code, not a simulation of one.

**Verdict: all four hard gates pass for the first time across three rounds** —
including the contrast gate that failed twice before. But the weighted
dimension total **dropped** from round 2's 5.7 to **5.0**, because this round's
render pass and two critics working independently surfaced a severe, previously
undiscovered functional defect (the correction control silently skips a term
instead of letting the student redo it — live-confirmed, not just read from
source) sitting on top of round 2's still-unresolved core defect (Summary is
still not session-aware, re-confirmed live via an actual completed session this
time, not just a skip-to-summary shortcut). Clearing the hard gates is real
progress; it does not mean the product is in better shape than round 2 — by the
rubric's own weighting it's measurably worse.

---

## Total

**5.0 / 10**, weighted — down from round 2's 5.7/10 and round 1's 4.6/10.

Same judgment call as rounds 1–2: the rubric gives an ordinal weight order, not
numeric weights. High dimensions ×3, Medium ×2, Low ×1, averaged.

| Dimension | Weight | Round 2 | Round 3 | Δ |
|---|---|---|---|---|
| System fidelity (High) | ×3 | 6 | 6 | — |
| Coherence (High) | ×3 | 6 | 4 | **−2** |
| Craft (High) | ×3 | 6 | 6 | — |
| UX judgment (High) | ×3 | 5 | 4 | **−1** |
| Accessibility (Medium) | ×2 | 5 | 5 | — |
| Structure (Low) | ×1 | 6 | 5 | **−1** |

(6×3 + 4×3 + 6×3 + 4×3 + 5×2 + 5×1) / 15 = 75/15 = **5.0**

Every score above comes from one adversarial critic working blind, in its own
context, with `Read`/`Grep`/`Glob` only — no critic had a render tool this
round either (despite MCP instructions suggesting more were available). Per the
rubric's own scoring rule, every critic score is capped at 7 regardless of
source quality; all six land well below that cap on the evidence itself. Where
this round's live render pass could independently verify a critic's
source-only finding, it's marked so below — several were, including the two
most consequential ones.

**critic-ambition's read: 6/10 — kept separate, does not feed the total above.**
See its own section at the bottom.

---

## Hard gates

| Gate | Result | vs. round 2 |
|---|---|---|
| Contrast ≥ 4.5:1 for all body text | **PASS** | fixed — first pass across 3 rounds |
| Touch targets ≥ 44pt on every interactive control | PASS | unchanged (already passing) |
| No raw hex color in component source (`check:tokens`) | PASS | unchanged (already passing) |
| No two states that should differ ever render identically | PASS | unchanged (already passing) |

- **Contrast — PASS, and this is real, not cosmetic.** Ran `npm run
  check:contrast` directly (`scripts/check-contrast.mjs`, itself new/expanded
  this round per `git status`): all 21 real token pairings clear 4.5:1, most by
  a wide margin. The specific pairing that failed both prior rounds —
  `--color-text-disabled` — now measures **5.33:1 on `background-page`** and
  **4.94:1 on `background-surface`**, up from round 2's hand-computed ~3.78:1
  and ~3.64:1. `critic-craft` independently re-derived one pairing the script
  doesn't cover (`VerdictBadge` "Flagged", `text-secondary` on
  `background-stacking` composited over both real backgrounds) by hand and
  found it clears comfortably (~5.7:1 / ~7.2:1) — not a live failure, just
  previously untested.
- **Touch targets — PASS, unchanged and independently re-confirmed.**
  `critic-craft` re-checked every `Button`/`ButtonIcon` size step against real
  `build/css/tokens.css` px values and the three round-2 fixes (`Navbar` tabs,
  Home's Recall chip, `ChatInput`'s send button) directly in source; all clear
  44pt. No new sub-44px control found by any critic or by this render pass.
- **No raw hex — PASS, and the gate's own coverage widened this round.**
  `package.json`'s `check:tokens` script now greps `components`, `screens`,
  **and `app`** (round 2's `critic-system` had flagged the `components`-only
  scope as an unflagged blind spot — this is a direct fix). Ran it directly:
  exit 0, zero matches. `critic-system`'s independent grep matched. One residual
  gap `critic-system` names: the grep still only covers `.ts`/`.tsx`, so a real
  CSS file in `components/` (`components/shared/Spinner.css`) is outside the
  gate's reach — benign today (no color in that file), but the gate's coverage
  is incomplete as written, not just narrowly-but-sufficiently scoped.
- **No two states render identically — PASS, and round 2's one open item on
  this gate is now fixed, confirmed live.** Selecting Legal studies on
  `screens/Hub/RecallHub.tsx` now correctly shows exactly one "Up next" badge
  (on Legal studies) while Research Methods falls back to a real count-based
  badge ("0 of 5") instead of also reading "Up next" — this render pass
  screenshotted the selected and deselected states side by side and confirmed
  the fix directly (`.eval-screens/round3/hub-01-default.png`,
  `hub-02-legal-selected.png`). This was round 1's original finding, still
  unfixed in round 2 despite being flagged twice; fixed now. Every other
  distinctness pair checked in rounds 1–2 (Recording/Transcribing/Paused,
  Wait's Checking vs. correction sub-phase, all four verdict types) was not
  re-litigated this round since the source files governing them
  (`RecordControl.tsx`, `VerdictBadge.tsx`) are untouched in the current diff —
  no regression risk there, and this round's own render pass re-confirmed
  Success/Miss/Almost/Flagged all remain visually distinct (color + icon +
  label, never color alone) by walking a real 5-term session live.

**Not a hard-gate item, but the most severe finding of this round, stated here
because it very nearly reads as a distinctness failure and the two are easy to
conflate:** the correction control does not produce a *visual* collision (it
renders a perfectly ordinary, correct-looking idle state) — it silently
advances the student to the **wrong term**. See "Live render pass" and UX
judgment below.

---

## Per-dimension findings

Each finding is the critic's own claim, condensed, with file:line evidence as
each critic gave it. Where this session's live render pass could independently
confirm or add to a finding, that's noted inline.

### System fidelity — 6/10, capped at 7 (`critic-system`)

Tool disclosure, stated by the critic itself: only `Read`/`Grep`/`Glob` were
reachable, no render.

1. **The row/list-item triplication flagged in both prior rounds is fixed.**
   `components/BucketRow/BucketRow.tsx` is new, and its own doc comment cites
   `eval/scorecard-01.md` and `eval/scorecard-02.md` by name as the reason it
   exists. `screens/Summary/Summary.tsx`, `screens/Hub/RecallHub.tsx`, and
   `screens/Hub/RecallHistory.tsx` all now import and use it instead of three
   parallel hand-rolled row shapes — exactly the rubric's 6→9 promotion rule,
   genuinely applied, not just asserted. This render pass's screenshots of
   Hub, Recall history, and the session-end Summary are consistent with one
   shared row anatomy across all three.
2. **Hand-typed pixel values where an exact token exists, unflagged** —
   `components/ChatInput/ChatInput.tsx:169,214,252` uses raw `'24px'`/`'16px'`
   for icon sizing where `tokens/tokens.json:1026-1069` defines `icon-200`/
   `icon-300` for exactly this, and the same file's own `Spinner` call is
   correctly token-bound two branches later (`screens/Loop/Loop.tsx:488`).
   Unlike this file's many other documented approximations, these three are
   unflagged. **Fix:** bind all three to `var(--icon-200)`/`var(--icon-300)`.
3. **`Scaffold`'s root 390×844 and other layout literals are consistently
   flagged as documented exceptions**, not silent ones — checked across
   `Scaffold.tsx`, `TopBar.tsx`, `RecordControl.tsx`, `Sheet.tsx`, `TermPip`,
   `ButtonTimed.tsx`; each has a doc comment naming it as an unbound Figma
   value with no governing token, matching the rubric's 9-anchor bar.
4. **`check:tokens`'s own coverage gap** (raw-hex grep never scans `.css`
   files) — see Hard gates above, same finding, counted here as its home
   dimension.

### Structure — 5/10, capped at 7 (`critic-system`)

1. **Home's `bottomContent` still stacks three elements — confirmed live this
   round, not just from source.** `screens/Home/Home.tsx:127-191` holds a chip
   filter row, a `ChatInput` composer row, and a full `Navbar` in one slot.
   `docs/design-system.md:122-125` documents this slot as holding exactly one
   of those three ("never two"), and `:453-456`'s `composer` entry names Home
   specifically as the standing violation. `Home.tsx` was **not** among the
   files touched in this round's uncommitted diff — the fix scorecard-02
   implicitly called for was not attempted. This render pass's
   `.eval-screens/round3/home-01-default.png` shows all three rows stacked
   and visible at 390×844 — it renders without clipping or overflow at this
   content length, so it's a real rule violation, not visible breakage, which
   is why this lands at 5 rather than lower.
2. Every one of the six in-scope screens sits on a real `<Scaffold>` root; no
   broken import, unclosed JSX, or prop mismatch found across all six
   screen components and their six `app/*/page.tsx` wrappers.
3. `bottomSheetOnly` is used consistently across all four screens that need it,
   each pairing a `MascotSlot` + `Sheet` the same way — this render pass
   confirms the mascot is now genuinely present above the sheet on
   `CannotSpeakSheet` specifically (see critic-ambition's round-2 finding,
   now fixed — screenshot below).

### Craft — 6/10, capped at 7 (`critic-craft`)

Tool disclosure: `Read`/`Grep`/`Glob` only; contrast math is hand-derived from
real token hex, not browser-measured — though this round's live render pass
independently ran the real script (see Hard gates) and confirms the numbers.

**Genuine strengths, stated by the critic for balance, several confirmed live
this round:**
- `RecordControl` differentiates Idle/Recording/Paused/Transcribing by shape +
  motion + color together. This render pass confirms it directly — the
  Recording state shows a real, live, per-bar magenta waveform (not a static
  image), captured at `.eval-screens/round3/loop-voice-recording-live.png`
  via a real (stubbed-media) recording session.
- `VerdictBadge`'s five variants tie color+glyph+label together with no
  override path — confirmed live across Success, Miss, Almost, and Flagged
  in this round's actual 5-term playthrough.
- `Scaffold`'s `middleContent` applies one structural `gap` to all children
  rather than hand-spacing each one; `Loop.tsx:583-588,632-634` shows a
  self-caught bug (a hand-assembled button pair that skipped the shared gap)
  fixed by routing through `ButtonGroup` instead.

**Findings:**
1. **The Wait/"Checking" beat still borrows the fully generic `Button`/
   `ButtonIcon` loading `Spinner`**, not a state-specific treatment —
   `screens/Loop/Loop.tsx:478-499`, same defect scorecard-02 found, unfixed
   (the file's own comment concedes the intent). Not dead — it moves — but
   has no identity distinguishing "Knowie is judging your answer" from any
   busy button anywhere. **Fix:** a Wait-specific motion (animated ellipsis,
   a pulsing placeholder) instead of the shared component's own spinner.
2. **Loop's Skip control is Default↔Disabled by text-opacity alone** —
   `screens/Loop/Loop.tsx:301-309`, `Tertiary`/Default and Tertiary/Disabled
   share `background: transparent`, differing only in `text-primary` vs.
   `text-disabled` (`components/shared/resolveButtonColors.ts:45-53`). This is
   the rubric's own 4-anchor example, live and reachable every recording
   session. **Fix:** a second cue (whole-control opacity, or a lock glyph),
   not a text-color swap alone.
3. **`TermPip`'s three progress states are color-only** — same defect
   scorecard-01 and -02 both found, still unfixed
   (`components/TermPip/TermPip.tsx:38-42`). This render pass's progress-pip
   row screenshots (visible at the top of every Loop screenshot this round)
   confirm the three states are large brightness deltas, not a confusability
   risk in practice, but still a literal rule-10 gap.

### Accessibility — 5/10, capped at 7 (`critic-craft`)

**Genuine strengths:** touch targets and accessible naming are both
structurally enforced (`aria-label` is a required TypeScript field on
`ButtonIconProps` and `NavigationButtonProps`), not incidental — every real
call site across the six screens supplies one, independently confirmed.

**Findings, most severe first:**
1. **A live, load-bearing control has zero keyboard/assistive-tech
   operability.** `screens/Loop/Loop.tsx:658-665` gives `RecallCard` a real
   `onClick={goToNextTerm}` on Success/Flagged verdicts, but
   `components/RecallCard/RecallCard.tsx:44-69` renders it as a bare `<div>`
   — no `role="button"`, no `tabIndex`, no keyboard handler. `components/
   BucketRow/BucketRow.tsx:47-63` implements exactly this pattern correctly a
   few files away. **This is the same root cause as the correction-control
   bug below** (`RecallCard`'s click handler swallowing/interacting badly
   with its children) — two independent defects from one under-scoped
   pattern. **Fix:** apply `BucketRow`'s own `role="button"`/`tabIndex={0}`/
   `onKeyDown` pattern to `RecallCard` when it receives an `onClick`.
2. **Disabled-state buttons/icon-buttons are color(lightness)-only**, the same
   evidence as Craft finding 2 above, cited here against `design-system.md`
   rule 10's named risk pair directly — also fires in `RecordControl.tsx:
   274-286` (Discard/Pause/Submit go `Disabled` during Transcribing, three
   controls at once, dimming only).
3. **The bottom-sheet pattern used on 4 of 6 screens has no dialog
   semantics** — `components/Scaffold/Scaffold.tsx:162-177` renders
   `bottomSheetOnly` as a bare `<div>`, no `role="dialog"`, `aria-modal`, or
   focus management, across `RecallHub`, `Loop`, `RecallHistory`, and
   `CannotSpeakSheet`. **Fix:** add dialog semantics and focus-trap once,
   centrally in `Scaffold`, since all four call sites share the shape.

### Coherence — 4/10, capped at 7 (`critic-ux`)

Rubric anchor used: the **4** anchor — this round's headline finding is
exactly its own example, an undocumented behavioral divergence in one control,
not a stated exception.

1. **The correction control ("That's not what I said") behaves differently
   depending on which verdict screen renders it — by accident, and
   confirmed live this round, not just from source.** `docs/sprint-context.md`
   locks the intended behavior: re-opening the correction control after a
   scored verdict "removes that term's already-recorded result before
   returning to record again" — strip, then let the student redo *that
   term*. `screens/Loop/Loop.tsx:658-662` gives `RecallCard` an `onClick=
   {goToNextTerm}` on Success/Flagged, and `renderCorrectionControl()`
   (`Loop.tsx:403-415`) renders its own button *inside* that same card on
   exactly those two verdicts. Neither `Button` (`components/Button/
   Button.tsx`) nor the correction control's own handler calls
   `stopPropagation`, so a tap bubbles to the card and fires **both**
   handlers: strip the result *and* advance past the term.
   **This render pass reproduced it directly, live, in voice mode:**
   completed "Construct validity" with a Success verdict (+15 XP,
   `.eval-screens/round3/loop-voice-transcribing.png` shows the resolved
   card with "That's not what I said" visible), tapped that exact button,
   and the screen did not return to idle for "Construct validity" to
   re-record — it jumped straight to "Confounding variable," a fresh idle
   state for the *next* term, silently discarding the first term's result
   with no way back to it
   (`.eval-screens/round3/loop-correction-control-test.png`). Text mode
   never renders this control at all (`Loop.tsx:404`), so this defect is
   voice-mode-only and was unreachable to any critic without a render tool —
   `critic-ux` traced the exact bubbling mechanism from source and called it
   correctly before this pass confirmed it live. Git history shows this bug
   has existed since the very first build commit (`648c856`) — it is not a
   regression from this round's fixes, it is the deepest-hiding defect found
   across three full eval rounds. **Fix:** call `event.stopPropagation()` in
   the correction control's `onClick` before `handleEditTranscript()`, or
   remove `RecallCard`'s own `onClick` and move the "tap to advance"
   affordance to a sub-region that never contains the correction button.
2. **"No, back to home" is uniformly wired to Hub, not Home — confirmed
   live from the Hub door this round.** All four doors into the Cannot-speak
   sheet label the dismiss action "No, back to home" but route to `/hub`
   (`router.push('/hub')`), never `/`. This render pass tested it directly
   from Hub: tapping "No, back to home" left the URL at `/hub` and simply
   closed the sheet in place — never navigated anywhere, let alone Home.
   `docs/sprint-context.md` says "no" returns home; it doesn't, anywhere.
3. **Loop and Summary are two disconnected screens joined by a query flag**,
   not one continuous flow — `Loop.tsx` builds a real, live `results` array
   all session (`recordResult`/`setResults`) then discards it, pushing only
   `topic` and an `allClear` boolean; `app/summary/page.tsx:16-37` always
   renders one of two hardcoded fixture arrays. Same evidence as UX judgment
   finding 1 below; counted here as an architectural coherence seam.

**Genuine strengths, stated for balance:** `BucketRow` is a well-reasoned,
non-lossy promotion (documented prop differences, not a flattening); back-
affordance iconography (`ChevronLeft` in a Tertiary `ButtonIcon`) is
consistent everywhere it appears; the honest-disabled pattern
(`BucketRow`'s no-`onActivate` treatment) is now applied identically to both
the locked "Read the lesson" row and "Start a new Recall" — this render
pass's Hub screenshots confirm both read as visually inert (dimmed, no
chevron), not just one of the two as in round 2.

### UX judgment — 4/10, capped at 7 (`critic-ux`)

Rubric anchor: this round is not "a Must state missing" (the hint ladder,
dispute, skip, and discard are all genuinely well built) — it's that the
product's core promise (an honest summary; a working correction path) is not
real, live-confirmed twice over.

1. **The Summary a student sees never reflects the session they actually
   ran — confirmed live this round by actually finishing a real 5-term
   session, not shortcutting to `/summary` or skipping.** This render pass
   played a genuine Research Methods session start-to-finish (2 unaided
   successes, 1 flagged dispute, 2 hint-assisted successes) and landed on
   `.eval-screens/round3/summary-01-session-end.png`: "Said it unaided — 1
   term / 15" and "Skipped — 1 term / 0," when the real session had **2**
   unaided terms and **0** skips. `app/summary/page.tsx:16-37` always
   selects between two hardcoded fixture arrays keyed only on an `allClear`
   boolean; the real `results` array `Loop.tsx` builds all session is never
   passed through. This is `docs/SPEC.md`'s own already-flagged Open item
   #12, now independently reconfirmed by both source-read critique and a
   real live playthrough, unresolved across all three rounds.
2. **"Keep going, N terms left" cannot do what it says.** Downstream of
   finding 1: `Summary.tsx`'s partial-state CTA routes to
   `/loop?topic={topic}` with no resume information; `Loop.tsx` always plays
   the full deterministic script from `termIndex = 0`, so "Keep going, 2
   terms left" actually replays the entire 5-term session from scratch,
   identical transcripts included. Contradicts `docs/sprint-context.md`'s
   explicit "resuming starts a fresh session on the remaining unrehearsed
   terms."
3. **The mic-permission primer, a Must-priority row in `docs/
   voice-ux-reference.md`, is still not built — same as round 2, and this
   round's render pass adds a nuance worth recording.** `startRecording()`
   fires `getUserMedia` on the very first tap with no intervening screen; the
   `!hasStarted` "Today: N terms" card is a session-length card, not a
   permission primer. This is a documented decision
   (`docs/SPEC.md:292-296`, "not the intro card, per the interview"), not a
   silent miss. **What the render pass adds:** the *denied* path this
   triggers is genuinely well-built — in this sandboxed browser, getUserMedia
   auto-rejects (no mic device), and the app correctly, immediately routes to
   the Cannot-speak sheet with no dead end, exactly matching
   `voice-ux-reference.md`'s "design the denied state" requirement. The
   primer is still a real, deliberate gap against a document the sprint
   calls binding; the fallback it lacks a primer for is at least handled
   honestly when it fires.
4. **Exiting mid-session still silently discards progress**, against
   `docs/sprint-context.md`'s own commitment to bank partial results on early
   exit. Neither the header back chevron nor the Cannot-speak sheet's "No,
   back to home" persists `results`/`termIndex` anywhere before navigating
   away.

**Genuine strengths, stated for balance:** the hint ladder (Try again + Hint
side by side on Miss/Almost), the 0-XP-honest dispute flow, and Discard's
real re-roll to a different scripted variant are all confirmed live this
round via an actual playthrough — this is a well-designed, non-punitive
failure path exactly per `design-brief.md`'s "judge generously." Text
fallback is reachable from every real door and "Switch back to voice" closes
round 1's original trap (a student who typed once is no longer stuck typing
for the whole session) — confirmed live. No screen shows two competing
Primary actions at once.

---

## Live render pass — flags (fix nothing, report only)

Walked every reachable state of all six screens at 390×844, dark mode, via
real taps — not code edits, and, for voice-mode states, a stubbed
`getUserMedia` that hands off to otherwise-untouched real app code (see
methodology note above). ~30 screenshots saved to `.eval-screens/round3/`.

- **New this round, most severe finding of the scorecard:** the correction
  control's click-bubbling bug (Coherence/UX judgment finding 1 above) —
  reproduced live, screenshotted before and after
  (`loop-voice-transcribing.png` → `loop-correction-control-test.png`).
- **Re-confirmed live, still broken:** Summary is not session-aware, this
  time via a genuine full playthrough rather than a shortcut
  (`summary-01-session-end.png` vs. the actually-played session's real
  outcomes).
- **Re-confirmed live, still broken:** Home's `bottomContent` stacks a chip
  row, a composer, and a full nav bar (`home-01-default.png`) — unchanged
  from round 2, `Home.tsx` untouched in this round's diff.
- **Re-confirmed live, still broken:** "No, back to home" from the Hub door
  leaves the URL at `/hub` and does not navigate anywhere.
- **Fixed, confirmed live:** Hub's "Up next" duplicate-badge bug (round 1's
  original finding, unfixed in round 2) — selecting Legal studies now shows
  exactly one "Up next" badge; Research Methods correctly falls back to
  "0 of 5" (`hub-01-default.png`, `hub-02-legal-selected.png`).
- **Fixed, confirmed live:** the Cannot-speak sheet now shows Knowie's mascot
  above the sheet from every door tested (Loop's cold-permission-denial path,
  Hub's explicit escape button) — round 2's `critic-ambition` finding, now
  resolved (`loop-03-recording-live.png`, `hub-03-sheet-open.png`).
- **Fixed, confirmed live:** both "Read the lesson" and "Start a new Recall"
  on Hub now read as consistently, honestly inert — dimmed text, no trailing
  chevron on either (`hub-02-legal-selected.png`). Round 2 found only one of
  the two treated this way.
- Real voice-mode Recording, captured live for the first time across all
  three rounds via the `getUserMedia` stub: a genuine live, per-bar magenta
  waveform, Discard/Pause/Submit controls, "Listening" caption
  (`loop-voice-recording-live.png`).
- Everything else checked — verdict Success/Miss/Almost/Flagged, hint reveal,
  dispute-confirm, text-mode entry/send, Home default vs. dismissed, Recall
  history's three-bucket grouping — rendered as distinct, correct states with
  no other collision or dead end found.

---

## critic-ambition's read — 6/10 (kept separate, not part of the total above)

Non-adversarial; scores how far the design reaches beyond the safe, compliant
choice, not correctness. Per its own calibration, 5 is the ceiling for "every
rule followed, no real risk taken" — this clears it via the same three real
departures round 2 already credited (the live per-bar waveform, Miss
withholding what's missing rather than handing over the answer, XP paid at
each verdict rather than deferred to Summary) plus a newly-credited one, the
Wait-state `Spinner` reuse being a *correctly argued* departure even though
`critic-craft` separately flags it as generic chrome (both are right — it's a
real technique, applied to the wrong moment). It doesn't clear 7 because two
of the sprint's highest-leverage screens still reach for a hand-rolled
solution where a real, already-built, already-storied component sits unused
nearby:

1. **Loop's session-start screen (`hasStarted === false`) hand-rolls a
   `<div>` + bare `TextBlock` instead of instantiating `SessionHero`'s own
   `align="Center" surface="None"` combination — the literal, already-storied
   version of this exact screen.** `screens/Loop/Loop.tsx:313-347` uses a
   custom flexbox `<div>` with an unlabelled, non-keyboard-reachable
   full-bleed `onClick`, and Knowie is entirely absent — the one screen in the
   whole Loop flow where the mascot never appears. `components/SessionHero/
   SessionHero.stories.tsx:141-157`'s `CenterNone` story is named `'Center,
   None (session entry)'` with args matching this exact moment
   (`headline: '5 terms from Research Methods'`, `body: 'About 3 minutes'`,
   a real `mascot` slot). `docs/design-system.md` names `sessionHero`'s job
   list explicitly as covering "session entry, the first-run intro." **Fix:**
   replace the hand-rolled block with `<SessionHero align="Center"
   surface="None" .../>`, move "tap to start" into `bottomContent` as a real
   `Button variant="Primary" cta="Start"` (keyboard-reachable, unlike the
   current bare div), matching the pattern `Loop.tsx` already uses everywhere
   else in the same file.
2. **The Almost verdict's "You had: ..." partial-credit line is a bare,
   unlabelled `<p>` where the file already imports the component built for
   exactly this.** `screens/Loop/Loop.tsx:558-562` — no heading names what
   this text is, sitting directly above a properly-labelled `RecallBlock`
   ("You said") doing the visually identical job one line below.
   `components/RecallBlock/RecallBlock.tsx`'s `Hint` variant is already
   imported and used two branches later in this same file (`Loop.tsx:605`)
   for actual hints, and its accent blue is the same blue `VerdictBadge`'s
   `Almost` variant already uses — reusing it here wouldn't introduce a new
   color relationship, it would make an existing one reappear coherently.
   **Fix:** `<RecallBlock variant="Hint" label="What you had right"
   body={attempt.had} />` in place of the bare `<p>`; the critic notes this
   reuses `Hint` for a second, related-but-distinct meaning (disambiguated
   only by label text, never co-occurring on screen), a real trade worth
   weighing rather than a free win.

**Blind spot named by this critic:** whether `SessionHero`'s token-governed
vertical rhythm actually centers as pleasingly as the current hand-tuned flex
layout, and whether reusing `accent/blue/subtle` twice in one Almost card
(badge + hint block) would read as a deliberate unifying echo or as two blue
rectangles competing for attention, are live-feel judgments unverifiable from
source. (This render pass did not specifically test either proposed
component swap, since both are proposals for code that doesn't exist yet —
noted as an open question for whoever picks this up.)