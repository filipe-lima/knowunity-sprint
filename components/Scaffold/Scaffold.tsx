import type { HTMLAttributes, ReactNode } from 'react';

/**
 * Read from the Figma component "scaffold" (file u3BZUg8k5p3mrOrKAnYO5c).
 * docs/design-system.md documents it in prose (its main component set
 * isn't on any page in the file — it survives only because instances point
 * at it, same warning the doc gives for hunting it in the assets panel),
 * but every layout value below was pulled from a real instance instead of
 * trusted from prose alone: walked `Hub C — The queue` (node 13752:39342,
 * page "Final flow"), a real scaffold instance, via the plugin API,
 * resolving every padding/gap/radius/fill back to its bound Figma
 * variable. Confirmed real: `background/page` (root fill), `Radius/600`
 * (root corner radius, all four corners), `Space/400` (middleContent's
 * horizontal padding and bottomContent's padding on all sides),
 * `Space/200` (middleContent's vertical padding), `Space/300`
 * (middleContent's own item spacing), `Space/100` (bottomContent's and
 * topNavigation's item spacing), `background/stacking` (Panel Header's
 * fill), and `background/scrim` (the sheet backdrop). All map directly to
 * this file's own tokens/tokens.json under the same names.
 *
 * Two real values have no exact token match, flagged rather than invented
 * as new ones (design-system.md rule 12: never add a token to make one
 * component work): Panel Header's real bottom divider is Figma's
 * `Core/Grayscale/Dividers` at 15% white in dark mode, which this file's
 * closest real token (`border.default`, 10.2% white) doesn't hit exactly
 * — used anyway since it's already the semantic wrapper for "the default
 * for dividers." And Panel Header's own height (48) has no governing
 * token; reproduced as a literal.
 *
 * Panel Header is deliberately built empty. design-system.md: "Holds the
 * status bar only. Never put content here." The real instance's own child
 * is a `Status Bar` component that doesn't exist in this codebase and
 * isn't worth building — it's OS chrome (clock, signal, battery), and a
 * real mobile browser already provides that above the page. This
 * component only reserves the height and paints the fill/divider a real
 * screen would sit under.
 *
 * `bottomSheetOnly` and its scrim are real `ABSOLUTE`-positioned layers in
 * Figma (confirmed via `layoutPositioning`), not part of the normal
 * vertical flow — reproduced here the same way, pinned to the bottom edge
 * and overlaid above `bottomContent`. Figma's own scrim rectangle
 * oversizes past the frame edges (a canvas-bleed trick so it still covers
 * the rounded corners); this uses a plain `inset: 0` instead, which covers
 * the same area without needing the same hack.
 *
 * `size` is a real variant axis in Figma (this file's scaffold has more
 * than one screen size), but this sprint is mobile-only, 390×844
 * (iPhone 13) — the only size in scope, so it isn't exposed as a prop.
 *
 * Slot content is intentionally untyped (`ReactNode`): this component
 * only owns structure, fills, and spacing — never assume what a screen
 * puts in a slot.
 */
export interface ScaffoldProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  topNavigation?: ReactNode;
  showTopNavSlot?: boolean;
  middleContent: ReactNode;
  bottomContent?: ReactNode;
  showBottomNavSlot?: boolean;
  bottomSheetOnly?: ReactNode;
  showBottomSheetBackground?: boolean;
}

export function Scaffold({
  topNavigation,
  showTopNavSlot = true,
  middleContent,
  bottomContent,
  showBottomNavSlot = true,
  bottomSheetOnly,
  showBottomSheetBackground = false,
  style,
  ...rest
}: ScaffoldProps) {
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        width: '390px',
        height: '844px',
        overflow: 'hidden',
        borderRadius: 'var(--radius-600)',
        background: 'var(--color-background-page)',
        ...style,
      }}
      {...rest}
    >
      {/* Panel Header — fixed, not a slot. Status bar region only. */}
      <div
        aria-hidden="true"
        style={{
          flexShrink: 0,
          width: '100%',
          height: '48px',
          background: 'var(--color-background-stacking)',
          borderBottom: '1px solid var(--color-border-default)',
        }}
      />

      {showTopNavSlot && topNavigation ? (
        <div
          style={{
            flexShrink: 0,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-100)',
          }}
        >
          {topNavigation}
        </div>
      ) : null}

      <div
        style={{
          flex: '1 1 auto',
          minHeight: 0,
          overflowY: 'auto',
          boxSizing: 'border-box',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-300)',
          paddingLeft: 'var(--space-400)',
          paddingRight: 'var(--space-400)',
          paddingTop: 'var(--space-200)',
          paddingBottom: 'var(--space-200)',
        }}
      >
        {middleContent}
      </div>

      {showBottomNavSlot && bottomContent ? (
        <div
          style={{
            flexShrink: 0,
            boxSizing: 'border-box',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-100)',
            padding: 'var(--space-400)',
          }}
        >
          {bottomContent}
        </div>
      ) : null}

      {showBottomSheetBackground ? (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'var(--color-background-scrim)',
          }}
        />
      ) : null}

      {bottomSheetOnly ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-100)',
          }}
        >
          {bottomSheetOnly}
        </div>
      ) : null}
    </div>
  );
}
