#!/usr/bin/env node
// Computes real WCAG contrast for every token pairing this codebase is
// actually built on, from the generated build/css/tokens.css — not from
// memory, not from a token's name. Fails the build if any pairing is
// under 4.5:1.
//
// Why these pairings and not a full cross-product: tokens/tokens.json
// already documents, in each token's own description, which background
// it's meant to sit on ("Content colour placed on accent/blue/subtle",
// "Copy placed on background/inverse", etc.). Checking every text token
// against every background would flag pairings that never actually occur
// (e.g. text-inverse on background-page) and bury real failures in noise.
// Add a new pairing below only when a new token is introduced that
// legible content is actually rendered on.

import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../build/css/tokens.css', import.meta.url), 'utf8');

// --- Parse every custom property into a raw value string ---
const raw = new Map();
for (const m of css.matchAll(/--([\w-]+):\s*([^;]+);/g)) {
  raw.set(m[1], m[2].trim());
}

// --- Resolve a token (possibly a var(--x) chain) to {r,g,b,a} in 0-1 ---
function resolve(name, seen = new Set()) {
  if (seen.has(name)) throw new Error(`circular token reference: ${name}`);
  seen.add(name);
  const value = raw.get(name);
  if (!value) throw new Error(`unknown token: --${name}`);

  const varMatch = value.match(/^var\(--([\w-]+)\)$/);
  if (varMatch) return resolve(varMatch[1], seen);

  const hexMatch = value.match(/^#([0-9a-fA-F]{6})$/);
  if (hexMatch) {
    const n = parseInt(hexMatch[1], 16);
    return { r: (n >> 16 & 255) / 255, g: (n >> 8 & 255) / 255, b: (n & 255) / 255, a: 1 };
  }

  const rgbaMatch = value.match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s]+([\d.]+))?\s*\)$/);
  if (rgbaMatch) {
    const [, r, g, b, a] = rgbaMatch;
    return { r: +r / 255, g: +g / 255, b: +b / 255, a: a === undefined ? 1 : +a };
  }

  throw new Error(`can't parse value for --${name}: ${value}`);
}

// --- WCAG relative luminance + contrast ratio ---
function srgbToLinear(c) {
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}
function luminance({ r, g, b }) {
  return 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);
}
function contrast(a, b) {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

// Real backgrounds are always fully opaque in this token set (checked:
// every background-*/*-subtle token below resolves to a solid hex, never
// an alpha value) — so foreground-over-background is the only blend
// this script needs.
function blendOverBackground(fg, bg) {
  if (fg.a === 1) return fg;
  return {
    r: bg.r + fg.a * (fg.r - bg.r),
    g: bg.g + fg.a * (fg.g - bg.g),
    b: bg.b + fg.a * (fg.b - bg.b),
    a: 1,
  };
}

// --- The real pairings this app renders ---
const GENERAL_TEXT = ['color-text-primary', 'color-text-secondary', 'color-text-tertiary', 'color-text-disabled'];
const GENERAL_SURFACES = ['color-background-page', 'color-background-surface'];

const ACCENT_FAMILIES = ['green', 'coral', 'blue', 'magenta', 'brand', 'pro'];
const FEEDBACK_FAMILIES = ['success', 'error', 'warning', 'info'];

const pairs = [];
for (const fg of GENERAL_TEXT) {
  for (const bg of GENERAL_SURFACES) pairs.push([fg, bg]);
}
for (const family of ACCENT_FAMILIES) {
  pairs.push([`color-accent-${family}-on-subtle`, `color-accent-${family}-subtle`]);
}
for (const family of FEEDBACK_FAMILIES) {
  pairs.push([`color-feedback-${family}-on-subtle`, `color-feedback-${family}-subtle`]);
}
pairs.push(['color-text-inverse', 'color-background-inverse']);

// Button.tsx's real Primary variant (resolveButtonColors.ts): label/icon on
// interactive/primary-on sits on the fill directly, both at rest and
// pressed — the single most-used interactive pairing in the app, never
// previously checked by any critic pass or script.
pairs.push(['color-interactive-primary-on', 'color-interactive-primary-default']);
pairs.push(['color-interactive-primary-on', 'color-interactive-primary-active']);

// --- Check every pairing, report, fail on any miss ---
const MIN_CONTRAST = 4.5;
let failed = false;

console.log(`Checking ${pairs.length} real foreground/background pairings against ${MIN_CONTRAST}:1...\n`);

for (const [fgName, bgName] of pairs) {
  const fg = resolve(fgName);
  const bg = resolve(bgName);
  const ratio = contrast(blendOverBackground(fg, bg), bg);
  const ok = ratio >= MIN_CONTRAST;
  if (!ok) failed = true;
  console.log(`${ok ? '✓' : '✗ FAIL'}  --${fgName}  on  --${bgName}   ${ratio.toFixed(2)}:1`);
}

if (failed) {
  console.error(`\nOne or more pairings fall under ${MIN_CONTRAST}:1. Raise the token's alpha/lightness, or introduce a new step — never assume a token clears contrast from its name.`);
  process.exit(1);
}
console.log('\nAll pairings clear the minimum.');
