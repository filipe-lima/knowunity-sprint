import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { ChatInput } from './ChatInput';

// "Chat Input"'s own Figma description field is literally null, and it
// isn't covered by docs/design-system.md at all (that file only documents
// the 15 "New components" built 11 September). This is a from-scratch
// account, built directly from the real component set's own properties
// and all six real status instances, not from written prose. Its one real
// designer annotation is quoted verbatim below, unedited.
const ACCOUNT = `
Found via a real "Chat Input" instance's mainComponent, not from docs/design-system.md (which doesn't cover this component at all) -- the same technique used for MascotSlot and BottomSheet.

**States and options.** Six variants on one axis, status: Inactive / Typing / Ready to send / Recording / Loading / Long input.

**A real designer annotation on this component set, quoted verbatim:** "Need a variant for image attachments in the input field (upto 3)" -- a named, real gap, not invented or built around here.

**What each state means.** Leading is always the same circular "plus" action, except Recording, which swaps it for a cancel (x-close). Inactive/Typing/Loading show a bare mic glyph with no button chrome; Typing additionally shows a blinking text-cursor bar. Ready to send, Recording and Long input instead show a real circular send button. Ready to send and Long input show real typed content instead of the placeholder; Long input also switches from a full pill shape to a smaller, fixed corner radius since a pill doesn't read as a text box once it grows tall. Recording replaces the text content with an amplitude visualization (approximated here -- see ChatInput.tsx's own comment for why the real bar-by-bar geometry wasn't reliably retrievable from Figma).

**A real oddity, found and not silently resolved:** the trailing send glyph's own fill resolves to a Figma variable literally named "interactive/secondary" -- a name with no match in tokens/tokens.json. Reproduced instead with interactive/primary/on, the real token this codebase already uses for icon colour on a light, Primary-style fill.

**When to reach for it / Don't.** Not written yet -- this component predates docs/design-system.md's documentation pass entirely.

**Since fixed, not just flagged:** an axe-core scan found two real gaps. Every leading/trailing icon button had no accessible name at all -- now labeled contextually ("Add" / "Cancel recording" / "Send"). The placeholder text (Inactive/Typing/Loading) used text/disabled, measuring 3.77:1 against a required 4.5:1 -- switched to text/secondary, the same token Field already uses correctly for its own equivalent placeholder state.
`.trim();

const meta = {
  title: 'Components/ChatInput',
  component: ChatInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: ACCOUNT,
      },
    },
  },
  argTypes: {
    status: {
      control: 'radio',
      options: ['Inactive', 'Typing', 'Ready to send', 'Recording', 'Loading', 'Long input'],
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 390 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ChatInput>;

export default meta;
type Story = StoryObj<typeof meta>;

// One story per status, matching Figma's own variant names.

export const Inactive: Story = {
  args: { status: 'Inactive' },
};

export const Typing: Story = {
  args: { status: 'Typing' },
};

export const ReadyToSend: Story = {
  name: 'Ready to send',
  args: { status: 'Ready to send' },
};

export const Recording: Story = {
  args: { status: 'Recording' },
};

export const Loading: Story = {
  args: { status: 'Loading' },
};

export const LongInput: Story = {
  name: 'Long input',
  args: { status: 'Long input' },
};
