import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Colors } from './Colors';

const meta = {
  title: 'Foundations/Colors',
  component: Colors,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Colors>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllColors: Story = {
  // This is a reference sheet, not a mobile screen — the project's 390px
  // default (.storybook/preview.tsx) doesn't apply to it, same as a docs
  // page. A story's own `globals.viewport` wins over that project default
  // and locks the toolbar to match, so it can't be narrowed by accident.
  globals: { viewport: { value: 'fill' } },
};
