import type { HTMLAttributes, ReactNode } from 'react';

/**
 * Read from the Figma component set "sessionHero" (node 13734:32447, file
 * u3BZUg8k5p3mrOrKAnYO5c, page "New components", inside the "Session hero"
 * wrapper frame). This component set carries no Figma description of its
 * own (its `description` field is literally null) — every prop name and
 * option below comes straight from its own componentPropertyDefinitions
 * and from directly diffing all four real variant instances, not from
 * written prose (docs/design-system.md's account is used only as a cross-
 * check, noted below where it disagrees).
 *
 * Two real axes: align (Left/Center, default Left) and surface
 * (None/Card, default None) — four real combinations. Text properties:
 * eyebrow/showEyebrow, headline, body/showBody, footnote/showFootnote —
 * every default string below is each property's own real Figma default.
 * Two real SLOTs: Mascot and Trailing.
 *
 * **Headline size genuinely differs by combination, confirmed directly
 * against all four instances:** Left/Card ("proposal") alone uses
 * font/size/3xl + font/lineHeight/2xl ("Headline XL"); the other three use
 * font/size/2xl + font/lineHeight/xl ("Headline L") — matches
 * docs/design-system.md's own account of this split.
 *
 * **Mascot is genuinely empty by default on both Left variants** — their
 * real instances collapse it to 1x1, matching neither Left combination
 * showing a mascot. Both Center variants fill it with a real mascotSlot
 * instance instead (2XL on Center/None, XL on Center/Card) — reproduced in
 * the stories with the real MascotSlot component, not hardcoded here,
 * matching the same real-SLOT precedent as TopBar/RecordControl/Composer.
 *
 * **Trailing's real default differs per instance too:** only Left/None's
 * real instance fills it, with a real xpPill instance ("+15 XP", size M).
 * xpPill itself hasn't been built as a component in this codebase yet
 * (docs/design-system.md documents it separately, out of scope for this
 * build) — the Left/None story reproduces its exact visual with tokens
 * inline, flagged there as a placeholder, the same resolution used for
 * every other not-yet-built nested component this session.
 *
 * **Text alignment is genuinely LEFT in every real instance, including
 * both Center variants** — Headline/Body/Footnote are all FILL-width
 * boxes with textAlignHorizontal LEFT even under align=Center. What
 * "Center" actually changes is the container's cross-axis alignment
 * (centering the HUG-width Eyebrow and Mascot), not the paragraph text's
 * own alignment. Built to match the real instance data, not the more
 * intuitive-sounding assumption.
 *
 * The master frame is a FIXED, unbound 358px wide with no binding
 * instruction, same missing-literal situation as field/composer — since
 * sessionHero is documented as living directly in scaffold content
 * (docs/design-system.md: "Session entry, the first-run intro, the
 * sheet's proposal, the summary head, the all-clear state"), this
 * component fills its container's width by default instead of
 * reproducing the literal.
 */
export type SessionHeroAlign = 'Left' | 'Center';
export type SessionHeroSurface = 'None' | 'Card';

export interface SessionHeroProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  align?: SessionHeroAlign;
  surface?: SessionHeroSurface;
  eyebrow?: string;
  showEyebrow?: boolean;
  headline?: string;
  body?: string;
  showBody?: boolean;
  footnote?: string;
  showFootnote?: boolean;
  mascot?: ReactNode;
  trailing?: ReactNode;
}

// gap + padding genuinely differ by align, confirmed directly: Left uses
// Space/200 gap with no vertical padding; Center uses the "entry" pattern
// (Space/300 gap, Space/400 vertical padding on surface=None) — see the
// file-level comment for why entry was picked over the conflicting
// "intro" pattern documented for the same coordinate.
const GAP: Record<SessionHeroAlign, string> = {
  Left: 'var(--space-200)',
  Center: 'var(--space-300)',
};

const VERTICAL_PADDING: Record<SessionHeroSurface, string> = {
  None: 'var(--space-0)',
  Card: 'var(--space-600)',
};

const HEADLINE_FONT_SIZE = (align: SessionHeroAlign, surface: SessionHeroSurface) =>
  align === 'Left' && surface === 'Card' ? 'var(--font-size-3xl)' : 'var(--font-size-2xl)';

const HEADLINE_LINE_HEIGHT = (align: SessionHeroAlign, surface: SessionHeroSurface) =>
  align === 'Left' && surface === 'Card' ? 'var(--font-line-height-2xl)' : 'var(--font-line-height-xl)';

export function SessionHero({
  align = 'Left',
  surface = 'None',
  eyebrow = 'Session done',
  showEyebrow = true,
  headline = 'You said 5 terms out loud',
  body = 'Two of them without any help.',
  showBody = true,
  footnote = '',
  showFootnote = false,
  mascot,
  trailing,
  style,
  ...rest
}: SessionHeroProps) {
  const isCard = surface === 'Card';

  return (
    <div
      data-align={align}
      data-surface={surface}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: align === 'Center' ? 'center' : 'flex-start',
        width: '100%',
        boxSizing: 'border-box',
        gap: GAP[align],
        paddingLeft: 'var(--space-400)',
        paddingRight: 'var(--space-400)',
        paddingTop: VERTICAL_PADDING[surface],
        paddingBottom: VERTICAL_PADDING[surface],
        borderRadius: isCard ? 'var(--radius-600)' : undefined,
        background: isCard ? 'var(--color-background-surface)' : undefined,
        ...style,
      }}
      {...rest}
    >
      {mascot}
      {showEyebrow && eyebrow ? (
        <p
          style={{
            margin: 0,
            fontFamily: 'var(--font-family-default)',
            fontWeight: 'var(--font-weight-semibold)',
            fontSize: 'var(--font-size-xs)',
            lineHeight: 'var(--font-line-height-xs)',
            letterSpacing: 'var(--font-tracking-loose)',
            color: 'var(--color-text-secondary)',
          }}
        >
          {eyebrow}
        </p>
      ) : null}
      <p
        style={{
          width: '100%',
          margin: 0,
          textAlign: 'left',
          fontFamily: 'var(--font-family-default)',
          fontWeight: 'var(--font-weight-bold)',
          fontSize: HEADLINE_FONT_SIZE(align, surface),
          lineHeight: HEADLINE_LINE_HEIGHT(align, surface),
          letterSpacing: 'var(--font-tracking-tight)',
          color: 'var(--color-text-primary)',
        }}
      >
        {headline}
      </p>
      {showBody && body ? (
        <p
          style={{
            width: '100%',
            margin: 0,
            textAlign: 'left',
            fontFamily: 'var(--font-family-default)',
            fontWeight: 'var(--font-weight-regular)',
            fontSize: 'var(--font-size-md)',
            lineHeight: 'var(--font-line-height-md)',
            letterSpacing: 'var(--font-tracking-loose)',
            color: 'var(--color-text-secondary)',
          }}
        >
          {body}
        </p>
      ) : null}
      {showFootnote && footnote ? (
        <p
          style={{
            margin: 0,
            fontFamily: 'var(--font-family-default)',
            fontWeight: 'var(--font-weight-regular)',
            fontSize: 'var(--font-size-xs)',
            lineHeight: 'var(--font-line-height-xs)',
            letterSpacing: 'var(--font-tracking-loose)',
            color: 'var(--color-text-secondary)',
          }}
        >
          {footnote}
        </p>
      ) : null}
      {trailing}
    </div>
  );
}
