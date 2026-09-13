import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

/**
 * Read from the Figma component set "iconSlot" (node 9003:8809, file
 * u3BZUg8k5p3mrOrKAnYO5c, page "🎨 Mascot & components"). Every prop name
 * and option below is that component's own: size is its one VARIANT
 * property (100/150/200/250/300/400). See IconSlot.stories.tsx for the
 * component's own written description — including its own warning that a
 * "library twin" elsewhere in the file names this same axis
 * "Size (IGNORE)" instead of "size".
 *
 * The actual glyph is Figma's INSTANCE_SWAP property (2,392 library
 * options) — this codebase has no built icon asset library to source real
 * SVGs from, so the glyph is left to the caller via children, same
 * resolution as Button/ButtonIcon's own icon slots.
 */
export type IconSlotSize = '100' | '150' | '200' | '250' | '300' | '400';

export interface IconSlotProps extends HTMLAttributes<HTMLSpanElement> {
  size?: IconSlotSize;
  /**
   * Figma's own default is text/primary, applied here as this component's
   * default — but exposed as an overridable prop, not baked in, since
   * iconSlot is nested inside colored contexts elsewhere (buttonIcon's own
   * icon needs interactive/primary/on, not text/primary, when Primary).
   */
  color?: string;
  children: ReactNode;
}

const SIZE_VAR: Record<IconSlotSize, string> = {
  '100': 'var(--icon-100)',
  '150': 'var(--icon-150)',
  '200': 'var(--icon-200)',
  '250': 'var(--icon-250)',
  '300': 'var(--icon-300)',
  '400': 'var(--icon-400)',
};

export function IconSlot({
  size = '400',
  color = 'var(--color-text-primary)',
  style,
  children,
  ...rest
}: IconSlotProps) {
  const box: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: SIZE_VAR[size],
    height: SIZE_VAR[size],
    flexShrink: 0,
    color,
    ...style,
  };

  return (
    <span style={box} {...rest}>
      {children}
    </span>
  );
}
