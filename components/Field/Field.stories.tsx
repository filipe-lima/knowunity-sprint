import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Field } from './Field';
import { ButtonIcon } from '../ButtonIcon/ButtonIcon';

// Verbatim from the Figma component set "field" (node 13734:32403, file
// u3BZUg8k5p3mrOrKAnYO5c, page "New components") — its own description
// field, unedited.
const FIGMA_DESCRIPTION = `
The text input inside composer. Built with 3 of the plan's 4 states: Empty and Filled are drawn in the file (chat input / text answer real instances); Focused has no drawn instance but the plan gives an explicit stroke binding (border/focus at Stroke/Border) so it was buildable without one. Disabled has neither a drawn instance nor a binding instruction -- not built, same policy as recordControl's Submitting/Disabled. One real inconsistency found and NOT built around: the one real multiline field instance (86 tall, Filled) uses Radius/600 instead of Radius/Full, while every single-line field (44 tall, 3 instances) uses Radius/Full. Built to the plan's literal Radius/Full for all states, since one data point is not enough to establish a documented multiline rule the plan never mentions.
`.trim();

function TrailingIconGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" aria-hidden="true">
      <path d="M5 5v14l10-7-10-7z" fill="currentColor" />
      <path d="M18 5v14" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}

const meta = {
  title: 'Components/Field',
  component: Field,
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
      options: ['Empty', 'Filled', 'Focused'],
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 358 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

// One story per state, matching Figma's variant names and each state's own
// real default value copy.

export const Empty: Story = {
  args: { state: 'Empty' },
};

export const Filled: Story = {
  args: { state: 'Filled' },
};

export const Focused: Story = {
  args: { state: 'Focused' },
};

// A generic demonstration of the real Trailing slot, using a real
// ButtonIcon (Tertiary/S) — not a reproduction of the specific Chat
// composer instance docs/design-system.md describes (camera + mic), since
// that instance's own icon sizing wasn't part of the fetched Figma data.
export const WithTrailingIcon: Story = {
  args: {
    state: 'Filled',
    trailing: <ButtonIcon variant="Tertiary" size="S" aria-label="Send" icon={<TrailingIconGlyph />} />,
  },
};
