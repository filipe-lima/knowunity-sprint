import type { HTMLAttributes, ReactNode } from 'react';

import { MascotSlot } from '../MascotSlot/MascotSlot';
import { Button } from '../Button/Button';

/**
 * Read from the Figma component "knowieMessage" (node 13734:32450, file
 * u3BZUg8k5p3mrOrKAnYO5c, page "New components", inside the "Knowie
 * message" wrapper frame). Carries no Figma description of its own (its
 * `description` field is literally null, same predates-the-docs-pass
 * situation as MascotSlot and SessionHero) — every prop and default below
 * comes straight from its own componentPropertyDefinitions and directly
 * diffing the real instance, cross-checked against
 * docs/design-system.md's own account.
 *
 * A single component, not a set — docs/design-system.md: "None — a single
 * component, not a set," matching the file's own convention that anything
 * with no real Figma axis is built as one component rather than a forced
 * one-variant set.
 *
 * The mascot is a real, directly-instantiated `mascotSlot` (size=XL,
 * crop=Full) — not a SLOT, so it's built into this component (matching
 * `composer`'s real `field` instantiation) rather than exposed as a
 * swappable child. Its own pose artwork has no property tracking it in
 * Figma either way (MascotSlot's own docs: "the pose is still an
 * instance-level swap that no property tracks"), so — same resolution as
 * every other icon/artwork gap this session — it's left to the caller via
 * an optional `mascot` prop, with no default asset.
 *
 * `message` is a real TEXT property; its default is Figma's own real
 * default value, verbatim.
 *
 * `Actions` is a genuine SLOT, but — unlike every other slot built this
 * session — docs/design-system.md explicitly calls out that it "now
 * defaults to a Primary/S 'Start' button plus a Tertiary/S 'Not now'
 * button (matching what every real instance actually places there),
 * rather than sitting empty." The real fetched instance confirms this
 * exactly (a real Primary/S button "Start" and a real Tertiary/S button
 * "Not now" already sit in the slot). So — deliberately departing from the
 * TopBar/RecordControl/Composer precedent of leaving real slots empty by
 * default — this component's own `actions` prop defaults to that real
 * button pair when omitted, using the already-built Button component,
 * rather than leaving it for the story alone to fill in.
 *
 * The master frame is a FIXED, unbound 358px wide with no binding
 * instruction, same missing-literal situation as field/composer/
 * sessionHero — and knowieMessage is documented as living directly in
 * scaffold content ("Home and Hub, where Knowie proposes a session, and
 * the all-clear states"), so this component fills its container's width
 * by default instead of reproducing the literal.
 */
export interface KnowieMessageProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  message?: string;
  mascot?: ReactNode;
  actions?: ReactNode;
}

const DEFAULT_ACTIONS = (
  <>
    <Button variant="Primary" size="S" cta="Start" />
    <Button variant="Tertiary" size="S" cta="Not now" />
  </>
);

export function KnowieMessage({
  message = 'You read Research Methods on Tuesday. Say five terms back to me? About 3 minutes.',
  mascot,
  actions,
  style,
  ...rest
}: KnowieMessageProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        width: '100%',
        boxSizing: 'border-box',
        gap: 'var(--space-200)',
        ...style,
      }}
      {...rest}
    >
      <MascotSlot size="XL">{mascot}</MascotSlot>
      <div
        style={{
          flex: '1 1 auto',
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
          gap: 'var(--space-200)',
          paddingLeft: 'var(--space-400)',
          paddingRight: 'var(--space-400)',
          paddingTop: 'var(--space-300)',
          paddingBottom: 'var(--space-300)',
          borderRadius: 'var(--radius-600)',
          background: 'var(--color-background-surface)',
        }}
      >
        <p
          style={{
            margin: 0,
            fontFamily: 'var(--font-family-default)',
            fontWeight: 'var(--font-weight-regular)',
            fontSize: 'var(--font-size-sm)',
            lineHeight: 'var(--font-line-height-sm)',
            letterSpacing: 'var(--font-tracking-loose)',
            color: 'var(--color-text-primary)',
          }}
        >
          {message}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-200)' }}>{actions ?? DEFAULT_ACTIONS}</div>
      </div>
    </div>
  );
}
