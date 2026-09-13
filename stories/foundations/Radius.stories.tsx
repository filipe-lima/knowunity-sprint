import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { RadiusScale } from './Radius';

const meta = {
  title: 'Foundations/Radius',
  component: RadiusScale,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof RadiusScale>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllSteps: Story = {
  globals: { viewport: { value: 'fill' } },
};
