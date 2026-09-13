import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { TypeScale } from './Type';

const meta = {
  title: 'Foundations/Type',
  component: TypeScale,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof TypeScale>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllStyles: Story = {
  globals: { viewport: { value: 'fill' } },
};
