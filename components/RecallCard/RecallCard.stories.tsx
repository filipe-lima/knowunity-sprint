import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { RecallCard } from './RecallCard';

// Verbatim from the Figma component "recallCard" (node 13734:32224, file
// u3BZUg8k5p3mrOrKAnYO5c, page "New components") — its own description
// field, unedited.
const FIGMA_DESCRIPTION = `
**What it is.** The container the whole rehearsal loop lives in. It says where the term came from, what to do with it, and the term, then hands everything below to a content slot. The card does not change. The slot carries idle, transcript, verdict, hint, explanation and confirm.

**When to reach for it.** Every screen in the loop, voice or text. If a screen shows a term to answer, it is this card.

**Don't.** Don't turn the loop states into variants of the card. The moment a verdict becomes a card variant, every new state costs a variant, the set stops being readable, and the card can never be used for anything but this feature.
`.trim();

const meta = {
  title: 'Components/RecallCard',
  component: RecallCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: FIGMA_DESCRIPTION,
      },
    },
  },
  args: {
    provenance: 'Research Methods, read Tuesday',
    instruction: 'Say what it means, out loud',
    term: 'Construct validity',
  },
} satisfies Meta<typeof RecallCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// No variant axis exists on this component at all — it's a single,
// unchanging container (Figma's own "Don't": never turn the loop's states
// into card variants). These stories instead show the one thing that
// actually varies in real use: what's placed in its open Content slot.

// The default, matching the real component's own default property values.
export const Default: Story = {};

// Empty Content slot — the documented "16px taller than a hand-built card"
// cost this component pays for the slot mechanism even with nothing in it.
// Not a defect; given its own story so it's visible rather than only
// inferred from a diagram.
export const EmptyContentSlot: Story = {
  args: {},
};

// A simple placeholder verdict block in the Content slot — standing in for
// what design-system.md calls out as this slot's real job: "idle,
// transcript, verdict, hint, explanation and confirm." No verdictBadge or
// recallBlock component exists yet in this codebase to reuse directly, so
// this is plain markup, not a placeholder claiming to be one of those.
export const WithContent: Story = {
  render: (args) => (
    <RecallCard {...args}>
      <div
        style={{
          padding: 'var(--space-300)',
          borderRadius: 'var(--radius-400)',
          background: 'var(--color-feedback-success-subtle)',
          color: 'var(--color-feedback-success-on-subtle)',
          fontFamily: 'var(--font-family-default)',
          fontSize: 'var(--font-size-sm)',
        }}
      >
        Got it
      </div>
    </RecallCard>
  ),
};

// A term long enough to wrap — the real component's title is a large
// display style with no documented truncation rule.
export const LongTerm: Story = {
  args: {
    term: 'Regression toward the mean',
    instruction: 'Explain it the way you would to a classmate',
  },
};
