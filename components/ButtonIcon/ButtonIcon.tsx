'use client';

import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { resolveButtonColors } from '../shared/resolveButtonColors';
import { Spinner } from '../shared/Spinner';

/**
 * Read from the Figma component set "buttonIcon" (node 9003:8235, file
 * u3BZUg8k5p3mrOrKAnYO5c, page "🎨 Mascot & components"). Every prop name
 * and option below is that component's own: variant/size/state, its only
 * three VARIANT properties — unlike button, buttonIcon has no separate
 * text/boolean properties, since the icon is its only content. See
 * ButtonIcon.stories.tsx for the component's own written description.
 *
 * Fill, pressed and disabled colors are shared with Button via
 * resolveButtonColors — buttonIcon's own description says it is "Icon-only
 * button on the same three axes as button," and that color logic really is
 * identical between the two. The one addition here is Primary's
 * border/default stroke, which button does not have.
 */
export type ButtonIconVariant = 'Primary' | 'Secondary' | 'Tertiary';
export type ButtonIconSize = 'S' | 'M' | 'L';
export type ButtonIconState = 'Default' | 'Pressed' | 'Disabled' | 'Loading';

export interface ButtonIconProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  variant?: ButtonIconVariant;
  size?: ButtonIconSize;
  state?: ButtonIconState;
  /**
   * Figma delivers the glyph through a nested iconSlot instance; this
   * codebase has no built iconSlot component yet to reproduce that from,
   * so the actual icon content is left to the caller.
   */
  icon: ReactNode;
  /** Required for an icon-only control — there is no visible label. */
  'aria-label': string;
}

// wrapper = the fixed-height/width tap target (accessibility hit area),
// square at every size except Tertiary/L — see the "Don't" in
// ButtonIcon.stories.tsx: Figma's own wrapper for Tertiary/L is 48 wide by
// 56 tall, not square like every other L, and is reproduced as-is here
// rather than silently squared off.
const WRAPPER_SIZE: Record<ButtonIconSize, string> = {
  S: 'var(--control-600)',
  M: 'var(--control-600)',
  L: 'var(--control-700)',
};

// circle = the visible, colored shape inside the wrapper, centered.
// Primary/Secondary get a real circle at the control scale; Tertiary has
// no fill, so its "circle" just hugs the icon itself (no size token to
// bind to, matching Figma's own construction).
const CIRCLE_SIZE: Record<ButtonIconSize, string> = {
  S: 'var(--control-400)',
  M: 'var(--control-500)',
  L: 'var(--control-700)',
};

const ICON_SIZE: Record<ButtonIconSize, string> = {
  S: 'var(--icon-200)',
  M: 'var(--icon-250)',
  L: 'var(--icon-300)',
};

export const ButtonIcon = forwardRef<HTMLButtonElement, ButtonIconProps>(function ButtonIcon(
  { variant = 'Primary', size = 'S', state = 'Default', icon, onClick, type = 'button', ...rest },
  ref,
) {
  const isDisabled = state === 'Disabled';
  const isLoading = state === 'Loading';
  const isTertiary = variant === 'Tertiary';
  const { background, foreground } = resolveButtonColors(variant, state);

  // Primary carries a 1px border/default stroke in Default, Pressed and
  // Loading, and loses it in Disabled. Secondary and Tertiary never have
  // one — see the component description for the "Don't" this produces
  // (an undecorated Secondary/Default becomes visually identical to a
  // Primary/Disabled).
  const border =
    variant === 'Primary' && !isDisabled
      ? 'var(--stroke-border) solid var(--color-border-default)'
      : 'none';

  // The inner-shadow bezel on the tap-target wrapper is real in Figma for
  // Primary/Secondary; Tertiary's wrapper carries no such effect — same
  // rule as Button.
  const hasBezel = !isTertiary;

  // Tertiary/L is the one irregular case: a 48-wide, 56-tall wrapper
  // (rather than a square 56x56 like every other L) — see the component's
  // own "Don't" about using it in a row with other L controls.
  const wrapperWidth = isTertiary && size === 'L' ? 'var(--control-600)' : WRAPPER_SIZE[size];

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled || isLoading}
      aria-busy={isLoading || undefined}
      onClick={isDisabled || isLoading ? undefined : onClick}
      data-variant={variant}
      data-size={size}
      data-state={state}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: wrapperWidth,
        height: WRAPPER_SIZE[size],
        background: 'transparent',
        border: 'none',
        padding: 'var(--space-0)',
        cursor: isDisabled ? 'default' : 'pointer',
        boxShadow: hasBezel
          ? `inset 0 ${size === 'L' ? 'var(--depth-negative-100)' : 'var(--depth-negative-050)'} var(--depth-0) var(--depth-0) var(--color-black-300)`
          : 'none',
      }}
      {...rest}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: isTertiary ? ICON_SIZE[size] : CIRCLE_SIZE[size],
          height: isTertiary ? ICON_SIZE[size] : CIRCLE_SIZE[size],
          borderRadius: 'var(--radius-full)',
          background,
          border,
          color: foreground,
        }}
      >
        {isLoading ? (
          <Spinner size={ICON_SIZE[size]} color={foreground} />
        ) : (
          <span
            style={{
              width: ICON_SIZE[size],
              height: ICON_SIZE[size],
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </span>
        )}
      </span>
    </button>
  );
});
