import type { Preview } from '@storybook/nextjs-vite'
// The generated design tokens (colors, spacing, radii, type) as CSS
// variables — see style-dictionary.config.mjs. This makes every
// --color-*, --space-*, etc. variable available to every story.
import '../build/css/tokens.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    },

    // This product is dark mode only — one colour, no light/dark
    // toggle this sprint (docs/sprint-context.md). So there's exactly
    // one background option, not a light/dark picker. The value is
    // color.navy.950 / background.page from tokens/tokens.json — the
    // same dark canvas every real screen sits on.
    backgrounds: {
      options: {
        dark: { name: 'Dark', value: '#090c18' },
      },
    },

    // docs/design-system.md: "Every screen starts as a scaffold
    // instance at size=iPhone 13" — 390 x 844, this sprint's one
    // screen width. Declared explicitly (rather than relying on
    // Storybook's built-in "iPhone 13" preset) because another addon
    // in this project already replaces the default viewport list with
    // its own, smaller set. Documentation (autodocs) pages aren't
    // affected by this setting and keep rendering at full width.
    viewport: {
      options: {
        mobile390: {
          name: '390px (iPhone 13)',
          styles: { width: '390px', height: '844px' },
          type: 'mobile',
        },
      },
    },
  },

  // The toolbar selections Storybook starts with.
  initialGlobals: {
    backgrounds: { value: 'dark' },
    viewport: { value: 'mobile390' },
  },
};

export default preview;