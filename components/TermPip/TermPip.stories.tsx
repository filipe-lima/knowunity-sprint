import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { TermPip } from './TermPip';

// Verbatim from the Figma component set "termPip" (node 13734:32295, file
// u3BZUg8k5p3mrOrKAnYO5c, page "New components") — its own description
// field, unedited.
const FIGMA_DESCRIPTION = `
**What it is.** One segment of session progress, meant to be dropped N-at-a-time into a plain HORIZONTAL auto-layout row (Space/150 gap, children set to FILL) — see the "Term Pips" reference row alongside it. Width is deliberately unbound: it stretches to fill whatever row it sits in, so the 24px width on this master component is just a resting default, not a token.

**When to reach for it (docs/design-system.md).** Any n-of-m progress in this feature, where progressIndicator cannot go because it steps in quarters.

**Don't (docs/design-system.md).** Don't use it for a percentage. progressIndicator owns continuous progress; this owns countable steps. If both end up representing the same thing, the student sees two progress languages in one product.

**Also from docs/design-system.md, not resolved here:** there's an open, unresolved question about the magenta Done uses — it's also the colour behind recordControl's amplitude bars, while progressIndicator uses accent/brand/bold for essentially the same "progress" idea. And: no Skipped or Flagged state exists yet, so a skipped or flagged term currently reads as Done on the pip row — a named gap, not a decision.
`.trim();

const meta = {
  title: 'Components/TermPip',
  component: TermPip,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: FIGMA_DESCRIPTION,
      },
    },
  },
  argTypes: {
    state: {
      control: 'radio',
      options: ['Done', 'Current', 'Upcoming'],
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 200 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TermPip>;

export default meta;
type Story = StoryObj<typeof meta>;

// One story per state, matching Figma's variant names. Each is wrapped at
// a fixed width above since a single pip's own width is deliberately
// unbound (it fills whatever row it's in) — with nothing to fill, it
// would otherwise collapse to nothing.

export const Done: Story = {
  args: { state: 'Done' },
};

export const Current: Story = {
  args: { state: 'Current' },
};

export const Upcoming: Story = {
  args: { state: 'Upcoming' },
};

// The real usage pattern — five pips in a row, reproducing the "Term
// Pips" reference row exactly as documented: a plain HORIZONTAL flex row,
// Space/150 gap, each pip set to fill. Not a new component (see the
// comment in TermPip.tsx for why one deliberately doesn't exist here).
export const SessionProgressRow: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--space-150)', width: 320 }}>
      <TermPip state="Done" />
      <TermPip state="Done" />
      <TermPip state="Current" />
      <TermPip state="Upcoming" />
      <TermPip state="Upcoming" />
    </div>
  ),
};
