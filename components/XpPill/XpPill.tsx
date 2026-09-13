import type { HTMLAttributes } from 'react';

/**
 * Read from the Figma component set "xpPill" (node 13734:32482, file
 * u3BZUg8k5p3mrOrKAnYO5c, page "New components", inside the "Xp pill"
 * wrapper frame). Carries no Figma description of its own (its
 * `description` field is literally null) — every prop and default below
 * comes straight from its own componentPropertyDefinitions and directly
 * diffing both real variants, cross-checked against
 * docs/design-system.md's own account.
 *
 * `size` (S/M, default S) is the one real VARIANT property; `label` is a
 * real TEXT property, defaulting to "+15 XP". Padding and type scale
 * genuinely differ by size, confirmed directly against both instances:
 * S uses Space/300 x Space/100 padding at font/size/xs; M uses Space/400
 * x Space/200 padding at font/size/sm. Both share the same fill
 * (accent/brand/subtle), text color (accent/brand/onSubtle) and radius
 * (full).
 *
 * **A real inconsistency, confirmed and matched, not corrected:**
 * docs/design-system.md's own prose describes S as "Caption M Bold" and M
 * as "Headline XXS Bold" — both real instances actually use
 * font/weight/semibold, not Bold, same category of discrepancy already
 * found and flagged on ChipMarker's Label. Built to match the real
 * instances.
 *
 * This is already reused directly inside SessionHero's Left/None ("summary
 * head") story, which found the real Left/None default instance filling
 * its Trailing slot with a size=M xpPill reading "+15 XP" — before this
 * component existed, that story reproduced the visual inline as a flagged
 * placeholder. That placeholder is not swapped out here since retrofitting
 * an already-shipped, verified story means editing it without being
 * asked — noted as a natural follow-up, not done as part of this build.
 */
export type XpPillSize = 'S' | 'M';

export interface XpPillProps extends HTMLAttributes<HTMLSpanElement> {
  size?: XpPillSize;
  label?: string;
}

const PADDING_X: Record<XpPillSize, string> = {
  S: 'var(--space-300)',
  M: 'var(--space-400)',
};

const PADDING_Y: Record<XpPillSize, string> = {
  S: 'var(--space-100)',
  M: 'var(--space-200)',
};

const FONT_SIZE: Record<XpPillSize, string> = {
  S: 'var(--font-size-xs)',
  M: 'var(--font-size-sm)',
};

export function XpPill({ size = 'S', label = '+15 XP', style, ...rest }: XpPillProps) {
  return (
    <span
      data-size={size}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        paddingLeft: PADDING_X[size],
        paddingRight: PADDING_X[size],
        paddingTop: PADDING_Y[size],
        paddingBottom: PADDING_Y[size],
        borderRadius: 'var(--radius-full)',
        background: 'var(--color-accent-brand-subtle)',
        ...style,
      }}
      {...rest}
    >
      <span
        style={{
          fontFamily: 'var(--font-family-default)',
          fontWeight: 'var(--font-weight-semibold)',
          fontSize: FONT_SIZE[size],
          lineHeight: 'var(--font-line-height-xs)',
          letterSpacing: 'var(--font-tracking-loose)',
          color: 'var(--color-accent-brand-on-subtle)',
        }}
      >
        {label}
      </span>
    </span>
  );
}
