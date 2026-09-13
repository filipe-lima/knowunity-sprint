import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { ButtonIcon } from './ButtonIcon';

// Verbatim from the Figma component set "buttonIcon" (node 9003:8235, file
// u3BZUg8k5p3mrOrKAnYO5c, page "🎨 Mascot & components") — its own
// description field, unedited.
const FIGMA_DESCRIPTION = `
**What it is.** Icon-only button on the same three axes as button. Square target 48 for S and M, 56 for L, with the glyph delivered through an iconSlot instance. Primary carries a 1px border/default stroke in Default, Pressed and Loading and loses it in Disabled. Secondary and Tertiary have no stroke, which makes a Secondary Default and a Primary Disabled identical.

**When to use it.** As the leading control of a horizontal buttonGroup, where it is built in rather than swapped in, and standalone at M.

**Don't.** Don't use Tertiary L in a row with other L controls. Its wrapper is 48 wide by 56 tall while every other L is 56 x 56, so it sits off-centre.

**GAP:** no Hover, Focus or Destructive state exists.
`.trim();

// A plain placeholder glyph — this codebase has no built iconSlot
// component yet to source a real one from (see ButtonIcon.tsx).
function PlaceholderGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" aria-hidden="true">
      <path
        d="M12 4v16M4 12h16"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </svg>
  );
}

const meta = {
  title: 'Components/ButtonIcon',
  component: ButtonIcon,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: FIGMA_DESCRIPTION,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'radio',
      options: ['Primary', 'Secondary', 'Tertiary'],
    },
    size: {
      control: 'radio',
      options: ['S', 'M', 'L'],
    },
    state: {
      control: 'radio',
      options: ['Default', 'Pressed', 'Disabled', 'Loading'],
    },
  },
  args: {
    size: 'M',
    icon: <PlaceholderGlyph />,
    'aria-label': 'Add',
  },
} satisfies Meta<typeof ButtonIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

// One story per variant x state, matching Button.stories.tsx's convention
// — size is left as a control on every story rather than tripling the
// count again, since it only changes scale, not behavior.

export const PrimaryDefault: Story = {
  args: { variant: 'Primary', state: 'Default' },
};

export const PrimaryPressed: Story = {
  args: { variant: 'Primary', state: 'Pressed' },
};

export const PrimaryDisabled: Story = {
  args: { variant: 'Primary', state: 'Disabled' },
};

export const PrimaryLoading: Story = {
  args: { variant: 'Primary', state: 'Loading' },
};

export const SecondaryDefault: Story = {
  args: { variant: 'Secondary', state: 'Default' },
};

export const SecondaryPressed: Story = {
  args: { variant: 'Secondary', state: 'Pressed' },
};

export const SecondaryDisabled: Story = {
  args: { variant: 'Secondary', state: 'Disabled' },
};

export const SecondaryLoading: Story = {
  args: { variant: 'Secondary', state: 'Loading' },
};

export const TertiaryDefault: Story = {
  args: { variant: 'Tertiary', state: 'Default' },
};

export const TertiaryPressed: Story = {
  args: { variant: 'Tertiary', state: 'Pressed' },
};

export const TertiaryDisabled: Story = {
  args: { variant: 'Tertiary', state: 'Disabled' },
};

export const TertiaryLoading: Story = {
  args: { variant: 'Tertiary', state: 'Loading' },
};

// The documented irregularity, given its own story so it's easy to find
// rather than only discoverable by switching controls — see the "Don't"
// above.
export const TertiaryLIrregularWrapper: Story = {
  args: { variant: 'Tertiary', size: 'L', state: 'Default' },
};
