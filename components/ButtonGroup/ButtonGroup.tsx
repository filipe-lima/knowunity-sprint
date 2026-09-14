import type { HTMLAttributes, ReactNode } from 'react';

/**
 * Read from the Figma component set "buttonGroup" (node 9003:8455, file
 * u3BZUg8k5p3mrOrKAnYO5c) — confirmed against all four real variants
 * directly (variant × size: Horizontal/Vertical × M/L), not from
 * docs/design-system.md's prose alone. That account: "buttonGroup for the
 * bottom action block, in the bottomContent slot. It is the only
 * sanctioned way to put two actions side by side. Horizontal holds a
 * buttonIcon then a button. Vertical holds two buttons, primary above
 * secondary. Do not assemble a group by hand out of loose buttons." — and
 * the real variants match that exactly: Horizontal's two children are a
 * `buttonIcon` (Secondary) then a `button` (Primary); Vertical's are two
 * `button`s, Primary then Secondary. Reproduced here as a discriminated
 * union keyed by `variant`, same resolution as TopBar's own Loop/Title/
 * Centered split, since the two variants take genuinely different slots,
 * not just a direction flip.
 *
 * Real per-variant item spacing, confirmed directly, not interpolated:
 * Vertical/M is 0 (`Space/0` — the two buttons sit flush, no gap);
 * Vertical/L is `Space/200` (8); Horizontal/M is `Space/100` (4);
 * Horizontal/L is `Space/200` (8). All four have zero internal padding on
 * every side (`Space/0`).
 *
 * Width is genuinely fill-parent here, unlike Sheet/TopBar's confirmed
 * hardcoded-390 precedent: every real usage found (Summary, Hub, Recall
 * history) sits inside a slot that already stretches its children
 * (`layoutSizingHorizontal: FILL`), and the real instance's own literal
 * width (319) only reflects the component's default, unstretched bounding
 * box in isolation — not a deliberate fixed width the way Sheet's 390 was
 * (design-system.md groups Sheet/TopBar's widths as confirmed-deliberate;
 * it never says that about buttonGroup). Built to fill its container
 * instead.
 *
 * Confirmed directly against Hub's own real buttonGroup instance that its
 * two real `button` children carry `layoutSizingHorizontal: FILL` too
 * (both measure the full 358px row width, not their own label's hug
 * width) — Button's own resting design hugs its label, centered in a
 * fixed-width wrapper (see components/Button's own doc comment), so this
 * component alone can't force that; it only lays out in the right
 * direction with the right gap. Filling the row is the caller's job, via
 * Button's own new `fill` prop (added alongside this component, for
 * exactly this) — every story below passes it on `primary`/`secondary`.
 * A `buttonIcon` used as Horizontal's `icon` keeps its own fixed square
 * size either way, matching the real component (no equivalent fill mode
 * needed there).
 */
export type ButtonGroupSize = 'M' | 'L';

type ButtonGroupCommon = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  size?: ButtonGroupSize;
};

export interface ButtonGroupHorizontalProps extends ButtonGroupCommon {
  variant: 'Horizontal';
  icon: ReactNode;
  primary: ReactNode;
}

export interface ButtonGroupVerticalProps extends ButtonGroupCommon {
  variant: 'Vertical';
  primary: ReactNode;
  secondary?: ReactNode;
}

export type ButtonGroupProps = ButtonGroupHorizontalProps | ButtonGroupVerticalProps;

const VERTICAL_GAP: Record<ButtonGroupSize, string> = {
  M: 'var(--space-0)',
  L: 'var(--space-200)',
};

const HORIZONTAL_GAP: Record<ButtonGroupSize, string> = {
  M: 'var(--space-100)',
  L: 'var(--space-200)',
};

export function ButtonGroup(props: ButtonGroupProps) {
  if (props.variant === 'Horizontal') {
    const { size = 'M', icon, primary, style, ...rest } = props;
    return (
      <div
        data-variant="Horizontal"
        data-size={size}
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'stretch',
          width: '100%',
          boxSizing: 'border-box',
          gap: HORIZONTAL_GAP[size],
          ...style,
        }}
        {...rest}
      >
        <div style={{ display: 'flex', flexShrink: 0 }}>{icon}</div>
        <div style={{ display: 'flex', flex: '1 1 auto', minWidth: 0 }}>{primary}</div>
      </div>
    );
  }

  const { size = 'M', primary, secondary, style, ...rest } = props;
  return (
    <div
      data-variant="Vertical"
      data-size={size}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        width: '100%',
        boxSizing: 'border-box',
        gap: VERTICAL_GAP[size],
        ...style,
      }}
      {...rest}
    >
      {primary}
      {secondary}
    </div>
  );
}
