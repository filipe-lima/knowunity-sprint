import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { VerdictBadge } from './VerdictBadge';

// Figma's own description is a brief one-liner for this component; the
// fuller account — the variant/fill/glyph/label table and the "Don't" —
// lives in docs/design-system.md instead. Both are included below, kept
// distinct rather than blended into one voice.
const DESCRIPTION = `
**Figma's own description:** Verdict feedback badge. 5 variants (variant axis). Glyph is baked per variant, not swappable — colour and glyph shape both encode the verdict together.

**docs/design-system.md's fuller account:**

| variant | fill | glyph | label |
|---|---|---|---|
| Success | feedback/success/subtle | check-circle | "Got it" |
| Almost | accent/blue/subtle | info-circle | "Almost" |
| Miss | accent/coral/subtle | alert-circle | "Not yet" |
| SaidBack | accent/brand/subtle | check-circle | "Said it back" |
| Flagged | background/stacking | info-circle | "Flagged for review" |

**When to reach for it.** Once per term, at the top of the card's content, the moment a verdict lands.

**Don't.** Don't move Miss onto feedback/error. It sits on accent/coral deliberately: the student has not failed, they have not got there yet, and error red says the opposite. Same reason Flagged is neutral rather than a warning.

There is no Skipped variant yet, though the summary screen counts skipped terms — flagged as a gap, not built around.
`.trim();

const meta = {
  title: 'Components/VerdictBadge',
  component: VerdictBadge,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: DESCRIPTION,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'radio',
      options: ['Success', 'Almost', 'Miss', 'SaidBack', 'Flagged'],
    },
  },
} satisfies Meta<typeof VerdictBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

// One story per variant, matching Figma's variant names and each
// variant's own real default label copy from the table above.

export const Success: Story = {
  args: { variant: 'Success', label: 'Got it' },
};

export const Almost: Story = {
  args: { variant: 'Almost', label: 'Almost' },
};

export const Miss: Story = {
  args: { variant: 'Miss', label: 'Not yet' },
};

export const SaidBack: Story = {
  args: { variant: 'SaidBack', label: 'Said it back' },
};

export const Flagged: Story = {
  args: { variant: 'Flagged', label: 'Flagged for review' },
};
