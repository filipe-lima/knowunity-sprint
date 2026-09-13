import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { RecallBlock } from './RecallBlock';
import { Button } from '../Button/Button';

// Verbatim from the Figma component set "recallBlock" (node 13734:32253,
// file u3BZUg8k5p3mrOrKAnYO5c, page "New components") — its own
// description field, unedited.
const FIGMA_DESCRIPTION = `
**What it is.** The labelled block inside a recall card. A short label over a body, in one of four roles: the student's answer read back, a hint, a re-explanation, or a confirm prompt with actions.

**When to reach for it.** Anything inside the recall card that needs a label over a body.

**Don't.** Don't give Transcript a colour. The block that shows a student their own words has to stay on background/stacking, because the moment it takes a feedback tint it reads as the verdict and the wait starts feeling like judgement before the judging has happened. That is the whole reason the transcript is on screen during the wait.

The correction control ("That's not what I said") lives in the Actions slot, not as a sibling of this block. Resolved transcripts leave the slot empty and it collapses.
`.trim();

const meta = {
  title: 'Components/RecallBlock',
  component: RecallBlock,
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
      options: ['Transcript', 'Hint', 'Explanation', 'Confirm'],
    },
  },
} satisfies Meta<typeof RecallBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

// One story per variant, matching Figma's variant names.

export const Transcript: Story = {
  args: {
    variant: 'Transcript',
    label: 'You said',
    body: 'Whether a test actually measures the thing it claims to measure, not something next to it',
  },
};

export const Hint: Story = {
  args: {
    variant: 'Hint',
    label: 'Hint',
    body: 'It affects both the thing you are measuring and the thing you think is causing it.',
  },
};

// No specific default copy is authored on the real Explanation variant
// itself (only Transcript's defaults are set at the component-set level) —
// this is representative copy for the role, not a value read off Figma.
export const Explanation: Story = {
  args: {
    variant: 'Explanation',
    label: "Here's another way to say it",
    body: 'A test has construct validity when it actually measures the underlying idea it claims to, not just something correlated with it.',
  },
};

export const Confirm: Story = {
  args: {
    variant: 'Confirm',
    label: "You're saying your answer was right?",
    body: 'We will look at it to improve the judging. It stays out of your practice list. No points either way, and you get one of these per session.',
  },
};

// The Actions slot in real use — Figma's own preferred value for this slot
// is the same button component set used elsewhere in this file, so this
// uses the real Button component (Tertiary, per "the correction control")
// rather than a placeholder.
export const TranscriptWithCorrection: Story = {
  name: 'Transcript, with correction control (Actions slot in use)',
  args: {
    variant: 'Transcript',
    label: 'You said',
    body: 'Whether a test actually measures the thing it claims to measure, not something next to it',
    children: (
      <Button variant="Tertiary" size="S" cta="That's not what I said" />
    ),
  },
};
