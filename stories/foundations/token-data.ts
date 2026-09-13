// Reads tokens/tokens.json directly (the same source style-dictionary.config.mjs
// reads) and shapes it into the plain data the foundations stories render.
// Nothing here invents a color, size, or description — every value either
// comes straight out of the token file, or is the file's own $value.hex /
// $value.value+unit already computed by whoever authored the tokens.
import rawTokens from '../../tokens/tokens.json';
import { cssVariableName } from '../../tokens/css-variable-name.mjs';

const NO_DESCRIPTION = 'No description in tokens.json.';

type TokenNode = {
  $type?: string;
  $value?: unknown;
  $description?: string;
  [key: string]: unknown;
};

const root = rawTokens as unknown as TokenNode;

function isLeafToken(node: unknown): node is TokenNode {
  return (
    typeof node === 'object' &&
    node !== null &&
    '$type' in node &&
    '$value' in node
  );
}

// Typography's fontFamily/fontWeight/fontSize/lineHeight/letterSpacing
// values are DTCG alias strings like "{font.size.6xl}", pointing at another
// token elsewhere in the file. This follows that pointer (repeatedly, in
// case of a chain) until it lands on a literal value.
function resolveAlias(value: unknown): unknown {
  let current = value;
  while (typeof current === 'string' && /^\{.+\}$/.test(current)) {
    const path = current.slice(1, -1).split('.');
    let node: unknown = root;
    for (const segment of path) {
      node = (node as Record<string, unknown>)?.[segment];
    }
    current = isLeafToken(node) ? node.$value : node;
  }
  return current;
}

function formatDimension(value: unknown): string {
  if (
    typeof value === 'object' &&
    value !== null &&
    'value' in value &&
    'unit' in value
  ) {
    const dim = value as { value: number; unit: string };
    return `${dim.value}${dim.unit}`;
  }
  return String(value);
}

export type ColorSwatch = {
  path: string;
  cssVar: string;
  hex: string;
  description: string;
};

export type ColorGroup = {
  key: string;
  label: string;
  swatches: ColorSwatch[];
};

// The semantic color layer — the tokens components actually bind to, per
// design-system.md's "never read a primitive directly" rule.
const SEMANTIC_COLOR_GROUPS = [
  'background',
  'interactive',
  'text',
  'border',
  'accent',
  'feedback',
  'highlight',
  'mascot',
] as const;

// The raw palette those semantic tokens point at. "color" itself is a
// group of named sub-palettes (navy, violet, ...), which the walk below
// splits into their own groups the same way it splits interactive.primary
// from interactive.secondary.
const PRIMITIVE_COLOR_GROUPS = ['color', 'homie', 'black', 'slate'] as const;

function prettifyGroupKey(key: string): string {
  return key
    .split('.')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' — ');
}

function collectColorGroupsFrom(groupKeys: readonly string[]): ColorGroup[] {
  const order: string[] = [];
  const byKey = new Map<string, ColorSwatch[]>();

  function walk(node: unknown, path: string[]) {
    if (isLeafToken(node)) {
      if (node.$type !== 'color') return;
      const groupKey = path.slice(0, -1).join('.') || path.join('.');
      const value = node.$value as { hex: string };
      const swatch: ColorSwatch = {
        path: path.join('.'),
        cssVar: `--${cssVariableName(path, node.$type)}`,
        hex: value.hex,
        description: node.$description ?? NO_DESCRIPTION,
      };
      if (!byKey.has(groupKey)) {
        byKey.set(groupKey, []);
        order.push(groupKey);
      }
      byKey.get(groupKey)!.push(swatch);
      return;
    }
    if (typeof node === 'object' && node !== null) {
      for (const [key, child] of Object.entries(node)) {
        walk(child, [...path, key]);
      }
    }
  }

  for (const groupKey of groupKeys) {
    walk(root[groupKey], [groupKey]);
  }

  return order.map((key) => {
    const swatches = byKey.get(key)!;
    // Step-scale groups (navy 800/900/950, violet 50/200/.../950, ...) read
    // as a scale — sort them ascending by that final numeric step rather
    // than trusting JavaScript's own (inconsistent) object-key order.
    // Named-state groups (interactive.primary's default/hover/active/on)
    // aren't numeric and keep the source file's own order.
    const isNumericScale = swatches.every((s) =>
      /^\d+$/.test(s.path.split('.').pop()!),
    );
    const ordered = isNumericScale
      ? [...swatches].sort(
          (a, b) => Number(a.path.split('.').pop()) - Number(b.path.split('.').pop()),
        )
      : swatches;
    return { key, label: prettifyGroupKey(key), swatches: ordered };
  });
}

export function collectSemanticColorGroups(): ColorGroup[] {
  return collectColorGroupsFrom(SEMANTIC_COLOR_GROUPS);
}

export function collectPrimitiveColorGroups(): ColorGroup[] {
  return collectColorGroupsFrom(PRIMITIVE_COLOR_GROUPS);
}

export type TypeStyle = {
  name: string;
  description: string;
  fontFamilyVar: string;
  fontWeightVar: string;
  fontSizeVar: string;
  lineHeightVar: string;
  letterSpacingVar: string;
  fontFamilyValue: string;
  fontWeightValue: string;
  fontSizePx: string;
  lineHeightPx: string;
  letterSpacingPx: string;
};

// tokens.json lists typography styles largest-first (display-l down to
// caption-s-regular) — that source order *is* scale order, so this just
// preserves it rather than re-sorting.
export function collectTypeStyles(): TypeStyle[] {
  const typographyNode = root.typography as Record<string, TokenNode>;
  return Object.entries(typographyNode).map(([name, styleNode]) => {
    const path = ['typography', name];
    const fontFamily = styleNode.fontFamily as TokenNode;
    const fontWeight = styleNode.fontWeight as TokenNode;
    const fontSize = styleNode.fontSize as TokenNode;
    const lineHeight = styleNode.lineHeight as TokenNode;
    const letterSpacing = styleNode.letterSpacing as TokenNode;

    return {
      name,
      description: styleNode.$description ?? NO_DESCRIPTION,
      fontFamilyVar: `--${cssVariableName([...path, 'fontFamily'], fontFamily.$type!)}`,
      fontWeightVar: `--${cssVariableName([...path, 'fontWeight'], fontWeight.$type!)}`,
      fontSizeVar: `--${cssVariableName([...path, 'fontSize'], fontSize.$type!)}`,
      lineHeightVar: `--${cssVariableName([...path, 'lineHeight'], lineHeight.$type!)}`,
      letterSpacingVar: `--${cssVariableName([...path, 'letterSpacing'], letterSpacing.$type!)}`,
      fontFamilyValue: String(resolveAlias(fontFamily.$value)),
      fontWeightValue: String(resolveAlias(fontWeight.$value)),
      fontSizePx: formatDimension(resolveAlias(fontSize.$value)),
      lineHeightPx: formatDimension(resolveAlias(lineHeight.$value)),
      letterSpacingPx: formatDimension(resolveAlias(letterSpacing.$value)),
    };
  });
}

export type ScaleStep = {
  name: string;
  cssVar: string;
  description: string;
  px: number;
  display: string;
};

// Shared by Spacing and Radius: both are flat maps of name -> dimension,
// under tokens.json's own group key ("space" or "radius"). Sorted by
// resolved pixel value so the visual scale reads smallest-to-largest
// regardless of how the keys happen to be ordered in the JSON file itself
// (tokens.json's "space" group, for instance, mixes "050" in with plain
// numeric keys, which JavaScript's own key ordering does not sort the way a
// size scale should read).
function collectScale(groupKey: string, { skip }: { skip?: (name: string) => boolean } = {}): ScaleStep[] {
  const groupNode = root[groupKey] as Record<string, TokenNode>;
  const steps: ScaleStep[] = [];
  for (const [name, node] of Object.entries(groupNode)) {
    if (skip?.(name)) continue;
    const value = node.$value as { value: number; unit: string };
    steps.push({
      name,
      cssVar: `--${cssVariableName([groupKey, name], node.$type!)}`,
      description: node.$description ?? NO_DESCRIPTION,
      px: value.value,
      display: formatDimension(value),
    });
  }
  return steps.sort((a, b) => a.px - b.px);
}

export function collectSpacingSteps(): ScaleStep[] {
  // Negative space tokens are offsets, not sizes — there's no sensible bar
  // to draw for a negative width, so they're left out of this visualization.
  return collectScale('space', { skip: (name) => name.startsWith('negative-') });
}

export function collectRadiusSteps(): ScaleStep[] {
  return collectScale('radius');
}
