# Scorecard 04

Screens graded: Home, Recall hub, Recall history, Loop (voice + text), Summary.
Rubric: `eval/rubric.md`. Method: same protocol as rounds 1–3 — a live render
pass (this session, Chrome DevTools MCP, 390×844 dark mode, every reachable
state) run concurrently with four blind critic agents in isolated contexts —
`critic-system`, `critic-craft`, `critic-ux` (adversarial, each blind to the
others' output, to this render pass, and to every prior scorecard) and
`critic-ambition` (non-adversarial, same blindness). All four ran as
background agents launched in parallel with Read/Grep/Glob only — no render
tool was exposed to any of them this round either, so every critic score is
independently capped at 7 by the rubric's own verification rule regardless
of source quality.

Graded against `HEAD` (`412d810`, 2026-09-19), the committed tree as it sits
right now — no uncommitted changes were present at the start of this round
(`.eval-screens/` is the only untracked path, and is this eval's own output
directory, not app code). This is the first round graded against a fully
committed tree rather than an in-progress working directory: round 3's own
commit (`583e4c9`) bundled its scorecard together with fixes for
round 3's own findings (Summary session-awareness, the correction-control
bug, Scaffold's viewport fit, "No, back to home" routing), and a follow-up
commit (`412d810`) further cleaned up Hub and Recall history's row content
and counts. This round is a fresh, independent audit of that settled state.

**Methodological note:** the render pass hit the same stale
`chrome-devtools-mcp` browser-profile lock rounds 2 and 3 both documented —
this time from a second, still-running Claude Code session's orphaned
process (PID 69735, alive since 10:07AM the same day). Same fix as prior
rounds: killing the orphaned process and its Chrome instance required
explicit user authorization, granted, after which the render pass ran
clean. As in round 3, reaching real live-voice states required stubbing
`navigator.mediaDevices.getUserMedia` (a fake, immediately-stopped
`MediaStream`, mirroring what `Loop.tsx` already does with a real stream —
nothing downstream depends on real audio, since the whole recall is
mocked per `CLAUDE.md`). **New this round:** a second tap of the mic hit a
real, unstubbed browser-permission check (`navigator.permissions.query`),
which this headless environment's actual OS state answers `denied` (no
microphone device) — this is not a bug, it's the app's own documented
"a later tap where permission was already revoked... routes to the
Cannot-speak sheet" path firing correctly and unprompted, live-confirmed.
`navigator.permissions.query` was patched to `granted` to continue
exercising later voice states after that was confirmed.

**Verdict: the hard-gate sweep round 3 called "the first clean pass across
three rounds" breaks again this round.** Three of four gates hold
(contrast, touch targets, no raw hex — all directly re-run or re-measured
live), but the fourth — **no two states that should differ ever render
identically** — fails on a genuine, previously-undetected defect this
render pass reproduced twice, live: tapping "Hint" on an **Almost** verdict
renders a `VerdictBadge` labeled **"Not yet" (Miss)**, not Almost, with an
**empty** hint body, because `screens/Loop/Loop.tsx`'s `hintRevealed` state
always renders `variant="Miss"` and every `Almost` variant in
`screens/Loop/script.ts` was written without a `hintBody` — a genuine Miss's
hint-reveal screen and an Almost's are now visually indistinguishable,
live-reproduced, not source-inferred. Per the rubric's own rule, **any
failed gate fails the submission regardless of dimension scores** — so
whatever this round's weighted total below reads as, the submission does
not clear this round on the rubric's own terms, exactly as round 1 and
round 2 didn't.

---

## Total

**5.6 / 10**, weighted — **not directly comparable to rounds 1–3's totals**
(4.6 / 5.7 / 5.0): this is the first round with real, live-measured evidence
for **Delivery-surface fidelity** (added to `eval/rubric.md` in round 3 but
never actually folded into round 3's own combining table — its "Total"
section still only summed six dimensions at weight 15). This round measured
it directly (see below) and includes it, so the weight base changes from 15
to 17. Read the per-dimension deltas below, not the single number, if
comparing to prior rounds.

Same judgment call as rounds 1–3: the rubric gives an ordinal weight order,
not numeric weights. High dimensions ×3, Medium ×2, Low ×1, averaged.

| Dimension | Weight | Round 3 | Round 4 | Δ |
|---|---|---|---|---|
| System fidelity (High) | ×3 | 6 | 7 | +1 |
| Coherence (High) | ×3 | 4 | 6 | +2 |
| Craft (High) | ×3 | 6 | 4 | **−2** |
| UX judgment (High) | ×3 | 4 | 4 | — |
| Accessibility (Medium) | ×2 | 5 | 5 | — |
| Delivery-surface fidelity (Medium) | ×2 | *not scored* | 9 | *new* |
| Structure (Low) | ×1 | 5 | 4 | −1 |

(7×3 + 6×3 + 4×3 + 4×3 + 5×2 + 9×2 + 4×1) / 17
= (21+18+12+12+10+18+4) / 17 = 95/17 = **5.59 ≈ 5.6**

Every High/Medium/Low score above starts from one adversarial critic
working blind, in its own context, Read/Grep/Glob only, capped at 7 by the
rubric's own rule. Where this round's live render pass could independently
verify, refute, or add to a finding, that's marked inline below —
including two genuinely new, severe defects **no critic found**, because
neither is visible from source alone (both require actually running a
session and watching what renders).

**critic-ambition's read: 6/10 — kept separate, does not feed the total
above.** See its own section at the bottom.

---

## Hard gates

| Gate | Result | vs. round 3 |
|---|---|---|
| Contrast ≥ 4.5:1 for all body text | **PASS** | unchanged — re-ran `npm run check:contrast` directly: all 21 real token pairings clear 4.5:1 |
| Touch targets ≥ 44pt on every interactive control | **PASS** | unchanged — live-measured via `getBoundingClientRect()` on every rendered button on Home and Loop's Idle/Recording states: 48–56px across the board, none under 44pt |
| No raw hex color in component source (`check:tokens`) | **PASS** | unchanged — re-ran `npm run check:tokens` directly: exit 0, zero matches across `components`, `screens`, `app` |
| No two states that should differ ever render identically | **FAIL** | **regression — round 3 was the first round to clear this gate; round 4 breaks it** |

**The distinctness failure, in detail — reproduced live, not inferred from
source.** `screens/Loop/Loop.tsx:565-585`: Miss and Almost verdicts share
an identical `Try again` + `Hint` action pair (the file's own comment calls
this out as a deliberate, Figma-confirmed choice — "Identical action pair
on both Miss and Almost"). But the `hintRevealed` state that `Hint`
transitions to is verdict-blind: it always renders
`&lt;VerdictBadge variant="Miss" label={VERDICT_LABEL.miss}&gt;` and pulls
`variant.hintBody ?? ''` — and grepping `screens/Loop/script.ts` confirms
**every one of its 16 `hintBody` definitions sits on a `miss`-verdict
attempt; none of the file's 5 `almost`-verdict attempts defines one.** This
render pass reproduced it directly on Research Methods' "Internal
validity" (an Almost term): submitted a real recording
(`.eval-screens/round4/loop-10-verdict-almost.png` — a correctly-labeled
blue "Almost" badge with real "You had:"/"You said" content), tapped
"Hint," and got `.eval-screens/round4/loop-11-hint-revealed.png` — an
orange-red "Not yet" (Miss) badge with nothing under it but the "Hint"
label itself. **A genuine Miss's hint-reveal screen (same badge, real hint
text) and an Almost's (same badge, blank) are now indistinguishable except
by the absence of text** — and since the badge itself is wrong (Almost
downgraded to Miss's visual identity), a student who was one word away from
a correct answer sees the exact same "you got it wrong" framing a student
who missed entirely would, at the one moment they asked for help. This is
systemic, not a one-term fluke — no `almost`-verdict variant in any of the
five topics in `script.ts` has a `hintBody`, so this fires on **every**
Almost term in the app, every session, whenever a student taps Hint instead
of Try again. **Fix:** either (a) give every `almost` variant a real
`hintBody` and render `VerdictBadge variant={isMiss ? 'Miss' : 'Almost'}`
in the `hintRevealed` case (matching how the verdict card itself already
branches on `isMiss` one state earlier), or (b) if Hint is only ever meant
to apply to a genuine Miss, hide the `Hint` action on Almost verdicts
entirely and route "Try again" as the sole recovery action there — either
is a real design decision, not a mechanical patch, since the current code
explicitly documents offering both actions on both verdicts as intentional.

---

## Per-dimension findings

Each finding is the critic's own claim, condensed, with file:line evidence
as each critic gave it. Where this session's live render pass could
independently confirm, refute, or add to a finding, that's noted inline.

### System fidelity — 7/10, capped at 7 (`critic-system`)

Tool disclosure, stated by the critic itself: only Read/Grep/Glob were
reachable, no render — "on the strength of the code alone, this project's
documentation discipline is close to the rubric's 9-tier description;
without rendering, it is capped at 7." This render pass rendered every
screen in scope and found no additional undocumented token/component
violations beyond what the critic already names below, so the cap, not a
merits gap, is what holds this at 7.

1. **The row-shape triplication flagged in rounds 1–2 stays fixed, live-
   confirmed.** `components/BucketRow/BucketRow.tsx` is used identically by
   `Summary.tsx`, `RecallHub.tsx`, and `RecallHistory.tsx` — this round's
   screenshots of all three show one consistent row anatomy.
2. **Hand-typed pixel values where an exact token exists, unflagged** —
   `components/ChatInput/ChatInput.tsx:169,214,252` uses raw `'24px'`/
   `'16px'` where `tokens/tokens.json` defines `icon-200`/`icon-300` for
   exactly this; unlike the file's many other documented approximations,
   these three are unflagged. **Fix:** bind to `var(--icon-200)`/
   `var(--icon-300)`.
3. **A second, undocumented outcome→{icon,color} mapping table.**
   `screens/Summary/Summary.tsx`'s `OUTCOME_STYLE` hand-rolls the same
   verdict→visual mapping `VerdictBadge` already owns, for a stated,
   reasoned conflict (a full pill's baked-in label would duplicate the
   row's own title) — a flagged exception, not a silent duplication, but
   still two places now encode "outcome → color/icon." **Fix:** extract a
   single shared lookup both consume, or state the duplication as a
   permanent, deliberate exception in `design-system.md`.
4. Scaffold's `390px`/`min(844px, 100dvh)` and other real layout literals
   remain consistently flagged as documented exceptions across
   `Scaffold.tsx`, `TopBar.tsx`, `RecordControl.tsx`, `Sheet.tsx` — matching
   the rubric's 9-tier "every non-exact substitution explicitly logged."

### Coherence — 6/10 (`critic-ux`)

1. **The correction control ("My answer was right") sits as a sibling of
   `RecallBlock`, not inside its documented `children`/Actions slot.**
   `components/RecallBlock/RecallBlock.tsx:36-41` states, quoting Figma's
   own component description: "The correction control lives in the
   Actions slot, not as a sibling of this block" — and even implements a
   real `children` prop for exactly this (Loop's own `wait` state uses it
   correctly for its spinner). But `screens/Loop/Loop.tsx:541-547` renders
   the dispute `Button` as a sibling after `RecallBlock`, not inside it.
   Confirmed live: this round's Miss and Almost screenshots
   (`loop-07-verdict-miss.png`, `loop-10-verdict-almost.png`) show "My
   answer was right" visually sitting inside the same card, but the DOM/
   component-contract violation is real regardless of how it looks
   rendered — per the rubric's calibration note, an isolated single-flow
   break of a stated convention is a 6-tier finding, not 4. **Fix:** move
   the `Button` into `RecallBlock`'s children slot.
2. **Two parallel, hand-rolled copies of the "Cannot speak" sheet.**
   `screens/CannotSpeak/CannotSpeakSheet.tsx` (a standalone route) and
   Loop's own inline sheet (`Loop.tsx:654-690`) are structurally identical
   but built twice — acknowledged directly in Loop.tsx's own comment. This
   render pass confirmed the standalone route still renders on its own
   (`.eval-screens/round4/cannotspeak-standalone-route.png`) but is
   genuinely orphaned — no live screen links to it; Hub, Home, and Loop's
   own escape button all reach the inline copy instead. **Fix:** delete
   the standalone route and its page (dead code), or extract one shared
   component both call.
3. **Minor, live-reinforcing note:** the Hint/Almost hard-gate failure
   above is also a coherence problem in miniature — the same visual
   identity (a red/orange "Not yet" `VerdictBadge`) now means two
   different things (a real Miss, or an Almost that asked for a hint)
   depending on a path the student can't see. Counted at the hard gate,
   not double-counted here, but it's the same root cause as findings 1–2:
   a real behavioral/visual contract, stated elsewhere in the codebase,
   not honored at one specific call site.

**Genuine strengths, confirmed live this round:** the "XP pill acts like
Try again" bug from earlier rounds is gone — grepped the whole repo,
`XpPill` has no `onClick` anywhere, and this round's live dispute path
(Miss → "My answer was right" → "Yes, flag it" → Flagged) confirmed the
control now opens a real, separate confirm step rather than silently
mutating the verdict. "Back to Recall Hub" (renamed from "No, back to
home" in round 3) was tested live from the Cannot-speak sheet mid-session
and correctly navigated to `/hub` — round 3's flagged routing bug is
genuinely fixed.

### Craft — 4/10 (`critic-craft`, live-confirmed and revised down)

`critic-craft`'s own source-only read landed at 6/10, capped at 7, citing
real strengths (distinct Idle/Recording/Paused/Transcribing states,
`VerdictBadge`'s five-variant color+glyph+label pairing) against two
color-only rough edges (`TermPip`, `Navbar` active tab). **This render pass
independently confirmed those two findings live** — the top progress-pip
row visible in every Loop screenshot this round shows Done/Current/
Upcoming differing by fill brightness only, no shape/icon; Home's `Navbar`
tabs (`home-01-default.png`) differ only by icon tint. Both real, both
matching the critic's citations exactly.

**But the hard-gate finding above is a Craft defect in its own right, more
severe than either color-only rough edge the critic found, and it moves
this score down rather than up.** The rubric's own 4-tier anchor is "States
exist but are visually interchangeable at a glance" — which is exactly
what an Almost verdict's Hint-reveal screen is: not merely under-
differentiated from a Miss's, but rendered with the *wrong* badge and *no*
content of its own at all. This is systemic (every Almost term, every
topic, every session that uses Hint instead of Try again) and live-
reproduced, not a source-inferred risk. Weighed against the critic's real,
confirmed strengths (a genuinely live, per-bar waveform; five cleanly
distinct verdict variants everywhere else), this lands Craft at **4**,
below the critic's own capped 6 — the rubric's own anchor language for a
"states exist but interchangeable" defect outweighs partial credit for
everything else working.

### Accessibility — 5/10, capped at 7 (`critic-craft`)

**Live-confirmed this round, directly in the accessibility tree, not
inferred from source:** Loop's session-entry screen (`hasStarted === false`)
exposes **no interactive element at all** for its only action. This
round's own snapshot of that screen
(`http://localhost:3000/loop?topic=research-methods` before the first tap)
lists exactly `button "Back to Recall Hub"`, `button "Skip"`, a heading, and
static text — no third button, no `role="button"`, nothing tab-reachable
that starts the session. The only way through is a mouse/touch click on a
bare `&lt;div onClick&gt;` (`screens/Loop/Loop.tsx:322-333`), exactly matching
`critic-craft`'s citation. A keyboard-only or screen-reader user cannot
start a recall session at all — confirmed live via the actual rendered a11y
tree, the closest this pass could get to real assistive-tech verification
without an axe-core run.

**Also live-confirmed:** touch targets are genuinely compliant —
`getBoundingClientRect()` on every rendered button across Home and Loop's
Idle/Recording states measured 48–56px, none under 44pt, corroborating the
critic's token-math projection with real numbers.

**Findings, most severe first (from `critic-craft`, live-corroborated
where noted):**
1. Keyboard/AT trap on Loop's session-entry screen — see above, live-
   confirmed this round via the rendered a11y tree.
2. Live color-only signal on `Navbar`'s active tab (`Home.tsx`) — live-
   confirmed visually this round.
3. `TermPip`'s color-only Done/Current/Upcoming — live-confirmed visually
   this round (same evidence as the Craft finding).
4. `resolveButtonColors.ts`'s Primary/Disabled vs. Secondary/Default
   sharing an identical fill (design-system.md's own named risk pair) —
   not reproduced on any current screen (no side-by-side placement found),
   latent per the critic's own note.

**Why 5, not lower:** touch targets are a clean pass, several deliberately
raised above spec to clear 44pt. **Why not 6–7:** a confirmed, live,
total keyboard/AT trap on the entry point of the entire recall flow is a
category of defect beyond the 6-tier's "one spot relying on color alone."

### UX judgment — 4/10 (`critic-ux`, live-confirmed and reinforced)

`critic-ux` scored this at 5/10 from source alone, capped at 7, citing one
clean Must-state gap (the mic permission primer, `voice-ux-reference.md`'s
own Must row, still absent — confirmed by grep, no priming copy or screen
exists anywhere) against a strong showing everywhere else (skip, discard,
generous no-answer-shown miss framing, dispute honesty, no punitive dead
end guaranteed by `script.ts`'s own hard rule).

**The single most consequential thing this round's live render pass
verified is genuinely positive: Summary is fixed.** Round 3's most severe
finding — Summary never reflected the real session played — is
independently, live-confirmed resolved. This pass ran a real 5-term
Research Methods session (1 unaided success, 1 miss→dispute→flagged, 1
miss→bare retry→success, 1 almost→hint(broken)→try again→success, 1 skip)
and landed on `.eval-screens/round4/summary-01-real-session.png`: "Said it
unaided — 1 term / 15," "Said it after a hint — 2 terms / 16," "Flagged for
review — 1 term / 0," "Skipped — 1 term / 0," **+31 XP** — every number
independently cross-checked against the actual live actions taken and
correct to the term. `app/summary/page.tsx` now genuinely reads
`sessionStorage`'s real `results` array rather than a hardcoded fixture.
This is real, load-bearing progress, not a partial fix.

**But this render pass also found a second, new, live-only defect that
directly undercuts "judge generously" — the exact principle Summary's fix
was meant to serve.** `screens/Loop/Loop.tsx:236` sets
`flagged: verdict === 'flagged' || verdict === 'skipped'` on every scored
term — reusing the `flagged` field to mean *either* "sent for review" *or*
"skipped." Both `Loop.tsx:120` and `app/summary/page.tsx:84` compute
`isAllClear` as `!results.some(r =&gt; r.flagged)` — so **a single Skip, on an
otherwise-perfect session, silently disqualifies the student from the
celebratory "Nothing queued" `SessionHero` treatment**, the same as an
actual flagged dispute would. Reproduced live, twice, side by side:
`.eval-screens/round4/summary-02-allclear.png` (5 terms, 2 skipped, 0
flagged) rendered the plain, no-mascot layout with a competing
`ButtonGroup` ("Back to Recall" / "Practice this topic again"); a fresh
session with zero skips, zero flags
(`.eval-screens/round4/summary-03-true-allclear.png`) rendered the real,
polished "Nothing queued" card — mascot, centered layout, a single Primary
CTA — exactly as `Summary.tsx`'s own comment describes it ("SessionHero's
own Center/Card story is already built for exactly this moment"). The
copy layer even anticipates this: `Summary.tsx:165-172`'s `allClearBody`
explicitly branches to say "...X were skipped" *inside* the all-clear
card — but that branch is unreachable dead code, since any skip already
prevents the card from rendering at all. Skip is one of the app's own
Must-priority, always-available, explicitly-non-punitive actions
(`voice-ux-reference.md`) — this makes it quietly punitive at the one
screen meant to sum up the session honestly.

**Findings, most severe first:**
1. **isAllClear/Skip conflation** — see above, live-reproduced with two
   full sessions. **Fix:** track `flagged` and `skipped` as two separate
   booleans on `SummaryResultRow`, and compute `isAllClear` from
   `flagged` alone (matching what `allClearBody`'s own copy already
   assumes).
2. **The Hint/Almost hard-gate defect** (see above) is UX-judgment-
   relevant in its own right: it silently converts a partial-credit,
   generously-framed moment into a full-miss one at exactly the point a
   student asks for help — the opposite of `design-brief.md`'s "judge
   generously."
3. **The mic permission primer** (`voice-ux-reference.md`'s Must row) is
   still absent — unchanged from round 3, a stated, deliberate gap per
   `docs/SPEC.md`, not a silent miss. This round's render pass adds
   confirmation the *fallback* is genuinely well-built: a real
   `getUserMedia`/`permissions.query` denial (reproduced unprompted by
   this sandboxed browser's actual lack of a microphone, not by the
   stub) correctly and immediately routed to the Cannot-speak sheet with
   no dead end.
4. **Progress on exit is still silently discarded**, re-confirmed live —
   abandoned a session after 1 of 5 terms via "Back to Recall Hub" from
   the Cannot-speak sheet, then checked Hub: the Research Methods row
   still read "Read Tuesday.", no partial-progress indicator, unchanged
   from before the session started.

**Genuine strengths, confirmed live this round:** the hint ladder (Try
again + Hint) is genuinely reachable and well-built for Miss verdicts (the
Almost-specific breakage is the exception, not the rule); "Practice this
topic again" now honestly restarts from term 1 rather than falsely
promising to resume (confirmed live — no false "keep going" claim
remains); text mode is fully reachable and functional (Idle → "I can't
speak right now" → "Yes, let me type" → real Send → correct verdict,
walked live end to end); at most one Primary CTA was visible on every
screen tested.

### Structure — 4/10 (`critic-system`, live-confirmed)

1. **Home's `bottomContent` still stacks three elements — re-confirmed
   live this round.** `screens/Home/Home.tsx:127-191` renders a chip
   filter row, a composer row, and a full `Navbar` in one `bottomContent`
   slot. `docs/design-system.md:453-458` states outright, in the
   `composer` component's own "Don't" section: "Home already breaks it."
   This round's own screenshot (`home-01-default.png`) confirms the
   violation is still live — `Home.tsx` was untouched by every commit
   since round 3. Per the rubric's calibration note, a self-documented,
   unfixed slot violation caps this dimension at 4 regardless of
   everything else, live-confirmed rendering or not.
2. **The Hint/Almost hard-gate defect is also, independently, a Structure
   4-tier hit** — "a slot renders empty where content was expected" is the
   rubric's own 4-tier language, and that's exactly what
   `RecallBlock`'s `body` prop does on every Almost term's Hint tap.
   Reinforces rather than compounds the score below 4 (the rubric scores
   ordinally, not additively), but it's a second, independent instance of
   the same tier's failure mode, not the same bug counted twice.
3. **Positive, live-confirmed this round:** every one of the five in-scope
   screens sits on a real `&lt;Scaffold&gt;` root with no broken layout; no
   content found outside the documented four slots anywhere else.
   `bottomSheetOnly` is used consistently for both Cannot-speak sheet
   instances.

### Delivery-surface fidelity — 9/10, live-measured (new this round)

The first round with real measurement evidence for this dimension. Round
3 introduced it to the rubric (driven by a real user test where the mic
and CTAs were hidden below the fold) and fixed `Scaffold`'s hardcoded
`844px` to `min(844px, 100dvh)` — but never actually scored it. This round
measured `document.documentElement.scrollHeight` against
`window.innerHeight` at the real 390×844 viewport across every screen
tested:

| Screen | scrollHeight | innerHeight | Fits without scroll |
|---|---|---|---|
| Home | 844 | 844 | Yes |
| Recall hub | 844 | 844 | Yes |
| Recall history | 844 | 844 | Yes |
| Summary (partial) | 844 | 844 | Yes |
| Loop (every state walked) | — | — | Every mic/CTA control visible on first paint in all ~20 screenshots this round, no scroll performed |

Every Must-priority control tested this round (the mic trigger, Submit/
Discard/Pause, Skip, the verdict card's primary action, both Summary
CTAs) was reachable and visible without scrolling at the real delivery
viewport, confirmed by direct measurement, not by re-checking the design
canvas. This is a clean, verified 9 per the rubric's own anchor language —
the round-3 fix genuinely holds everywhere it was tested.

---

## Live render pass — flags (fix nothing, report only)

Walked every reachable state across Home, Recall hub, Recall history,
Loop (voice + text, three full sessions across Research Methods, Cell
biology, and Legal studies), and Summary (three variants: partial with a
flagged term, partial with only skips, and a true all-clear) at 390×844,
dark mode, via real taps. ~35 screenshots saved to `.eval-screens/round4/`.

- **New this round, most severe finding of the scorecard, and this
  round's hard-gate failure:** the Hint/Almost badge-and-content bug (see
  Hard gates above) — reproduced live, screenshotted before and after
  (`loop-10-verdict-almost.png` → `loop-11-hint-revealed.png`).
- **New this round, second severe finding:** the isAllClear/Skip
  conflation (see UX judgment above) — reproduced live with two full
  sessions side by side (`summary-02-allclear.png` vs.
  `summary-03-true-allclear.png`).
- **Fixed, confirmed live via a real full playthrough with exact math
  cross-checked:** Summary now genuinely reflects the session played —
  round 3's most severe finding, resolved.
- **Fixed, confirmed live:** "Back to Recall Hub" correctly routes to
  `/hub` from the Cannot-speak sheet, tested mid-session.
- **Fixed, confirmed live:** `RecallCard`'s "Next term" is a real,
  focusable button (round 3's correction-control removal also closed the
  sibling accessibility gap it left behind).
- **Fixed, confirmed live:** Recall history's three bucket counts (3/3/2)
  now exactly match their rendered rows — round 3-adjacent finding,
  closed by the latest commit.
- **Re-confirmed live, still broken:** Home's triple-stacked
  `bottomContent`, unchanged.
- **Re-confirmed live, still broken:** progress silently discarded on
  mid-session exit.
- **Re-confirmed live, still a stated gap, fallback confirmed sound:** no
  mic permission primer exists; the real permission-denied path (this
  sandboxed browser's genuine lack of a microphone, not a stub) correctly
  routes to the Cannot-speak sheet with no dead end.
- **New, incidentally useful finding:** the app's own documented
  "permission already revoked, pre-checked, no failed-attempt beat" path
  (`Loop.tsx:160-171`) fired completely unprompted in this environment on
  a second mic tap — real evidence the branch works, not just that it
  exists in source.
- **Live-measured, clean pass:** every screen tested renders at exactly
  390×844 with zero scroll needed and every Must-priority control visible
  on first paint (see Delivery-surface fidelity above).
- **Live-confirmed:** `RecordControl`'s amplitude waveform is genuinely
  animating (two screenshots one beat apart show different bar patterns),
  not a static image.
- **Live-confirmed, color-only:** `TermPip`'s Done/Current/Upcoming and
  `Navbar`'s active tab, both visible in every relevant screenshot this
  round.
- Everything else checked — Idle/Recording/Paused/Transcribing states,
  Miss/Almost/Flagged verdicts, dispute-confirm, hint reveal on a genuine
  Miss (correctly populated, only Almost's is broken), text-mode entry/
  send/verdict, "Practice this topic again"'s honest full restart, Skip's
  routing straight to Summary — rendered as distinct, correct, reachable
  states with no other collision or dead end found.

---

## critic-ambition's read — 6/10 (kept separate, not part of the total above)

Non-adversarial; scores how far the design reaches beyond the safe,
compliant choice, not correctness. Clears the critic's own 5-ceiling for
"every rule followed, no real risk taken" via two real, already-landed
departures: `Summary.tsx:218-229` reuses `SessionHero`'s `Center/Card`
shape for the all-clear moment (this round's render pass independently
confirmed this renders exactly as intended, live, whenever actually
reached — see `summary-03-true-allclear.png` — which makes the isAllClear
bug above a sharper loss than it would otherwise be: the ambitious version
is real, working, and gets hidden by a logic bug most sessions will hit).
`Loop.tsx:496-508` shows the earned `XpPill` inside the verdict card the
instant a term resolves rather than deferring to Summary — also
independently confirmed live this round (every verdict screenshot shows
real, correct XP inline).

**Top findings (both unverified by this render pass — genuine proposals
for code that doesn't exist yet, not confirmed defects):**

1. **Loop's session-entry screen hand-rolls a `&lt;div&gt;` instead of
   instantiating `SessionHero`'s own `align="Center" surface="None"`
   combination** — the literal, already-storied version of this exact
   screen (`components/SessionHero/SessionHero.stories.tsx:141-157`,
   named "Center, None (session entry)"). This render pass's own
   Accessibility finding (the keyboard/AT trap on this exact screen) is
   direct, independent evidence for the critic's proposed fix: swapping
   in a real `Button` in `bottomContent` would also close the
   accessibility gap as a side effect, not just the ambition gap.
2. **The Almost verdict's "You had: ..." line is a bare, unlabeled `&lt;p&gt;`**
   where `RecallBlock`'s `Hint` variant (already imported and used two
   branches later for actual hints) would give it a real label. This
   render pass's own screenshot (`loop-10-verdict-almost.png`) confirms
   the line renders exactly as described — plain text, no heading, sitting
   above the properly-labelled "You said" block.

**Blind spot named by the critic:** whether `SessionHero`'s token-governed
vertical rhythm actually centers as pleasingly as the current hand-tuned
flex layout on Loop's entry screen is a live-feel judgment the critic
couldn't verify from source — this render pass didn't test the proposed
swap either, since the code doesn't exist yet.
