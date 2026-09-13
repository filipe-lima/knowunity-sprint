import type { HTMLAttributes, ReactNode } from 'react';

import { Button } from '../Button/Button';

/**
 * Read from the Figma component "sheet" (node 13734:32465, file
 * u3BZUg8k5p3mrOrKAnYO5c, page "New components", inside the "Sheet"
 * wrapper frame). Carries no Figma description of its own (its
 * `description` field is literally null, same predates-the-docs-pass
 * situation as MascotSlot/SessionHero/KnowieMessage) — every prop and
 * default below comes straight from its own componentPropertyDefinitions
 * and directly diffing the real instance, cross-checked against
 * docs/design-system.md's own account.
 *
 * A single component, not a set — no real Figma axis, matching the file's
 * own convention (`recallCard`, `knowieMessage`, `sheet` all built this
 * way rather than a forced one-variant set).
 *
 * `title`/`body`/`footnote`/`showFootnote` are real TEXT/BOOLEAN
 * properties; every default below is each property's own real Figma
 * default, verbatim.
 *
 * `Actions` is a genuine SLOT. docs/design-system.md explicitly calls out
 * that it "now defaults to a Primary/L 'Yes, let me type' button above a
 * Tertiary/M 'No, back to home' button (matching real content), rather
 * than sitting empty" — the real fetched instance confirms this exactly.
 * So, same deliberate departure from the TopBar/RecordControl/Composer
 * "leave real slots empty" precedent as KnowieMessage's Actions, this
 * component's own `actions` prop defaults to that real button pair when
 * omitted, using the already-built Button component.
 *
 * The Grabber (the drag handle) and the sheet's own rounded-top-only
 * shape (only the top corners are bound to Radius/800; the bottom corners
 * carry no radius, since the sheet sits flush against the bottom of the
 * screen) are both real, reproduced directly from the fetched frame data.
 *
 * Width is a real, hardcoded literal 390 — unlike field/composer/
 * sessionHero/knowieMessage's unbound widths (which default to filling
 * their container, since none of those had an explicit hardcode
 * instruction), docs/design-system.md explicitly groups sheet's 390 in
 * the same confirmed-deliberate-literal bucket as topBar's 390: "topBar
 * and recordControl's 390/358 widths... sheet's 390 width... none of
 * these have a tokens/tokens.json entry, and none should be treated as
 * one." Reproduced as the literal for that reason, not filled.
 *
 * docs/design-system.md's own "Don't": the scaffold owns the scrim
 * through `showBottomSheetBackground`, so this component never renders
 * one itself — it's just the sheet's own content surface.
 */
export interface SheetProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  title?: string;
  body?: string;
  footnote?: string;
  showFootnote?: boolean;
  actions?: ReactNode;
}

const DEFAULT_ACTIONS = (
  <>
    <Button variant="Primary" size="L" cta="Yes, let me type" />
    <Button variant="Tertiary" size="M" cta="No, back to home" />
  </>
);

export function Sheet({
  title = "Can't speak right now?",
  body = 'You can type your answers instead. Same terms, same feedback, same points. This holds for the rest of the session.',
  footnote = 'Your set is kept either way.',
  showFootnote = true,
  actions,
  style,
  ...rest
}: SheetProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxSizing: 'border-box',
        width: '390px',
        gap: 'var(--space-400)',
        paddingLeft: 'var(--space-400)',
        paddingRight: 'var(--space-400)',
        paddingTop: 'var(--space-300)',
        paddingBottom: 'var(--space-600)',
        borderTopLeftRadius: 'var(--radius-800)',
        borderTopRightRadius: 'var(--radius-800)',
        background: 'var(--color-background-surface)',
        ...style,
      }}
      {...rest}
    >
      <div
        aria-hidden="true"
        style={{
          width: '40px',
          height: 'var(--space-100)',
          borderRadius: 'var(--radius-full)',
          background: 'var(--color-background-stacking)',
        }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 'var(--space-200)' }}>
        <p
          style={{
            width: '100%',
            margin: 0,
            fontFamily: 'var(--font-family-default)',
            fontWeight: 'var(--font-weight-bold)',
            fontSize: 'var(--font-size-lg)',
            lineHeight: 'var(--font-line-height-md)',
            letterSpacing: 'var(--font-tracking-none)',
            color: 'var(--color-text-primary)',
          }}
        >
          {title}
        </p>
        <p
          style={{
            width: '100%',
            margin: 0,
            fontFamily: 'var(--font-family-default)',
            fontWeight: 'var(--font-weight-regular)',
            fontSize: 'var(--font-size-sm)',
            lineHeight: 'var(--font-line-height-sm)',
            letterSpacing: 'var(--font-tracking-loose)',
            color: 'var(--color-text-secondary)',
          }}
        >
          {body}
        </p>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          width: '100%',
          gap: 'var(--space-200)',
        }}
      >
        {actions ?? DEFAULT_ACTIONS}
      </div>
      {showFootnote && footnote ? (
        <p
          style={{
            width: '100%',
            margin: 0,
            fontFamily: 'var(--font-family-default)',
            fontWeight: 'var(--font-weight-regular)',
            fontSize: 'var(--font-size-xs)',
            lineHeight: 'var(--font-line-height-xs)',
            letterSpacing: 'var(--font-tracking-loose)',
            color: 'var(--color-text-secondary)',
          }}
        >
          {footnote}
        </p>
      ) : null}
    </div>
  );
}
