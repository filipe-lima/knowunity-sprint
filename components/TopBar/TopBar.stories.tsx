import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { TopBar } from './TopBar';
import { ButtonIcon } from '../ButtonIcon/ButtonIcon';
import { TermPip } from '../TermPip/TermPip';

// Verbatim from the Figma component set "topBar" (node 13734:32344, file
// u3BZUg8k5p3mrOrKAnYO5c, page "New components") — its own description
// field, unedited.
const FIGMA_DESCRIPTION = `
**What it is.** The mobile top bar for this feature. Loop carries close, session progress and skip. Title carries back, a title and an optional subtitle. Centered is a title alone. Width is a literal 390 (no mobile screen-width variable exists in the file; confirmed with Filipe, hardcoded deliberately). Leading/Progress/Trailing are SLOT nodes but this runtime (figma-console Desktop Bridge) could not set slotSettings/preferredValues programmatically (throws "object is not extensible") -- they use Figma's default slot behaviour instead of the tuned appBar-style settings the plan describes.

**When to reach for it (docs/design-system.md).** Every screen at 390 in this feature.

**Don't (docs/design-system.md).** Don't reach for the library's appBar instead. It is a 1200 wide desktop scrim built on App Bar Button components, with no instances anywhere in the file. Using it here means resizing and re-slotting every single instance.

**A correction to docs/design-system.md's own summary, found while building this:** it describes "three slots: Leading, Progress (Loop only), Trailing" as if Leading and Trailing were shared across every variant. Checked directly against the real Title variant — it has Leading and a fixed 48px spacer, no Trailing slot at all. Trailing turns out to be Loop-only too.
`.trim();

function CloseGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}

function BackGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" aria-hidden="true">
      <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SkipGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" aria-hidden="true">
      <path d="M5 5v14l10-7-10-7z" fill="currentColor" />
      <path d="M18 5v14" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}

// The real Figma instance behind Loop's Progress slot: five real termPip
// instances (one Done, one Current, three Upcoming) in the documented
// plain row pattern — not a placeholder.
function SessionProgress() {
  return (
    <>
      <TermPip state="Done" />
      <TermPip state="Current" />
      <TermPip state="Upcoming" />
      <TermPip state="Upcoming" />
      <TermPip state="Upcoming" />
    </>
  );
}

const meta = {
  title: 'Components/TopBar',
  component: TopBar,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: FIGMA_DESCRIPTION,
      },
    },
  },
} satisfies Meta<typeof TopBar>;

export default meta;
type Story = StoryObj<typeof meta>;

// One story per variant, matching Figma's variant names. Leading/
// Trailing/Progress use the real ButtonIcon and TermPip components
// already in this codebase, matching what Figma's own instances actually
// place there.

export const Loop: Story = {
  args: {
    variant: 'Loop',
    leading: <ButtonIcon variant="Tertiary" size="M" aria-label="Close" icon={<CloseGlyph />} />,
    progress: <SessionProgress />,
    trailing: <ButtonIcon variant="Tertiary" size="M" aria-label="Skip" icon={<SkipGlyph />} />,
  },
};

export const Title: Story = {
  args: {
    variant: 'Title',
    title: 'Say it out loud',
    leading: <ButtonIcon variant="Tertiary" size="M" aria-label="Back" icon={<BackGlyph />} />,
  },
};

// showSubtitle's documented default is false — its own story since it
// changes the bar's height (HUG), not just the subtitle's visibility.
export const TitleWithSubtitle: Story = {
  args: {
    variant: 'Title',
    title: 'Say it out loud',
    subtitle: 'Exam in 12 days',
    showSubtitle: true,
    leading: <ButtonIcon variant="Tertiary" size="M" aria-label="Back" icon={<BackGlyph />} />,
  },
};

// "Results" is the real component's own default text for this variant in
// Figma, not one this build made up.
export const Centered: Story = {
  args: {
    variant: 'Centered',
    title: 'Results',
  },
};
