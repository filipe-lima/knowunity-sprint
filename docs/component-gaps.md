# Component gaps

Per `.claude/skills/build-screen/SKILL.md`: a running list of things built
inline, inside a screen file, because nothing in `components/` fit — not
real components yet. Read before building a new screen; if a gap listed
here would also serve your screen, promote it to a real component instead
of building a second inline copy (see the skill for that process).

- **Summary's all-clear block** (mascot + a short title + a body line, no
  actions) — `screens/Summary/Summary.tsx`. `KnowieMessage` was the
  obvious candidate but its real shape is mascot + one message string + an
  `Actions` slot that defaults to real buttons, built for a prompt with
  actions, not a two-line informational block with none. Built inline from
  `MascotSlot` + `MascotArt` + plain text. If a second screen needs this
  same shape, build it as a real component instead of a second inline copy.
- **Screen headers (back icon + centered title) — promoted 2026-09-17.**
  Was `screens/Hub/ScaffoldHeader.tsx`, shared by `RecallHub` and
  `RecallHistory` (both restored 2026-09-16); now
  `components/ScaffoldHeader/ScaffoldHeader.tsx` + `.stories.tsx`, per
  this file's own promotion rule (2+ real screens needing the same
  inline shape). Neither of `TopBar`'s two real variants reproduces this
  layout (`Title` is left-aligned next to Leading; `Centered` has no
  Leading slot at all). Live-checked on promotion against Hub C's real
  `appBar` instance: its real back icon (`arrow-left`) and real 15px
  SemiBold title text already matched this component's own type/icon
  size exactly — nothing needed correcting, only reused. Its real layout
  is left-aligned, not centered; this component's centered composition
  is a deliberate, documented divergence, matching `design-system.md`'s
  own rule for a static screen. Added live to Figma too, on the "New
  components" page — see that component's own description.
- **Transcribing has no real visual design** — `screens/Loop/Loop.tsx`.
  `components/RecordControl.tsx`'s own doc comment: only Idle and
  Recording are actually drawn anywhere in the real file; Submitting and
  Disabled are undesigned gaps. Built here as `RecordControl`
  `state="Recording"` with `caption="Transcribing"` and both control
  handlers omitted (inert, not visually disabled). **Resolved
  2026-09-17:** the amplitude bars now genuinely read frozen (rather than
  "static because nothing animates regardless of state," true until this
  date) — `RecordControl` gained a real `amplitudeFrozen` prop (see the
  live-animation entry below) and this call site passes it, fulfilling
  `SPEC.md`'s own "bars stay visible but freeze" line for this beat for
  the first time. Still needs a real Figma addition (a third
  RecordControl state) before the rest of this beat — caption styling,
  layout — can be built properly; only the bars' freeze behavior is
  resolved here.
- **A small icon + caption status row** ("Checking" on Wait; "Answering by
  text for this session" on text mode) — `screens/Loop/Loop.tsx`, built
  inline both times from `IconSlot` + plain text, not a shared local
  helper yet. Repeats twice within this one screen already — worth
  extracting to a small shared piece (or a real component, if `Chips` or
  similar doesn't already cover it) before a third screen needs the same
  shape.
- **Summary's result row** (leading status `iconSlot` + title/subtitle +
  trailing XP number) — `screens/Summary/Summary.tsx`, local component
  `ResultRow`. Figma's own layer name is the bespoke, un-componentized
  `bucket / NEW` frame, not a real `listRow` instance. This is the same
  `row / NEW` family used by Hub's `HubRow` (below) and Recall history's
  `TermBucketRow` and Home's excluded Continue-studying rows — a real,
  recurring pattern across at least 3 built screens now (icon/emoji
  leading + title/subtitle + a trailing slot that varies per usage:
  a number here, a `chips` badge on Hub, nothing on Recall history).
  Worth promoting to one real shared component rather than three separate
  inline copies — not done in this pass since each usage's trailing
  content differs enough to need a real decision about the shared shape,
  not a mechanical merge.
- **Hub's rows** (`HubRow`) — `screens/Hub/RecallHub.tsx`. None of the 7
  real rows on `Hub C — The queue` are `ListRow` instances; Figma's own
  layer names are the `row / NEW` family (see the note above — same
  pattern as Summary's `ResultRow` and Recall history's `TermBucketRow`).
  Trailing content varies per row (a `chips` badge, a real `button`, or a
  bare chevron) — built as one local component with a flexible `trailing`
  slot rather than three near-duplicate rows.
- **Hub's "Read the lesson" and "Start a new Recall" have no real
  destination** — `screens/Hub/RecallHub.tsx`. Both are real, tappable
  rows/buttons in Figma, but no lesson-reading or note-upload screens
  exist in this sprint's scope — same resolution as Home's inert Scan/
  Quiz/Upload chips: present, not wired to a destination, flagged rather
  than invented.
- **Navbar's icon colors don't fully map to this codebase's tokens** —
  `components/Navbar/Navbar.tsx`. The real Active icon resolves to a
  Figma variable named `interactive/primary` (no exact match in
  `tokens/tokens.json`, which only has the `/default`, `/hover`, `/active`,
  `/on` sub-keys) — approximated as `--color-interactive-primary-default`.
  One real Inactive tab (`trophy-02`) resolves to `palette/blue/tint`,
  which has no match at all — approximated as
  `--color-accent-blue-on-subtle`, exposed as a per-tab `color` override
  rather than baked into the component, since it may be a Figma authoring
  mistake rather than a deliberate signal. Worth a real decision from
  whoever owns the Figma file.
- **Avatar's per-size pixel dimensions aren't fully confirmed** —
  `components/Avatar/Avatar.tsx`. The Desktop Bridge connection dropped
  mid-session before each of the three real `Size` variants' own
  intrinsic dimensions could be checked directly — only one instance
  (`Large`, rendered at 24×24 in the Navbar) was confirmed. Medium/Small
  are sized on the `--icon-250`/`--icon-200` step tokens as a reasonable
  scale, not confirmed against the component set itself.
- **Recall chip's brain glyph has no real asset** — `screens/Home/Home.tsx`.
  Figma's own layer name is literally `chip / Recall / NEW (brain glyph
  pending library)` — the source file has no resolved icon either, not
  just this codebase. Built with a `lucide-react` `Brain` placeholder,
  mirroring Figma's own flag rather than inventing a resolved icon.
- **Home's streak chip icon visibility is unconfirmed** —
  `screens/Home/Home.tsx`. The real Figma instance's own
  `showLeftIcon`/`showRightIcon` properties both read `false`, but the
  real screenshot clearly shows a leading icon before "7 day streak" —
  built here WITH a leading icon (a `lucide-react` `Trophy` placeholder,
  matching the visible screenshot over the possibly-stale boolean
  properties), not reconciled with Figma's own contradictory data.
- **Home's composer is missing a second real icon** —
  `screens/Home/Home.tsx`. The real frame shows a "camera" icon inside
  the field alongside the mic (`iconSlot / camera glyph missing` — also
  unresolved in Figma's own source), but `ChatInput`
  (`components/ChatInput/ChatInput.tsx`) has no slot for a second icon —
  every icon position is fixed per its own `status`, not a swappable
  slot. Not reproduced; would need a real change to the shared component,
  which affects Loop's text mode too, not just this one screen.
- **Home's "Continue studying" section is deliberately not built** —
  `screens/Home/Home.tsx`. Explicitly excluded on request when Home's
  scope was agreed (2026-09-16) — its heading, "View all" button, and the
  two hardcoded material rows (`row / NEW` in Figma) are absent by
  decision, not by oversight. Revisit only if asked.
- **The persistent correction control's pencil icon has no real asset,
  in code or in Figma** — `screens/Loop/Loop.tsx`'s
  `renderCorrectionControl`. Checked directly: no component or instance
  named "pencil" or "edit" exists anywhere in the Figma file's icon
  library. Built with a `lucide-react` `Pencil` placeholder in code; the
  live Figma edits (Loop 5/6/8/13, node `13759:45445` etc.) clone the
  real "That's not what I said" button as-is, unmodified, so Figma's copy
  of this control doesn't have the pencil either — same gap in both
  places, not just this codebase.
- **Wait's Checking → correction-control sequencing isn't represented in
  Figma as a second frame** — `screens/Loop/Loop.tsx`'s `checkingDone`
  timer. Figma frames in this file are static, one per meaningful visual
  state; this is a ~700ms-in timing swap within a single screen, not a
  new state a student navigates to. The real Wait frame (node
  `13759:45381`) was updated to match the **resting**/first-shown phase
  (Checking alone); the second phase (correction control replacing it)
  exists only as code behavior. If this pattern gets used again, worth a
  real decision on how (or whether) to represent timed sub-phases in this
  Figma file at all.
- **Every term's mic path must carry real transcript text — no exceptions,
  even for a "skip-demonstration" term** — `screens/Loop/script.ts`.
  "Random assignment" (term 5) used to ship with `transcript: ''` on both
  variants, reasoning that "skip never reaches a verdict" so no content
  was needed. That reasoning only covers the Skip path
  (`handleTopSkip` in `screens/Loop/Loop.tsx`, which calls
  `goToNextTerm()` directly and never renders a card) — nothing stops a
  student recording on that term instead, which reached a real verdict
  with a blank "You said" block. Fixed 2026-09-16 with real mocked
  content on both variants, same shape as every other term. If a future
  term is added specifically to demonstrate a bypass path (skip, discard,
  etc.), give it real transcript content too — the "this path is never
  actually rendered" assumption doesn't hold for anything a student can
  reach by just... recording normally.
- **Every scripted variant's final attempt must be `'success'` — never a
  repeating `miss`/`almost`** — `screens/Loop/script.ts` (stated in full
  in the file's own header comment; logged here too since it's the same
  category of "real bug, now a hard rule" as the entry above).
  `attemptIndex` clamps to a variant's last attempt once "Try again" runs
  out of scripted attempts (`handleTryAgain` in `screens/Loop/Loop.tsx`),
  so a variant whose only/last attempt is non-terminal becomes a closed
  loop — confirmed live 2026-09-16 on Internal validity (reported bug)
  and Ecological validity's Discard-alternate (found auditing for the
  same class of issue). Both fixed by adding a second, successful
  attempt. Also why Reveal (a second miss escalating to a mandatory
  explanation) was removed entirely the same day, not just the bare-retry
  path into it — see the next entry.
- **Say-it-back (Loop 10, a real confirmed Figma screen) currently has no
  trigger anywhere in the app** — `screens/Loop/Loop.tsx`. Its only entry
  point was Reveal, removed entirely 2026-09-16 on direct request since
  Reveal itself was never part of the committed flow (no "Loop 9" exists
  in the real 17-frame set) — see `docs/SPEC.md`'s and
  `docs/sprint-context.md`'s matching updates. Not deleted, just
  currently dead code with a real screen behind it; needs a real decision
  on whether/how it gets a new trigger before it's genuinely unused
  weight rather than a flagged gap.
- **`RecordControl`'s Pause/Resume control has no real icon asset, in
  code or in Figma** — `components/RecordControl/RecordControl.tsx`.
  Checked directly: no component named "pause" or "play" exists anywhere
  in the Figma file's icon library (same situation as the correction
  control's missing pencil). Code uses `lucide-react`'s real `Pause`/
  `Play` icons as placeholders; the live Figma variant (node
  `13734:32389`) instead reuses `Discard`'s real button shape with a
  different label, so at least the two stay visually honest with each
  other even though neither has the "real" glyph.
- **`RecordControl`'s Paused amplitude-bar dim amount has no governing
  token** — `components/RecordControl/RecordControl.tsx`. Opacity `0.4`
  is a hand-typed value (`tokens/tokens.json` has no opacity scale at
  all, checked — this codebase has never needed one before). Flagged
  rather than inventing a new token for this one use.
- **`RecordControl`'s amplitude meter now animates live — code-only,
  Figma has no way to represent it** — `components/RecordControl/
  RecordControl.tsx`'s `AmplitudeMeter`, added 2026-09-17 on direct
  request. Figma's own Recording frame is (and can only ever be) one
  static resting-waveform snapshot; there's no variant to add for
  motion, unlike `Paused`, which was a genuinely new discrete state that
  did get a real component variant. Each bar now oscillates around its
  own resting literal via a per-bar sine wave plus light jitter
  (`transform: scaleY`, CSS-transitioned) while `live` — simulated, not
  real audio reactivity, since this app never processes real audio (see
  this component's own file-level doc comment). A new `amplitudeFrozen`
  prop lets a caller force the bars static without fading — used by
  Loop's Transcribing beat, above. **Real bug, found testing 2026-09-17:**
  `amplitudeFrozen` was declared only on `RecordControlRecordingProps`,
  so `RecordControl`'s own top-level destructuring (`const { state,
  escape, ... } = props`) never extracted it — it fell into `...rest` and
  got spread onto the root `<div>`, firing a real React "does not
  recognize the `amplitudeFrozen` prop on a DOM element" console error on
  every render, any state (caught live via the Next.js dev overlay, not
  by lint or `tsc` — this is a runtime-only React DOM warning, invisible
  to both). Fixed by moving `amplitudeFrozen` onto the shared
  `RecordControlBase` interface (same place `onPauseClick`/
  `onResumeClick` already live despite being state-specific too) and
  destructuring it explicitly, so it never reaches `rest` regardless of
  state. `caption` was already exposed the same latent way (declared per
  state-variant interface, read via `props.caption` instead of
  destructured) — fixed alongside it for the same reason, even though no
  call site happened to trip a visible warning for it yet.
- **Recall history's section headers don't fit any real `TextBlock`
  variant** — `screens/Hub/RecallHistory.tsx`. Re-checked live 2026-09-16
  (node `13759:45818`) at direct request: the real headers ("Skipped,"
  "Said recently," "Never said out loud") are 21px Bold
  (`--font-size-lg`), and none of `TextBlock`'s 4 real variants hit that
  — checked all: XL 76px, L 44px (what this screen used before, over 2×
  too large), M 18px SemiBold, S 15px SemiBold. Rendered as a plain
  `<h3>` styled directly instead of forcing a `TextBlock` prop that
  doesn't exist. Also corrected the same day: this screen's row shape
  (the `bucket`/`row / NEW` family also used by Hub's `HubRow` and
  Summary's `ResultRow`, see above) actually covers all 3 sections, not
  just "Never said out loud" — the first two sections used real `ListRow`
  instances before, which was the wrong component for 6 of the 8 rows.
  Corrected icon/color per section, all confirmed live: "Skipped" →
  `Loader2` / `accent/coral/bold`; "Said recently" → `CheckCircle2` /
  `feedback/success/bold`; "Never said out loud" → `Mic` /
  `text/secondary` (was defaulting to `text/primary` before — a real
  color fix, not just a shape one). Row titles and subtitles are both
  real 12px (`--font-size-xs`), not the 15px used before.
