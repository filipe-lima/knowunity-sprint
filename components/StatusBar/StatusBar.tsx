import { SignalHigh, Wifi, BatteryFull } from 'lucide-react';

/**
 * Read from the real Figma component set "Status Bar" (node `3085:7279`,
 * `Mode=Night` variant, node `3085:7297`) — pulled directly, not guessed:
 * 375×48, a "09:41" time label on the left, and on the right a cellular-
 * signal glyph, a Wi-Fi glyph, and a battery glyph.
 *
 * Baked directly into `components/Scaffold/Scaffold.tsx`'s Panel Header,
 * not exposed as its own slot or prop — design-system.md's own account of
 * Panel Header: "fixed, not a slot... holds the status bar only." Every
 * screen gets the identical bar, unconditionally, matching that rule.
 *
 * Earlier this session, Panel Header was deliberately left empty —
 * reasoning at the time was that a real mobile browser already renders
 * its own OS chrome above the page. Reversed: this project is reviewed as
 * phone-shaped screenshots inside a desktop browser, not run on an actual
 * phone, so nothing shows a status bar unless this component draws one.
 *
 * The three real glyphs (signal/wifi/battery) are real icons from
 * `lucide-react` (installed this pass to close a standing "no icon
 * library" gap across the whole project) — close visual matches for the
 * real Figma vectors, not the exact traced paths.
 */
export function StatusBar() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
        padding: '0 var(--space-400)',
        color: 'var(--color-text-primary)',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-family-default)',
          fontWeight: 'var(--font-weight-semibold)',
          fontSize: 'var(--font-size-sm)',
          letterSpacing: 'var(--font-tracking-loose)',
        }}
      >
        9:41
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-100)' }}>
        <SignalHigh size={16} strokeWidth={2} aria-hidden="true" />
        <Wifi size={16} strokeWidth={2} aria-hidden="true" />
        <BatteryFull size={22} strokeWidth={1.5} aria-hidden="true" />
      </div>
    </div>
  );
}
