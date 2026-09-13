import type { CSSProperties } from 'react';

// Shared by every foundations page. The Storybook canvas background is
// already set dark by .storybook/preview.tsx's `backgrounds` parameter, but
// that only paints the iframe itself — it does nothing about the color of
// text these components render, which would otherwise default to plain
// black-on-dark and be unreadable. background/page and text/primary here are
// the same real tokens everything else on the page uses.
export const pageStyle: CSSProperties = {
  background: 'var(--color-background-page)',
  color: 'var(--color-text-primary)',
  padding: 24,
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  fontSize: 13,
  lineHeight: 1.4,
  minHeight: '100%',
  boxSizing: 'border-box',
};

export const sectionHeadingStyle: CSSProperties = {
  fontSize: 16,
  fontWeight: 600,
  marginBottom: 12,
  color: 'var(--color-text-primary)',
};

export const captionStyle: CSSProperties = {
  fontFamily:
    'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
  fontSize: 11,
  color: 'var(--color-text-secondary)',
};

export const descriptionStyle: CSSProperties = {
  fontSize: 11,
  color: 'var(--color-text-tertiary)',
  marginTop: 4,
};
