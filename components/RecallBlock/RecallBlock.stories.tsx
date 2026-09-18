import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { RecallBlock } from './RecallBlock';
import { Button } from '../Button/Button';

// Verbatim from the Figma component set "recallBlock" (node 13734:32253,
// file u3BZUg8k5p3mrOrKAnYO5c, page "New components") — its own
// description field, unedited.
const FIGMA_DESCRIPTION = `
**What it is.** The labelled block inside a recall card. A short label over a body, in one of four roles in Figma: the student's answer read back, a hint, a re-explanation, or a confirm prompt with actions.

**When to reach for it.** Anything inside the recall card that needs a label over a body.

**Don't.** Don't give Transcript a colour. The block that shows a student their own words has to stay on background/stacking, because the moment it takes a feedback tint it reads as the verdict and the wait starts feeling like judgement before the judging has happened. That is the whole reason the transcript is on screen during the wait.

The correction control ("That's not what I said") lives in the Actions slot, not as a sibling of this block. Resolved transcripts leave the slot empty and it collapses.

Only 3 of Figma's 4 roles are implemented here — the fourth, \`Explanation\` (a re-explanation, shown on a second miss before a mandatory "say it back"), was removed 2026-09-18 along with the "Reveal" flow it exclusively served.
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
      options: ['Transcript', 'Hint', 'Confirm'],
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
