# Scorecard 02

Screens graded: Cannot-speak sheet, Summary, Hub (+ Recall history), Loop, Home.
Rubric: `eval/rubric.md`. Method: same protocol as `eval/scorecard-01.md` — a live
render pass (this session, Chrome DevTools MCP, 390×844 dark mode, every reachable
state, done first and independently of the critics) followed by four critic agents
run in isolated contexts — `critic-system`, `critic-craft`, `critic-ux`
(adversarial, each blind to the others' output, to this render pass, and to
`scorecard-01.md`) and `critic-ambition` (non-adversarial). No critic saw another
critic's findings, this render pass, or a score from anyone. All five ran as
background agents launched in parallel.

**One methodological note on this round:** the render pass initially failed twice
— a stale `chrome-devtools-mcp` browser profile lock left over from unrelated,
days-old sessions blocked every attempt to launch a browser, for both the render
agent and, when I tried directly, this session's own browser too. Killing the
orphaned processes required explicit user authorization (the sandbox's auto-mode
classifier denies `kill` on its own); once granted, the render pass ran clean.
Flagged here because it means the render pass landed *after* all four critics had
already reported — order that doesn't affect independence (critics never see
render output regardless of sequence) but is worth being honest about.

**Verdict: fails**, same as round 1 — the contrast hard gate still fails, and per
the rubric that fails the submission regardless of dimension scores. But this
round is a real, verified improvement on round 1: 3 of 4 hard gates now pass
(vs. 1 of 4), including the specific state-distinctness defects round 1 caught
being fixed and independently re-verified live this round.

---

## Total

**5.7 / 10**, weighted — up from round 1's 4.6/10.

Same judgment call as round 1: the rubric gives an ordinal weight order, not
numeric weights. High dimensions ×3, Medium ×2, Low ×1, averaged.

| Dimension | Weight | Score /10 |
|---|---|---|
| System fidelity (High) | ×3 | 6 |
| Coherence (High) | ×3 | 6 |
| Craft (High) | ×3 | 6 |
| UX judgment (High) | ×3 | 5 |
| Accessibility (Medium) | ×2 | 5 |
| Structure (Low) | ×1 | 6 |

(6×3 + 6×3 + 6×3 + 5×3 + 5×2 + 6×1) / 15 = 85/15 = **5.7**

Every score above comes from one adversarial critic working blind, in its own
context, with `Read`/`Grep`/`Glob` only — none had a render tool. Per the
rubric's own scoring rule that caps every score at 7 regardless of source
quality; all six land below that cap on the evidence itself.

**critic-ambition's read: 6/10 — kept separate, does not feed the total above.**
See its own section at the bottom.

---

## Hard gates

| Gate | Result | vs. round 1 |
|---|---|---|
| Contrast ≥ 4.5:1 for all body text | **FAIL** | still fails, now with more instances found |
| Touch targets ≥ 44pt on every interactive control | **PASS** | fixed |
| No raw hex color in component source (`check:tokens`) | PASS | unchanged (already passing) |
| No two states that should differ ever render identically | **PASS** | fixed |

- **Contrast — FAIL, and now shown to be broader than round 1 caught.**
  `critic-craft` hand-computed real WCAG contrast from the actual token hex
  values in `build/css/tokens.css`: `--color-text-disabled` resolves to
  `rgba(255,255,255,0.4)` (`build/css/tokens.css:54,193`); blended over
  `--color-background-surface` (`#22242f`) that's **≈3.64:1**, matching (within
  rounding) the **3.69:1** the project's own real axe-core run already
  documented for this exact pairing in `docs/design-system.md:190-202` — good
  cross-check that the hand computation is sound. Blended over
  `--color-background-page` (`#090c18`) it's **≈3.78:1** — also under the 4.5:1
  floor.
  Round 1's specific fix (`RecallHub.tsx`'s locked row: move the dim from
  title to subtitle) **was applied** — I confirmed directly,
  `screens/Hub/RecallHub.tsx:231-233` now has `titleColor` on `text/secondary`
  and `subtitleColor` on `text/disabled`, exactly as scorecard-01 prescribed.
  But that fix only moved *which* text takes the hit — the underlying token
  itself still fails contrast wherever it's used as legible body copy, and
  `critic-craft` found it recurring in at least three more live, reachable
  spots beyond the one round 1 caught:
  - `components/RecordControl/RecordControl.tsx:274,279,281,286` — Discard/
    Pause/Resume/Submit go `state="Disabled"` (this same failing pairing) for
    the ~900ms Transcribing beat on **every single answer**, per
    `screens/Loop/Loop.tsx:470-480`.
  - `screens/Hub/RecallHub.tsx:241` — "Read the lesson" (Tertiary, Disabled).
  - `screens/Loop/Loop.tsx:313-320` — the Skip button, Tertiary/Disabled
    during Recording/Transcribing, over `background-page` (TopBar has no fill
    of its own).
  **Fix, aimed at the root cause this time, not another per-instance patch:**
  stop routing disabled-control labels and dimmed body text through the same
  `text-disabled` token — it was designed as a "not currently actionable"
  tint, not something that should ever need to clear AA on its own. Either add
  a new token step measured to ≥4.5:1 against both real backgrounds, or make
  disabled controls dim via reduced opacity on the whole control rather than
  isolated text/icon color.

- **Touch targets — PASS, fixed since round 1.** All three round-1 failures
  are gone, and `critic-craft` independently re-confirmed each against real
  `tokens.json`/component values without being shown round 1's findings:
  - `Navbar` tabs: `components/Navbar/Navbar.tsx:64-68` now pads explicitly to
    48px, with an in-file comment citing the 44pt rule directly.
  - Home's Recall chip: per `docs/SPEC.md`'s "Touch target, 2026-09-17" note,
    the real tap target is now a `<button>` padded to `control-600` (48px)
    wrapping the unchanged-looking 32px `Chips` visual — the same
    invisible-padding technique `ButtonIcon` already used.
  - `ChatInput`'s send/mic button: `components/ChatInput/ChatInput.tsx:137-145,
    260-266` explicitly bumped from Figma's real 40px to 48px, with a comment
    citing this exact gate.
  `critic-craft` also checked every other interactive control it could reach
  (`ButtonIcon` S/M, `Button` S/M/L) and found all ≥48px. No new sub-44px
  control was found by any critic this round.

- **No raw hex — PASS, unchanged.** Ran `npm run check:tokens` directly: exit
  0, zero matches. `critic-system`'s independent grep across `components/`
  *and* `screens/` (wider than the script's own `components/`-only scope, a
  gap it flagged in its own findings below) also returned zero hits.

- **No two states render identically — PASS, and this is the one gate result
  actually strengthened by a live render this round, not just a code read.**
  Round 1 failed this gate on two grounds: Recording vs. Transcribing being
  visually near-indistinguishable, and Wait's "Checking" status and the
  correction control appearing together instead of as sequential sub-phases.
  This round's render pass walked the real state machine by tapping through
  it (390×844, dark mode) and screenshotted every state, then diffed the
  specific pairs round 1 flagged:
  - Recording vs. Transcribing vs. Paused: now genuinely distinct — live pink
    bars + 3 enabled controls (Recording) vs. frozen white-grey bars + all 3
    controls visibly disabled + "Transcribing" caption (Transcribing) vs.
    static bars + a swapped Resume icon + "Paused" caption (Paused).
  - Wait "Checking" vs. the correction-control sub-phase: now sequential and
    distinct — a spinner + "Checking" text alone, then a pencil icon +
    "That's not what I said" button with no spinner, never both at once.
  - Also checked (not previously flagged, confirmed clean): verdict Success
    vs. Flagged (green check + "Got it" + purple XP pill vs. grey info-circle
    + "Flagged for review," no XP pill, extra "Sent..." caption) and verdict
    Miss vs. Almost (orange warning-circle vs. blue info-circle + an extra
    "You had:" line).
  No pair came out identical when the underlying state had genuinely changed.
  **Related, not identical, so not counted toward this gate — same pattern as
  round 1's own "Up next" finding, still present:** the render pass caught
  `screens/Hub/RecallHub.tsx` showing "Up next" on *two* rows again after a
  selection change. Traced to source: `TOPIC_ROWS[0]` (research-methods) has a
  hardcoded `badge: 'Up next'` (`RecallHub.tsx:61`) used as its own fallback
  label once deselected (`RecallHub.tsx:221`: `text={isSelected ? 'Up next' :
  row.badge}`) — so after selecting Legal studies, Legal studies' `Chips` pill
  correctly goes active/"Up next" while Research Methods' now-inactive pill
  *also* reads "Up next," just in the inactive fill. Two chips, different
  active state, identical text, both real components (not a frozen/broken
  render) — a stale content default, not a distinctness-gate failure, but
  round 1's exact recommended fix (give `research-methods` a neutral fallback
  badge, matching the other three topics' own count-based badges) **was never
  applied**. **Fix, unchanged from round 1:** give `TOPIC_ROWS[0]`'s `badge` a
  neutral default (e.g. a term count, matching Cell biology/Legal studies'
  own pattern) instead of reusing the active-state label.

**Also render-confirmed, not a hard gate but worth recording alongside the
"Up next" finding above since both are the same root problem (mock data that
doesn't track real session state):** `critic-ux` independently found from
source, and the render pass independently confirmed live, that the
end-of-loop Summary is not session-aware at all. Skipping the real, final
term of an actually-played session (`loop-13-skip-to-summary.png`) produced a
result list identical to the standalone `/summary` route's hardcoded
`PARTIAL_RESULTS` — crediting "Confounding variable" as "Said it after a
hint" when the real run resolved it cleanly via a Discard-reroll with no
hint, and naming "Sampling bias" as skipped when the real run actually
skipped "Random assignment" (which isn't even a Research Methods term). This
is `docs/SPEC.md`'s own already-flagged Open item #12, confirmed still live
in both the code and the render.

---

## Per-dimension findings

Each finding is the critic's own claim, condensed, with file:line evidence as
each critic gave it.

### System fidelity — 6/10, capped at 7 (`critic-system`)

Tool disclosure, stated by the critic itself: only `Read`/`Grep`/`Glob` were
actually reachable, despite MCP instructions suggesting more — every claim
below is a source read, not a render.

1. **The row/`NEW` shape is still triplicated and still unpromoted — this is
   now the second scorecard in a row to find it.** `screens/Summary/
   Summary.tsx:75-132` (`ResultRow`), `screens/Hub/RecallHub.tsx:105-179`
   (`HubRow`), `screens/Hub/RecallHistory.tsx:78-125` (`TermRow`) — identical
   anatomy, identical spacing tokens. `docs/component-gaps.md:58-77` names
   this itself as unresolved, and cites the project's own promotion rule
   (correctly applied to `ScaffoldHeader`) as the standard this triplication
   should have triggered. **Fix:** extract `components/BucketRow/
   BucketRow.tsx` with `{icon, iconColor, title, subtitle, trailing?}`, same
   move already made for `ScaffoldHeader`.
2. **`Scaffold`'s own root dimensions are hand-typed and unflagged**, unlike
   every comparable literal elsewhere in the same file tree —
   `components/Scaffold/Scaffold.tsx:87-88` hardcodes `width: '390px',
   height: '844px'` with no acknowledging comment, where `TopBar`'s identical
   390 width *is* explicitly flagged (`docs/design-system.md:472-478`).
   **Fix:** add a parallel doc-comment to `Scaffold.tsx`, or promote a real
   device-size token pair and bind both files to it.
3. **The enforcement gate itself only covers half the codebase.**
   `check:tokens` (`package.json:10`) greps `components` only, never
   `screens/` — today cosmetic (nothing hand-typed found there), but an
   unflagged blind spot in a hard rule whose own phrasing ("in
   `components/`") quietly concedes it.
4. Zero raw-hex/CSS-fallback hits across `components/` and `screens/` —
   independently confirmed by this critic's own grep, matching my direct
   `check:tokens` run above.

**Blind spot named by this critic:** everything above is inferred from
JSX/CSS-in-JS source, never rendered — most consequentially, whether Home's
stacked `bottomContent` (see Structure #1 below) actually reads as broken or
fine at 390×844 is unknown from source alone.

### Structure — 6/10, capped at 7 (`critic-system`)

1. **Home's `bottomContent` still stacks three elements where the scaffold's
   own doc says it holds exactly one** — `docs/design-system.md:122-125`,
   "the thumb zone... one of those three, never two," and
   `docs/design-system.md:449-452` names this exact screen as the one that
   already breaks it. `screens/Home/Home.tsx:127-191` stacks a `Chips` filter
   row, a `ChatInput` row, and a full 5-tab `Navbar` in one `bottomContent`.
   Admitted in the project's own docs, not fixed. **Fix:** move the `Chips`
   row into `middleContent` (it's page content, not a bottom action); either
   drop `Navbar` from this slot or define a real scaffold variant for
   screens that need more than the documented three.
2. All five screens sit on a real `<Scaffold>` root; no broken import or
   unclosed JSX found on a direct read of all five files.

**Blind spot named by this critic:** no render tool — Home's stacked
`bottomContent` is a confirmed rule violation from source, but whether it
actually crowds/overflows at 390×844 (which would push this toward a 4) is
unconfirmed from source math alone. (The render pass this round did not
specifically screenshot Home's bottom region at full detail to settle this —
worth a targeted follow-up.)

### Craft — 6/10, capped at 7 (`critic-craft`)

Tool disclosure, stated by the critic itself: only `Read`/`Grep`/`Glob` were
reachable; contrast numbers are hand-computed WCAG math from real token hex
values, not a browser-measured pass.

1. **`TermPip`'s three progress states are still color-only**, on screen for
   every session — `components/TermPip/TermPip.tsx:38-42`, `Done`/`Current`/
   `Upcoming` share the identical pill shape, differing only by
   `background`. Same defect scorecard-01 found, unfixed. **Fix:** a
   check-glyph overlay for `Done`, a distinct border/ring for `Current`.
2. **Disabled controls dim color only, no shape/icon change** — the exact
   risk pair `design-system.md` rule 10 names ("a disabled primary button and
   an enabled secondary one"). `components/shared/resolveButtonColors.ts:
   21-30,33-43`; live instances at `screens/Hub/RecallHub.tsx:241` and
   `screens/Loop/Loop.tsx:316-319`. **Fix:** pair the dim with a second
   signal (e.g. a lock glyph), not color alone.
3. **The Wait/"Checking" beat borrows the generic `Button` loading `Spinner`**
   rather than a bespoke "the judge is thinking about your answer" treatment
   — `screens/Loop/Loop.tsx:489-509` (the file's own comment already
   self-diagnoses the original dead-state problem, then patches it with
   `components/shared/Spinner.tsx:13-29`, the same spinner used for any
   unrelated button's loading state). Real motion, but borrowed chrome, not a
   state-specific identity. **Fix:** a Wait-specific visual (e.g. pulsing
   dots inside `RecallBlock`, or an animated ellipsis) distinct from generic
   button loading.

**Genuine strengths, stated by the critic for balance:** `RecordControl`'s
per-bar sine-wave amplitude animation has real per-bar phase/frequency
variance, not a looping repeat; `VerdictBadge`'s five variants tie
color+glyph+label together with no override path, exactly Principle 1's ask.

**Blind spot named by this critic:** cannot confirm the amplitude animation
actually *reads* as calm rather than jittery in motion, or whether the
700ms Wait spinner reads as "thinking" vs. "broken" — felt-quality judgments
only a live render settles.

### Accessibility — 5/10, capped at 7 (`critic-craft`)

1. Contrast failures — see Hard gates above (same findings, this is their
   home dimension); this round found the failing token pairing in at least
   four live locations, not the one round 1 caught.
2. **Color-only signal, again:** `TermPip` (same citation as Craft #1) is
   real, load-bearing progress information, not decoration — a second,
   independent hit against design-system.md rule 10.
3. **What passed, stated by the critic for balance:** every touch target
   checked cleared 44px (see Hard gates above), and every icon-only control
   found (`ButtonIcon`, `ChatInput`'s icons, `Navbar` tabs) carries a real
   `aria-label`.

**Blind spot named by this critic:** contrast numbers are a hand-computed
approximation from token hex values, not a browser-rendered, anti-aliased
measurement — a real `test-run` (axe-core) pass, which wasn't reachable to
this critic, would be authoritative instead of a calculation.

### Coherence — 6/10, capped at 7 (`critic-ux`)

1. **"No, back to home" means four different things**, with no comment
   reconciling the split: `screens/CannotSpeak/CannotSpeakSheet.tsx:61-62`
   actually navigates (`router.push('/hub')`); `screens/Hub/RecallHub.tsx:
   307-309`, `screens/Hub/RecallHistory.tsx:257-262`, and `screens/Loop/
   Loop.tsx:690` all just close the sheet in place, leaving the student
   wherever they already were. `docs/SPEC.md:61` documents "returns to Hub" —
   true for 1 of 4 real instances.
2. **Two rows are both documented as inert, but only one honestly looks it.**
   `RecallHub.tsx:228-243` ("Read the lesson") uses a real disabled-state
   `Button` specifically so it doesn't look live — its own comment says so.
   `RecallHub.tsx:245-254` ("Start a new Recall") has an identical trailing
   chevron to the fully-live row two lines below it, with no `onActivate` at
   all — the honest-disabled precedent set two rows up wasn't applied here.
3. **Summary has no back control and no stated reason** — `Summary.tsx:208`
   (`TopBar variant="Centered"`) vs. Hub/Recall history's labeled
   `ScaffoldHeader` and Loop's own (justified-by-comment) bare chevron.
   Possibly intentional as a terminal screen, but not stated anywhere.
4. **The triplicated row shape** (same finding as System fidelity #1 above,
   counted here as a Coherence seam: three one-offs built before anyone
   noticed they were the same shape).

**Blind spot named by this critic:** could not confirm how any of this feels
live — whether a real student would even notice the "No, back to home"
divergence, or whether the missing back control on Summary reads as
deliberate or broken in practice.

### UX judgment — 5/10, capped at 7 (`critic-ux`)

1. **The mic-permission primer (a voice-ux-reference.md Must) does not exist
   anywhere in this codebase, and this is a documented decision, not a gap.**
   `docs/voice-ux-reference.md` Principle 3 requires priming before the OS
   dialog fires; `docs/sprint-context.md:18-19` even specs a real "Intro
   card" design for it. Grepping `screens/` finds no trace — instead,
   `screens/Loop/Loop.tsx`'s `!hasStarted` branch shows only "Today: N
   terms... tap to start," and the very next tap fires `getUserMedia` cold.
   `docs/SPEC.md:282-284` confirms this is deliberate ("not the intro card,
   per the interview"). Per the rubric, a missing Must state is sufficient
   for a 4 on its own.
2. **Summary's "Keep going" silently drops the student's real topic and
   progress** — `screens/Summary/Summary.tsx:271`, a bare
   `router.push('/loop')` with no `topic` param, so `Loop.tsx:73` always
   falls back to `research-methods` regardless of what was actually being
   studied. This is the same defect the render pass independently confirmed
   live this round (see Hard gates, "Also render-confirmed" note above) —
   `docs/SPEC.md`'s own Open item #12.
3. **The project's own "progress shouldn't evaporate" decision is
   unimplemented, and back defeats it.** `docs/sprint-context.md:52` commits
   to banking partial results on early exit; `results` is local
   `useState` in `Loop.tsx:86` with zero persistence, and the back chevron
   (`Loop.tsx:296-304`) does a bare `router.push('/hub')` with no
   confirmation or handoff. Hub's badges (`'Up next'`, `'1 of 6'`, `'0 of
   4'`) never reflect anything that actually happened in a session.
4. **A fake affordance that goes nowhere** — same citation as Coherence #2
   (`RecallHub.tsx:245-254`), counted here as a UX-judgment issue: a student
   has no way to tell a dead row from a live one before tapping it.

**What's handled well, stated by the critic for balance:** every branch of
the Loop state machine was traced with no dead ends and no doubled-up
primaries; miss-recovery is genuinely generous (every scripted variant
resolves by the second attempt; Almost shows only what the student had,
never what's missing, per the brief's "judge generously" mandate, cited
directly in a `Loop.tsx` comment).

**Blind spot named by this critic:** could not confirm how any of this feels
in motion — whether the ~700ms Checking beat reads as "an answer is coming"
or a blink-and-miss-it flash, or whether the raw OS permission dialog firing
with zero on-screen lead-in feels jarring in practice.

---

## Live render pass — flags (fix nothing, report only)

Rendered every reachable state of all five screens at 390×844, dark mode,
via real taps (not code edits); ~32 screenshots saved to
`.eval-screens/round2/`. Every distinctness pair round 1 flagged, plus every
pair explicitly requested this round, was checked. Results:

- **Fixed since round 1, confirmed live:** Recording/Transcribing/Paused are
  now genuinely distinct; Wait's Checking and correction-control sub-phases
  no longer co-occur. See Hard gates above for the detail — this is the
  headline change between the two scorecards.
- **Flag, unfixed since round 1:** Hub shows "Up next" on two rows
  simultaneously after switching topic selection (round 1's exact finding,
  same root cause, fix never applied). See Hard gates above.
- **Flag, newly confirmed live this round (previously only a source-read
  finding):** the end-of-loop Summary reached by actually finishing/skipping
  a real session shows the same static, hardcoded result set regardless of
  what was actually said, discarded, hinted, or skipped in that real
  session. See Hard gates above.
- Everything else checked — verdict Success vs. Flagged, Miss vs. Almost,
  the cannot-speak sheet rendered from all three doors (Hub, Loop, standalone
  route), Home default vs. dismissed — came out properly, visibly distinct.
  No other pair rendered identically when the underlying state had changed.

---

## critic-ambition's read — 6/10 (kept separate, not part of the total above)

Non-adversarial; scores how far the design reaches beyond the safe,
compliant choice, not correctness. Per its own calibration, 5 is the ceiling
for "every rule followed, no real risk taken"; this clears that via three
real departures from the safe default: the live, non-repeating per-bar
waveform (`components/RecordControl/RecordControl.tsx`), Miss deliberately
withholding what's missing rather than handing over the answer
(`screens/Loop/Loop.tsx:564-573`), and XP paid out at the moment of each
verdict rather than deferred to one summary reveal
(`screens/Loop/Loop.tsx:529-532`). It doesn't clear 7 because at three
specific moments where the product is telling the student something
important, it reached for a hand-rolled re-implementation over a real,
already-built component sitting in the same file:

1. **Summary's result rows re-invent `VerdictBadge`'s own
   variant→{glyph, color, label} pattern instead of instantiating it.**
   `screens/Summary/Summary.tsx:75-132,154-162` hand-builds a leading icon +
   hardcoded color per outcome string — its own comment at `Summary.tsx:48`
   admits it's "following `VerdictBadge`'s existing pattern," not using it.
   `VerdictBadge`'s five real variants line up almost exactly with Summary's
   outcome strings (`Flagged`'s default label is the literal `"Flagged for
   review"`, an exact match). **Fix:** each `ResultRow` leads with a real
   `<VerdictBadge variant={...} label={...} />` in place of the bare
   `IconSlot`, so Loop and Summary render the identical visual object for
   "what happened."
2. **Loop's dispute-confirm prompt hand-rolls the exact shape
   `RecallBlock`'s `Confirm` variant was built for.**
   `screens/Loop/Loop.tsx:626-636` manually sets font-weight/color on two
   bare `<p>` tags to get a heavier-label/lighter-body pairing that
   `RecallBlock`'s own `Confirm` variant already encodes natively — a variant
   `design-system.md` itself says was built from "the real dispute confirm
   reference instances," i.e. this exact moment. **Fix:** replace with
   `<RecallBlock variant="Confirm" label="..." body="..." />`.
3. **The Cannot-speak sheet is the one screen where Knowie never appears —
   at the exact moment a student is hitting a wall.**
   `screens/CannotSpeak/CannotSpeakSheet.tsx:44-69` has no mascot, unlike
   every other place Knowie speaks to the student (Home's `KnowieMessage`,
   Loop's Peek mascot through every recording state, Summary's all-clear
   hero). `Scaffold`'s `bottomSheetOnly` slot already holds more than one
   child by design. **Fix:** add a `<MascotSlot size="XL" crop="Full">`
   (the same pairing already used at `Loop.tsx:367-369` and
   `Home.tsx:112`) as a sibling above `<Sheet>` in the same slot.

**Blind spot named by this critic:** the live waveform and the generous-Miss
copy are both read as real risk from source, but never rendered — whether
the waveform reads as calm or jittery, and whether five `VerdictBadge` pills
down Summary's list would read as continuity with Loop or as visually loud
at that density, are live-feel judgments this pass can't settle.
