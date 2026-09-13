import type { HTMLAttributes } from 'react';

/**
 * Read from the Figma component set "chipMarker" (node 13734:32476, file
 * u3BZUg8k5p3mrOrKAnYO5c, page "New components", inside the "Chip marker"
 * wrapper frame). Carries no Figma description of its own (its
 * `description` field is literally null) — every prop and default below
 * comes straight from its own componentPropertyDefinitions and directly
 * diffing both real variants, cross-checked against
 * docs/design-system.md's own account.
 *
 * `variant` (Dot/Label, default Dot) is the one real VARIANT property;
 * `label` is a real TEXT property, defaulting to "NEW". The absence of
 * the marker entirely (a chip with no marker at all) is handled by simply
 * not rendering this component, not by a third variant — there is no
 * "none" option here.
 *
 * Both variants share the same fill, accent/coral/bold — confirmed
 * directly against both, not assumed. Dot is a bare 8x8 filled circle
 * (Icon/100), the recurring "ready" signal. Label is a text pill reading
 * "NEW" by default, meant to appear once, ever, per chip.
 *
 * **A real inconsistency, confirmed and matched, not corrected:** the one
 * real Label instance in the file uses font/weight/regular (Caption S
 * Regular), not the Bold docs/design-system.md's own prose says the plan
 * specified — built to match the real instance, since only one real
 * reference exists this is worth double-checking if Bold was actually
 * intended.
 *
 * docs/design-system.md's own "Don't": don't show both Dot and Label at
 * once. Precedence is NEW, then dot, then none, and no component can
 * enforce that — it's a rule the screen using this component has to keep,
 * not something built in here.
 */
export type ChipMarkerVariant = 'Dot' | 'Label';

export interface ChipMarkerProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: ChipMarkerVariant;
  label?: string;
}

export function ChipMarker({ variant = 'Dot', label = 'NEW', style, ...rest }: ChipMarkerProps) {
  if (variant === 'Dot') {
    return (
      <span
        data-variant={variant}
        style={{
          display: 'inline-block',
          width: 'var(--icon-100)',
          height: 'var(--icon-100)',
          borderRadius: 'var(--radius-full)',
          background: 'var(--color-accent-coral-bold)',
          ...style,
        }}
        {...rest}
      />
    );
  }

  return (
    <span
      data-variant={variant}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        paddingLeft: 'var(--space-150)',
        paddingRight: 'var(--space-150)',
        borderRadius: 'var(--radius-full)',
        background: 'var(--color-accent-coral-bold)',
        ...style,
      }}
      {...rest}
    >
      <span
        style={{
          fontFamily: 'var(--font-family-default)',
          fontWeight: 'var(--font-weight-regular)',
          fontSize: 'var(--font-size-2xs)',
          lineHeight: 'var(--font-line-height-2xs)',
          letterSpacing: 'var(--font-tracking-loose)',
          color: 'var(--color-accent-coral-on-bold)',
        }}
      >
        {label}
      </span>
    </span>
  );
}
