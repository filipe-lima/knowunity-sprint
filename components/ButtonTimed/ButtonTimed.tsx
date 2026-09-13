import type { HTMLAttributes } from 'react';

/**
 * Read from the Figma component set "buttonTimed" (node 13734:32501, file
 * u3BZUg8k5p3mrOrKAnYO5c, page "New components", inside the "Button
 * timed" wrapper frame). Carries no Figma description of its own (its
 * `description` field is literally null) — every prop and default below
 * comes straight from its own componentPropertyDefinitions and directly
 * diffing the progress=0 and progress=100 instances, cross-checked
 * against docs/design-system.md's own account.
 *
 * `progress` (0/25/50/75/100, default 0) is the one real VARIANT property
 * — the same five-step convention as progressIndicator. Built as its own
 * component rather than a new axis on Button, which would have meant 180
 * variants for one first-run screen.
 *
 * No other property is exposed. The visible label ("Start") is hardcoded,
 * not a component property — docs/design-system.md is explicit that this
 * is "a deliberate scope limit to stay inside what was actually asked for
 * this round, not an oversight." Reproduced the same way here.
 *
 * Structurally this is two absolutely-positioned layers confirmed
 * directly via the plugin API (`layoutPositioning: "ABSOLUTE"` on both
 * children, at every progress step, not a normal flex arrangement despite
 * the frame's own HORIZONTAL layout mode): a full-size track
 * (background/surface) and a "Fill Elapsed" bar (accent/brand/bold) that
 * grows left-to-right from x=0, with the "Start" label centered on top of
 * both, independent of the fill's width. This inverts the usual
 * Primary-button colour relationship on purpose, matching the one real
 * reference instance in the file.
 *
 * **A real accessibility gap, found and fixed, not just flagged:** the
 * real instance's own fixed text/primary label color measures 3.14:1
 * against the grown accent/brand/bold fill at 75/100% progress — under
 * the 4.5:1 WCAG AA minimum, and a real failure since this label is
 * permanent, load-bearing content, not decoration. Reproduced faithfully
 * at 0/25/50% (where it was never broken — still comfortably over the
 * dark track); at 75/100% the label switches to accent/brand/on-bold,
 * this codebase's own real token for "content colour placed on
 * accent/brand/bold," restoring contrast without touching the passing
 * cases or inventing a new color.
 *
 * The fill width itself is not a token — confirmed directly against both
 * fetched instances (0px at progress=0, 358px, the frame's own full
 * width, at progress=100); the values for 25/50/75 are the same computed
 * geometry docs/design-system.md already names (90/179/269px against the
 * 358-wide frame), the same category of value as termPip's row width.
 * The 358x56 frame itself is also unbound in Figma (no width/height entry
 * in its own boundVariables, unlike its radius) — reproduced as a literal
 * for the same reason as topBar/recordControl/sheet's confirmed-hardcoded
 * widths, not invented as a new token.
 */
export type ButtonTimedProgress = '0' | '25' | '50' | '75' | '100';

export interface ButtonTimedProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  progress?: ButtonTimedProgress;
}

// Computed geometry against the 358-wide frame — not a token, matching
// docs/design-system.md's own account.
const FILL_WIDTH: Record<ButtonTimedProgress, string> = {
  '0': '0px',
  '25': '90px',
  '50': '179px',
  '75': '269px',
  '100': '358px',
};

// A real, measured accessibility gap, fixed here rather than left flagged:
// the label is centered at x~156-202 of the 358-wide track. A fixed
// text/primary (near-white) label — the real Figma instance's own color —
// passes contrast comfortably at 0/25/50% (still mostly or entirely over
// the dark background/surface track) but fails at 75/100%, once the
// accent/brand/bold fill has grown underneath it (measured: 3.14:1 against
// a 4.5:1 requirement). accent/brand/on-bold is this codebase's own real
// token for "content colour placed on accent/brand/bold" — switching to it
// once the fill has actually reached the label restores contrast without
// touching the 0/25/50% cases, which were never broken.
const LABEL_COLOR: Record<ButtonTimedProgress, string> = {
  '0': 'var(--color-text-primary)',
  '25': 'var(--color-text-primary)',
  '50': 'var(--color-text-primary)',
  '75': 'var(--color-accent-brand-on-bold)',
  '100': 'var(--color-accent-brand-on-bold)',
};

export function ButtonTimed({ progress = '0', style, ...rest }: ButtonTimedProps) {
  return (
    <div
      data-progress={progress}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        width: '358px',
        height: '56px',
        borderRadius: 'var(--radius-full)',
        background: 'var(--color-background-surface)',
        overflow: 'hidden',
        ...style,
      }}
      {...rest}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: FILL_WIDTH[progress],
          borderRadius: 'var(--radius-full)',
          background: 'var(--color-accent-brand-bold)',
        }}
      />
      <span
        style={{
          position: 'relative',
          fontFamily: 'var(--font-family-default)',
          fontWeight: 'var(--font-weight-semibold)',
          fontSize: 'var(--font-size-md)',
          lineHeight: 'var(--font-line-height-md)',
          letterSpacing: 'var(--font-tracking-loose)',
          color: LABEL_COLOR[progress],
        }}
      >
        Start
      </span>
    </div>
  );
}
