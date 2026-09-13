import type { HTMLAttributes } from 'react';

/**
 * Read from the Figma component set "termPip" (node 13734:32295, file
 * u3BZUg8k5p3mrOrKAnYO5c, page "New components", inside the "Term pip"
 * wrapper frame). Every prop name and option below is that component's
 * own: state is its one VARIANT property (Done/Current/Upcoming). No
 * other properties or slots exist — Figma's own description: "A single
 * filled frame with no children — do not add one."
 *
 * Height is a real token (Space/150, 6px) confirmed directly against all
 * three variants. Width is deliberately NOT a token — Figma's own
 * description: "Width is deliberately unbound: it stretches to fill
 * whatever row it sits in, so the 24px width on this master component is
 * just a resting default, not a token." Every real instance sets FILL
 * inside a row, so this component defaults to filling its container
 * rather than reproducing that literal 24px, which was never meant to be
 * the real width anywhere it's actually used.
 *
 * The row itself ("Term Pips") is explicitly documented as NOT a
 * component — a plain auto-layout pattern (HORIZONTAL, Space/150 gap,
 * children set to FILL), kept deliberately raw because a real termPips
 * component would have needed 88 variants for a 6px bar. So there is no
 * TermPips component here either — see TermPip.stories.tsx for the row
 * demonstrated as that same plain pattern, not a new component invented
 * to formalize it.
 */
export type TermPipState = 'Done' | 'Current' | 'Upcoming';

export interface TermPipProps extends HTMLAttributes<HTMLDivElement> {
  state?: TermPipState;
}

// There's an open, unresolved question upstream about accent/magenta/bold
// here: it's also the color behind recordControl's amplitude bars, while
// progressIndicator uses accent/brand/bold for the same "progress" idea.
// Reproduced as-is, not resolved in this build.
const FILL: Record<TermPipState, string> = {
  Done: 'var(--color-accent-magenta-bold)',
  Current: 'var(--color-text-primary)',
  Upcoming: 'var(--color-background-stacking)',
};

export function TermPip({ state = 'Upcoming', style, ...rest }: TermPipProps) {
  return (
    <div
      style={{
        flex: '1 1 0%',
        height: 'var(--space-150)',
        borderRadius: 'var(--radius-full)',
        background: FILL[state],
        ...style,
      }}
      {...rest}
    />
  );
}
