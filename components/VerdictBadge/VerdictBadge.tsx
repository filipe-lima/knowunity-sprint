import type { HTMLAttributes, ReactNode } from 'react';
import { IconSlot } from '../IconSlot/IconSlot';

/**
 * Read from the Figma component set "verdictBadge" (node 13734:32290, file
 * u3BZUg8k5p3mrOrKAnYO5c, page "New components", inside the "Verdict
 * badge" wrapper frame). Figma's own description: "Verdict feedback
 * badge. 5 variants (variant axis). Glyph is baked per variant, not
 * swappable — colour and glyph shape both encode the verdict together."
 * See VerdictBadge.stories.tsx for docs/design-system.md's fuller account
 * (the variant/fill/glyph/label table and the "Don't move Miss onto
 * feedback/error" rule).
 *
 * Deliberately NOT an icon prop, unlike Button/ButtonIcon/ListRow: this is
 * the one component so far where Figma itself locks glyph to variant
 * (design-system.md: "an overridable glyph would let someone break that
 * pairing"). The actual glyphs (check-circle, info-circle, alert-circle)
 * aren't real assets in this codebase — same recurring gap as every icon
 * slot — but the fixed variant->glyph pairing itself is a real, load-
 * bearing rule this component enforces, not a placeholder detail.
 */
export type VerdictBadgeVariant = 'Success' | 'Almost' | 'Miss' | 'SaidBack' | 'Flagged';

export interface VerdictBadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: VerdictBadgeVariant;
  label: string;
}

function CheckCircle() {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth={2} />
      <path d="M8 12l3 3 5-6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function InfoCircle() {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth={2} />
      <path d="M12 11v5M12 8v.01" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}

function AlertCircle() {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth={2} />
      <path d="M12 8v5M12 16v.01" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}

// variant -> fill/color/glyph, confirmed against the real component
// (Success and Flagged fetched directly; Almost/Miss/SaidBack follow the
// same fill/onSubtle pairing pattern, per design-system.md's table).
const VARIANT_STYLE: Record<VerdictBadgeVariant, { background: string; color: string; Glyph: () => ReactNode }> = {
  Success: {
    background: 'var(--color-feedback-success-subtle)',
    color: 'var(--color-feedback-success-on-subtle)',
    Glyph: CheckCircle,
  },
  Almost: {
    background: 'var(--color-accent-blue-subtle)',
    color: 'var(--color-accent-blue-on-subtle)',
    Glyph: InfoCircle,
  },
  Miss: {
    // Deliberately accent/coral, not feedback/error — design-system.md's
    // own "Don't": the student hasn't failed, error red says otherwise.
    background: 'var(--color-accent-coral-subtle)',
    color: 'var(--color-accent-coral-on-subtle)',
    Glyph: AlertCircle,
  },
  SaidBack: {
    background: 'var(--color-accent-brand-subtle)',
    color: 'var(--color-accent-brand-on-subtle)',
    Glyph: CheckCircle,
  },
  Flagged: {
    // Neutral, not a warning tint — same reasoning as Miss avoiding error.
    // Also the one variant that doesn't use an "onSubtle" pairing at all,
    // confirmed directly: background/stacking + text/secondary.
    background: 'var(--color-background-stacking)',
    color: 'var(--color-text-secondary)',
    Glyph: InfoCircle,
  },
};

export function VerdictBadge({ variant = 'Success', label, style, ...rest }: VerdictBadgeProps) {
  const { background, color, Glyph } = VARIANT_STYLE[variant];

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--space-200)',
        paddingLeft: 'var(--space-300)',
        paddingRight: 'var(--space-300)',
        paddingTop: 'var(--space-200)',
        paddingBottom: 'var(--space-200)',
        borderRadius: 'var(--radius-full)',
        background,
        color,
        ...style,
      }}
      {...rest}
    >
      <IconSlot size="250" color={color}>
        <Glyph />
      </IconSlot>
      <span
        style={{
          fontFamily: 'var(--font-family-default)',
          fontWeight: 'var(--font-weight-semibold)',
          fontSize: 'var(--font-size-xs)',
          lineHeight: 'var(--font-line-height-xs)',
          letterSpacing: 'var(--font-tracking-loose)',
        }}
      >
        {label}
      </span>
    </div>
  );
}
