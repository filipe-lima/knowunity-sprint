import type { HTMLAttributes, ReactNode } from 'react';

/**
 * Read from the real Figma "Avatar" component set, found via the live
 * Desktop Bridge connection (2026-09-16) inside `Home E — Knowie's
 * message` (node `13759:45221`, "Final flow" page) — the same session
 * that built the Home screen this component was needed for. Confirmed
 * real variant axes, pulled directly from the component set's own
 * children: `Type` (`Image` / `Initial`) × `Size` (`Large` / `Medium` /
 * `Small`) × `Shape` (`Circle` — the only shape present in the real set,
 * no `Square` variant exists). The one real instance checked
 * (`Type=Image, Size=Large, Shape=Circle`, the Navbar's own trailing
 * avatar) rendered at 24×24 in that context.
 *
 * **Not fully confirmed, flagged rather than guessed:** the Figma
 * connection dropped before each size variant's own intrinsic pixel
 * dimensions could be pulled directly (only the one Large instance's
 * rendered size was captured, and it may have been scaled down by its
 * parent layout rather than reflecting Large's real intrinsic size).
 * Sized here as the 24/20/16 `--icon-300`/`--icon-250`/`--icon-200` step
 * (matching the one confirmed Large=24 data point) — re-confirm Medium/
 * Small against the component set directly before treating these as real.
 *
 * No real photo asset exists in this codebase (same recurring gap as
 * every other image/glyph slot here) — `Type="Image"` takes its content
 * via `children`, same resolution as `MascotSlot`, rather than inventing
 * an image source.
 */
export type AvatarType = 'Image' | 'Initial';
export type AvatarSize = 'Large' | 'Medium' | 'Small';
export type AvatarShape = 'Circle';

export interface AvatarProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  type?: AvatarType;
  size?: AvatarSize;
  shape?: AvatarShape;
  /** Required when `type="Initial"` — a single letter/short string. */
  initials?: string;
  /** Required when `type="Image"` — the image content itself (no real
   *  photo asset exists in this codebase). */
  children?: ReactNode;
}

const SIZE_VAR: Record<AvatarSize, string> = {
  Large: 'var(--icon-300)',
  Medium: 'var(--icon-250)',
  Small: 'var(--icon-200)',
};

const FONT_SIZE: Record<AvatarSize, string> = {
  Large: 'var(--font-size-sm)',
  Medium: 'var(--font-size-xs)',
  Small: 'var(--font-size-2xs)',
};

export function Avatar({
  type = 'Image',
  size = 'Large',
  shape = 'Circle',
  initials,
  children,
  style,
  ...rest
}: AvatarProps) {
  const dimension = SIZE_VAR[size];

  return (
    <span
      data-type={type}
      data-size={size}
      data-shape={shape}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: dimension,
        height: dimension,
        flexShrink: 0,
        overflow: 'hidden',
        borderRadius: 'var(--radius-full)',
        background: 'var(--color-background-stacking)',
        ...style,
      }}
      {...rest}
    >
      {type === 'Initial' ? (
        <span
          style={{
            fontFamily: 'var(--font-family-default)',
            fontWeight: 'var(--font-weight-semibold)',
            fontSize: FONT_SIZE[size],
            color: 'var(--color-text-primary)',
          }}
        >
          {initials}
        </span>
      ) : (
        children
      )}
    </span>
  );
}
