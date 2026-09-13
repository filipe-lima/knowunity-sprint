import type { HTMLAttributes, ReactNode } from 'react';

/**
 * Read from the Figma component set "bottomSheet" (node 3675:30952, file
 * u3BZUg8k5p3mrOrKAnYO5c, page "🎨  Mascot & components"). Not found by
 * name in docs/design-system.md (that file only documents the 15
 * "New components" built 11 September; this is one of the pre-existing
 * ten, structurally distinct from the `sheet` component also built this
 * session — the two coexist). Found by resolving a real `bottomSheet`
 * INSTANCE's mainComponent, the same technique used for MascotSlot,
 * since — per docs/design-system.md's own account of how the scaffold's
 * own component set works — "the [component's] main component set is not
 * on any page in the file; it survives only because instances point at
 * it." No description exists on the set itself.
 *
 * `height` (S/M/L, default S) is the one real VARIANT property.
 * `middleSection` and `bottomSection` are both real SLOTs, confirmed
 * identical in padding/gap/alignment across all three height variants
 * (Space/400 side padding, Space/600 gap; middleSection centers its
 * content and clips 8px off the bottom, bottomSection pads all sides
 * evenly) — so nothing about that styling actually varies by height.
 *
 * **Two things NOT reproduced pixel-for-pixel, flagged rather than
 * guessed:**
 *
 * 1. Every real instance nests a separate, whole component, "Bottom-sheet
 *    App Bar" (its own Title/Caption/showCaption properties and its own
 *    Type variant — confirmed genuinely different per height: S uses
 *    Type=dismissAndAction, M and L use Type=Default), plus a 32x4
 *    grabber handle nested inside that same instance. That app bar is a
 *    real, separate, unbuilt component with real complexity (gradient
 *    fade edges, its own variant matrix) well beyond a header row — not
 *    something to invent here. This component exposes a generic `header`
 *    slot instead (no default), and always renders the one genuinely
 *    simple, real, height-independent piece — the grabber handle itself
 *    (background/floating, 32x4, 2px radius) — directly.
 * 2. The three real instances' overall heights (300/494/768 for S/M/L)
 *    and their slots' own reported heights do NOT form a clean, consistent
 *    pattern even though every fetched instance had zero real children in
 *    both slots — strong evidence these are leftover measurements from
 *    whatever content last sat in each specific example, not a
 *    deliberate, reproducible height token per variant. Rather than
 *    invent a fixed height per step from unreliable numbers, this
 *    component lets its real height come from whatever content is
 *    actually passed to `middleSection`/`bottomSection`, matching the
 *    master's own `layoutSizingVertical: "HUG"` behavior. Worth a real
 *    decision from whoever owns this component about what `height`
 *    should actually constrain, since right now — reproduced faithfully —
 *    it constrains nothing but the (unbuilt) header's own Type.
 *
 * The 350px width on every real instance has no bound token and no
 * "hardcode this" instruction anywhere (unlike topBar/recordControl/
 * sheet's confirmed-deliberate literals) — same missing-literal situation
 * as field/composer/sessionHero/knowieMessage, so this component fills
 * its container's width by default instead of reproducing the literal.
 */
export type BottomSheetHeight = 'S' | 'M' | 'L';

export interface BottomSheetProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  height?: BottomSheetHeight;
  /** Stand-in for the real, separate "Bottom-sheet App Bar" nested
   *  instance — not rebuilt here (see the file-level comment). */
  header?: ReactNode;
  middleSection?: ReactNode;
  bottomSection?: ReactNode;
}

export function BottomSheet({
  height = 'S',
  header,
  middleSection,
  bottomSection,
  style,
  ...rest
}: BottomSheetProps) {
  return (
    <div
      data-height={height}
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden',
        borderTopLeftRadius: 'var(--radius-900)',
        borderTopRightRadius: 'var(--radius-900)',
        background: 'var(--color-background-surface)',
        ...style,
      }}
      {...rest}
    >
      {header}
      <div
        aria-hidden="true"
        style={{
          alignSelf: 'center',
          width: '32px',
          height: 'var(--space-100)',
          borderRadius: '2px',
          background: 'var(--color-background-floating)',
          margin: 'var(--space-300) 0',
        }}
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--space-600)',
          paddingLeft: 'var(--space-400)',
          paddingRight: 'var(--space-400)',
          paddingBottom: 'var(--space-200)',
        }}
      >
        {middleSection}
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--space-600)',
          padding: 'var(--space-400)',
        }}
      >
        {bottomSection}
      </div>
    </div>
  );
}
