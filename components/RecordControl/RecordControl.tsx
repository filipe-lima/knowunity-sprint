import type { HTMLAttributes, ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { Mic, X, Check, Pause, Play } from 'lucide-react';

import { ButtonIcon } from '../ButtonIcon/ButtonIcon';

/**
 * Read from the Figma component set "recordControl" (node 13734:32389, file
 * u3BZUg8k5p3mrOrKAnYO5c, page "New components", inside the "Record
 * control" wrapper frame). Figma's own description, verbatim (goes into
 * the story docs too): the plan calls for 4 states, but only Idle and
 * Recording are actually drawn anywhere in the file (48 real instances
 * between them) — Submitting and Disabled are undesigned gaps, not
 * invented here. Fixed height 215 on both built variants, so switching
 * state never reflows whatever sits below this control.
 *
 * Genuine reuse: Idle's mic control and Recording's Discard/Submit
 * controls are all real `buttonIcon` instances (already
 * components/ButtonIcon in this codebase) — Mic is Primary/L, Discard is
 * Secondary/M, Submit is Primary/L. None of the three is a Figma SLOT
 * (they're fixed instances, not swappable), so — matching the precedent
 * set by VerdictBadge's per-variant glyphs — the icon each one shows is
 * hardcoded inside this component rather than exposed as a prop. The
 * actual vector data behind each real instance wasn't retrievable (the
 * deep-fetch tool's depth limit was reached before the glyph's own vector
 * children), so the three glyphs below are simple, faithful
 * approximations, not the exact traced paths.
 *
 * Escape *is* a real Figma SLOT, present on both variants, so it's a
 * genuine `escape?: ReactNode` prop here — left empty by default, matching
 * Recording's own real instance (collapsed to 1x1 with no children).
 * Idle's real instance fills it with a `button` (Tertiary/M, CTA "I can't
 * speak right now") — reproduced in the story by passing a real
 * components/Button there, not baked into this component.
 *
 * The 11 amplitude bars are literal, unbound pixel heights in the real
 * Recording instance (only their width/radius are token-bound, not their
 * height) — Figma's own frame is a static snapshot of one real
 * waveform-at-rest moment, so those 11 literals are reproduced here as
 * each bar's resting/max height, same treatment as every other unbound
 * literal found this session (TopBar's 390 width, TermPip's 24px resting
 * default). Their fill, accent/magenta/bold, is the same open colour
 * question TermPip's own docs already flagged (shared with progress's
 * Done state) — reproduced as-is, not resolved here.
 *
 * **Live animation added 2026-09-17, on direct request.** Figma can only
 * ever show that one static resting frame — it has no way to represent
 * motion — so this is a code-only addition, not something "confirmed
 * live" the way a new variant would be. While `live` (Recording), each
 * bar's height oscillates from its own resting literal via a per-bar
 * sine function (distinct phase/frequency so bars don't move in
 * lockstep) plus light periodic jitter, applied as `transform: scaleY`
 * with a short CSS transition for interpolation — transform-only, so
 * it's compositor work, not layout/paint. This is a **simulated** wave,
 * not a real audio analyser: this app never processes real audio
 * (`docs/design-system.md`'s hard rule), so it can't actually react to
 * the student's voice level, only look like it does. `amplitudeFrozen`
 * (distinct from `dimmed`) lets a caller force the bars static without
 * fading them — see the Transcribing note below.
 *
 * caption's default text differs by state in the real file (Idle: "Tap to
 * answer", Recording: "Listening") — modeled as one prop with a
 * state-appropriate default rather than two separate hardcoded strings,
 * since it's genuinely the same property in Figma.
 *
 * **`Paused` added 2026-09-16, on direct request, overriding
 * `sprint-context.md`'s locked "No pause/resume into one take" decision**
 * — no real Figma instance exists for it either (same undesigned-gap
 * category as `Recording`'s own missing `Submitting`/`Disabled` states),
 * so it's built from this component's own existing real patterns rather
 * than invented from nothing: mirrors `Recording`'s layout exactly, adds
 * a third control (`Pause`/`Resume`, a `ButtonIcon` Secondary/M, same
 * treatment as `Discard`) between Discard and Submit, and dims the
 * amplitude meter to read as frozen (`dimmed` — faded *and* static,
 * distinct from Transcribing's `amplitudeFrozen`, static but full
 * opacity, per `docs/SPEC.md`'s own "stay visible but freeze" line for
 * that state). Added live to the real Figma component set too (node
 * `13734:32389`), not just built in code — see docs/component-gaps.md
 * for exactly what's confirmed vs. a judgment call.
 */
export type RecordControlState = 'Idle' | 'Recording' | 'Paused';

interface RecordControlBase extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Escape-hatch slot, real on both variants. Empty by default — matches
   *  Recording's real instance; Idle's real instance fills it with a
   *  Tertiary/M Button ("I can't speak right now"), reproduced in the
   *  story, not here. */
  escape?: ReactNode;
  onMicClick?: () => void;
  onDiscardClick?: () => void;
  onSubmitClick?: () => void;
  /** Paused only — see the file-level comment on this state's addition. */
  onPauseClick?: () => void;
  onResumeClick?: () => void;
  /** Recording only — forces the amplitude meter static without dimming
   *  it, for a screen-level beat that reuses `Recording`'s layout but
   *  shouldn't read as actively listening (e.g. Loop's Transcribing
   *  beat). Distinct from `Paused`'s `dimmed` treatment, which fades as
   *  well as freezes. On the shared base (like `onPauseClick`/
   *  `onResumeClick` above) rather than only on `RecordControlRecordingProps`
   *  so it destructures cleanly out of `rest` regardless of state — see
   *  this file's own render function. */
  amplitudeFrozen?: boolean;
}

export interface RecordControlIdleProps extends RecordControlBase {
  state: 'Idle';
  caption?: string;
}

export interface RecordControlRecordingProps extends RecordControlBase {
  state: 'Recording';
  caption?: string;
}

export interface RecordControlPausedProps extends RecordControlBase {
  state: 'Paused';
  caption?: string;
}

export type RecordControlProps = RecordControlIdleProps | RecordControlRecordingProps | RecordControlPausedProps;

const ROOT_GAP: Record<RecordControlState, string> = {
  Idle: 'var(--space-300)',
  Recording: 'var(--space-400)',
  Paused: 'var(--space-400)',
};

const CAPTION_STYLE = {
  fontFamily: 'var(--font-family-default)',
  fontWeight: 'var(--font-weight-regular)',
  fontSize: 'var(--font-size-xs)',
  lineHeight: 'var(--font-line-height-xs)',
  letterSpacing: 'var(--font-tracking-loose)',
  color: 'var(--color-text-secondary)',
  margin: 0,
} as const;

const ACTION_LABEL_STYLE = {
  fontFamily: 'var(--font-family-default)',
  fontWeight: 'var(--font-weight-regular)',
  fontSize: 'var(--font-size-2xs)',
  lineHeight: 'var(--font-line-height-2xs)',
  letterSpacing: 'var(--font-tracking-loose)',
  color: 'var(--color-text-secondary)',
  margin: 0,
} as const;

// The 11 real bar heights from the Recording instance, literal and
// unbound in Figma (see the file-level comment above).
const AMPLITUDE_BAR_HEIGHTS = [10, 20, 34, 48, 30, 52, 26, 40, 16, 28, 12];

// `dimmed` (Paused only) reduces the bars' opacity to read as frozen — a
// judgment call, not a real Figma property (see this file's Paused note).
// `live` (Recording, unless `frozen`) animates each bar around its own
// resting height via a per-bar sine wave (distinct phase/frequency so
// bars don't move in lockstep) plus light jitter — simulated, not real
// audio reactivity (see this file's live-animation note above). `frozen`
// forces the bars static without dimming (Transcribing).
function AmplitudeMeter({ dimmed, live, frozen }: { dimmed?: boolean; live?: boolean; frozen?: boolean }) {
  const animating = Boolean(live) && !frozen;
  const [scales, setScales] = useState<number[]>(() => AMPLITUDE_BAR_HEIGHTS.map(() => 1));
  const startRef = useRef(0);

  useEffect(() => {
    // Not animating: nothing to subscribe to — the render below already
    // falls back to a resting scaleY(1) per bar without needing state.
    if (!animating) return;
    startRef.current = Date.now();
    const id = setInterval(() => {
      const t = (Date.now() - startRef.current) / 1000;
      setScales(
        AMPLITUDE_BAR_HEIGHTS.map((_, index) => {
          const phase = index * 0.7;
          const frequency = 1.6 + (index % 4) * 0.35;
          const wave = Math.sin(t * frequency + phase);
          const jitter = Math.sin(t * 5.3 + index * 2.1) * 0.15;
          const scale = 0.55 + 0.4 * wave + jitter;
          return Math.min(1.15, Math.max(0.25, scale));
        }),
      );
    }, 100);
    return () => clearInterval(id);
  }, [animating]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-150)',
        paddingLeft: 'var(--space-600)',
        paddingRight: 'var(--space-600)',
        paddingTop: 'var(--space-300)',
        paddingBottom: 'var(--space-300)',
        borderRadius: 'var(--radius-full)',
        background: 'var(--color-background-stacking)',
        // No governing opacity token in tokens/tokens.json — flagged in
        // docs/component-gaps.md rather than inventing one for this alone.
        opacity: dimmed ? 0.4 : 1,
      }}
    >
      {AMPLITUDE_BAR_HEIGHTS.map((height, index) => (
        <div
          key={index}
          style={{
            width: 'var(--space-100)',
            height: `${height}px`,
            borderRadius: 'var(--radius-full)',
            // `frozen` (Transcribing) must stay visible per SPEC.md, not
            // dimmed like Paused — but a static frame at the live
            // recording color was pixel-indistinguishable from a live bar
            // that just happened to pause mid-wave (confirmed by
            // rendering both side by side). Swapping to text/secondary
            // gives the frozen beat its own unmistakable color, still at
            // full opacity, without reintroducing Paused's dimmed look.
            background: frozen ? 'var(--color-text-secondary)' : 'var(--color-accent-magenta-bold)',
            transform: `scaleY(${animating ? scales[index] : 1})`,
            transformOrigin: 'center',
            transition: 'transform 120ms ease-out',
          }}
        />
      ))}
    </div>
  );
}

export function RecordControl(props: RecordControlProps) {
  const {
    state,
    escape,
    onMicClick,
    onDiscardClick,
    onSubmitClick,
    onPauseClick,
    onResumeClick,
    amplitudeFrozen,
    caption: captionProp,
    style,
    ...rest
  } = props;
  const caption = captionProp ?? (state === 'Idle' ? 'Tap to answer' : state === 'Paused' ? 'Paused' : 'Listening');

  return (
    <div
      data-state={state}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: ROOT_GAP[state],
        width: '358px',
        height: '215px',
        boxSizing: 'border-box',
        ...style,
      }}
      {...rest}
    >
      {state === 'Idle' ? (
        <ButtonIcon variant="Primary" size="L" aria-label="Start recording" icon={<Mic style={{ width: '100%', height: '100%' }} />} onClick={onMicClick} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-400)' }}>
          <AmplitudeMeter
            dimmed={state === 'Paused'}
            live={state === 'Recording'}
            frozen={amplitudeFrozen}
          />
          {/* Per SPEC.md's Transcribing spec ("the take is locked the
              instant recording stops"): every control here disables the
              moment the meter freezes, not just the caption changing. */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-600)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-150)' }}>
              <ButtonIcon variant="Secondary" size="M" state={amplitudeFrozen ? 'Disabled' : 'Default'} aria-label="Discard" icon={<X style={{ width: '100%', height: '100%' }} />} onClick={onDiscardClick} />
              <p style={ACTION_LABEL_STYLE}>Discard</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-150)' }}>
              {state === 'Paused' ? (
                <ButtonIcon variant="Secondary" size="M" state={amplitudeFrozen ? 'Disabled' : 'Default'} aria-label="Resume" icon={<Play style={{ width: '100%', height: '100%' }} />} onClick={onResumeClick} />
              ) : (
                <ButtonIcon variant="Secondary" size="M" state={amplitudeFrozen ? 'Disabled' : 'Default'} aria-label="Pause" icon={<Pause style={{ width: '100%', height: '100%' }} />} onClick={onPauseClick} />
              )}
              <p style={ACTION_LABEL_STYLE}>{state === 'Paused' ? 'Resume' : 'Pause'}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-150)' }}>
              <ButtonIcon variant="Primary" size="L" state={amplitudeFrozen ? 'Disabled' : 'Default'} aria-label="Submit" icon={<Check style={{ width: '100%', height: '100%' }} />} onClick={onSubmitClick} />
              <p style={ACTION_LABEL_STYLE}>Submit</p>
            </div>
          </div>
        </div>
      )}
      <p style={CAPTION_STYLE}>{caption}</p>
      {escape}
    </div>
  );
}
