import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Chips } from './Chips';

// docs/design-system.md doesn't carry a dedicated write-up for this
// component beyond one line and one "Never do this" rule — both quoted
// verbatim; the rest of this component's shape came from its own real
// Figma componentPropertyDefinitions and variants, not prose.
const DESIGN_SYSTEM_ACCOUNT = `
**When to reach for it.** Chips for filters, selectable options and small counters. Not for actions: a chip that performs something rather than selecting something is a button.

**Don't.** Never use colour alone to carry meaning — an inactive pro chip and an inactive Primary chip are already visually identical at rest, so active state needs more than a colour shift to read (this component leans on the same rule ChipMarker and VerdictBadge already follow).

Four real sizes (XXS/XS/S/M), two real colours (Primary/pro), and a real active/inactive axis — inactive chips fill identically regardless of colour; only active chips diverge (Primary vs. pro get different fills). Confirmed against all 16 real variants directly.
`.trim();

const meta = {
  title: 'Components/Chips',
  component: Chips,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: DESIGN_SYSTEM_ACCOUNT,
      },
    },
  },
} satisfies Meta<typeof Chips>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Active: Story = {
  args: {
    active: true,
    text: 'Selected',
  },
};

export const Pro: Story = {
  args: {
    color: 'pro',
    active: true,
    text: 'Pro',
  },
};

// The one real usage found in the file: Recall history's section-count
// badges (size XS, color Primary, both icons off) — "Due again" renders
// active, "Said recently" / "Never said out loud" render inactive.
export const CountBadgeDue: Story = {
  args: {
    size: 'XS',
    active: true,
    text: '6',
    showLeftIcon: false,
    showRightIcon: false,
  },
};

export const CountBadgeSaid: Story = {
  args: {
    size: 'XS',
    active: false,
    text: '22',
    showLeftIcon: false,
    showRightIcon: false,
  },
};
