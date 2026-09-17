import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { StatusBar } from './StatusBar';

const DESIGN_SYSTEM_ACCOUNT = `
Read from the real Figma component "Status Bar" (Mode=Night variant) — 375×48, a "09:41" time label on the left, a cellular-signal glyph, a Wi-Fi glyph, and a battery glyph on the right.

Baked directly into Scaffold's Panel Header, unconditionally, on every screen — not its own slot or prop, matching design-system.md's own account of Panel Header as "fixed, not a slot."
`.trim();

const meta = {
  title: 'Components/StatusBar',
  component: StatusBar,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: DESIGN_SYSTEM_ACCOUNT,
      },
    },
  },
} satisfies Meta<typeof StatusBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: '390px', height: '48px', background: 'var(--color-background-stacking)' }}>
        <Story />
      </div>
    ),
  ],
};
