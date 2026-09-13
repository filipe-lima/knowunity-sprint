import type { HTMLAttributes, ReactNode } from 'react';

/**
 * Read from the Figma component set "field" (node 13734:32403, file
 * u3BZUg8k5p3mrOrKAnYO5c, page "New components", inside the "Field" wrapper
 * frame). Every prop name and option below is that component's own: state
 * is its one VARIANT property (Empty/Filled/Focused, default Empty); value
 * (TEXT) and Trailing (SLOT) are its only other properties.
 *
 * Figma's own description (verbatim, also in the story docs): built with 3
 * of the plan's 4 states. Empty and Filled are drawn as real instances
 * (chat input / text answer); Focused has no drawn instance but the plan
 * gives an explicit stroke binding (border/focus at Stroke/Border), so it
 * was buildable without one. Disabled has neither a drawn instance nor a
 * binding instruction — not built, same policy as recordControl's
 * Submitting/Disabled.
 *
 * value's default text genuinely differs by state in the real file
 * (Empty/Focused: "Ask Knowie...", Filled: "Type your answer") — modeled
 * as one prop with a state-appropriate default, same pattern used for
 * recordControl's caption.
 *
 * A real inconsistency, found but NOT built around (Figma's own
 * description says so explicitly): the one real multiline field instance
 * in the file uses Radius/600 instead of Radius/Full, and looks visibly
 * different because of it. field's only axis is state, not line count,
 * and the plan's own binding table only specifies Radius/Full — built to
 * that literal instruction, one data point being insufficient to invent a
 * documented multiline rule the plan never states.
 *
 * The real master frame is a FIXED, unbound 302px wide with no binding
 * instruction and no "hardcode this" note anywhere (unlike topBar's
 * explicit, confirmed 390 literal) — 302 reads as an artifact of whatever
 * composer instance it happened to be measured inside, not a deliberate
 * dimension. Since field is documented as living inside composer
 * (docs/design-system.md's `composer` section: "field is instantiated
 * directly inside composer... the field itself is its own component"),
 * next to a variable number of leading/trailing icons, it needs to stretch
 * rather than stay fixed — so this component defaults to filling its
 * container's width instead of reproducing the literal.
 *
 * This is a presentational reproduction of the real component (its state
 * is driven by the state/value props, matching every other state-driven
 * component built this session, e.g. ListRow, RecallBlock) rather than a
 * wired-up text input — no keystroke/onChange behavior exists on the real
 * Figma component either. Wiring a real `<input>`/`<textarea>` underneath
 * is a natural follow-up but is not part of this build.
 */
export type FieldState = 'Empty' | 'Filled' | 'Focused';

export interface FieldProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  state?: FieldState;
  value?: string;
  trailing?: ReactNode;
}

const DEFAULT_VALUE: Record<FieldState, string> = {
  Empty: 'Ask Knowie...',
  Filled: 'Type your answer',
  Focused: 'Ask Knowie...',
};

const VALUE_COLOR: Record<FieldState, string> = {
  Empty: 'var(--color-text-secondary)',
  Filled: 'var(--color-text-primary)',
  Focused: 'var(--color-text-secondary)',
};

export function Field({ state = 'Empty', value, trailing, style, ...rest }: FieldProps) {
  const isFocused = state === 'Focused';

  return (
    <div
      data-state={state}
      style={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        boxSizing: 'border-box',
        gap: 'var(--space-300)',
        paddingLeft: 'var(--space-400)',
        paddingRight: 'var(--space-300)',
        paddingTop: 'var(--space-300)',
        paddingBottom: 'var(--space-300)',
        borderRadius: 'var(--radius-full)',
        background: 'var(--color-background-surface)',
        border: isFocused
          ? 'var(--stroke-border) solid var(--color-border-focus)'
          : 'var(--stroke-border) solid transparent',
        ...style,
      }}
      {...rest}
    >
      <p
        style={{
          flex: '1 1 auto',
          minWidth: 0,
          margin: 0,
          fontFamily: 'var(--font-family-default)',
          fontWeight: 'var(--font-weight-regular)',
          fontSize: 'var(--font-size-sm)',
          lineHeight: 'var(--font-line-height-sm)',
          letterSpacing: 'var(--font-tracking-loose)',
          color: VALUE_COLOR[state],
        }}
      >
        {value ?? DEFAULT_VALUE[state]}
      </p>
      {trailing}
    </div>
  );
}
