import type { HTMLAttributes, ReactNode } from 'react';

import { IconSlot, type IconSlotSize } from '../IconSlot/IconSlot';

/**
 * Read from the Figma component set "chips" (node 9003:8679, file
 * u3BZUg8k5p3mrOrKAnYO5c) — a distinct component from the already-built
 * `ChipMarker` (components/ChipMarker), which maps to a different Figma
 * node entirely (`chipMarker`, the Dot/Label read-marker). Every prop and
 * value below was pulled from the real component set's own
 * componentPropertyDefinitions and by diffing every real variant directly
 * (all 16: size × color × active), not from docs/design-system.md's prose
 * alone — that account only says "chips for filters, selectable options
 * and small counters," not its shape.
 *
 * `size` (XXS/XS/S/M, default XXS) and `color` (Primary/pro, default
 * Primary) are real VARIANT properties; `active` is too, but modeled here
 * as the boolean it actually is rather than kept as a Figma-style
 * "False"/"True" string enum, matching how every other true/false axis in
 * this codebase is exposed. `text` (Figma's own `Text`, default "1/2
 * words", reproduced verbatim) and `showLeftIcon`/`showRightIcon` (both
 * real BOOLEAN properties, both defaulting true) are instance properties.
 *
 * Colour is genuinely state-dependent, not just size-dependent: inactive
 * chips (either colour) fill with `background/surface` / `text/primary` —
 * confirmed identical for Primary and pro at rest, matching
 * docs/design-system.md's own "Never do this" #10 ("an inactive `pro`
 * chip and an inactive `Primary` chip" are "already visually identical at
 * rest"). Active chips diverge: Primary fills with
 * `interactive/primary/default` on `interactive/primary/on` text; pro
 * fills with `accent/pro/bold` on `accent/pro/onBold` text.
 *
 * Each size step carries its own real height (Control/250-500), padding
 * (Space/050-400), item spacing, icon size, and type scale — all four
 * confirmed directly, not interpolated between the two sampled originally.
 *
 * The two icon slots are real `iconSlot` instances in Figma (this
 * codebase's own IconSlot, components/IconSlot, reused directly) — but
 * like every other icon slot built this session, there's no real glyph
 * asset library to source from, so `leadingIcon`/`trailingIcon` are left
 * to the caller via children, same resolution as ListRow's Leading/
 * Trailing. The one real usage found in the file (the count badges on
 * Recall history) sets both `showLeftIcon` and `showRightIcon` to false —
 * this component's own defaults still match the component's real Figma
 * default (true), not that one usage, per this session's established
 * convention of reproducing the component's own defaults verbatim.
 */
export type ChipsSize = 'XXS' | 'XS' | 'S' | 'M';
export type ChipsColor = 'Primary' | 'pro';

export interface ChipsProps extends HTMLAttributes<HTMLSpanElement> {
  size?: ChipsSize;
  color?: ChipsColor;
  active?: boolean;
  text?: string;
  showLeftIcon?: boolean;
  showRightIcon?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

interface SizeSpec {
  height: string;
  paddingX: string;
  gap: string;
  iconSize: IconSlotSize;
  fontSize: string;
  lineHeight: string;
}

const SIZE_SPEC: Record<ChipsSize, SizeSpec> = {
  XXS: {
    height: 'var(--control-250)',
    paddingX: 'var(--space-150)',
    gap: 'var(--space-050)',
    iconSize: '150',
    fontSize: 'var(--font-size-2xs)',
    lineHeight: 'var(--font-line-height-2xs)',
  },
  XS: {
    height: 'var(--control-300)',
    paddingX: 'var(--space-200)',
    gap: 'var(--space-100)',
    iconSize: '150',
    fontSize: 'var(--font-size-2xs)',
    lineHeight: 'var(--font-line-height-2xs)',
  },
  S: {
    height: 'var(--control-400)',
    paddingX: 'var(--space-300)',
    gap: 'var(--space-100)',
    iconSize: '200',
    fontSize: 'var(--font-size-xs)',
    lineHeight: 'var(--font-line-height-xs)',
  },
  M: {
    height: 'var(--control-500)',
    paddingX: 'var(--space-400)',
    gap: 'var(--space-150)',
    iconSize: '250',
    fontSize: 'var(--font-size-sm)',
    lineHeight: 'var(--font-line-height-sm)',
  },
};

function fillAndText(color: ChipsColor, active: boolean) {
  if (!active) {
    return { background: 'var(--color-background-surface)', text: 'var(--color-text-primary)' };
  }
  if (color === 'pro') {
    return { background: 'var(--color-accent-pro-bold)', text: 'var(--color-accent-pro-on-bold)' };
  }
  return { background: 'var(--color-interactive-primary-default)', text: 'var(--color-interactive-primary-on)' };
}

export function Chips({
  size = 'XXS',
  color = 'Primary',
  active = false,
  text = '1/2 words',
  showLeftIcon = true,
  showRightIcon = true,
  leadingIcon,
  trailingIcon,
  style,
  ...rest
}: ChipsProps) {
  const spec = SIZE_SPEC[size];
  const { background, text: textColor } = fillAndText(color, active);

  return (
    <span
      data-size={size}
      data-color={color}
      data-active={active}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        boxSizing: 'border-box',
        height: spec.height,
        paddingLeft: spec.paddingX,
        paddingRight: spec.paddingX,
        gap: spec.gap,
        borderRadius: 'var(--radius-full)',
        background,
        ...style,
      }}
      {...rest}
    >
      {showLeftIcon && leadingIcon ? (
        <IconSlot size={spec.iconSize} color={textColor}>
          {leadingIcon}
        </IconSlot>
      ) : null}
      <span
        style={{
          fontFamily: 'var(--font-family-default)',
          fontWeight: 'var(--font-weight-semibold)',
          fontSize: spec.fontSize,
          lineHeight: spec.lineHeight,
          letterSpacing: 'var(--font-tracking-loose)',
          color: textColor,
          whiteSpace: 'nowrap',
        }}
      >
        {text}
      </span>
      {showRightIcon && trailingIcon ? (
        <IconSlot size={spec.iconSize} color={textColor}>
          {trailingIcon}
        </IconSlot>
      ) : null}
    </span>
  );
}
