import type { KeyboardEvent, ReactNode } from 'react';

import { IconSlot, type IconSlotSize } from '../IconSlot/IconSlot';

/**
 * Promoted 2026-09-18 from three separately hand-rolled copies of the
 * identical shape — `screens/Summary/Summary.tsx`'s `ResultRow`,
 * `screens/Hub/RecallHub.tsx`'s `HubRow`, and `screens/Hub/
 * RecallHistory.tsx`'s `TermRow` — flagged as unpromoted duplication in
 * two rounds of eval scorecards (`eval/scorecard-01.md`,
 * `eval/scorecard-02.md`) before this fix. Figma's own layer name for
 * this shape, across all three real screens, is the un-componentized
 * `bucket / NEW` / `row / NEW` frame family (see `docs/component-gaps.md`)
 * — not a real Figma component, so this is this codebase's own
 * promotion, not a mirror of a real Figma component set.
 *
 * The three original call sites weren't quite identical — real, confirmed
 * differences are kept as props rather than flattened away:
 * - `iconSize`: Hub's real instance uses `IconSlot` `300`; Summary/Recall
 *   history use `250`.
 * - `titleSize`: Recall history's real title is confirmed 12px
 *   (`font-size-xs`, per `docs/SPEC.md`'s live Figma check), distinct
 *   from Summary/Hub's real 15px (`font-size-sm`) — not a bug to unify.
 * - `titleColor`/`subtitleColor`: only Hub's locked row needs these
 *   overridden (`text/secondary` title, `text/disabled` subtitle).
 * - `trailing`: a free slot — Summary passes its own XP `<span>`, Hub
 *   passes a `Chips`/`Button`/chevron, Recall history passes nothing.
 * - `onActivate`: only Hub's topic rows are real tappable rows; Summary's
 *   and Recall history's are purely informational.
 */
export interface BucketRowProps {
  /** A real icon node, or a plain emoji string (Hub's topic rows use
   *  emoji directly — rendered at a fixed readable size, not scaled to
   *  the icon slot's own bounding box). */
  icon: ReactNode;
  iconSize?: IconSlotSize;
  iconColor?: string;
  title: string;
  titleSize?: 'xs' | 'sm';
  titleColor?: string;
  subtitle: string;
  subtitleColor?: string;
  trailing?: ReactNode;
  onActivate?: () => void;
}

// ListRow-style rows have no built-in interactive affordance of their own
// (no role, no keyboard handling) — same resolution as every other
// tappable custom row in this project: the row itself is responsible for
// real, keyboard-reachable interactivity, not just a mouse-only onClick.
function rowA11yProps(onActivate: () => void) {
  return {
    role: 'button' as const,
    tabIndex: 0,
    onClick: onActivate,
    onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onActivate();
      }
    },
  };
}

export function BucketRow({
  icon,
  iconSize = '250',
  iconColor = 'var(--color-text-primary)',
  title,
  titleSize = 'sm',
  titleColor = 'var(--color-text-primary)',
  subtitle,
  subtitleColor = 'var(--color-text-secondary)',
  trailing,
  onActivate,
}: BucketRowProps) {
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
        background: 'var(--color-background-surface)',
        cursor: onActivate ? 'pointer' : undefined,
      }}
      {...(onActivate ? rowA11yProps(onActivate) : {})}
    >
      <IconSlot size={iconSize} color={iconColor}>
        {typeof icon === 'string' ? <span style={{ fontSize: 'var(--font-size-lg)' }}>{icon}</span> : icon}
      </IconSlot>
      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: '1 1 auto' }}>
        <p
          style={{
            margin: 0,
            fontFamily: 'var(--font-family-default)',
            fontWeight: 'var(--font-weight-semibold)',
            fontSize: titleSize === 'xs' ? 'var(--font-size-xs)' : 'var(--font-size-sm)',
            lineHeight: 'var(--font-line-height-xs)',
            letterSpacing: 'var(--font-tracking-loose)',
            color: titleColor,
          }}
        >
          {title}
        </p>
        <p
          style={{
            margin: 0,
            fontFamily: 'var(--font-family-default)',
            fontWeight: 'var(--font-weight-regular)',
            fontSize: 'var(--font-size-xs)',
            lineHeight: 'var(--font-line-height-xs)',
            letterSpacing: 'var(--font-tracking-loose)',
            color: subtitleColor,
          }}
        >
          {subtitle}
        </p>
      </div>
      {trailing}
    </div>
  );
}
