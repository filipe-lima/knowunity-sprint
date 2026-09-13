import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { ChipMarker } from './ChipMarker';

// chipMarker's own Figma description field is literally null — this is
// docs/design-system.md's own account instead, quoted directly.
const DESIGN_SYSTEM_ACCOUNT = `
No Figma description exists for this component set — every prop and default below was confirmed directly against its own componentPropertyDefinitions and both real variants, not from written prose.

**States and options.** Two variants on one axis, variant: Dot / Label.

**Other properties.** label TEXT, defaulting to "NEW". The absence of the marker (a chip with no marker at all) is handled by simply not placing an instance, not by a third variant.

**What each state means.** Dot is a bare 8x8 filled circle -- the recurring "ready" signal. Label is a text pill reading "NEW" by default -- meant to appear once, ever, per chip. Note: the one real Label instance in the file uses Greed/Caption S Regular, not the Bold the plan's prose specified -- built to match the real instance, since only one real reference exists this is worth double-checking if Bold was actually intended.

**When to reach for it.** Only on the Recall chip.

**Don't.** Don't show both. Precedence is NEW, then dot, then none, and no component can enforce that, so it is a rule the screen has to keep.
`.trim();

const meta = {
  title: 'Components/ChipMarker',
  component: ChipMarker,
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
    variant: {
      control: 'radio',
      options: ['Dot', 'Label'],
    },
  },
} satisfies Meta<typeof ChipMarker>;

export default meta;
type Story = StoryObj<typeof meta>;

// One story per variant, matching Figma's own variant names.

export const Dot: Story = {
  args: { variant: 'Dot' },
};

export const Label: Story = {
  args: { variant: 'Label', label: 'NEW' },
};
