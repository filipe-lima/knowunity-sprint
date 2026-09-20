# Scorecard 05

Screens graded: Home, Recall hub, Recall history, Loop (voice + text), Summary.
Rubric: `eval/rubric.md`. Method: same protocol as rounds 1–4 — a live render
pass (this session, Chrome DevTools MCP, 390×844 dark mode, every reachable
state) run concurrently with four blind critic agents in isolated contexts —
`critic-system`, `critic-craft`, `critic-ux` (adversarial, each blind to the
others' output, to this render pass, and to every prior scorecard) and
`critic-ambition` (non-adversarial, same blindness). All four ran as
background agents launched in parallel with Read/Grep/Glob only — no render
tool was exposed to any of them this round either, so every critic score is
independently capped at 7 by the rubric's own verification rule regardless
of source quality.

Graded against the working tree as it sat at the start of this round —
**not** a clean `HEAD`. Four files were already modified, uncommitted, when
this round started: `docs/design-system.md`, `screens/Home/Home.tsx`,
`screens/Loop/Loop.tsx`, `screens/Loop/script.ts`. These turned out to be a
real, substantive fix for round 4's own hard-gate failure (the Hint/Almost
badge bug) plus a documentation fix for round 4's Structure finding on
Home's `bottomContent` — see "What changed since round 4" below. Grading the
working tree, not a stale commit, is the right call here: it's what a
student would actually see if this session shipped right now.

**Methodological note:** the render pass hit the same stale
`chrome-devtools-mcp` browser-profile lock rounds 2–4 all documented — a
second, unrelated Chrome instance (PID 80104, launched under the automation
profile) had the profile locked. Per the same resolution as prior rounds,
explicit user authorization was requested and granted before killing it;
the render pass then ran clean. `navigator.mediaDevices.getUserMedia` was
stubbed with a fake, immediately-stopped `MediaStream` (mirroring what
`Loop.tsx` itself does) and `navigator.permissions.query('microphone')`
was patched to resolve `granted`, exactly as rounds 3–4 did, since the
sandboxed environment has no real microphone and the whole recall is
mocked per `CLAUDE.md`.

**Verdict: the hard-gate sweep still fails this round — but not for the
same reason round 4 failed it.** Round 4's own hard-gate defect (Hint on an
Almost verdict rendering the wrong badge with an empty body) is **fixed,
live-confirmed**: this is real, load-bearing progress, not a paperwork fix.
But this round's live render pass found a **second, independent**
distinctness failure the fix didn't touch and no critic named: a skipped
term and a successfully-completed term render **pixel-identical** on the
`TermPip` progress row (see Hard gates below) — a gap `docs/design-
system.md` itself already admits to (`docs/design-system.md:358-359`, "a
skipped or flagged term currently reads as `Done` on the pip row — a gap,
not a decision") but which the rubric's hard gate doesn't forgive just
because it's named. On top of that, this round's live pass re-confirmed
that round 4's **second**-most-severe finding — the `isAllClear`/Skip
conflation that silently denies the celebratory all-clear treatment to any
session containing a Skip, even with zero real misses or flags — is
**still present, unaddressed**, and reproduced it live with two full
sessions side by side. Neither of this round's own uncommitted fixes
touched either of these.

---

## Total

**5.9 / 10**, weighted — comparable to round 4's method (same 17-weight
base, now that Delivery-surface fidelity is a standing dimension). Round 4
was 5.6/10.

Same judgment call as rounds 1–4: the rubric gives an ordinal weight order,
not numeric weights. High dimensions ×3, Medium ×2, Low ×1, averaged.

| Dimension | Weight | Round 4 | Round 5 | Δ |
|---|---|---|---|---|
| System fidelity (High) | ×3 | 7 | 6 | −1 |
| Coherence (High) | ×3 | 6 | 6 | — |
| Craft (High) | ×3 | 4 | 6 | +2 |
| UX judgment (High) | ×3 | 4 | 4 | — |
| Accessibility (Medium) | ×2 | 5 | 5 | — |
| Delivery-surface fidelity (Medium) | ×2 | 9 | 9 | — |
| Structure (Low) | ×1 | 4 | 6 | +2 |

(6×3 + 6×3 + 6×3 + 4×3 + 5×2 + 9×2 + 6×1) / 17
= (18+18+18+12+10+18+6) / 17 = 100/17 = **5.88 ≈ 5.9**

Every High/Medium/Low score above starts from one adversarial critic
working blind, in its own context, Read/Grep/Glob only, capped at 7 by the
rubric's own rule. Where this round's live render pass could independently
verify, refute, or add to a finding, that's marked inline below —
including two carried-forward, still-broken defects **no critic named this
round** (the `isAllClear`/Skip conflation, and the session-entry
keyboard/AT trap), because neither is visible from source alone without
actually running a session and watching what renders, and one critic
finding this render pass actively **refuted** with live measurement (the
`TopBar`/Skip clipping risk).

**critic-ambition's read: 6/10 — kept separate, does not feed the total
above.** Unchanged from round 4. See its own section at the bottom.

---

## What changed since round 4 (verified against this round's live pass)

1. **Fixed, live-confirmed, the round's most consequential positive:** the
   Hint/Almost hard-gate bug. `screens/Loop/Loop.tsx:576-594`'s
   `hintRevealed` case now branches on `attempt.verdict === 'miss'` and
   renders `VerdictBadge variant={isMiss ? 'Miss' : 'Almost'}
   label={VERDICT_LABEL[attempt.verdict]}`, and every `almost`-verdict
   variant across `screens/Loop/script.ts` that lacked a `hintBody` now has
   one (5 added). Reproduced live end-to-end this round: submitted
   Ecological validity's Almost variant, tapped Hint, and got a correctly-
   labeled blue "Almost" badge with real, populated hint text
   (`.eval-screens/round5/loop-08-hint-almost.png`) — not the orange-red
   "Not yet" badge with an empty body round 4 documented
   (`.eval-screens/round4/loop-11-hint-revealed.png`). A genuine Miss's
   hint reveal was also re-confirmed still correct
   (`.eval-screens/round5/loop-06-hint-miss.png`).
2. **Fixed, reframed correctly:** Home's triple-stacked `bottomContent`.
   Round 4 scored this a 4-tier Structure defect specifically because
   `design-system.md` merely *admitted* the break ("Home already breaks
   it") without sanctioning it. This round, `docs/design-system.md:127-137`
   adds a real, reasoned "Stated exception: `Home`" entry — Home is named
   as the app's one persistent-navigation hub screen, the exception is
   scoped to that specific combination, and future screens are explicitly
   told not to copy it — and `screens/Home/Home.tsx:127-130` carries a
   matching inline comment. Live-confirmed the screen still renders the
   same three-stack (`.eval-screens/round5/home-01-default.png`), but per
   the rubric's own Structure calibration note (a *stated* exception is a
   known, accepted trade-off, not a violation left broken), this moves the
   dimension off the 4-tier floor — `critic-system`, reading blind, landed
   on 6 independently, treating it exactly this way.

---

## Hard gates

| Gate | Result | vs. round 4 |
|---|---|---|
| Contrast ≥ 4.5:1 for all body text | **PASS** | unchanged — re-ran `npm run check:contrast` directly: all 21 real token pairings clear 4.5:1 |
| Touch targets ≥ 44pt on every interactive control | **PASS** | unchanged — live-measured via `getBoundingClientRect()`: `TopBar`'s "Back to Recall Hub" and "Skip" both 48×48px on Loop; consistent with prior rounds |
| No raw hex color in component source (`check:tokens`) | **PASS** | unchanged — re-ran `npm run check:tokens` directly: exit 0, zero matches. **Caveat, not a failure:** `critic-system` notes this script only regexes for `#hex` and cannot catch a `var(--color-black-300)` primitive read or a hand-typed `rgba()` literal — both real, if minor, violations exist unflagged (`components/Button/Button.tsx:171`, `components/ListItem/ListItem.tsx:294`) that the script's own blind spot lets through. Not re-verified live by this pass (no visual difference expected at these two specific call sites). |
| No two states that should differ ever render identically | **FAIL** | **still fails — different cause than round 4.** Round 4's cause (Hint/Almost) is fixed; a second, independent distinctness failure (Skip vs. Done on `TermPip`) was found live this round and was already present, undocumented as a hard-gate issue, before this round started. |

**The distinctness failure, in detail — reproduced live, not inferred from
source.** Skipping a term (`screens/Loop/Loop.tsx:250-255`,
`handleTopSkip`) and successfully completing one both mark that term's
`TermPip` the identical filled/complete color. This round's own screenshot
sequence proves it directly: `.eval-screens/round5/loop-04-transcribing.png`
shows the pip row after term 1 resolved with a genuine Success — pip 1 is
solid magenta/pink, pip 2 (current) white, the rest grey.
`.eval-screens/round5/loop-10-pip-after-skip.png`, from a **separate**
session where term 1 was **skipped**, not completed, shows the exact same
pip row: pip 1 solid magenta/pink, pip 2 white, the rest grey — no visual
difference whatsoever between "the student said this correctly" and "the
student skipped this entirely." This isn't a surprise defect this round
introduced — `docs/design-system.md:358-359` already states it plainly, in
the `termPip` component's own entry: "No `Skipped` or `Flagged` state
exists yet, so a skipped or flagged term currently reads as `Done` on the
pip row — a gap, not a decision." That's an honest admission, but the
rubric's hard gate doesn't carve out an exception for gaps that are merely
named rather than fixed — "any failed gate fails the submission regardless
of dimension scores" is unconditional. A student scanning the pip row
mid-session — the one piece of persistent status UI in the whole flow —
cannot tell "I got that one" from "I skipped that one" by looking at it.
**Fix:** give `TermPip` real `Skipped`/`Flagged` variants (even a simple
outline-only or dashed treatment would clear Principle 1's "pair color with
a shape" bar) and wire `Loop.tsx`'s pip-state derivation to check the
actual per-term outcome instead of collapsing every resolved term into one
"done" bucket.

---

## Per-dimension findings

Each finding is the critic's own claim, condensed, with file:line evidence
as each critic gave it. Where this session's live render pass could
independently confirm, refute, or add to a finding, that's noted inline.

### System fidelity — 6/10, capped at 7 (`critic-system`)

Tool disclosure, stated by the critic itself: only Read/Grep/Glob were
reachable, no render — capped at 7 regardless. The critic's own finding
lands at 6 on the merits, not just the cap.

1. **Unflagged primitive-color reads.** `components/Button/Button.tsx:171`
   and `components/ButtonIcon/ButtonIcon.tsx:118` both read
   `var(--color-black-300)` directly — `black` is a primitive family, not a
   semantic token (`design-system.md` rule 5: "never read a primitive
   directly"). Every other unbound value in this codebase is explicitly
   flagged inline or in `docs/component-gaps.md`; these two are not, in
   either place. Not live-verified this round (no expected visual
   difference at these call sites to check for).
2. **A fully hand-typed, non-token color value.** `components/ListItem/
   ListItem.tsx:294` — `rgba(0,0,0,0.15)` invented outright, unflagged,
   inconsistent with the same file's otherwise rigorous doc comment two
   paragraphs above. Mitigating: `ListItem` is not imported by any real
   screen today (only its sibling `ListRow` is) — a real defect in a
   promoted component file, but not currently live.
3. **`check:tokens`'s own blind spot is systemic**, per the critic — it
   only catches `#hex`, not `rgba()`/`rgb()`/primitive `var()` reads. Both
   violations above evade it silently. **Fix:** extend the script's regex.

**Genuine strengths, live-confirmed this round:**
- **The row-shape promotion flagged in rounds 1–2 stays fixed, live-
  reconfirmed.** `components/BucketRow/BucketRow.tsx` renders identically
  across Hub, Recall history, and (per source) Summary — this round's own
  screenshots of Hub (`hub-01-default.png`) and Recall history
  (`recallhistory-01-default.png`) show one consistent row anatomy, same as
  round 4.
- No raw hex anywhere in `components/`/`screens/`, confirmed by the live
  `check:tokens` run above, not just grepped by the critic.

### Coherence — 6/10 (`critic-ux`)

1. **Home's three inert quick-action chips look exactly as tappable as the
   one real one, while Hub explicitly solved this same problem elsewhere in
   the product.** `screens/Home/Home.tsx:134` (Scan), `:169` (Quiz), `:170`
   (Upload) render with the identical `Chips size="S" color="Primary"`
   styling as the wired "Recall" chip (`:144-163`) but carry no `onClick`
   and no dimmed/disabled treatment. **Live-confirmed via this round's own
   screenshot** (`.eval-screens/round5/home-01-default.png`): all four
   chips are visually indistinguishable in weight. Compare `screens/Hub/
   RecallHub.tsx:133-169`, where the identical "no real destination this
   sprint" situation got a real dimmed `Disabled`-state treatment,
   specifically because (per the code's own comment) an inert live-looking
   control "looked exactly like a live control that silently does nothing
   on tap." That fix was never carried to Home's three chips. Live-
   confirmed in Hub's own screenshot too (`hub-01-default.png`): "Read the
   lesson" and "Start a new Recall" are visibly dimmed relative to the
   other rows — the contrast between Home's undimmed dead chips and Hub's
   dimmed dead rows is real and visible, not just a source-level claim.
2. **Minor: two different visual mechanisms for "this row goes nowhere" on
   the same Hub screen** — a real `Button variant="Tertiary" state=
   "Disabled"` for "Read the lesson" vs. a bare dimmed chevron for "Start a
   new Recall." Visible side by side in the same screenshot.

**Genuine strengths, confirmed live this round:** the correction control
("My answer was right") visually sits inside the same card as the verdict
on every Miss/Almost screenshot this round
(`loop-05-wait-immediate.png`, `loop-07-verdict-almost.png`) — the DOM/
component-contract question `critic-ux` raises (whether it's a real sibling
of `RecallBlock` rather than inside its slot) wasn't re-inspected this
round, but the rendered result reads as one coherent card either way, same
as round 4 found. XP pill and the correction control still carry no stray
`onClick` wiring anywhere they're used this round (confirmed via the same
dispute flow tested in round 4's own live pass, not re-walked step-by-step
this round to conserve time, since neither code path was touched by this
round's diff).

### Craft — 6/10, capped at 7 (`critic-craft`, one finding live-refuted)

`critic-craft` read this at 6/10 from source alone, citing real strengths
(distinct Idle/Recording/Paused/Transcribing states, a genuinely live
waveform, a spacing-rhythm fix this round confirmed via `ButtonGroup`)
against several rough edges.

**This round's live pass refutes one of the critic's own findings.** The
critic flagged, as its #2 finding, a self-documented risk in
`screens/Loop/Loop.tsx:279-285`'s own comment: that the "Skip" text button,
forced into `TopBar`'s fixed 48×48px trailing box, might clip or crowd the
adjacent `TermPip` row, and that the code itself says "if it clips, that's
the next thing to fix, not assumed fine." **This round measured it
directly** via `getBoundingClientRect()` on the real rendered Loop screen:
the pip row spans `left:76 → right:314`; the Skip button's box spans
`left:326 → right:374` — a clean **12px gap**, no overlap, no clipping,
`Skip`'s own 48×48px box unclipped. The self-flagged risk does not
materialize at the real 390px viewport. This is a real, live-only
verification a source-only critic couldn't have performed — noted here as
a correction, not a new finding.

**Not independently re-verified this round** (no live timing capture was
attempted): the critic's #1 finding, a claimed ~500ms fully-dead gap
between the "Checking" spinner's `checkingDone` flag (700ms) and
`resolveAttempt` firing (1200ms) in `Loop.tsx:205-214,461-483`. Plausible
from the code's own timing constants, but this round's screenshots landed
either before or after that window each time it was attempted, so it's
reported as an unverified critic finding, not a live-confirmed one.

**Live-reconfirmed, unchanged from round 4:** Home's dead-chip/live-chip
visual inconsistency (see Coherence #1) is also a Craft defect in its own
right — states that should read as different (an actionable control vs. a
decorative one) don't.

### Accessibility — 5/10, capped at 7 (`critic-craft`, live-revised down)

`critic-craft` scored this 6/10 from source, citing `resolveButtonColors
.ts`'s Primary/Disabled-vs-Secondary/Default identical fill (latent,
unused on any live screen today) and a `check-contrast.mjs` coverage gap on
the `background-stacking` token (plausible, not independently re-run this
round).

**This round's live pass found a severe, Must-priority defect no critic
named this round, carried forward unaddressed from round 4.** Loop's
session-entry screen (`hasStarted === false`, `screens/Loop/Loop.tsx:317-
349`) still exposes **no interactive element at all** for its only action.
This round's own accessibility-tree snapshot of that exact screen
(`http://localhost:3000/loop?topic=research-methods`, before the first
tap) lists exactly: `button "Back to Recall Hub"`, `button "Skip"`, a
heading, and static text — no third button, no `role="button"`, nothing
tab-reachable that starts the session. The only way through remains a
mouse/touch click on a bare `<div onClick>` (`Loop.tsx:322` /
`Loop.tsx:332`'s `onClick={() => setHasStarted(true)}`). A keyboard-only or
screen-reader user still cannot start a recall session at all — this is
the identical defect round 4 found and scored down for, unaddressed by any
commit or uncommitted change since (this round's diff touched `Loop.tsx`
only inside the `hintRevealed` case, nowhere near this code). Per round 4's
own reasoning, a confirmed, live, total keyboard/AT trap on the entry point
of the entire recall flow is a category of defect beyond the rubric's
6-tier "one spot relying on color alone" — it holds this dimension below
the critic's own blind 6.

**Live-confirmed, clean pass:** touch targets — `getBoundingClientRect()`
on Loop's `TopBar` buttons measured 48×48px, consistent with round 4's
broader sweep and with `Button`/`ButtonIcon`'s documented minimums.

**Why 5, not lower:** touch targets and contrast are both clean, live-
verified passes, and text mode (a real Must-priority alternative path) is
fully keyboard-reachable once inside a session. **Why not 6–7:** the same
reasoning as round 4 — a confirmed, live, total keyboard/AT trap on the one
screen every single session must pass through first.

### UX judgment — 4/10 (`critic-ux`, live-reconfirmed, unaddressed since round 4)

`critic-ux` scored this 4/10 from source alone, citing: the mic permission
primer (a Must row in `voice-ux-reference.md`) still doesn't exist as a
screen, confirmed by grep and unchanged from round 3–4; permission-denied
routing that's unreliable cross-session on Safari specifically (plausible,
code-level, not live-tested this round since the stub bypasses it); Skip
producing no distinct visual feedback; and Loop's back chevron always
routing to `/hub` regardless of entry point.

**This round's live pass independently reproduced two of these, and found
a third the critic didn't name at all.**

1. **Skip produces zero transitional feedback, live-confirmed.** Tapping
   "Skip" on Loop's `TopBar` (`Loop.tsx:250-255`) jumped straight to the
   next term's Idle state in the same render — no verdict card, no beat,
   nothing shown for having skipped, exactly as the critic describes from
   source. Live-confirmed via this round's own snapshot sequence (Internal
   validity → Skip → Random assignment, no intervening state).
2. **The `isAllClear`/Skip conflation — round 4's second-most-severe
   finding — is still present, unaddressed, and this round live-reproduced
   it with two full sessions side by side, neither critic naming it this
   round.** `Loop.tsx:236` still sets `flagged: verdict === 'flagged' ||
   verdict === 'skipped'` on every scored term, and both `Loop.tsx:120` and
   `app/summary/page.tsx:84` still compute `isAllClear` as `!results.some
   (r => r.flagged)`. This round ran a real 5-term Research Methods session
   with 4 real attempts and exactly 1 Skip, 0 flags/disputes, and landed on
   `.eval-screens/round5/summary-01-oneskip-zeroflags.png` — the plain
   layout with a competing `ButtonGroup` ("Back to Recall" / "Practice this
   topic again"), **not** the celebratory all-clear card. A second,
   separate 5-term Cell biology session with 0 skips and 0 flags landed on
   `.eval-screens/round5/summary-02-true-allclear.png` — the real
   "Nothing queued" mascot card, single Primary CTA. Same product, same
   session length, only difference is one honest, explicitly non-punitive
   Skip — and it's treated identically to an actual flagged dispute. This
   is the single most consequential unresolved defect of this round: it
   silently punishes the one Must-priority action (`voice-ux-reference
   .md`) the product's own documentation calls non-punitive.
3. **The mic permission primer** (`voice-ux-reference.md`'s Must row) is
   still absent — unchanged since round 3, a stated, deliberate gap per
   `docs/SPEC.md`, not a silent miss.

**Genuine strengths, live-confirmed this round:** text mode is fully
reachable and functional — Idle → mic-denial path or direct `?mode=text` →
`ChatInput` with "Switch back to voice" reversible
(`.eval-screens/round5/loop-09-textmode.png`) — matching round 4's finding,
still holds. The Hint ladder is genuinely well-built on both Miss and now
Almost (see Hard gates fix above).

### Structure — 6/10, live-confirmed improvement (`critic-system`)

`critic-system` scored this 6/10 from source, capped at 7 for lack of live
verification.

1. **Home's `bottomContent` three-stack is now a genuinely stated,
   reasoned exception, not a silently-admitted break — live-confirmed
   rendering unchanged, documentation changed.** See "What changed since
   round 4" above. `critic-system`, reading blind and without access to
   round 4's scorecard, independently treated this as a legitimate,
   documented trade-off rather than an unfixed violation — exactly the
   distinction the rubric's own Structure calibration note draws between a
   *stated* exception and a rule left in a *self-documented broken* state.
   This is real, live-confirmed progress: round 4 capped this dimension at
   4 specifically because the exception wasn't yet legitimized; it now is.
2. **The `TermPip` Skip/Done collision** (see Hard gates) is also,
   independently, a Structure-relevant finding under the rubric's own
   4-tier language ("a slot renders empty where content was expected" /
   a self-documented broken state) — but per the rubric's ordinal scoring,
   this doesn't pull Structure back down to 4 on its own, since it's a
   content-distinctness problem within a slot that does render, not a
   slot rendering empty or a screen failing to load. It's counted at the
   hard gate, not double-counted here.
3. **No other visible breakage found in any of the 6 screens visited this
   round** — Home, Hub, Recall history, Loop (all states walked), Summary
   (both branches) all rendered cleanly on `Scaffold` with nothing outside
   the four documented slots.

### Delivery-surface fidelity — 9/10, live-measured (unassigned to any critic)

None of the three specialized critics score this dimension (it isn't
covered by System/Structure, Craft/Accessibility, or Coherence/UX
judgment's pairings) — this round, as in round 4, it's measured directly
by this live pass. `document.documentElement.scrollHeight` against
`window.innerHeight` at the real 390×844 viewport:

| Screen | scrollHeight | innerHeight | Fits without scroll |
|---|---|---|---|
| Home | 844 | 844 | Yes |
| Recall hub | 844 | 844 | Yes |
| Recall history | 844 | 844 | Yes |
| Loop (session entry) | 844 | 844 | Yes |

Every screen measured this round holds the round-3 `Scaffold` fix
(`min(844px, 100dvh)`) cleanly, unchanged from round 4 — no dimension of
this codebase touched `Scaffold.tsx` between rounds. Same clean 9 as round
4, same anchor language ("confirmed... every Must-priority control visible
without scrolling").

---

## Live render pass — flags (fix nothing, report only)

Walked Home, Recall hub, Recall history, three full Loop sessions
(Research Methods with a Skip, Cell biology with zero skips/flags, Legal
studies partial) plus a fourth abbreviated pass to test the Skip/Done pip
collision, and both branches of Summary, at 390×844, dark mode, via real
taps and DOM-level automation. ~20 screenshots saved to
`.eval-screens/round5/`.

- **Fixed, confirmed live via direct before/after reproduction:** the
  Hint/Almost badge-and-content bug — round 4's hard-gate failure and this
  scorecard's headline positive.
- **New this round, this round's own hard-gate failure:** the `TermPip`
  Skip/Done color collision — a pre-existing, self-documented gap now
  confirmed, for the first time, to actually fail the rubric's
  distinctness hard gate live.
- **Re-confirmed live, still broken, unaddressed since round 4, most
  consequential unresolved defect:** the `isAllClear`/Skip conflation —
  reproduced with two full sessions side by side.
- **Re-confirmed live, still broken, unaddressed since round 4:** Loop's
  session-entry screen has no keyboard/AT-reachable way to start a session.
- **Live-refuted this round:** `critic-craft`'s self-flagged TopBar/Skip
  clipping risk — measured a clean 12px gap, no overlap, at the real
  viewport.
- **Live-confirmed, clean pass:** contrast (`check:contrast`, 21/21),
  tokens (`check:tokens`, 0 matches), touch targets (48×48px measured),
  delivery-surface fidelity (4/4 screens measured, zero scroll).
- **Live-confirmed, unchanged from round 4:** text mode fully reachable and
  reversible; Home's dead Scan/Quiz/Upload chips visually indistinguishable
  from the one wired "Recall" chip, while Hub's own equivalent dead rows
  are properly dimmed two screens away.
- **Not re-verified this round** (out of scope for the time available, no
  code changed in these paths per this round's diff, and round 4 already
  live-confirmed them working): the dispute/flag path end-to-end, the
  standalone `/cannot-speak` route's orphaned status (confirmed via grep
  that no live screen links to it, matching round 4 exactly, but the sheet
  itself wasn't re-screenshotted), the Wait beat's claimed dead ~500ms
  window.

---

## critic-ambition's read — 6/10 (kept separate, not part of the total above)

Non-adversarial; scores how far the design reaches beyond the safe,
compliant choice, not correctness. Unchanged from round 4's own 6/10 —
neither of this round's two uncommitted fixes touched anything in scope for
this critic, and its own findings weren't re-verified live this round for
time, but both remain plausible, unimplemented proposals rather than
confirmed defects.

**Top findings (both unverified by this render pass — genuine proposals
for code that doesn't exist yet, not confirmed defects):**

1. **Loop's session-entry screen hand-rolls a `<div>` instead of
   instantiating `SessionHero`'s own `align="Center" surface="None"`
   combination** — already the literal, storied version of this exact
   screen. This round's own Accessibility finding (the keyboard/AT trap on
   this exact screen, still unaddressed) is direct, independent,
   *reinforcing* evidence for the critic's proposed fix: swapping in a real
   `Button` in `bottomContent` would close the accessibility gap as a side
   effect of the ambition fix, not just improve the ambition score.
2. **Summary's scored rows (`Said it unaided`, `Said it after a hint`)
   render through a plain numeral instead of `XpPill`**, even though
   `Loop.tsx` already reaches for `XpPill` the instant those same points
   are earned mid-session. **Live-confirmed unchanged this round:**
   `.eval-screens/round5/summary-02-true-allclear.png` shows both scored
   rows ("30", "24") as plain white numerals, not pills — exactly the gap
   the critic describes, still present.

**Blind spot named by the critic, unchanged:** whether `SessionHero`'s
token-governed vertical rhythm actually centers as pleasingly as the
current hand-tuned flex layout on Loop's entry screen is a live-feel
judgment the critic can't verify from source, and this round's render pass
didn't test the proposed swap either, since the code still doesn't exist.
