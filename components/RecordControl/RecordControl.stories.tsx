import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { RecordControl } from './RecordControl';
import { Button } from '../Button/Button';

// Verbatim from the Figma component set "recordControl" (node 13734:32389,
// file u3BZUg8k5p3mrOrKAnYO5c, page "New components") — its own description
// field, unedited.
const FIGMA_DESCRIPTION = `
The answer control at the bottom of the loop. Built with 2 of the plan's 4 states -- Idle and Recording -- because those are the only two drawn anywhere in the file (48 real instances between them). Submitting and Disabled are listed in the plan as undesigned gaps; per Filipe, not invented here, add as separate variants once designed. Fixed height 215 on both variants (Recording's own natural height with Escape collapsed), centered, so switching state does not reflow bottomContent.
`.trim();

const meta = {
  title: 'Components/RecordControl',
  component: RecordControl,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: FIGMA_DESCRIPTION,
      },
    },
  },
  argTypes: {
    state: {
      control: 'radio',
      options: ['Idle', 'Recording'],
    },
  },
} satisfies Meta<typeof RecordControl>;

export default meta;
type Story = StoryObj<typeof meta>;

// One story per state, matching Figma's variant names.

export const Idle: Story = {
  args: {
    state: 'Idle',
    // The real Idle instance's own default Escape content: a real
    // Tertiary/M Button, not a placeholder.
    escape: <Button variant="Tertiary" size="M" cta="I can't speak right now" />,
  },
};

export const Recording: Story = {
  args: {
    state: 'Recording',
  },
};
