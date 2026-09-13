import StyleDictionary from 'style-dictionary';
import { cssVariableName } from './tokens/css-variable-name.mjs';

// A "transform" is a small function Style Dictionary runs on every token
// before it writes it out. This one decides the CSS variable's *name*, using
// the shared cssVariableName helper (also read by the Storybook foundations
// stories) so both always agree on what a token is called. See that file for
// the naming rule itself.
StyleDictionary.registerTransform({
  name: 'name/path-kebab',
  type: 'name',
  transform: (token) => {
    const type = token.$type ?? token.type;
    return cssVariableName(token.path, type);
  },
});

// A "transform group" is just a named bundle of transforms applied together.
// Alongside our naming rule above, this bundle also converts each token's
// *value* into something CSS can actually read:
// - color/css turns a token's color object into a hex or rgba() string.
// - size/px turns a token's { value: 16, unit: "px" } shape into "16px".
// - fontFamily/css wraps a multi-word font name ("Greed Standard-TRIAL") in
//   quotes, which CSS requires once a font name contains a space.
StyleDictionary.registerTransformGroup({
  name: 'knowunity/css',
  transforms: ['name/path-kebab', 'color/css', 'size/px', 'fontFamily/css'],
});

export default {
  // Where to read the design tokens from.
  source: ['tokens/tokens.json'],
  // "Platforms" are the different outputs Style Dictionary can produce from
  // the same source tokens (CSS today; a future platform could add iOS or
  // Android outputs from this same file without touching this one).
  platforms: {
    css: {
      transformGroup: 'knowunity/css',
      buildPath: 'build/css/',
      files: [
        {
          destination: 'tokens.css',
          format: 'css/variables',
          options: {
            // Keep references linked instead of flattened: a semantic
            // variable like --color-background-page becomes
            // "var(--color-navy-950)" rather than a repeated literal hex,
            // mirroring the tokens.json file's own semantic-to-primitive
            // structure and design-system.md's "never read a primitive
            // directly" rule.
            outputReferences: true,
            fileHeader: () => [
              'Generated file — do not edit by hand.',
              'Source: tokens/tokens.json. Regenerate with `npm run tokens`.',
            ],
          },
        },
      ],
    },
  },
};
