import type { HTMLAttributes, ReactNode } from 'react';

import { Spinner } from '../shared/Spinner';

/**
 * Read from the Figma component set "Chat Input" (node 3249:84007, file
 * u3BZUg8k5p3mrOrKAnYO5c, page "🎨  Mascot & components"). Not reachable
 * by name search on either component page — resolved from a real "Chat
 * Input" INSTANCE's mainComponent, the same technique used for MascotSlot
 * and BottomSheet, since this component's own set isn't a direct page
 * child either. Not covered by docs/design-system.md at all (that file
 * only documents the 15 "New components" built 11 September). Carries no
 * Figma description, but does carry a real designer annotation, quoted
 * verbatim in the story docs: "Need a variant for image attachments in
 * the input field (upto 3)" — a named, real gap, not invented here.
 *
 * `status` (Typing/Inactive/Ready to send/Recording/Loading/Long input,
 * default Inactive) is the one real VARIANT property. No slot exists
 * anywhere in this component — every icon position is a real, fixed,
 * non-swappable nested instance that changes per status (not a SLOT
 * node), so — matching VerdictBadge's and RecordControl's precedent for
 * genuinely non-swappable per-state glyphs — the leading/trailing icons
 * are baked into this component per status rather than exposed as props.
 * `value` is this component's own generalization of the real Placeholder
 * text node, since every status but Recording shows one.
 *
 * Confirmed directly against all six real variants:
 * - Leading is always the same 56x56 "OLD Icon Button" (Neutral/M):
 *   a plus glyph on every status except Recording, which swaps to
 *   x-close (cancel the recording).
 * - Inactive/Typing/Loading show a bare, buttonless mic (Inactive/
 *   Typing) — Typing additionally overlays a 1px text-cursor bar next
 *   to the placeholder — or, for Loading, a spinner glyph in that same
 *   bare position (the real glyph there is a different icon key than
 *   mic's; reproduced here as a spinner to match "Loading" honestly
 *   rather than guess the exact glyph).
 * - Ready to send/Recording/Long input instead wrap the trailing icon
 *   in a real 40x40 "OLD Icon Button" (Primary/S) holding a send glyph.
 * - Ready to send and Long input show real typed content in text/primary
 *   (not the text/disabled placeholder); Long input also switches the
 *   input container's radius from a full pill to Radius/600, since a
 *   pill shape doesn't read as a text box once it grows tall.
 * - Recording replaces the text content with a real amplitude
 *   visualization (a 33-rectangle "Audio Input" group) — every rectangle
 *   in the fetched data reported degenerate 1x1 geometry (a data
 *   artifact, not the real design), so the bars below are a stylized
 *   approximation using the real color tokens found
 *   (interactive/secondary, interactive/secondary/on, background/
 *   inverse), not a bar-for-bar reproduction.
 *
 * **A real oddity, found and not silently resolved:** the trailing send
 * glyph's own fill resolves to a Figma variable literally named
 * "interactive/secondary" — a name that doesn't match any real token in
 * tokens/tokens.json (which only has interactive/secondary/default,
 * /hover, /active, /on). Using it literally would render a near-invisible
 * icon on the button's own light background/inverse fill. Reproduced
 * instead with interactive/primary/on, the real token this codebase
 * already uses for icon/label color on a light, Primary-style fill —
 * worth a real decision from whoever owns this component about what that
 * broken binding was supposed to point to.
 *
 * "OLD Icon Button" is itself a separate, legacy nested component (not
 * ButtonIcon — different shape: Radius/800, a squircle rather than a full
 * circle) that predates this codebase's own ButtonIcon build. Not
 * rebuilt as its own component here; represented locally as a private,
 * un-exported helper.
 *
 * Width is unbound in Figma (361px on every instance, no governing token)
 * — same missing-literal situation as field/composer/sessionHero/
 * knowieMessage/bottomSheet, so this component fills its container's
 * width by default instead of reproducing the literal.
 *
 * **Two real accessibility gaps, found and fixed, not just flagged:**
 * (1) every leading/trailing icon button had no accessible name at all —
 * "OLD Icon Button" is a bare icon wrapper with no built-in label, and
 * nothing here supplied one either. Now labeled contextually ("Add" /
 * "Cancel recording" for leading, "Send" for trailing) via the
 * `LegacyIconButton` helper's own required `ariaLabel`. (2) the
 * placeholder text (Inactive/Typing/Loading) used text/disabled, which
 * measures 3.77:1 against background/page — under the 4.5:1 AA minimum,
 * and a real failure since placeholder text in an enabled, typeable field
 * doesn't get WCAG's disabled-component exemption; sighted low-vision
 * users still need to read it. Switched to text/secondary, the same
 * token Field already uses correctly for its own equivalent empty/
 * placeholder state.
 */
export type ChatInputStatus = 'Inactive' | 'Typing' | 'Ready to send' | 'Recording' | 'Loading' | 'Long input';

export interface ChatInputProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  status?: ChatInputStatus;
  value?: string;
  onLeadingClick?: () => void;
  onTrailingClick?: () => void;
}

const DEFAULT_VALUE: Record<ChatInputStatus, string> = {
  Inactive: 'Ask anything...',
  Typing: 'Ask anything...',
  Loading: 'Ask anything...',
  'Ready to send': 'Something truly smart',
  'Long input':
    'Something truly smart & often surprisingly long and winding and never ending so crazy long these texts sometimes become. Likely students copy-pasting stuff...',
  Recording: '',
};

const HAS_SEND_BUTTON: Record<ChatInputStatus, boolean> = {
  Inactive: false,
  Typing: false,
  Loading: false,
  'Ready to send': true,
  Recording: true,
  'Long input': true,
};

const IS_PLACEHOLDER: Record<ChatInputStatus, boolean> = {
  Inactive: true,
  Typing: true,
  Loading: true,
  'Ready to send': false,
  Recording: false,
  'Long input': false,
};

function PlusGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" aria-hidden="true">
      <path d="M12 4v16M4 12h16" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}

function CloseGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}

function MicGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" aria-hidden="true">
      <rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor" />
      <path d="M6 11a6 6 0 0012 0M12 19v2" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}

function SendGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Stylized approximation of the real "Audio Input" 33-bar amplitude
// visualization — see the file-level comment for why the exact bar
// geometry wasn't reliably retrievable.
const AMPLITUDE_HEIGHTS = [4, 8, 14, 20, 14, 8, 4, 10, 18, 22, 16, 8, 4, 10, 20, 24, 18, 10, 4, 8];

function LegacyIconButton({
  size,
  variant,
  onClick,
  ariaLabel,
  children,
}: {
  size: 40 | 56;
  variant: 'Neutral' | 'Primary';
  onClick?: () => void;
  ariaLabel: string;
  children: ReactNode;
}) {
  const isPrimary = variant === 'Primary';
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      style={{
        flexShrink: 0,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: 'var(--radius-800)',
        background: isPrimary ? 'var(--color-background-inverse)' : 'var(--color-interactive-secondary-default)',
        border: isPrimary ? 'none' : 'var(--stroke-border) solid var(--color-border-default)',
        color: isPrimary ? 'var(--color-interactive-primary-on)' : 'var(--color-background-inverse)',
        cursor: 'pointer',
        padding: 0,
      }}
    >
      <span style={{ width: size === 56 ? '24px' : '16px', height: size === 56 ? '24px' : '16px' }}>{children}</span>
    </button>
  );
}

export function ChatInput({ status = 'Inactive', value, onLeadingClick, onTrailingClick, style, ...rest }: ChatInputProps) {
  const isLongInput = status === 'Long input';
  const isRecording = status === 'Recording';
  const text = value ?? DEFAULT_VALUE[status];

  return (
    <div
      data-status={status}
      style={{
        display: 'flex',
        alignItems: isLongInput ? 'flex-end' : 'center',
        width: '100%',
        boxSizing: 'border-box',
        gap: 'var(--space-150)',
        padding: 'var(--space-200)',
        ...style,
      }}
      {...rest}
    >
      <LegacyIconButton size={56} variant="Neutral" onClick={onLeadingClick} ariaLabel={isRecording ? 'Cancel recording' : 'Add'}>
        {isRecording ? <CloseGlyph /> : <PlusGlyph />}
      </LegacyIconButton>

      <div
        style={{
          flex: '1 1 auto',
          minWidth: 0,
          display: 'flex',
          alignItems: isLongInput ? 'flex-end' : 'center',
          gap: 'var(--space-200)',
          boxSizing: 'border-box',
          paddingLeft: 'var(--space-400)',
          paddingRight: HAS_SEND_BUTTON[status] ? 'var(--space-200)' : 'var(--space-400)',
          paddingTop: 'var(--space-150)',
          paddingBottom: 'var(--space-150)',
          borderRadius: isLongInput ? 'var(--radius-600)' : 'var(--radius-full)',
          border: 'var(--stroke-border) solid var(--color-border-default)',
        }}
      >
        {isRecording ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flex: '1 1 auto', height: '24px' }} aria-hidden="true">
            {AMPLITUDE_HEIGHTS.map((height, index) => (
              <div
                key={index}
                style={{
                  width: '3px',
                  height: `${height}px`,
                  borderRadius: 'var(--radius-full)',
                  background: index % 3 === 0 ? 'var(--color-interactive-secondary-on)' : 'var(--color-background-inverse)',
                }}
              />
            ))}
          </div>
        ) : (
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
              color: IS_PLACEHOLDER[status] ? 'var(--color-text-secondary)' : 'var(--color-text-primary)',
              whiteSpace: isLongInput ? 'pre-wrap' : 'nowrap',
              overflow: 'hidden',
              textOverflow: isLongInput ? 'clip' : 'ellipsis',
            }}
          >
            {text}
          </p>
        )}

        {status === 'Typing' ? (
          <span aria-hidden="true" style={{ width: '1px', height: '17px', background: 'var(--color-background-inverse)', flexShrink: 0 }} />
        ) : null}

        {status === 'Loading' ? <Spinner size="24px" color="var(--color-background-inverse)" /> : null}

        {!isRecording && !HAS_SEND_BUTTON[status] && status !== 'Loading' ? (
          <span style={{ width: '24px', height: '24px', flexShrink: 0, color: 'var(--color-background-inverse)' }} aria-hidden="true">
            <MicGlyph />
          </span>
        ) : null}

        {HAS_SEND_BUTTON[status] ? (
          <LegacyIconButton size={40} variant="Primary" onClick={onTrailingClick} ariaLabel="Send">
            <SendGlyph />
          </LegacyIconButton>
        ) : null}
      </div>
    </div>
  );
}
