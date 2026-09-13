// The single source of truth for turning a token's own path (its address
// inside tokens.json, e.g. ["interactive", "primary", "default"]) into the
// name Style Dictionary gives it as a CSS custom property. Shared between
// style-dictionary.config.mjs (which builds build/css/tokens.css) and the
// Storybook foundations stories (which read tokens.json directly to display
// each token's name, value, and description) so the two can never drift
// apart into disagreeing about what a token is called.

// Splits camelCase segments ("fontFamily" -> "font-family") the same way
// the rest of a token's path is already lowercase-with-hyphens.
export function kebab(segment) {
  return String(segment)
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase();
}

// Returns the CSS custom property name for a token, without its leading
// "--" (style-dictionary.config.mjs appends nothing further; callers that
// need a literal `var(--x)` reference add the "--" themselves). A token
// whose $type is "color" gets a "color" segment stitched onto the front,
// unless its path already starts with "color".
export function cssVariableName(path, type) {
  const parts = [...path];
  if (type === 'color' && parts[0] !== 'color') {
    parts.unshift('color');
  }
  return parts.map(kebab).join('-');
}
