import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Sheet } from './Sheet';
import { Button } from '../Button/Button';

// sheet's own Figma description field is literally null (predates the
// file's documentation pass, same situation as MascotSlot/SessionHero/
// KnowieMessage) — this is docs/design-system.md's own account instead,
// quoted directly.
const DESIGN_SYSTEM_ACCOUNT = `
No Figma description exists for this component (its own description field is literally null) — every prop and default below was confirmed directly against its own componentPropertyDefinitions and the real instance, not from written prose.

**States and options.** None -- a single component, not a set.

**Other properties.** title TEXT, body TEXT, footnote TEXT, showFootnote BOOLEAN. One slot, Actions, now defaulting to a Primary/L "Yes, let me type" button above a Tertiary/M "No, back to home" button (matching real content), rather than sitting empty.

**When to reach for it.** A single question that interrupts the flow, like the text-mode offer.

**Don't.** Don't build the scrim into it. The scaffold owns the scrim through showBottomSheetBackground, and a sheet carrying its own gives you two.
`.trim();

const meta = {
  title: 'Components/Sheet',
  component: Sheet,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: DESIGN_SYSTEM_ACCOUNT,
      },
    },
  },
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

// The real default instance — Figma's own default title/body/footnote,
// and Actions left to fall back to the component's own real default (Yes,
// let me type / No, back to home), not overridden here.
export const Default: Story = {};

// showFootnote's documented default is true, but it's a real toggle —
// given its own story rather than only discoverable via controls.
export const WithoutFootnote: Story = {
  args: {
    showFootnote: false,
  },
};

// A supplementary story demonstrating the real Actions slot is genuinely
// overridable, not hardcoded — a different single-question use ("A single
// question that interrupts the flow").
export const CustomActions: Story = {
  args: {
    title: 'End this session early?',
    body: "You'll keep the points from the terms you already said out loud.",
    footnote: 'You can start a new session any time.',
    actions: (
      <>
        <Button variant="Primary" size="L" cta="Yes, end session" />
        <Button variant="Tertiary" size="M" cta="Keep going" />
      </>
    ),
  },
};
