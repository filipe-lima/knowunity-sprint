/**
 * Shared by Button and ButtonIcon — both Figma component sets ("button" and
 * "buttonIcon") describe themselves as living on the same three axes
 * (variant/size/state), and both resolve fill + foreground color the same
 * way per variant/state. buttonIcon's own description: "Icon-only button
 * on the same three axes as button." Extracted here once so the two
 * components can't quietly drift apart on what a given variant/state
 * combination is supposed to look like.
 *
 * Figma's own documented pairing — see each component's description in its
 * *.stories.tsx for the "Don't" this reproduces (Primary/Disabled and
 * Secondary/Default share the same fill on purpose, not by accident here).
 */
export type Variant = 'Primary' | 'Secondary' | 'Tertiary';
export type State = 'Default' | 'Pressed' | 'Disabled' | 'Loading';

export function resolveButtonColors(variant: Variant, state: State) {
  const isDisabled = state === 'Disabled';
  const isPressed = state === 'Pressed';

  if (variant === 'Primary') {
    if (isDisabled) {
      return { background: 'var(--color-background-surface)', foreground: 'var(--color-text-disabled)' };
    }
    return {
      background: isPressed
        ? 'var(--color-interactive-primary-active)'
        : 'var(--color-interactive-primary-default)',
      foreground: 'var(--color-interactive-primary-on)',
    };
  }

  if (variant === 'Secondary') {
    if (isDisabled) {
      return { background: 'var(--color-background-surface)', foreground: 'var(--color-text-disabled)' };
    }
    return {
      background: isPressed
        ? 'var(--color-interactive-secondary-active)'
        : 'var(--color-background-surface)',
      foreground: 'var(--color-text-primary)',
    };
  }

  // Tertiary: no fill at rest (or disabled); picks up
  // interactive/secondary/active only while pressed.
  if (isDisabled) {
    return { background: 'transparent', foreground: 'var(--color-text-disabled)' };
  }
  return {
    background: isPressed ? 'var(--color-interactive-secondary-active)' : 'transparent',
    foreground: 'var(--color-text-primary)',
  };
}
