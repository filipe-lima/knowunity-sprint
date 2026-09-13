import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { KnowieMessage } from './KnowieMessage';
import { Button } from '../Button/Button';

// knowieMessage's own Figma description field is literally null (predates
// the file's documentation pass, same situation as MascotSlot and
// SessionHero) — this is docs/design-system.md's own account instead,
// quoted directly.
const DESIGN_SYSTEM_ACCOUNT = `
No Figma description exists for this component (its own description field is literally null) — every prop and default below was confirmed directly against its own componentPropertyDefinitions and the real instance, not from written prose.

**States and options.** None -- a single component, not a set.

**Other properties.** message TEXT. A nested mascotSlot instance (size=XL) sits to the left, not a generic slot -- it keeps the mascot component's own lowercase name as its layer name, per house convention. One true slot, Actions, which now defaults to a Primary/S "Start" button plus a Tertiary/S "Not now" button (matching what every real instance actually places there), rather than sitting empty.

**When to reach for it.** Home and Hub, where Knowie proposes a session, and the all-clear states.

**Don't.** Don't use it inside the loop. In the loop Knowie is the peek above the card and the card does the talking. A bubble there gives the student two places to read from at exactly the moment they are trying to speak.
`.trim();

// Same placeholder pattern as MascotSlot.stories.tsx and
// SessionHero.stories.tsx — no real Knowie artwork asset exists in this
// codebase.
function MascotPlaceholder() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        borderRadius: 'var(--radius-full)',
        background: 'var(--color-mascot-primary)',
      }}
      aria-hidden="true"
    />
  );
}

const meta = {
  title: 'Components/KnowieMessage',
  component: KnowieMessage,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: DESIGN_SYSTEM_ACCOUNT,
      },
    },
  },
  args: {
    mascot: <MascotPlaceholder />,
  },
  decorators: [
    (Story) => (
      <div style={{ width: 358 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof KnowieMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

// The real default instance — Figma's own default message, and Actions
// left to fall back to the component's own real default (Start / Not
// now), not overridden here.
export const Default: Story = {};

// A supplementary story demonstrating the real Actions slot is genuinely
// overridable, not hardcoded — matching the "all-clear" usage where no
// session is being proposed.
export const NoSessionProposed: Story = {
  args: {
    message: 'Nothing new to study yet. Come back after your next lesson.',
    actions: <Button variant="Tertiary" size="S" cta="Got it" />,
  },
};
