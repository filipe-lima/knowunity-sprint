import type { ReactNode } from 'react';

import { IconSlot } from '../IconSlot/IconSlot';

/**
 * Read from the real Figma "Navbar" component (found via the live Desktop
 * Bridge connection, 2026-09-16, inside `Home E — Knowie's message`, node
 * `13759:45221`, "Final flow" page) — this project's first real usage.
 * Confirmed real `componentProperties` on the one instance checked:
 * `Scrim` (boolean, `false` here), `# of tabs` (`5`), `Border` (`No`).
 * Rendered at 358×64.
 *
 * Composed of 5 real `Navigation Button` instances (confirmed props:
 * `Icon`, `Has Label` — `false` on every real tab here, `Label`, `State`
 * — `Active`/`Inactive`) plus a trailing `Avatar`
 * (`components/Avatar/Avatar.tsx`, also new this session). `# of tabs`
 * being a real Figma property suggests other tab counts may exist, but
 * only the 5-tab real instance was confirmed — `tabs` is exposed as an
 * array rather than 5 fixed named slots so a different count isn't a type
 * error, but only 5 has been checked against the real file.
 *
 * Icon colors, resolved from each real bound Figma variable directly (not
 * guessed): `Active` uses `interactive/primary` (mapped to this project's
 * closest real token, `--color-interactive-primary-default` — the
 * variable name itself has no exact match in this codebase's generated
 * tokens, flagged in docs/component-gaps.md); `Inactive` uses
 * `text/secondary` (`--color-text-secondary`, an exact match) on 3 of the
 * 4 real inactive tabs. The 4th (`trophy-02`) resolved to
 * `palette/blue/tint`, which doesn't correspond to anything in this
 * codebase's semantic token set at all. Rather than bake that one-off
 * anomaly into this generic component (it may just be an authoring
 * mistake in Figma, not a deliberate signal), it's exposed as a plain
 * optional `color` override on `NavigationButtonProps` instead — the
 * caller who knows which real tab is which decides whether to reproduce
 * it. See `screens/Home/Home.tsx` and `docs/component-gaps.md`.
 */
export type NavigationButtonState = 'Active' | 'Inactive';

export interface NavigationButtonProps {
  icon: ReactNode;
  state?: NavigationButtonState;
  label?: string;
  hasLabel?: boolean;
  /** Overrides the state-derived color — see the file-level comment on
   *  the one confirmed real anomaly (`trophy-02`'s `palette/blue/tint`). */
  color?: string;
  onClick?: () => void;
  'aria-label': string;
}

function NavigationButton({ icon, state = 'Inactive', label, hasLabel = false, color, onClick, ...rest }: NavigationButtonProps) {
  const resolvedColor = color ?? (state === 'Active' ? 'var(--color-interactive-primary-default)' : 'var(--color-text-secondary)');
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flex: '1 1 0',
        gap: 'var(--space-050)',
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
      }}
      {...rest}
    >
      <IconSlot size="250" color={resolvedColor}>
        {icon}
      </IconSlot>
      {hasLabel && label ? (
        <span
          style={{
            fontFamily: 'var(--font-family-default)',
            fontWeight: 'var(--font-weight-regular)',
            fontSize: 'var(--font-size-2xs)',
            lineHeight: 'var(--font-line-height-2xs)',
            color: resolvedColor,
          }}
        >
          {label}
        </span>
      ) : null}
    </button>
  );
}

export interface NavbarProps {
  tabs: NavigationButtonProps[];
  avatar?: ReactNode;
}

export function Navbar({ tabs, avatar }: NavbarProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        boxSizing: 'border-box',
        gap: 'var(--space-200)',
        paddingTop: 'var(--space-200)',
        paddingBottom: 'var(--space-200)',
      }}
    >
      {tabs.map((tab, i) => (
        <NavigationButton key={i} {...tab} />
      ))}
      {avatar ? <div style={{ flexShrink: 0 }}>{avatar}</div> : null}
    </div>
  );
}
