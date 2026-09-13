'use client';

import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';
import { resolveButtonColors } from '../shared/resolveButtonColors';
import { Spinner } from '../shared/Spinner';

/**
 * Read from the Figma component set "button" (node 9003:6667, file
 * u3BZUg8k5p3mrOrKAnYO5c, page "🎨 Mascot & components"). Every prop name
 * and option below is that component's own: variant/size/state are its
 * three VARIANT properties, cta/showLeftIcon/showRightIcon its three
 * instance properties. See Button.stories.tsx for the component's own
 * written description (what it is, when to use it, what not to do).
 */
export type ButtonVariant = 'Primary' | 'Secondary' | 'Tertiary';
export type ButtonSize = 'S' | 'M' | 'L';
export type ButtonState = 'Default' | 'Pressed' | 'Disabled' | 'Loading';

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  state?: ButtonState;
  /** The button's label. Figma's own property is named "CTA". */
  cta: string;
  showLeftIcon?: boolean;
  showRightIcon?: boolean;
  /**
   * Figma toggles a fixed icon glyph via showLeftIcon/showRightIcon; this
   * codebase has no built iconSlot component yet to reproduce that glyph
   * from, so the actual icon content is left to the caller.
   */
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

// wrapper = the fixed-height tap target (accessibility hit area).
// pill = the visible, colored shape inside it, centered.
const WRAPPER_MIN_HEIGHT: Record<ButtonSize, string> = {
  S: 'var(--control-600)',
  M: 'var(--control-600)',
  L: 'var(--control-700)',
};

const PILL_HEIGHT: Record<ButtonSize, string> = {
  S: 'var(--control-400)',
  M: 'var(--control-500)',
  L: 'var(--control-700)',
};

const PILL_PADDING_X: Record<ButtonSize, string> = {
  S: 'var(--space-300)',
  M: 'var(--space-400)',
  L: 'var(--space-600)',
};

const CONTENT_GAP: Record<ButtonSize, string> = {
  S: 'var(--space-150)',
  M: 'var(--space-150)',
  L: 'var(--space-200)',
};

// A small optical nudge that sits the label baseline correctly against any
// icon beside it — present in the real component at every size.
const CONTENT_PADDING_BOTTOM: Record<ButtonSize, string> = {
  S: 'var(--space-050)',
  M: 'var(--space-050)',
  L: 'var(--space-100)',
};

const LABEL_FONT: Record<ButtonSize, CSSProperties> = {
  S: {
    fontFamily: 'var(--font-family-default)',
    fontWeight: 'var(--font-weight-semibold)' as CSSProperties['fontWeight'],
    fontSize: 'var(--font-size-sm)',
    lineHeight: 'var(--font-line-height-sm)',
    letterSpacing: 'var(--font-tracking-loose)',
  },
  M: {
    fontFamily: 'var(--font-family-default)',
    fontWeight: 'var(--font-weight-semibold)' as CSSProperties['fontWeight'],
    fontSize: 'var(--font-size-sm)',
    lineHeight: 'var(--font-line-height-sm)',
    letterSpacing: 'var(--font-tracking-loose)',
  },
  L: {
    fontFamily: 'var(--font-family-default)',
    fontWeight: 'var(--font-weight-bold)' as CSSProperties['fontWeight'],
    fontSize: 'var(--font-size-lg)',
    lineHeight: 'var(--font-line-height-md)',
    letterSpacing: 'var(--font-tracking-none)',
  },
};

const ICON_BOX: CSSProperties = {
  width: 'var(--icon-200)',
  height: 'var(--icon-200)',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'Primary',
    size = 'S',
    state = 'Default',
    cta,
    showLeftIcon = false,
    showRightIcon = false,
    leftIcon,
    rightIcon,
    onClick,
    type = 'button',
    ...rest
  },
  ref,
) {
  const isDisabled = state === 'Disabled';
  const isLoading = state === 'Loading';
  const { background, foreground: label } = resolveButtonColors(variant, state);
  // The inner-shadow bezel on the tap-target wrapper is real in Figma for
  // Primary/Secondary; Tertiary's wrapper carries no such effect.
  const hasBezel = variant !== 'Tertiary';

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled || isLoading}
      aria-busy={isLoading || undefined}
      // Loading swaps the visible label for a bare spinner (see below) —
      // without this, the button's accessible name disappears entirely
      // for screen reader users at exactly the moment they most need
      // confirmation the button still means what it said. A caller's own
      // aria-label (spread via ...rest below) still wins over this.
      aria-label={isLoading ? cta : undefined}
      onClick={isDisabled || isLoading ? undefined : onClick}
      data-variant={variant}
      data-size={size}
      data-state={state}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 'var(--control-600)',
        minHeight: WRAPPER_MIN_HEIGHT[size],
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
          height: PILL_HEIGHT[size],
          paddingLeft: variant === 'Tertiary' ? 'var(--space-0)' : PILL_PADDING_X[size],
          paddingRight: variant === 'Tertiary' ? 'var(--space-0)' : PILL_PADDING_X[size],
          borderRadius: 'var(--radius-full)',
          background,
          color: label,
        }}
      >
        {isLoading ? (
          <Spinner size="var(--icon-200)" color={label} />
        ) : (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: CONTENT_GAP[size],
              paddingBottom: CONTENT_PADDING_BOTTOM[size],
            }}
          >
            {showLeftIcon ? <span style={ICON_BOX}>{leftIcon}</span> : null}
            <span style={LABEL_FONT[size]}>{cta}</span>
            {showRightIcon ? <span style={ICON_BOX}>{rightIcon}</span> : null}
          </span>
        )}
      </span>
    </button>
  );
});
