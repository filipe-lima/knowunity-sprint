import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Composer } from './Composer';
import { ButtonIcon } from '../ButtonIcon/ButtonIcon';

// Verbatim from the Figma component set "composer" (node 13734:32417, file
// u3BZUg8k5p3mrOrKAnYO5c, page "New components") — its own description
// field, unedited.
const FIGMA_DESCRIPTION = `
The input row. Chat is plus + field (Home). Answer is field + send (loop text mode). field is a real instantiated component inside composer, not a slot -- built as its own separate set first, matching the plan's explicit split. Leading/Trailing SLOTs run on Figma's untuned defaults; this Desktop Bridge runtime cannot set slotSettings programmatically (same limitation hit on topBar and recordControl).

**A correction to docs/design-system.md's own summary, found while building this:** it describes "Chat's own field carries camera and mic icons in its own Trailing." Checked directly against the real Chat instance — field's Trailing and composer's own Trailing are both genuinely empty there; only Leading (a plus buttonIcon) is filled. Reproduced to match the real instance, not the prose.
`.trim();

function PlusGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" aria-hidden="true">
      <path d="M12 4v16M4 12h16" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}

function SendGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const meta = {
  title: 'Components/Composer',
  component: Composer,
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
    variant: {
      control: 'radio',
      options: ['Chat', 'Answer'],
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 358 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Composer>;

export default meta;
type Story = StoryObj<typeof meta>;

// One story per variant, matching Figma's variant names and each real
// instance's own default content exactly: Chat's real default fills
// Leading with a plus buttonIcon and leaves Trailing empty; Answer's real
// default leaves Leading empty and fills Trailing with the arrow-right
// ("send") buttonIcon. Both use the real ButtonIcon component
// (Secondary/M), matching what Figma's own instances actually place
// there.

export const Chat: Story = {
  args: {
    variant: 'Chat',
    leading: <ButtonIcon variant="Secondary" size="M" aria-label="Add" icon={<PlusGlyph />} />,
  },
};

export const Answer: Story = {
  args: {
    variant: 'Answer',
    trailing: <ButtonIcon variant="Secondary" size="M" aria-label="Send" icon={<SendGlyph />} />,
  },
};
