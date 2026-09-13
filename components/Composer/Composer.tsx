import type { HTMLAttributes, ReactNode } from 'react';

import { Field } from '../Field/Field';
import type { FieldState } from '../Field/Field';

/**
 * Read from the Figma component set "composer" (node 13734:32417, file
 * u3BZUg8k5p3mrOrKAnYO5c, page "New components", inside the "Composer"
 * wrapper frame). Every prop name and option below is real: variant is the
 * one VARIANT property (Chat/Answer, default Chat); Leading and Trailing
 * are composer's own real SLOTs.
 *
 * `field` is genuinely instantiated directly inside composer, not a slot
 * (docs/design-system.md: "field is a real instantiated component inside
 * composer, not a slot"), so it's built into this component rather than
 * exposed as a swappable child — but field's own real, meaningful
 * properties (state/value/its own Trailing) are passed through as
 * fieldState/fieldValue/fieldTrailing rather than hidden, since they're
 * genuine configurable properties of that nested instance, not baked
 * content like RecordControl's mic glyph.
 *
 * Leading/Trailing are real SLOTs, so — matching TopBar's and
 * RecordControl's precedent — they're left empty by default and
 * populated with real content only in the stories, not hardcoded here.
 *
 * **A real inconsistency found, not resolved:** docs/design-system.md's
 * own account says "Chat's own field carries camera and mic icons in its
 * own Trailing." The real default Chat instance fetched directly from
 * Figma contradicts this — its field's Trailing and composer's own
 * Trailing are both genuinely collapsed (empty, 1x1), and only Leading
 * (a plus buttonIcon) is filled. Reproduced to match the real instance
 * data, not the prose.
 *
 * Real per-variant defaults confirmed directly against both instances:
 * Chat = Leading filled (plus buttonIcon, Secondary/M), Trailing empty,
 * field state=Empty value="Ask Knowie...". Answer = Leading empty,
 * Trailing filled (arrow-right buttonIcon, Secondary/M — the real "send"
 * control), field state=Empty value="Type your answer". Both real
 * instances share the same field state (Empty) — "Type your answer"
 * appearing in Answer's field is a per-instance value override, not a
 * different default state.
 *
 * The master frame is a FIXED, unbound 358px wide with no binding
 * instruction — same missing-literal situation as field's own 302px,
 * and for the same reason (composer directly wraps a field that must
 * itself stretch to fill bottomContent, per docs/design-system.md's
 * "Anywhere the student types") this component fills its container's
 * width by default instead of reproducing the literal.
 */
export type ComposerVariant = 'Chat' | 'Answer';

export interface ComposerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  variant?: ComposerVariant;
  leading?: ReactNode;
  trailing?: ReactNode;
  fieldState?: FieldState;
  fieldValue?: string;
  fieldTrailing?: ReactNode;
}

// Matches the real per-variant instance override found in Figma — Field's
// own default ("Ask Knowie...") already covers Chat, so only Answer needs
// an explicit override here.
const DEFAULT_FIELD_VALUE: Partial<Record<ComposerVariant, string>> = {
  Answer: 'Type your answer',
};

export function Composer({
  variant = 'Chat',
  leading,
  trailing,
  fieldState = 'Empty',
  fieldValue,
  fieldTrailing,
  style,
  ...rest
}: ComposerProps) {
  return (
    <div
      data-variant={variant}
      style={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        boxSizing: 'border-box',
        gap: 'var(--space-200)',
        ...style,
      }}
      {...rest}
    >
      <div style={{ display: 'flex', width: 'var(--control-600)', height: 'var(--control-600)', flexShrink: 0 }}>
        {leading}
      </div>
      <div style={{ flex: '1 1 auto', minWidth: 0 }}>
        <Field state={fieldState} value={fieldValue ?? DEFAULT_FIELD_VALUE[variant]} trailing={fieldTrailing} />
      </div>
      <div style={{ display: 'flex', width: 'var(--control-600)', height: 'var(--control-600)', flexShrink: 0 }}>
        {trailing}
      </div>
    </div>
  );
}
