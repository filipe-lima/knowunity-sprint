import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Avatar } from './Avatar';

const DESIGN_SYSTEM_ACCOUNT = `
Read from the real Figma "Avatar" component set, found via the Desktop Bridge connection inside \`Home E — Knowie's message\` while building the Home screen.

**States and options.** Confirmed real variant axes: Type (Image / Initial) x Size (Large / Medium / Small) x Shape (Circle — the only shape present in the real set, no Square variant exists).

**What each state means.** Type=Image expects real photo content via \`children\` (no real photo asset exists in this codebase, same gap as every other image slot); Type=Initial renders \`initials\` as plain text instead.

**Not fully confirmed.** Only the Large/Image/Circle instance's rendered size (24x24, in the Navbar) was checked directly — Medium/Small are sized on the \`--icon-250\`/\`--icon-200\` step tokens as a reasonable scale, not confirmed against the component set's own per-variant dimensions.

**When to reach for it.** The trailing slot of \`Navbar\`, for the signed-in student.
`.trim();

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
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
    type: {
      control: 'radio',
      options: ['Image', 'Initial'],
    },
    size: {
      control: 'radio',
      options: ['Large', 'Medium', 'Small'],
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

// One story per real Type, at the confirmed Large/Circle instance's size.

export const Image: Story = {
  args: {
    type: 'Image',
    size: 'Large',
    shape: 'Circle',
    children: (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, var(--color-accent-blue-bold), var(--color-accent-brand-subtle))',
        }}
      />
    ),
  },
};

export const Initial: Story = {
  args: {
    type: 'Initial',
    size: 'Large',
    shape: 'Circle',
    initials: 'H',
  },
};

export const Small: Story = {
  args: {
    type: 'Initial',
    size: 'Small',
    shape: 'Circle',
    initials: 'H',
  },
};
