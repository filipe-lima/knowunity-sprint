import type { HTMLAttributes, ReactNode } from 'react';

/**
 * Read from the Figma component set "listItem" (node 4156:13685, file
 * u3BZUg8k5p3mrOrKAnYO5c, page "🎨  Mascot & components"). Not reachable
 * by name search on either component page — resolved from a real
 * "listItem" INSTANCE's mainComponent, the same technique used for
 * MascotSlot/BottomSheet/ChatInput. Not covered by docs/design-system.md
 * at all, and genuinely distinct from `ListRow` (also in this codebase,
 * also real, also documented) — the two coexist as separate components.
 * Carries no Figma description. This is the single largest component set
 * found this session: 45 real variant combinations (5 `trailing` options
 * × 3 `variant` options × 3 `state` options), confirmed directly rather
 * than fully enumerated one by one.
 *
 * Real properties, confirmed against componentPropertyDefinitions:
 * `trailing` (Icon/Icon & Text/Switch/Checkbox/None, default Icon),
 * `variant` (Filled/Filled Compact/Transparent, default Transparent),
 * `state` (Default/Pressed/Selected, default Default), `title` (default
 * "Something dope"), `subtitle`/`showSubtitle` (default "Short & crisp.",
 * true), `rightIconText` (default "9th grade", used by trailing="Icon &
 * Text"), `emoji` (default "🔥"), and four independent leading-media
 * booleans — `showIcon`/`showIllustration`/`showEmoji`/`showImage` — all
 * defaulting to true in Figma's own property list, even though a real row
 * would only ever enable one at a time. Reproduced with the same four
 * independent booleans (not collapsed into a single invented "leading"
 * enum) since that's the property shape Figma actually has.
 *
 * **A real, confirmed constraint, not enforced at the type level:**
 * `trailing="Switch"` only exists under `variant="Transparent"` — there
 * is no Filled or Filled Compact + Switch combination anywhere in the
 * real component set. Flagged here rather than silently allowed to look
 * fully orthogonal.
 *
 * **Root-level styling per variant, confirmed directly:** Transparent has
 * no fill (Space/400 x Space/100 padding, Radius/200); Filled and Filled
 * Compact both fill background/surface with Radius/600 and a bottom-lit
 * inner-shadow bezel, differing only in padding (Space/400 all sides vs
 * Space/300 vertical) and bezel offset. `state="Pressed"` is confirmed
 * identical to ListRow's own precedent — background/surface plus an
 * interactive/pressed 10% overlay, regardless of `variant`.
 * `state="Selected"` was checked directly against the real
 * trailing="Icon" instance and shows **no root-level fill or stroke
 * difference at all** — its real visual signal (if any) lives on the
 * trailing control itself (a ticked Checkbox, an on Switch), not a row
 * treatment. Reproduced faithfully: Selected only changes `checked`/`on`
 * defaults on Checkbox/Switch trailing, not the row's own background.
 *
 * **Title/subtitle typography is unbound in Figma — a real, confirmed
 * gap, not silently forced to the nearest token:** the real Label nodes
 * use raw 17px/600 (title) and 14px/400 (subtitle), with no
 * boundVariables entry for fontSize/fontWeight/lineHeight at all (unlike
 * every color/space/radius value in this same component, which are all
 * properly bound). Since this codebase's hard rule is that no value is
 * ever hand-typed, the nearest real tokens are used instead —
 * font/size/md (18px) + font/weight/semibold for title, font/size/sm
 * (15px) + font/weight/regular for subtitle — flagged here as an
 * approximation of an unbound original, not a match.
 *
 * **Two nested pieces are separate, real, unbuilt components — not
 * reproduced pixel-for-pixel:** the real "Checkbox" instance (its own
 * Selection/State variants) and the real "switch" instance (its own
 * state/isActive variants). Both are represented here as small, private,
 * faithful-enough local visuals (using the real tokens confirmed on the
 * switch: 52x32 pill, background/stacking track) rather than fully
 * rebuilt as their own components.
 *
 * The row's own height is unbound in Figma too (56/72/60 for Transparent/
 * Filled/Filled Compact) but every one of `variant`'s three heights comes
 * directly from its own real padding + fixed 40px content row, so it's
 * reproduced here as the natural result of that padding, not a separate
 * hardcoded height.
 *
 * **A real accessibility gap, found and fixed, not just flagged:** neither
 * the real Checkbox/switch instances nor this component's own local
 * stand-ins carry any built-in accessible name, so a screen reader
 * announced a bare, unlabeled control. Both now take their name from
 * `trailingAriaLabel`, defaulting to `title` — the row's own title is the
 * only real text that identifies what the control governs.
 */
export type ListItemVariant = 'Filled' | 'Filled Compact' | 'Transparent';
export type ListItemState = 'Default' | 'Pressed' | 'Selected';
export type ListItemTrailing = 'Icon' | 'Icon & Text' | 'Switch' | 'Checkbox' | 'None';

export interface ListItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  variant?: ListItemVariant;
  state?: ListItemState;
  trailing?: ListItemTrailing;
  title?: string;
  subtitle?: string;
  showSubtitle?: boolean;
  rightIconText?: string;
  emoji?: string;
  showIcon?: boolean;
  showIllustration?: boolean;
  showEmoji?: boolean;
  showImage?: boolean;
  leadingIcon?: ReactNode;
  leadingIllustration?: ReactNode;
  leadingImage?: ReactNode;
  trailingIcon?: ReactNode;
  checked?: boolean;
  on?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  onSwitchToggle?: (on: boolean) => void;
  /**
   * Accessible name for the trailing Checkbox/Switch control — neither is
   * a slot in Figma, and neither has any built-in label, so without this
   * a screen reader announces a bare, unlabeled control. Defaults to
   * `title`, since in real usage the row's own title is the only text
   * that identifies what the control governs.
   */
  trailingAriaLabel?: string;
}

const ROOT_STYLE: Record<
  ListItemVariant,
  { paddingLeft: string; paddingRight: string; paddingTop: string; paddingBottom: string; radius: string; filled: boolean; shadowOffset: string }
> = {
  Transparent: {
    paddingLeft: 'var(--space-400)',
    paddingRight: 'var(--space-400)',
    paddingTop: 'var(--space-100)',
    paddingBottom: 'var(--space-100)',
    radius: 'var(--radius-200)',
    filled: false,
    shadowOffset: '0',
  },
  Filled: {
    paddingLeft: 'var(--space-400)',
    paddingRight: 'var(--space-400)',
    paddingTop: 'var(--space-400)',
    paddingBottom: 'var(--space-400)',
    radius: 'var(--radius-600)',
    filled: true,
    shadowOffset: '-4px',
  },
  'Filled Compact': {
    paddingLeft: 'var(--space-400)',
    paddingRight: 'var(--space-400)',
    paddingTop: 'var(--space-300)',
    paddingBottom: 'var(--space-300)',
    radius: 'var(--radius-600)',
    filled: true,
    shadowOffset: '-2px',
  },
};

function DefaultTrailingGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" aria-hidden="true">
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LocalCheckbox({
  checked,
  onChange,
  ariaLabel,
}: {
  checked: boolean;
  onChange?: (v: boolean) => void;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      aria-label={ariaLabel}
      onClick={() => onChange?.(!checked)}
      style={{
        flexShrink: 0,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 'var(--icon-300)',
        height: 'var(--icon-300)',
        borderRadius: 'var(--radius-200)',
        border: checked ? 'none' : 'var(--stroke-border) solid var(--color-border-default)',
        background: checked ? 'var(--color-interactive-primary-default)' : 'transparent',
        cursor: 'pointer',
        padding: 0,
      }}
    >
      {checked ? (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
          <path
            d="M5 13l4 4 10-10"
            stroke="var(--color-interactive-primary-on)"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : null}
    </button>
  );
}

function LocalSwitch({
  on,
  onChange,
  ariaLabel,
}: {
  on: boolean;
  onChange?: (v: boolean) => void;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={ariaLabel}
      onClick={() => onChange?.(!on)}
      style={{
        flexShrink: 0,
        display: 'inline-flex',
        alignItems: 'center',
        width: '52px',
        height: '32px',
        borderRadius: 'var(--radius-full)',
        border: 'none',
        padding: 'var(--space-050)',
        boxSizing: 'border-box',
        background: on ? 'var(--color-interactive-primary-default)' : 'var(--color-background-stacking)',
        cursor: 'pointer',
        justifyContent: on ? 'flex-end' : 'flex-start',
      }}
    >
      <span
        style={{
          display: 'block',
          width: '24px',
          height: '24px',
          borderRadius: 'var(--radius-full)',
          background: 'var(--color-background-inverse)',
        }}
      />
    </button>
  );
}

export function ListItem({
  variant = 'Transparent',
  state = 'Default',
  trailing = 'Icon',
  title = 'Something dope',
  subtitle = 'Short & crisp.',
  showSubtitle = true,
  rightIconText = '9th grade',
  emoji = '🔥',
  showIcon = true,
  showIllustration = true,
  showEmoji = true,
  showImage = true,
  leadingIcon,
  leadingIllustration,
  leadingImage,
  trailingIcon,
  checked,
  on,
  onCheckedChange,
  onSwitchToggle,
  trailingAriaLabel,
  style,
  ...rest
}: ListItemProps) {
  const rootStyle = ROOT_STYLE[variant];
  const isPressed = state === 'Pressed';
  const resolvedChecked = checked ?? state === 'Selected';
  const resolvedOn = on ?? state === 'Selected';

  return (
    <div
      data-variant={variant}
      data-state={state}
      data-trailing={trailing}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        boxSizing: 'border-box',
        gap: 'var(--space-300)',
        paddingLeft: rootStyle.paddingLeft,
        paddingRight: rootStyle.paddingRight,
        paddingTop: rootStyle.paddingTop,
        paddingBottom: rootStyle.paddingBottom,
        borderRadius: rootStyle.radius,
        background: rootStyle.filled || isPressed ? 'var(--color-background-surface)' : undefined,
        boxShadow: rootStyle.filled ? `inset 0 ${rootStyle.shadowOffset} 0 0 rgba(0,0,0,0.15)` : undefined,
        ...style,
      }}
      {...rest}
    >
      {isPressed ? (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: rootStyle.radius,
            background: 'var(--color-interactive-pressed-default)',
          }}
        />
      ) : null}

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 'var(--space-300)', minWidth: 0, flex: '1 1 auto' }}>
        {showIcon && leadingIcon ? (
          <span style={{ width: 'var(--icon-300)', height: 'var(--icon-300)', flexShrink: 0, color: 'var(--color-text-primary)' }}>
            {leadingIcon}
          </span>
        ) : null}
        {showIllustration && leadingIllustration ? (
          <span style={{ width: 'var(--icon-300)', height: 'var(--icon-300)', flexShrink: 0 }}>{leadingIllustration}</span>
        ) : null}
        {showEmoji && emoji ? (
          <span
            style={{
              width: 'var(--icon-300)',
              height: 'var(--icon-300)',
              flexShrink: 0,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 'var(--font-size-md)',
              color: 'var(--color-interactive-primary-on)',
            }}
          >
            {emoji}
          </span>
        ) : null}
        {showImage && leadingImage ? (
          <span
            style={{
              width: 'var(--icon-300)',
              height: 'var(--icon-300)',
              flexShrink: 0,
              borderRadius: 'var(--radius-200)',
              overflow: 'hidden',
              display: 'inline-flex',
            }}
          >
            {leadingImage}
          </span>
        ) : null}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-050)', minWidth: 0, flex: '1 1 auto' }}>
          <p
            style={{
              margin: 0,
              minWidth: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              fontFamily: 'var(--font-family-default)',
              fontWeight: 'var(--font-weight-semibold)',
              fontSize: 'var(--font-size-md)',
              color: 'var(--color-text-primary)',
            }}
          >
            {title}
          </p>
          {showSubtitle && subtitle ? (
            <p
              style={{
                margin: 0,
                minWidth: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                fontFamily: 'var(--font-family-default)',
                fontWeight: 'var(--font-weight-regular)',
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-text-secondary)',
              }}
            >
              {subtitle}
            </p>
          ) : null}
        </div>
      </div>

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 'var(--space-100)', flexShrink: 0 }}>
        {trailing === 'Icon' ? (
          <span style={{ width: 'var(--icon-300)', height: 'var(--icon-300)', color: 'var(--color-text-secondary)' }}>
            {trailingIcon ?? <DefaultTrailingGlyph />}
          </span>
        ) : null}
        {trailing === 'Icon & Text' ? (
          <>
            <span
              style={{
                fontFamily: 'var(--font-family-default)',
                fontWeight: 'var(--font-weight-regular)',
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-text-secondary)',
                whiteSpace: 'nowrap',
              }}
            >
              {rightIconText}
            </span>
            <span style={{ width: 'var(--icon-300)', height: 'var(--icon-300)', color: 'var(--color-text-secondary)' }}>
              {trailingIcon ?? <DefaultTrailingGlyph />}
            </span>
          </>
        ) : null}
        {trailing === 'Checkbox' ? (
          <LocalCheckbox checked={resolvedChecked} onChange={onCheckedChange} ariaLabel={trailingAriaLabel ?? title} />
        ) : null}
        {trailing === 'Switch' ? (
          <LocalSwitch on={resolvedOn} onChange={onSwitchToggle} ariaLabel={trailingAriaLabel ?? title} />
        ) : null}
      </div>
    </div>
  );
}
