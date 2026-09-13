import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { SpacingScale } from './Spacing';

const meta = {
  title: 'Foundations/Spacing',
  component: SpacingScale,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof SpacingScale>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllSteps: Story = {
  globals: { viewport: { value: 'fill' } },
};
