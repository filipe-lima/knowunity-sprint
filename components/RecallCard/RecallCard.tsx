import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import { IconSlot } from '../IconSlot/IconSlot';

/**
 * Read from the Figma component "recallCard" (node 13734:32224, file
 * u3BZUg8k5p3mrOrKAnYO5c, page "New components", inside the "Recall card"
 * wrapper frame). This is a single COMPONENT, not a set — no variant axes
 * at all, matching its own description exactly: "The card does not
 * change." Every prop name below is one of its own three text properties
 * (provenance/instruction/term) plus its one open Content slot. See
 * RecallCard.stories.tsx for the component's own written description.
 *
 * Unlike Button/ButtonIcon/ListRow, the provenance icon here is NOT an
 * exposed instance-swap property in Figma — componentPropertyDefinitions
 * lists only Content/provenance/instruction/term, nothing for the icon.
 * The real component always shows the same fixed glyph ("graduation-hat-01").
 * Being faithful here means the opposite of those other components: don't
 * expose it as a prop, since Figma itself doesn't either. It's rendered
 * internally via the real IconSlot component, with a placeholder glyph in
 * its place (no icon asset library exists in this codebase — same gap as
 * every other icon slot so far).
 */
export interface RecallCardProps extends HTMLAttributes<HTMLDivElement> {
  provenance: string;
  instruction: string;
  term: string;
  /**
   * Not a Figma property — term is plain text there too, but it's the
   * single focal thing a screen reader user needs to recognize as this
   * screen's primary content. Defaults to "h2"; override per usage, same
   * reasoning as TextBlock's own "as" prop.
   */
  as?: ElementType;
  /**
   * The Content slot. Figma's own description: it "holds a stack (badge,
   * aside, transcript, correction button can all sit in it at once), not
   * a single child" — so this is deliberately typed as ReactNode, not a
   * single required element.
   */
  children?: ReactNode;
}

function GraduationCapGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" aria-hidden="true">
      <path
        d="M12 3l10 5-10 5-10-5 10-5z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <path d="M6 11v5c0 1.5 2.5 3 6 3s6-1.5 6-3v-5" stroke="currentColor" strokeWidth={2} />
    </svg>
  );
}

export function RecallCard({
  provenance,
  instruction,
  term,
  as: Term = 'h2',
  style,
  children,
  ...rest
}: RecallCardProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-400)',
        paddingLeft: 'var(--space-400)',
        paddingRight: 'var(--space-400)',
        paddingTop: 'var(--space-600)',
        paddingBottom: 'var(--space-600)',
        borderRadius: 'var(--radius-600)',
        background: 'var(--color-background-surface)',
        boxSizing: 'border-box',
        ...style,
      }}
      {...rest}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-200)' }}>
        <IconSlot size="200" color="var(--color-text-primary)">
          <GraduationCapGlyph />
        </IconSlot>
        <span
          style={{
            fontFamily: 'var(--font-family-default)',
            fontWeight: 'var(--font-weight-regular)',
            fontSize: 'var(--font-size-xs)',
            lineHeight: 'var(--font-line-height-xs)',
            letterSpacing: 'var(--font-tracking-loose)',
            color: 'var(--color-text-secondary)',
          }}
        >
          {provenance}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-150)' }}>
        <span
          style={{
            fontFamily: 'var(--font-family-default)',
            fontWeight: 'var(--font-weight-semibold)',
            fontSize: 'var(--font-size-xs)',
            lineHeight: 'var(--font-line-height-xs)',
            letterSpacing: 'var(--font-tracking-loose)',
            color: 'var(--color-text-secondary)',
          }}
        >
          {instruction}
        </span>
        <Term
          style={{
            fontFamily: 'var(--font-family-default)',
            fontWeight: 'var(--font-weight-bold)',
            fontSize: 'var(--font-size-2xl)',
            lineHeight: 'var(--font-line-height-xl)',
            letterSpacing: 'var(--font-tracking-tight)',
            color: 'var(--color-text-primary)',
            margin: 0,
          }}
        >
          {term}
        </Term>
      </div>

      {/* Always rendered, even with nothing inside — Figma's own note:
          "the base component measures 16px taller than a real hand-built
          card with no third block, because the slot node is still present
          as a child even empty. Not a defect." The gap above (space-400)
          applies to this element whether or not children is provided,
          reproducing that cost rather than optimizing it away. */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>{children}</div>
    </div>
  );
}
