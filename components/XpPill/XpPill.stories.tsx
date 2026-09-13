import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { XpPill } from './XpPill';

// xpPill's own Figma description field is literally null — this is
// docs/design-system.md's own account instead, quoted directly.
const DESIGN_SYSTEM_ACCOUNT = `
No Figma description exists for this component set — every prop and default below was confirmed directly against its own componentPropertyDefinitions and both real variants, not from written prose.

**States and options.** Two variants on one axis, size: S / M.

**Other properties.** label TEXT.

**What each state means.** S is the in-card pill beside a verdict. M is the summary-head pill, with larger padding and a bigger type size. Note: both real instances actually use font/weight/semibold, not the Bold docs/design-system.md's own prose specified (it describes S as "Caption M Bold" and M as "Headline XXS Bold") -- built to match the real instances, same category of discrepancy already found on ChipMarker's Label.

**When to reach for it.** Only where points were awarded.

**Don't.** Don't use it for the zero cases. Flagged and skipped terms currently say "No points" as plain text, and a brand-tinted pill there would read as an award. There's no "no points" pill yet -- an open decision, not built.
`.trim();

const meta = {
  title: 'Components/XpPill',
  component: XpPill,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: DESIGN_SYSTEM_ACCOUNT,
      },
    },
  },
  argTypes: {
    size: {
      control: 'radio',
      options: ['S', 'M'],
    },
  },
} satisfies Meta<typeof XpPill>;

export default meta;
type Story = StoryObj<typeof meta>;

// One story per size, matching Figma's own variant names.

export const S: Story = {
  args: { size: 'S', label: '+15 XP' },
};

export const M: Story = {
  args: { size: 'M', label: '+28 XP' },
};
