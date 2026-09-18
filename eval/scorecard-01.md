# Scorecard 01

Screens graded: Cannot-speak sheet, Summary, Hub (+ Recall history), Loop, Home.
Rubric: `eval/rubric.md`. Method: a live render pass (this session, Chrome DevTools
MCP, 390×844 dark mode, every reachable state) done first and independently of the
critics, then four critic agents run in isolated contexts — `critic-system`,
`critic-craft`, `critic-ux` (adversarial, one blind to the others' output and to
this render pass) and `critic-ambition` (non-adversarial). No critic saw another
critic's findings, this render pass, or a score from anyone.

**Verdict: fails.** Three of the four hard gates fail (below). Per the rubric,
that fails the submission regardless of the dimension scores that follow.

---

## Total

**4.6 / 10**, weighted.

The rubric gives an *ordinal* weight order, not numeric weights ("System
fidelity, Coherence, Craft, and UX judgment (High) outweigh Accessibility
(Medium), which outweighs Structure (Low)... don't average the six into a false
equivalence"). To produce one number without pretending otherwise, High
dimensions are weighted ×3, Medium ×2, Low ×1, then averaged — a judgment call
on my part to satisfy the request for one total, not something the rubric
specifies numerically. Read the per-dimension table below before the total;
the total is a compression of it, not a replacement for it.

| Dimension | Weight | Score /10 |
|---|---|---|
| System fidelity (High) | ×3 | 6 |
| Coherence (High) | ×3 | 5 |
| Craft (High) | ×3 | 4 |
| UX judgment (High) | ×3 | 4 |
| Accessibility (Medium) | ×2 | 3 |
| Structure (Low) | ×1 | 6 |

(6×3 + 5×3 + 4×3 + 4×3 + 3×2 + 6×1) / 15 = 69/15 = **4.6**

Every dimension score above comes from one adversarial critic working blind,
in its own context, reading only source (`Read`/`Grep`/`Glob` — no render tool
was actually reachable to any of them, despite MCP server instructions
suggesting Storybook tools might be). Per the rubric's own scoring rule, that
caps every score at 7 regardless of source quality — moot here since every
score already lands below that cap on the evidence itself, not the cap.

**critic-ambition's read: 6/10 — kept separate, does not feed the total above.**
See its own section at the bottom.

---

## Hard gates

| Gate | Result |
|---|---|
| Contrast ≥ 4.5:1 for all body text | **FAIL** |
| Touch targets ≥ 44pt on every interactive control | **FAIL** |
| No raw hex color in component source (`check:tokens`) | PASS |
| No two states that should differ ever render identically | **FAIL** |

- **Contrast — FAIL.** `screens/Hub/RecallHub.tsx:104,222` sets the locked
  "Statistics, section 3" row's title to `titleColor="var(--color-text-disabled)"`
  on `background: var(--color-background-surface)` (`RecallHub.tsx:130`). I
  cross-checked this directly against `docs/design-system.md:190-202`, which
  documents that this exact pairing — a row title on `text/disabled` over
  `background/surface` — was axe-core-measured at **3.69:1** (under the 4.5:1
  AA minimum) on `ListRow`'s own `Locked` state, and was deliberately reversed
  project-wide as a result (title now belongs on `text/secondary`, the dimming
  moved to the subtitle). `RecallHub.tsx` was never updated to match its own
  project's reversal — it still uses the pre-fix pairing on a real, live row.
  Found independently by `critic-craft`; I verified the token values
  (`tokens/tokens.json`) and the doc citation myself and confirm it stands.
  **Fix:** swap `RecallHub.tsx:222`'s `titleColor` to
  `var(--color-text-secondary)` and dim the subtitle instead, matching
  `design-system.md`'s current documented rule.

- **Touch targets — FAIL.** Three controls measured below 44px, all against
  real token values I confirmed in `tokens/tokens.json` myself:
  - `components/Navbar/Navbar.tsx:47-79` (`NavigationButton`): `padding: 0`, no
    explicit height, holding only `IconSlot size="250"` (`--icon-250` = 20px).
    Every one of Home's 5 bottom-nav tabs is ~20px tall. Confirmed directly by
    reading the component — no min-height anywhere in the tree.
  - `screens/Home/Home.tsx:131-139`: the "Recall" chip — the literal entry
    point into this whole feature — is a `Chips size="S"` with an `onClick`
    wired directly onto it. `Chips`' `S` height is `--control-400` = 32px
    (`tokens/tokens.json`), and `Chips` is documented as "for filters,
    selectable options and small counters... Not for actions."
  - `components/ChatInput/ChatInput.tsx:130-167,256-259`: the trailing
    send/mic button renders at a literal `size={40}` in every status Loop's
    text mode actually uses (`screens/Loop/Loop.tsx:386-390`) — `--control-500`
    = 40px, under the 44pt gate.
  Found by `critic-craft`; all three pixel values verified independently
  against `tokens/tokens.json`.

- **No raw hex — PASS.** Ran `npm run check:tokens` directly (not a critic
  claim — I ran the actual script): exit 0, zero matches for raw hex in
  `components/`. `critic-system`'s independent grep for the same pattern
  across `components/` and `screens/` also returned zero hits.

- **No two states render identically — FAIL.** Confirmed two ways
  independently, then reconciled into one finding:
  1. **My own live render** (Chrome DevTools MCP, 390×844, dark mode):
     `loop-03-recording.png` (Recording) and `loop-05-transcribing.png`
     (Transcribing) are visually near-indistinguishable — identical bright-pink
     amplitude bars, identical-looking enabled Discard/Pause/Submit controls;
     the *only* visible difference is the caption string flipping "Listening"
     → "Transcribing". Compare this to Paused (`loop-04-paused.png`), captured
     in the same pass, which *is* correctly distinct: bars visibly dimmed
     (opacity 0.4), Pause icon swaps to a Resume triangle, caption changes —
     proving the codebase knows how to make a state visually distinct and
     simply didn't do it here.
  2. **`critic-craft`, working blind, independently reading source**, found
     the same defect from the code side: `screens/Loop/Loop.tsx:457-467`
     passes `amplitudeFrozen` to `RecordControl`, and
     `components/RecordControl/RecordControl.tsx:160-184` shows `frozen` only
     stops the animation loop — it applies no distinct static color/treatment,
     so a single frame is pixel-identical to live Recording. The same file
     also found `screens/Loop/Loop.tsx:468-497`'s "Checking" sub-beat (Wait,
     first ~700ms) has *zero* motion at all — not even a dead spinner, just a
     static icon and word — which `docs/voice-ux-reference.md` Principle 6
     names as precisely the failure mode to avoid.
  Two independent methods (a real render vs. a blind code read) converging on
  the same defect is why this gate is marked failed with high confidence, not
  just flagged as a maybe.
  **Related, not identical, so not counted toward this gate but worth
  recording:** my render pass also found `screens/Hub/RecallHub.tsx` shows the
  literal string "Up next" on *two* rows at once after a selection change —
  Legal studies' real active `Chips` pill, and Research Methods' deselected
  chip, whose hardcoded fallback `badge: 'Up next'` (`RecallHub.tsx:62`)
  happens to equal the active-state label. Pixel-sampled the actual PNG to
  confirm: the two chips are *not* pixel-identical (Chips' `active` prop does
  correctly swap the fill from `--color-interactive-primary-default` to
  `--color-background-surface`, which here happens to match the row's own
  background, i.e. no visible pill at all for the inactive one) — so this
  doesn't fail the "renders identically" gate, but two rows both displaying
  "Up next" simultaneously is a real, render-confirmed content bug. **Fix:**
  give `research-methods`'s `TOPIC_ROWS` entry (`RecallHub.tsx:56-62`) a
  neutral default badge (e.g. its term count, matching Cell biology/Legal
  studies' own pattern) instead of the string that's also the selected-state
  label.

---

## Per-dimension findings

Each finding below is the critic's own claim, condensed; file:line citations
are as each critic gave them. "Verified" notes mark the handful I independently
re-checked against source/tokens/docs myself during reconciliation — most
findings were not independently re-verified beyond that critic's own citation,
consistent with each critic having already cited real file:line evidence for
everything reported.

### System fidelity — 6/10 (`critic-system`)

1. **The "row / NEW" shape (icon + title/subtitle + trailing slot) is
   duplicated identically on 3 screens and never promoted to a real
   component**, despite the project's own stated promotion rule being applied
   elsewhere (`ScaffoldHeader` was promoted at 2 screens).
   `screens/Summary/Summary.tsx:75-132` (`ResultRow`),
   `screens/Hub/RecallHub.tsx:101-169` (`HubRow`),
   `screens/Hub/RecallHistory.tsx:72-119` (`TermRow`) — pixel-identical
   flex/gap/padding/radius/background. `docs/component-gaps.md:53-72` names
   this exact triplication itself as unresolved. **Fix:** extract
   `components/TermRow/TermRow.tsx` with a generic `trailing?: ReactNode`
   slot; delete all three local copies.
2. **`screens/Home/Home.tsx:127-170` stacks three things (chip row, composer,
   `Navbar`) in one `bottomContent` slot**, against
   `docs/design-system.md:122-125`'s "one of those three, never two" —
   self-documented as a known break in the same doc (`design-system.md:447-452`)
   but still live in the graded screen.
3. Non-exact token substitutions (`Navbar.tsx:22-35`,
   `screens/Home/Home.tsx:160-165`) are properly logged in
   `docs/component-gaps.md:79-89` — cited as a positive, why the score isn't
   lower.
4. Zero raw-hex/CSS-fallback hits across `components/` and `screens/` —
   **verified independently**, `npm run check:tokens` exit 0.

**Blind spot named by this critic:** could not render Home's triple-stacked
`bottomContent` to see whether it actually crowds or clips at 390px — only
inferred from `Scaffold`'s overflow/scroll behavior in source.

### Structure — 6/10, capped at 7 (`critic-system`)

1. Same `Home.tsx:127-170` triple-stack finding as above, counted here as a
   scaffold-slot-contract violation (`design-system.md` rule 8) rather than a
   component-reuse issue.
2. **Noted but not scored**: `app/summary/page.tsx:24`'s `PARTIAL_RESULTS`
   includes `outcome: 'Ecological validity'`, which isn't a key in
   `Summary.tsx`'s `OUTCOME_STYLE` map — silently falls back to the `Skipped`
   icon/color/score and renders backwards (term name as title, outcome as
   subtitle). Renders cleanly, so doesn't move this score, but is a real
   content bug.
3. Every one of the 5 screens sits on a real `<Scaffold>` root; no broken
   imports or prop mismatches found on a source read.

**Blind spot named by this critic:** identical to Structure finding 1 above —
no render tool available to confirm actual layout behavior.

### Craft — 4/10 (`critic-craft`)

1. **Loop's entire processing sequence is static, not animated, in two
   consecutive beats** — the Transcribing/Recording indistinguishability and
   the motionless "Checking" beat, both detailed under the hard-gate section
   above (this is the same finding, cited here as this dimension's primary
   evidence). Directly contradicts `voice-ux-reference.md` Principle 6.
2. **`TermPip`'s three progress states (`Done`/`Current`/`Upcoming`) are
   color-only**, no shape or icon change —
   `components/TermPip/TermPip.tsx:38-42`. On screen for the entire Loop
   session, on every one of the 5 target screens' flagship flow.
   Principle 1 violation.
3. **Sibling button-pair spacing diverges by screen.** Loop hand-assembles
   verdict/dispute button pairs directly in JSX
   (`screens/Loop/Loop.tsx:567-572,606-611`), inheriting `Scaffold`'s
   `bottomContent` gap (`--space-100`, 4px,
   `components/Scaffold/Scaffold.tsx:137`) instead of routing through the real
   `ButtonGroup`, whose own `Vertical`/`L` gap is `--space-200` (8px,
   `components/ButtonGroup/ButtonGroup.tsx:68-71`) — the pattern Summary uses
   for the visually identical primary-over-secondary shape
   (`screens/Summary/Summary.tsx:250-266`). Same shape, two different gaps
   depending on screen.

**Blind spot named by this critic:** could not watch `RecordControl`'s live
amplitude animation to confirm it reads as calm/non-repeating rather than
"popping" — a Principle-1/6 concern the rubric requires be watched, not
inferred from the `setInterval` logic.

### Accessibility — 3/10 (`critic-craft`)

1. Touch-target and contrast failures — see Hard gates above (same findings,
   this is their home dimension).
2. **Mitigating factor, stated by the critic itself:** every icon-only control
   checked across all 5 screens does carry a real `aria-label` — the
   "icon-only control with no accessible name" clause of the rubric's 4-anchor
   is not triggered. Real, deliberate work, not enough to offset the sizing/
   contrast failures.

**Blind spot named by this critic:** cross-referenced one already-measured
contrast ratio (the Hub locked-row one); did not compute any other body-text/
background pairing (e.g. `text-secondary` on `background-stacking`, used in
every caption/provenance line) — a real audit could surface more failures or
clear them, genuinely unknown from source alone.

### Coherence — 5/10 (`critic-ux`)

1. **"Skipped" is drawn with two unrelated icon/color pairs on two screens
   that show it in the same flow.** `screens/Summary/Summary.tsx:146`:
   `SkipForward` icon, `text-secondary`. `screens/Hub/RecallHistory.tsx:48-52,
   154-170`: `Loader2` icon (reads as a loading spinner, not a skip glyph),
   `accent-coral-bold` — the same coral reserved for Miss elsewhere. No
   comment reconciling the divergence.
2. **"Flagged for review" has no bucket in Recall history's taxonomy** at all,
   despite being a real outcome Loop produces (`screens/Loop/Loop.tsx:225-231`)
   and Summary displaying it (`Summary.tsx:145`).
   `screens/Hub/RecallHistory.tsx` has exactly 3 sections
   (Skipped/Said recently/Never said out loud, lines 150/172/195) and a
   flagged term has nowhere to land.
3. **The same quantity ("terms you missed") is stated 3 different ways**:
   Hub's badge says `'3 terms'` (`RecallHub.tsx:79`), RecallHistory's CTA says
   `"Say the 6 that are due"` (`RecallHistory.tsx:219`), and the actual
   scripted data has 5 terms (`screens/Loop/script.ts`). None reconciled.
4. **Back-navigation is present on 3 of 5 screens, silently absent on
   Summary**, with no comment addressing the omission — `Summary.tsx:178`
   uses `TopBar variant="Centered"` with no leading slot, unlike Hub/
   RecallHistory (`ScaffoldHeader`) and Loop (`TopBar` with a documented
   rationale for its variant).
5. Minor: Hub's "47 terms across 5 topics" claim doesn't match the app's
   actual 4 selectable topics (`RecallHub.tsx:240` vs. `script.ts`'s
   `TopicSlug`, 4 members) — possibly explained by the locked 5th row, but
   uncommented either way.

**Blind spot named by this critic:** could not confirm felt urgency/confusion
of any of these moments live — only that the code permits the divergence.

### UX judgment — 4/10 (`critic-ux`)

1. **The text-fallback Must-state only actually works from inside Loop —
   every other real door drops the student back into a voice-only screen.**
   Only `screens/Loop/Loop.tsx:645-653`'s internal sheet actually sets
   `textMode`. Hub's sheet (`RecallHub.tsx:279-284`), Recall history's sheet
   (`RecallHistory.tsx:242-247`), and the standalone `/cannot-speak` route
   (`CannotSpeakSheet.tsx:52-57`) all do a bare `router.push('/loop'...)` with
   no text-mode flag, and `app/loop/page.tsx:9-11` has no mechanism to start
   `Loop` in text mode from a URL. Walked concretely: a returning student with
   mic permission already granted who says "I can't speak right now" from Hub
   lands on Loop facing a **live mic button**, not text entry — the intent-
   based door into the sheet, not just the OS-denial door, silently fails its
   own promise. Also inconsistent within one screen: `RecallHub.tsx:258`
   threads the selected topic into the primary CTA but not into the escape-
   sheet CTA three lines later.
2. **Summary is structurally disconnected from the session actually
   played.** `screens/Loop/Loop.tsx:108` passes only a boolean
   (`allClear`) to `/summary`, never the real `results`/`termsCount`/`topic`.
   `app/summary/page.tsx:10-27` renders one of two entirely hardcoded,
   Research-Methods-flavored result sets regardless of what topic was played.
   A student who plays Cell biology sees Research Methods terms they never
   said. Compounding: the shipped `ALL_CLEAR_RESULTS` fixture itself includes
   a `flagged: true` row, which contradicts `Loop.tsx:107`'s own code
   definition of "all clear" (`!results.some(r => r.flagged)`) — the demo data
   doesn't satisfy the app's own rule for the state it's illustrating. This is
   also `docs/SPEC.md`'s own already-flagged Open item #12 (verified present
   in the code, not just in the doc).
3. **The mic-permission primer doesn't function as a Principle-3 primer.**
   `Loop.tsx:311-345`'s pre-start card is a generic session intro ("Today: 5
   terms... tap to start"), not mic-specific framing; the very next tap fires
   the real native permission dialog directly.
4. Minor: `RecallHub.tsx:218-224`'s locked-row "Read the lesson" button has
   `variant="Tertiary"` (looks live/tappable) but **no `onClick` at all** —
   invites a tap that does nothing, unlike Home's genuinely inert placeholder
   chips (Scan/Quiz/Upload), which are plain `Chips`, not `Button`s.

**What's handled well, per this critic (stated for balance, not part of the
score):** the in-Loop failure ladder (Try again/Hint, the dispute/flag contest
path, coral-not-red for Miss, no auto-advance forcing past feedback) reads as
genuinely generous, matching `design-brief.md`'s "judge generously" mandate.
Skip is correctly gated only during Recording/Transcribing.

**Blind spot named by this critic:** could not confirm whether a real user
would notice the text-fallback failure quickly enough to self-correct before
touching the live mic, nor whether the transcribing/wait timing chain
(900ms/700ms/1200ms) reads as calm rather than jarring in motion.

---

## critic-ambition's read — 6/10 (kept separate, not part of the total above)

Non-adversarial; scores how far the design reaches beyond the safe, compliant
choice, not correctness. Per its own calibration, 5 is the ceiling for
"every rule followed, no real risk taken"; this project clears that via three
genuine departures from the safer default: the uncapped dispute/flag path
(`Loop.tsx:256-265`), the correction control persisting through every verdict
instead of just Wait (`Loop.tsx:401-413`), and the live per-bar waveform
animation. But at the three specific moments where the product is telling the
student something important, it repeatedly reached for the flat/inline/
unstyled version over a stronger real component already sitting in the same
file:

1. **Every "Got it" verdict shows no reward.**
   `screens/Loop/Loop.tsx:500-512`'s `success` branch renders only
   `VerdictBadge`, no XP shown in the moment it's earned — despite
   `components/XpPill/XpPill.tsx`'s `S` size existing specifically for "the
   in-card pill beside a verdict," and the real per-outcome point values
   already computed one file away (`Summary.tsx:140-143`). **Fix:** add
   `<XpPill size="S" label={...} />` beside `VerdictBadge` in the success
   branch only (not miss/almost/flagged — `XpPill`'s own documented "Don't"
   forbids zero-point use).
2. **Summary's all-clear block is hand-rolled from raw tokens**
   (`Summary.tsx:202-243`) one screen-length below where the same file already
   uses `SessionHero` once (`Summary.tsx:181`) — `SessionHero`'s own
   `Center`/`Card` story is literally named `'Center, Card (all-clear)'`
   (`SessionHero.stories.tsx:161-175`) with near-verbatim matching copy.
   **Fix:** replace the hand-rolled block with `SessionHero align="Center"
   surface="Card"`, zero new imports needed.
3. **Home's dismissed state is a blank scroll region**
   (`Home.tsx:110`, `dismissed ? null : ...`) — the safest possible
   resolution for what the method calls a highest-leverage empty-state moment.
   `SessionHero`'s `Center`/`None` shape exists for exactly this ("this block
   only ever states something"). Weakest of the three fixes on "zero extra
   work" (needs new imports in `Home.tsx`), but still built from existing
   components only.

**Blind spot named by this critic:** couldn't confirm whether `SessionHero`'s
`Card` surface actually sits comfortably below Summary's flatter `ResultRow`
instances in real scroll flow, or reads as an oddly heavy final block — a
render question, not a code one.
