import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { BottomSheet } from './BottomSheet';
import { TextBlock } from '../TextBlock/TextBlock';
import { Button } from '../Button/Button';

// bottomSheet's own Figma description field is literally null, and it
// isn't covered by docs/design-system.md at all (that file only documents
// the 15 "New components" built 11 September — this is one of the
// pre-existing ten). This is a from-scratch account, built directly from
// the real component set's own properties and all three real height
// instances, not from any written prose.
const ACCOUNT = `
Found via a real "bottomSheet" instance's mainComponent, not from docs/design-system.md (which doesn't cover this component at all) -- the same technique used for MascotSlot, since this component's own set isn't reachable by name search either.

**States and options.** Three variants on one axis, height: S / M / L.

**Other properties.** Two slots, middleSection and bottomSection, both confirmed identical in padding/gap/alignment across all three height variants.

**Not reproduced pixel-for-pixel, flagged rather than guessed:** every real instance nests a separate, whole "Bottom-sheet App Bar" component (its own Title/Caption/showCaption properties and Type variant -- genuinely different per height: S uses dismissAndAction, M and L use Default) plus a grabber handle nested inside it. That app bar is real, separate, and unbuilt -- this component exposes a generic \`header\` slot instead and always renders just the simple, real, height-independent grabber handle directly.

Also: the three real instances' overall heights don't form a clean, consistent pattern even though every fetched instance had zero real children in both slots -- evidence these are leftover measurements, not a deliberate height token per step. This component's real height comes from whatever content is passed in, matching the master's own HUG sizing, rather than inventing a fixed height from unreliable numbers.

**When to reach for it / Don't.** Not written yet -- this component predates docs/design-system.md's documentation pass entirely.
`.trim();

const meta = {
  title: 'Components/BottomSheet',
  component: BottomSheet,
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
    height: {
      control: 'radio',
      options: ['S', 'M', 'L'],
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 390 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof BottomSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

// One story per height, matching Figma's own variant names. header is
// left empty (the real, separate app bar component isn't rebuilt here —
// see the component's own docs) so each story focuses on demonstrating
// the two real slots with real content.

export const S: Story = {
  args: {
    height: 'S',
    middleSection: <TextBlock variant="S" title="Can't speak right now?" caption="You can type your answers instead." showCaption />,
    bottomSection: <Button variant="Primary" size="M" cta="Yes, let me type" />,
  },
};

export const M: Story = {
  args: {
    height: 'M',
    middleSection: (
      <TextBlock
        variant="M"
        title="End this session early?"
        caption="You'll keep the points from the terms you already said out loud."
        showCaption
      />
    ),
    bottomSection: (
      <>
        <Button variant="Primary" size="L" cta="Yes, end session" />
        <Button variant="Tertiary" size="M" cta="Keep going" />
      </>
    ),
  },
};

export const L: Story = {
  args: {
    height: 'L',
    middleSection: (
      <TextBlock
        variant="L"
        title="Choose what to study"
        caption="Pick a set, or let Knowie choose based on what's due."
        showCaption
      />
    ),
    bottomSection: <Button variant="Primary" size="L" cta="Continue" />,
  },
};
