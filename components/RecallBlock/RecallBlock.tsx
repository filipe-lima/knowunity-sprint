import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

/**
 * Read from the Figma component set "recallBlock" (node 13734:32253, file
 * u3BZUg8k5p3mrOrKAnYO5c, page "New components", inside the "Recall block"
 * wrapper frame). Every prop name and option below is that component's
 * own: variant is its one VARIANT property (Transcript/Hint/Explanation/
 * Confirm in Figma), label/body its two text properties, Actions its one
 * slot. See RecallBlock.stories.tsx for the component's own written
 * description.
 *
 * Confirmed directly (not inferred from the written description alone):
 * Transcript and Confirm fill background/stacking; only Hint takes
 * accent/blue/subtle. Confirm genuinely inverts the emphasis of the other
 * variants — its label is the heavier style (matching headline-xxs-bold)
 * on text/primary and its body the lighter one (matching caption-m-
 * regular) on text/secondary, while Transcript/Hint share the opposite
 * pairing: a lighter label (caption-m-bold) on text/secondary (text/
 * accent-blue-on-subtle for Hint specifically) over a heavier body
 * (body-s-regular) on text/primary.
 *
 * `Explanation` — real in Figma, not implemented here — was this
 * component's fourth variant, used only for the "Reveal" state's
 * re-explanation copy. Removed 2026-09-18 along with the Reveal flow it
 * exclusively served (see docs/SPEC.md); not a case of inventing past
 * what Figma defines, the opposite: intentionally not reproducing a real
 * variant that no longer has anywhere to appear.
 */
export type RecallBlockVariant = 'Transcript' | 'Hint' | 'Confirm';

export interface RecallBlockProps extends HTMLAttributes<HTMLDivElement> {
  variant?: RecallBlockVariant;
  label: string;
  body: string;
  /**
   * The Actions slot. Figma's own description: "The correction control
   * ('That's not what I said') lives in the Actions slot, not as a
   * sibling of this block. Resolved transcripts leave the slot empty and
   * it collapses." Omitted entirely (not just empty) when not provided,
   * matching that collapse behavior.
   */
  children?: ReactNode;
}

const LABEL_FONT_READBACK: CSSProperties = {
  fontFamily: 'var(--font-family-default)',
  fontWeight: 'var(--font-weight-semibold)',
  fontSize: 'var(--font-size-xs)',
  lineHeight: 'var(--font-line-height-xs)',
  letterSpacing: 'var(--font-tracking-loose)',
};

const BODY_FONT_READBACK: CSSProperties = {
  fontFamily: 'var(--font-family-default)',
  fontWeight: 'var(--font-weight-regular)',
  fontSize: 'var(--font-size-sm)',
  lineHeight: 'var(--font-line-height-sm)',
  letterSpacing: 'var(--font-tracking-loose)',
  color: 'var(--color-text-primary)',
};

const LABEL_FONT_CONFIRM: CSSProperties = {
  fontFamily: 'var(--font-family-default)',
  fontWeight: 'var(--font-weight-semibold)',
  fontSize: 'var(--font-size-sm)',
  lineHeight: 'var(--font-line-height-xs)',
  letterSpacing: 'var(--font-tracking-loose)',
  color: 'var(--color-text-primary)',
};

const BODY_FONT_CONFIRM: CSSProperties = {
  fontFamily: 'var(--font-family-default)',
  fontWeight: 'var(--font-weight-regular)',
  fontSize: 'var(--font-size-xs)',
  lineHeight: 'var(--font-line-height-xs)',
  letterSpacing: 'var(--font-tracking-loose)',
  color: 'var(--color-text-secondary)',
};

function resolveVisuals(variant: RecallBlockVariant) {
  const background =
    variant === 'Hint' ? 'var(--color-accent-blue-subtle)' : 'var(--color-background-stacking)';

  if (variant === 'Confirm') {
    return { background, labelFont: LABEL_FONT_CONFIRM, bodyFont: BODY_FONT_CONFIRM };
  }

  const labelColor = variant === 'Hint' ? 'var(--color-accent-blue-on-subtle)' : 'var(--color-text-secondary)';
  return {
    background,
    labelFont: { ...LABEL_FONT_READBACK, color: labelColor },
    bodyFont: BODY_FONT_READBACK,
  };
}

export function RecallBlock({
  variant = 'Transcript',
  label,
  body,
  style,
  children,
  ...rest
}: RecallBlockProps) {
  const { background, labelFont, bodyFont } = resolveVisuals(variant);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-200)',
        padding: 'var(--space-300)',
        borderRadius: 'var(--radius-400)',
        background,
        boxSizing: 'border-box',
        ...style,
      }}
      {...rest}
    >
      <span style={labelFont}>{label}</span>
      <span style={bodyFont}>{body}</span>
      {children ? <div style={{ display: 'flex' }}>{children}</div> : null}
    </div>
  );
}
