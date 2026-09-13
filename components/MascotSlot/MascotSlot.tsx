import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

/**
 * Read from the Figma component set "mascotSlot" (node 3262:91072, file
 * u3BZUg8k5p3mrOrKAnYO5c, page "🎨 Mascot & components", reached via a real
 * usage instance's mainComponent — unlike every other component built so
 * far, mascotSlot isn't a direct child of that page, and page.findOne
 * crashed on it directly; found by searching for any node named
 * "mascot" instead and following that instance's own mainComponent link).
 *
 * Two real gaps here, both from docs/design-system.md rather than
 * something this file invents an answer for:
 *
 * 1. No Figma description exists on this component at all (it predates the
 *    file's documentation pass — design-system.md's own account: "it's a
 *    live edit to the existing shared component"). See
 *    MascotSlot.stories.tsx for what's used in its place.
 *
 * 2. design-system.md describes two axes, size and crop, but only `size`
 *    is an actual wired Figma property today (confirmed three ways: the
 *    component set's own componentPropertyDefinitions, and each of the
 *    four size variants' own top-level properties — none show a `crop`
 *    axis). `crop` is implemented below anyway, because design-system.md
 *    gives one concrete, checkable data point for it: "XL's native height
 *    already equals the crop height, so there's nothing to crop" — which
 *    only holds if "the crop height" is a single fixed value equal to
 *    XL's own height (--illustration-800). That's not an invented number;
 *    it's the one real token the text itself points to, and applying it
 *    uniformly is what makes the documented no-op happen on its own rather
 *    than needing a special case for XL. Still: this is built from the
 *    written spec, not a confirmed live Figma property — say so if that
 *    turns out to be wrong.
 *
 * The mascot artwork itself (a multi-layer illustration, plus an
 * INSTANCE_SWAP property named "Homie" nested on a private
 * `.mascotSlotBase` instance for pose) has no real asset in this codebase
 * — same resolution as every other icon/glyph slot so far: left to the
 * caller via children. Pose specifically isn't exposed as a prop here
 * because it isn't a clean prop in Figma either — design-system.md: "The
 * pose is still an instance-level swap that no property tracks."
 */
export type MascotSlotSize = 'XL' | '2XL' | '3XL' | '4XL';
export type MascotSlotCrop = 'Full' | 'Peek';

export interface MascotSlotProps extends HTMLAttributes<HTMLDivElement> {
  size?: MascotSlotSize;
  crop?: MascotSlotCrop;
  children: ReactNode;
}

const SIZE_VAR: Record<MascotSlotSize, string> = {
  XL: 'var(--illustration-800)',
  '2XL': 'var(--illustration-1500)',
  '3XL': 'var(--illustration-2500)',
  '4XL': 'var(--illustration-4000)',
};

// The fixed crop height every size clips down to in crop="Peek" — equal to
// XL's own full height. See the file-level comment for why this is the
// one defensible value rather than an invented per-size fraction.
const PEEK_HEIGHT = 'var(--illustration-800)';

export function MascotSlot({ size = 'XL', crop = 'Full', style, children, ...rest }: MascotSlotProps) {
  const box: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: SIZE_VAR[size],
    height: crop === 'Peek' ? PEEK_HEIGHT : SIZE_VAR[size],
    padding: 'var(--space-300)',
    overflow: crop === 'Peek' ? 'hidden' : 'visible',
    boxSizing: 'border-box',
    flexShrink: 0,
    ...style,
  };

  return (
    <div style={box} {...rest}>
      {children}
    </div>
  );
}
