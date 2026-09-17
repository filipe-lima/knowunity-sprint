import { ChevronLeft } from 'lucide-react';

import { ButtonIcon } from '../ButtonIcon/ButtonIcon';

/**
 * Promoted 2026-09-17 from `screens/Hub/ScaffoldHeader.tsx` — shared by
 * two real screens (`RecallHub`, `RecallHistory`), the threshold
 * `docs/component-gaps.md` sets for moving something inline into a real
 * `components/` entry.
 *
 * Not a real Figma component of its own. Both real screen instances show
 * a back icon plus a centered title; neither of `TopBar`'s two real
 * variants reproduces that layout (`Title` puts the text next to
 * Leading, left-aligned; `Centered` centers the text but has no Leading
 * slot at all — see `components/TopBar`'s own doc comment).
 * `docs/design-system.md`: "if the header sits on a static screen, use a
 * plain row in the slot instead" — a bare `buttonIcon` next to a title,
 * no `appBar`/`TopBar` involved. Built as that plain row.
 *
 * **Live-checked directly against Hub C's real `appBar` instance
 * (node `13759:45277`) on promotion, not just re-described:** its real
 * back button is a genuine `arrow-left` icon inside a real `iconSlot`
 * inside an `App Bar Button Icon`, 48×48 — exactly `ButtonIcon`
 * Tertiary/M's own real size (`--control-600`), already an exact match.
 * Its real title text is 15px SemiBold (`Greed Standard-TRIAL`) — exactly
 * `--font-size-sm` + `--font-weight-semibold`, also already an exact
 * match. So this component's own type and icon size were already right;
 * nothing needed correcting on promotion. The one real, deliberate
 * divergence: appBar's real layout is left-aligned (icon then text,
 * `primaryAxisAlignItems: MIN`) — this component centers the title
 * independent of the button instead (`position: relative` plus an
 * absolutely-positioned back button), matching `design-system.md`'s own
 * prescribed rule for a static (non-scrolling) screen rather than
 * appBar's own real composition. Reproduced live in Figma the same way,
 * on the "New components" page — see that component's own description.
 */
export interface ScaffoldHeaderProps {
  title: string;
  onBack: () => void;
}

export function ScaffoldHeader({ title, onBack }: ScaffoldHeaderProps) {
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        boxSizing: 'border-box',
        padding: 'var(--space-300) var(--space-400)',
      }}
    >
      <div style={{ position: 'absolute', left: 'var(--space-400)' }}>
        <ButtonIcon variant="Tertiary" size="M" icon={<ChevronLeft style={{ width: '100%', height: '100%' }} />} aria-label="Back" onClick={onBack} />
      </div>
      <p
        style={{
          margin: 0,
          fontFamily: 'var(--font-family-default)',
          fontWeight: 'var(--font-weight-semibold)',
          fontSize: 'var(--font-size-sm)',
          lineHeight: 'var(--font-line-height-xs)',
          letterSpacing: 'var(--font-tracking-loose)',
          color: 'var(--color-text-primary)',
        }}
      >
        {title}
      </p>
    </div>
  );
}
