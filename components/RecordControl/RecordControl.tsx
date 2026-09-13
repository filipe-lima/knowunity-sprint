import type { HTMLAttributes, ReactNode } from 'react';

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
 * height) — a static snapshot of one real waveform-at-rest moment, not a
 * live meter. Reproduced as the exact literals Figma draws, same
 * treatment as every other unbound literal found this session (TopBar's
 * 390 width, TermPip's 24px resting default). Their fill,
 * accent/magenta/bold, is the same open colour question TermPip's own
 * docs already flagged (shared with progress's Done state) — reproduced
 * as-is, not resolved here.
 *
 * caption's default text differs by state in the real file (Idle: "Tap to
 * answer", Recording: "Listening") — modeled as one prop with a
 * state-appropriate default rather than two separate hardcoded strings,
 * since it's genuinely the same property in Figma.
 */
export type RecordControlState = 'Idle' | 'Recording';

interface RecordControlBase extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Escape-hatch slot, real on both variants. Empty by default — matches
   *  Recording's real instance; Idle's real instance fills it with a
   *  Tertiary/M Button ("I can't speak right now"), reproduced in the
   *  story, not here. */
  escape?: ReactNode;
  onMicClick?: () => void;
  onDiscardClick?: () => void;
  onSubmitClick?: () => void;
}

export interface RecordControlIdleProps extends RecordControlBase {
  state: 'Idle';
  caption?: string;
}

export interface RecordControlRecordingProps extends RecordControlBase {
  state: 'Recording';
  caption?: string;
}

export type RecordControlProps = RecordControlIdleProps | RecordControlRecordingProps;

const ROOT_GAP: Record<RecordControlState, string> = {
  Idle: 'var(--space-300)',
  Recording: 'var(--space-400)',
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

function MicGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" aria-hidden="true">
      <rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor" />
      <path
        d="M6 11a6 6 0 0012 0M12 19v2"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </svg>
  );
}

function DiscardGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}

function SubmitGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" aria-hidden="true">
      <path
        d="M5 13l4 4 10-10"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AmplitudeMeter() {
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
      }}
    >
      {AMPLITUDE_BAR_HEIGHTS.map((height, index) => (
        <div
          key={index}
          style={{
            width: 'var(--space-100)',
            height: `${height}px`,
            borderRadius: 'var(--radius-full)',
            background: 'var(--color-accent-magenta-bold)',
          }}
        />
      ))}
    </div>
  );
}

export function RecordControl(props: RecordControlProps) {
  const { state, escape, onMicClick, onDiscardClick, onSubmitClick, style, ...rest } = props;
  const caption = props.caption ?? (state === 'Idle' ? 'Tap to answer' : 'Listening');

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
        <ButtonIcon variant="Primary" size="L" aria-label="Start recording" icon={<MicGlyph />} onClick={onMicClick} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-400)' }}>
          <AmplitudeMeter />
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-600)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-150)' }}>
              <ButtonIcon variant="Secondary" size="M" aria-label="Discard" icon={<DiscardGlyph />} onClick={onDiscardClick} />
              <p style={ACTION_LABEL_STYLE}>Discard</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-150)' }}>
              <ButtonIcon variant="Primary" size="L" aria-label="Submit" icon={<SubmitGlyph />} onClick={onSubmitClick} />
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
