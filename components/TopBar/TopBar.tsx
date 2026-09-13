import type { HTMLAttributes, ReactNode } from 'react';

/**
 * Read from the Figma component set "topBar" (node 13734:32344, file
 * u3BZUg8k5p3mrOrKAnYO5c, page "New components", inside the "Top bar"
 * wrapper frame). Confirmed against all three real variants directly
 * (not just the written description): Loop is Leading + a filling
 * Progress slot + Trailing; Title is Leading + a filling title/subtitle
 * column + a fixed 48px Spacer (no Trailing at all); Centered is the
 * title/subtitle column alone, centered, with neither Leading nor
 * Trailing. docs/design-system.md's own summary lists "three slots:
 * Leading, Progress (Loop only), Trailing" as if Leading/Trailing were
 * shared across every variant — the real component doesn't do that:
 * Trailing turns out to be Loop-only too. Built to match the real file.
 *
 * title/subtitle/showSubtitle are genuinely absent from Loop, not just
 * hidden — design-system.md: "no real loop top bar instance, ever, shows
 * a title, so they were deliberately scoped off that variant rather than
 * left present but unused." Reproduced here as a discriminated union so
 * passing a title to a Loop bar is a type error, not a silently ignored
 * prop.
 *
 * Genuine reuse: the real Leading/Trailing content in Figma's own
 * instances is a real buttonIcon (Tertiary/M), and Progress is five real
 * termPip instances — both already exist in this codebase
 * (components/ButtonIcon, components/TermPip) and are used directly in
 * the stories, not placeholders.
 *
 * Width is a hardcoded, unbound 390 on all three variants — Figma's own
 * description: "no mobile screen-width variable exists in the file;
 * confirmed with Filipe, hardcoded deliberately." Reproduced as a literal
 * for the same reason, not invented as a new token.
 */
type TopBarCommonProps = Omit<HTMLAttributes<HTMLDivElement>, 'title'>;

export interface TopBarLoopProps extends TopBarCommonProps {
  variant: 'Loop';
  leading?: ReactNode;
  progress?: ReactNode;
  trailing?: ReactNode;
}

export interface TopBarTitleProps extends TopBarCommonProps {
  variant: 'Title';
  title: string;
  subtitle?: string;
  showSubtitle?: boolean;
  leading?: ReactNode;
}

export interface TopBarCenteredProps extends TopBarCommonProps {
  variant: 'Centered';
  title: string;
  subtitle?: string;
  showSubtitle?: boolean;
}

export type TopBarProps = TopBarLoopProps | TopBarTitleProps | TopBarCenteredProps;

const BAR_BASE = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--space-300)',
  width: '390px',
  paddingLeft: 'var(--space-400)',
  paddingRight: 'var(--space-400)',
  paddingTop: 'var(--space-300)',
  paddingBottom: 'var(--space-300)',
  boxSizing: 'border-box' as const,
};

const TITLE_FONT = {
  fontFamily: 'var(--font-family-default)',
  fontWeight: 'var(--font-weight-semibold)',
  fontSize: 'var(--font-size-sm)',
  lineHeight: 'var(--font-line-height-xs)',
  letterSpacing: 'var(--font-tracking-loose)',
  color: 'var(--color-text-primary)',
  margin: 0,
};

// Not fetched directly (real instances all have showSubtitle=false, so no
// visible Subtitle to read styling off) — matches the caption-m-regular
// pattern used consistently for every other subtitle/secondary line built
// so far (TextBlock, ListRow, RecallCard's provenance).
const SUBTITLE_FONT = {
  fontFamily: 'var(--font-family-default)',
  fontWeight: 'var(--font-weight-regular)',
  fontSize: 'var(--font-size-xs)',
  lineHeight: 'var(--font-line-height-xs)',
  letterSpacing: 'var(--font-tracking-loose)',
  color: 'var(--color-text-secondary)',
  margin: 0,
};

function TitleColumn({
  title,
  subtitle,
  showSubtitle,
  fill,
}: {
  title: string;
  subtitle?: string;
  showSubtitle?: boolean;
  fill: boolean;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: fill ? '1 1 auto' : '0 0 auto', minWidth: 0 }}>
      <p style={TITLE_FONT}>{title}</p>
      {showSubtitle && subtitle ? <p style={SUBTITLE_FONT}>{subtitle}</p> : null}
    </div>
  );
}

export function TopBar(props: TopBarProps) {
  if (props.variant === 'Loop') {
    const { variant, leading, progress, trailing, style, ...rest } = props;
    return (
      <div data-variant={variant} style={{ ...BAR_BASE, justifyContent: 'space-between', ...style }} {...rest}>
        <div style={{ display: 'flex', width: 'var(--control-600)', height: 'var(--control-600)', flexShrink: 0 }}>
          {leading}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-150)', flex: 1 }}>{progress}</div>
        <div style={{ display: 'flex', width: 'var(--control-600)', height: 'var(--control-600)', flexShrink: 0 }}>
          {trailing}
        </div>
      </div>
    );
  }

  if (props.variant === 'Title') {
    const { variant, title, subtitle, showSubtitle = false, leading, style, ...rest } = props;
    return (
      <div data-variant={variant} style={{ ...BAR_BASE, ...style }} {...rest}>
        <div style={{ display: 'flex', width: 'var(--control-600)', height: 'var(--control-600)', flexShrink: 0 }}>
          {leading}
        </div>
        <TitleColumn title={title} subtitle={subtitle} showSubtitle={showSubtitle} fill />
        {/* The 48px spacer that keeps the title optically centered against
            the Leading slot's own 48px width — a real structural element
            in Figma, not a Trailing slot in disguise. */}
        <div style={{ width: 'var(--control-600)', flexShrink: 0 }} aria-hidden="true" />
      </div>
    );
  }

  const { variant, title, subtitle, showSubtitle = false, style, ...rest } = props;
  return (
    <div data-variant={variant} style={{ ...BAR_BASE, height: '40px', justifyContent: 'center', ...style }} {...rest}>
      <TitleColumn title={title} subtitle={subtitle} showSubtitle={showSubtitle} fill={false} />
    </div>
  );
}
