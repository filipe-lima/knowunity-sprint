import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CheckCircle2, ChevronRight } from 'lucide-react';

import { BucketRow } from './BucketRow';
import { Chips } from '../Chips/Chips';

// Not a real Figma component — Figma's own layer name for this shape,
// across every real screen it appears on, is the un-componentized
// `bucket / NEW` / `row / NEW` frame family (see docs/component-gaps.md).
// This is this codebase's own promotion of that repeated shape into one
// real component, after two eval scorecards flagged it hand-rolled three
// separate times (Summary's ResultRow, Hub's HubRow, Recall history's
// TermRow).
const DESCRIPTION = `
**What it is.** A leading icon, a title/subtitle pair, and a free trailing slot — the shape Summary's result rows, Hub's topic/utility rows, and Recall history's term rows all share.

**When to reach for it.** Any list row that pairs a status icon with two lines of text and an optional trailing element (a score, a badge, a chevron, nothing).

**Don't.** Don't hand-roll this shape again as a fourth local copy — that's the exact mistake this component exists to close out.
`.trim();

const meta = {
  title: 'Components/BucketRow',
  component: BucketRow,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: DESCRIPTION,
      },
    },
  },
} satisfies Meta<typeof BucketRow>;

export default meta;
type Story = StoryObj<typeof meta>;

// Summary's real shape: a trailing XP number, IconSlot 250.
export const WithTrailingScore: Story = {
  name: 'With a trailing score (Summary)',
  args: {
    icon: <CheckCircle2 style={{ width: '100%', height: '100%' }} />,
    iconColor: 'var(--color-feedback-success-bold)',
    title: 'Said it unaided',
    subtitle: '1 term',
    trailing: (
      <span style={{ fontFamily: 'var(--font-family-default)', fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)' }}>
        15
      </span>
    ),
  },
};

// Hub's real shape: IconSlot 300, a tappable row with a trailing badge.
export const Tappable: Story = {
  name: 'Tappable, with a trailing badge (Hub)',
  args: {
    icon: '🧬',
    iconSize: '300',
    title: 'Cell biology',
    subtitle: 'Last practised last week',
    trailing: <Chips size="XS" color="Primary" text="1 of 6" />,
    onActivate: () => {},
  },
};

// Hub's locked-row treatment: dimmed title/subtitle, a disabled-looking
// trailing chevron instead of the default text-secondary one.
export const Inert: Story = {
  name: 'Inert, honestly dimmed (Hub)',
  args: {
    icon: '➕',
    iconSize: '300',
    title: 'Start a new Recall',
    titleColor: 'var(--color-text-secondary)',
    subtitle: 'Upload a set of notes, or document and choose a topic',
    subtitleColor: 'var(--color-text-disabled)',
    trailing: <ChevronRight style={{ width: 'var(--icon-250)', height: 'var(--icon-250)', color: 'var(--color-text-disabled)' }} />,
  },
};

// Recall history's real shape: font-size-xs title (confirmed against
// Figma, not a bug — see BucketRow.tsx's own doc comment), no trailing.
export const CompactNoTrailing: Story = {
  name: 'Compact title, no trailing (Recall history)',
  args: {
    icon: <CheckCircle2 style={{ width: '100%', height: '100%' }} />,
    iconColor: 'var(--color-feedback-success-bold)',
    title: 'Construct validity',
    titleSize: 'xs',
    subtitle: 'Said unaided today',
  },
};
