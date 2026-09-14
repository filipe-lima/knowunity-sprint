import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Button } from './Button';

// Verbatim from the Figma component set "button" (node 9003:6667, file
// u3BZUg8k5p3mrOrKAnYO5c, page "🎨 Mascot & components") — its own
// description field, unedited.
const FIGMA_DESCRIPTION = `
**What it is.** A pill at radius 9999 inside a fixed-height tap wrapper: wrapper 48 / 48 / 56 for S / M / L, visible pill 32 / 40 / 56. Three variants x three sizes x four states, plus optional left and right icons and a CTA text property. Primary is interactive/primary, Pressed is interactive/primary/active, Disabled swaps to background/surface with text/disabled, Loading keeps the fill and collapses to icon width. Tertiary has no fill at rest and picks up interactive/secondary/active when pressed.

**When to use it.** Primary L inside a buttonGroup is the bottom CTA on the example screens. Tertiary S is the inline link-style action.

**Don't.** Don't place a Primary Disabled next to a Secondary Default. Both fill with background/surface, so the disabled primary reads as an enabled secondary.

**GAP:** no Hover, Focus or Destructive state exists.
`.trim();

const meta = {
  title: 'Components/Button',
  component: Button,
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
    cta: { control: 'text' },
    showLeftIcon: { control: 'boolean' },
    showRightIcon: { control: 'boolean' },
  },
  args: {
    cta: 'Continue',
    size: 'M',
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// One story per variant x state — the same 12 combinations Figma names as
// "variant=X, size=Y, state=Z" (size is left as a control on every story
// rather than tripling the count again, since it only changes scale, not
// behavior).

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

// Not a Figma variant — added for components/ButtonGroup, whose real
// instances place this component with layoutSizingHorizontal: FILL
// (confirmed directly against Hub's own real buttonGroup). Every story
// above leaves `fill` at its default false, matching the component's own
// resting, label-hugging look everywhere else it's used.
export const Fill: Story = {
  args: { variant: 'Primary', cta: 'Start Research Methods', fill: true },
  parameters: { layout: 'padded' },
};
