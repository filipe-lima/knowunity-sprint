import type { CSSProperties, ElementType, HTMLAttributes } from 'react';

/**
 * Read from the Figma component set "textBlock" (node 9003:9039, file
 * u3BZUg8k5p3mrOrKAnYO5c, page "🎨 Mascot & components"). Every prop name
 * and option below is that component's own: variant is its one VARIANT
 * property (XL/L/M/S), title/caption/showCaption its three instance
 * properties. See TextBlock.stories.tsx for the component's own written
 * description (what it is, when to use it, what not to do) — including
 * its own UNCONFIRMED note and the "don't treat these as one smooth
 * scale" warning.
 *
 * No "state" axis exists here — textBlock is static content, not an
 * interactive control, so unlike Button/ButtonIcon there's nothing to
 * share from resolveButtonColors.
 */
export type TextBlockVariant = 'XL' | 'L' | 'M' | 'S';

export interface TextBlockProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  variant?: TextBlockVariant;
  title: string;
  caption?: string;
  showCaption?: boolean;
  /**
   * Not a Figma property — textBlock's own Figma layer is plain text, not
   * a semantic heading, and correct heading level (h1..h6) depends on
   * where in the page this instance sits, which this component can't know
   * on its own. Defaults to "h2"; override per usage.
   */
  as?: ElementType;
}

type VariantSpec = {
  gap: string;
  align: CSSProperties['textAlign'];
  header: CSSProperties;
  caption: CSSProperties;
};

const VARIANTS: Record<TextBlockVariant, VariantSpec> = {
  // Header: Display M (76). Caption: Headline XS Regular (18).
  XL: {
    gap: 'var(--space-100)',
    align: 'center',
    header: {
      fontFamily: 'var(--font-family-default)',
      fontWeight: 'var(--font-weight-bold)',
      fontSize: 'var(--font-size-5xl)',
      lineHeight: 'var(--font-line-height-4xl)',
      letterSpacing: 'var(--font-tracking-tight)',
      color: 'var(--color-text-primary)',
    },
    caption: {
      fontFamily: 'var(--font-family-default)',
      fontWeight: 'var(--font-weight-regular)',
      fontSize: 'var(--font-size-md)',
      lineHeight: 'var(--font-line-height-sm)',
      letterSpacing: 'var(--font-tracking-loose)',
      color: 'var(--color-text-secondary)',
    },
  },
  // Header: Headline XL (44). Caption: same Headline XS Regular as XL.
  L: {
    gap: 'var(--space-100)',
    align: 'center',
    header: {
      fontFamily: 'var(--font-family-default)',
      fontWeight: 'var(--font-weight-bold)',
      fontSize: 'var(--font-size-3xl)',
      lineHeight: 'var(--font-line-height-2xl)',
      letterSpacing: 'var(--font-tracking-tight)',
      color: 'var(--color-text-primary)',
    },
    caption: {
      fontFamily: 'var(--font-family-default)',
      fontWeight: 'var(--font-weight-regular)',
      fontSize: 'var(--font-size-md)',
      lineHeight: 'var(--font-line-height-sm)',
      letterSpacing: 'var(--font-tracking-loose)',
      color: 'var(--color-text-secondary)',
    },
  },
  // Header: Body M Bold (18) — a role change from L, not a size step
  // down; this is the same 18px as XL/L's own caption. Caption: Caption M
  // Regular (12).
  M: {
    gap: 'var(--space-050)',
    align: 'left',
    header: {
      fontFamily: 'var(--font-family-default)',
      fontWeight: 'var(--font-weight-semibold)',
      fontSize: 'var(--font-size-md)',
      lineHeight: 'var(--font-line-height-md)',
      letterSpacing: 'var(--font-tracking-loose)',
      color: 'var(--color-text-primary)',
    },
    caption: {
      fontFamily: 'var(--font-family-default)',
      fontWeight: 'var(--font-weight-regular)',
      fontSize: 'var(--font-size-xs)',
      lineHeight: 'var(--font-line-height-xs)',
      letterSpacing: 'var(--font-tracking-loose)',
      color: 'var(--color-text-secondary)',
    },
  },
  // Header: Body S Bold (15). Caption: Caption S Regular (9).
  S: {
    gap: 'var(--space-050)',
    align: 'left',
    header: {
      fontFamily: 'var(--font-family-default)',
      fontWeight: 'var(--font-weight-semibold)',
      fontSize: 'var(--font-size-sm)',
      lineHeight: 'var(--font-line-height-sm)',
      letterSpacing: 'var(--font-tracking-loose)',
      color: 'var(--color-text-primary)',
    },
    caption: {
      fontFamily: 'var(--font-family-default)',
      fontWeight: 'var(--font-weight-regular)',
      fontSize: 'var(--font-size-2xs)',
      lineHeight: 'var(--font-line-height-2xs)',
      letterSpacing: 'var(--font-tracking-loose)',
      color: 'var(--color-text-secondary)',
    },
  },
};

export function TextBlock({
  variant = 'XL',
  title,
  caption,
  showCaption = true,
  as: Heading = 'h2',
  style,
  ...rest
}: TextBlockProps) {
  const spec = VARIANTS[variant];
  const renderCaption = showCaption && Boolean(caption);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: renderCaption ? spec.gap : 'var(--space-0)',
        ...style,
      }}
      {...rest}
    >
      <Heading style={{ ...spec.header, textAlign: spec.align, margin: 0 }}>{title}</Heading>
      {renderCaption ? (
        <p style={{ ...spec.caption, textAlign: spec.align, margin: 0 }}>{caption}</p>
      ) : null}
    </div>
  );
}
