import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

/**
 * Read from the Figma component set "listRow" (node 13734:32134, file
 * u3BZUg8k5p3mrOrKAnYO5c, page "New components", inside the "List row"
 * wrapper frame). Every prop name and option below is that component's
 * own: state/size/surface are its three VARIANT properties,
 * title/subtitle/showSubtitle its three instance properties, Leading and
 * Trailing its two slots. See ListRow.stories.tsx for the component's own
 * written description (what it is, when to reach for it, what not to do).
 *
 * Preferred slot content per Figma's own description: iconSlot, chips,
 * button, buttonIcon — of those, IconSlot, Button and ButtonIcon already
 * exist in this codebase (components/IconSlot, components/Button,
 * components/ButtonIcon) and are used directly in the stories rather than
 * placeholders, since — unlike every prior component's icon slot — there's
 * real code here to reuse.
 */
export type ListRowState = 'Default' | 'Selected' | 'Locked' | 'Pressed';
export type ListRowSize = 'M' | 'S';
export type ListRowSurface = 'Surface' | 'Stacking';

export interface ListRowProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  state?: ListRowState;
  size?: ListRowSize;
  surface?: ListRowSurface;
  title: string;
  subtitle?: string;
  showSubtitle?: boolean;
  /** Leading slot. Omitted entirely (not just empty) when not provided —
   *  Figma's own description: "An empty slot collapses out of the layout
   *  on its own." */
  leading?: ReactNode;
  /** Trailing slot — same collapse behavior as leading. */
  trailing?: ReactNode;
}

// size=M's title is Headline XXS Bold; size=S's is Caption M Bold — a role
// change (design-system.md's own account, confirmed against the real
// component: font-size-sm/font-line-height-xs for M, font-size-xs/
// font-line-height-xs for S). The subtitle style is the same at both
// sizes — only the title changes.
const TITLE_FONT: Record<ListRowSize, CSSProperties> = {
  M: {
    fontFamily: 'var(--font-family-default)',
    fontWeight: 'var(--font-weight-semibold)',
    fontSize: 'var(--font-size-sm)',
    lineHeight: 'var(--font-line-height-xs)',
    letterSpacing: 'var(--font-tracking-loose)',
  },
  S: {
    fontFamily: 'var(--font-family-default)',
    fontWeight: 'var(--font-weight-semibold)',
    fontSize: 'var(--font-size-xs)',
    lineHeight: 'var(--font-line-height-xs)',
    letterSpacing: 'var(--font-tracking-loose)',
  },
};

const SUBTITLE_FONT: CSSProperties = {
  fontFamily: 'var(--font-family-default)',
  fontWeight: 'var(--font-weight-regular)',
  fontSize: 'var(--font-size-xs)',
  lineHeight: 'var(--font-line-height-xs)',
  letterSpacing: 'var(--font-tracking-loose)',
};

// Not fixed-size: Figma's own slot has stretchChildOnInsert=false, meaning
// whatever's dropped in (an IconSlot, a Button, a ButtonIcon) keeps its own
// natural size rather than being clamped to the slot's default Icon/250
// footprint. Forcing a fixed box here would clip anything bigger than a
// bare icon — flexShrink:0 just stops the row's own layout from squeezing it.
const SLOT_BOX: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
};

function resolveSurfaceFill(surface: ListRowSurface): string {
  return surface === 'Stacking' ? 'var(--color-background-stacking)' : 'var(--color-background-surface)';
}

// state=Pressed fills interactive/pressed regardless of the surface axis —
// confirmed against the real component: Pressed/Surface and
// Pressed/Stacking are pixel-identical, exactly as design-system.md
// documents ("that's an open question below, not a resolved rule" — i.e.
// a known, deliberate-for-now inconsistency, not something to silently
// "fix" here).
function resolveVisuals(state: ListRowState, surface: ListRowSurface): { background: string; border: string } {
  if (state === 'Pressed') {
    return { background: 'var(--color-interactive-pressed-default)', border: 'none' };
  }
  const background = resolveSurfaceFill(surface);
  if (state === 'Selected') {
    return {
      background,
      border: 'var(--stroke-heavy-border) solid var(--color-accent-brand-bold)',
    };
  }
  return { background, border: 'none' };
}

export function ListRow({
  state = 'Default',
  size = 'M',
  surface = 'Surface',
  title,
  subtitle,
  showSubtitle = true,
  leading,
  trailing,
  style,
  ...rest
}: ListRowProps) {
  const { background, border } = resolveVisuals(state, surface);
  const isLocked = state === 'Locked';
  const renderSubtitle = showSubtitle && Boolean(subtitle);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        boxSizing: 'border-box',
        gap: 'var(--space-300)',
        padding: 'var(--space-300)',
        borderRadius: 'var(--radius-400)',
        background,
        border,
        ...style,
      }}
      {...rest}
    >
      {leading ? <span style={SLOT_BOX}>{leading}</span> : null}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-050)',
          flex: 1,
          minWidth: 0,
        }}
      >
        <span
          style={{
            ...TITLE_FONT[size],
            // The real Figma component dims the TITLE to text/disabled on
            // Locked and keeps the subtitle on text/secondary — confirmed
            // against the real instance, and documented in
            // docs/design-system.md's own "Don't" as deliberate. An
            // axe-core scan found that real pairing fails contrast at
            // 3.69:1 (text/disabled on background/surface, under the
            // 4.5:1 AA minimum) on the row's primary, load-bearing label.
            // Reversed here on an explicit design decision: keep the
            // title legible (text/secondary — still visually one step
            // down from Default's text/primary, so Locked still reads as
            // distinct) and move the dim treatment to the subtitle
            // instead, since a locked row should still say what it is,
            // even if the reason it's locked reads as de-emphasized.
            color: isLocked ? 'var(--color-text-secondary)' : 'var(--color-text-primary)',
          }}
        >
          {title}
        </span>
        {renderSubtitle ? (
          <span style={{ ...SUBTITLE_FONT, color: isLocked ? 'var(--color-text-disabled)' : 'var(--color-text-secondary)' }}>
            {subtitle}
          </span>
        ) : null}
      </div>
      {trailing ? <span style={SLOT_BOX}>{trailing}</span> : null}
    </div>
  );
}
