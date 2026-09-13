import './Spinner.css';

/**
 * The Loading-state indicator shared by Button and ButtonIcon — both
 * Figma component sets swap their icon/label content for a spinning glyph
 * in the Loading state, keeping the resting fill underneath it.
 *
 * No motion token exists in tokens/tokens.json for animation timing — the
 * 0.7s linear duration below is a plain hand-picked value, not sourced
 * from a token. Flagged rather than hidden: add a real token if this needs
 * to be design-system-governed.
 */
export function Spinner({ size, color }: { size: string; color: string }) {
  return (
    <span
      aria-hidden="true"
      style={{
        display: 'inline-flex',
        width: size,
        height: size,
        flexShrink: 0,
        borderRadius: 'var(--radius-full)',
        border: 'var(--stroke-heavy-border) solid transparent',
        borderTopColor: color,
        animation: 'ks-spinner-spin 0.7s linear infinite',
      }}
    />
  );
}
