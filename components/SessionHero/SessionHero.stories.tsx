import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { SessionHero } from './SessionHero';
import { MascotSlot } from '../MascotSlot/MascotSlot';

// sessionHero's own Figma description field is literally null (it predates
// the file's documentation pass, same situation as MascotSlot) — this is
// docs/design-system.md's own account instead, quoted directly.
const DESIGN_SYSTEM_ACCOUNT = `
No Figma description exists for this component set — every prop and default below was confirmed directly against its own componentPropertyDefinitions and all four real variant instances, not from written prose.

**States and options.** Four variants on two axes: align (Left / Center) x surface (None / Card).

**What each state means.** Left/surface=Card is the "proposal" shape and is the one variant using Headline XL; the other three use Headline L. Center/surface=None was built to match the "entry" pattern's tighter spacing (Space/300 gap, Space/400 top/bottom padding) rather than the "intro" pattern's looser spacing (Space/400 gap, Space/600 padding) -- both patterns map to this same variant coordinate in the file and disagree with each other; entry was chosen because more real instances follow it and because of a stated preference for Headline L as the default elsewhere. Worth revisiting deliberately if intro's wider spacing is actually the one wanted live.

**When to reach for it.** Session entry, the first-run intro, the sheet's proposal, the summary head, the all-clear state.

**Don't.** Don't use it for a card the student answers into. This block only ever states something. The moment it needs an input it is a recallCard.
`.trim();

// No xpPill component exists in this codebase yet (docs/design-system.md
// documents it as its own separate component, out of scope for this
// build) — this reproduces the real Left/None instance's exact visual
// ("+15 XP", size M) with tokens inline, the same placeholder resolution
// used for every other not-yet-built nested component this session.
function XpPillPlaceholder() {
  return (
    <div
      style={{
        display: 'inline-flex',
        paddingLeft: 'var(--space-400)',
        paddingRight: 'var(--space-400)',
        paddingTop: 'var(--space-200)',
        paddingBottom: 'var(--space-200)',
        borderRadius: 'var(--radius-full)',
        background: 'var(--color-accent-brand-subtle)',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-family-default)',
          fontWeight: 'var(--font-weight-semibold)',
          fontSize: 'var(--font-size-sm)',
          lineHeight: 'var(--font-line-height-xs)',
          letterSpacing: 'var(--font-tracking-loose)',
          color: 'var(--color-accent-brand-on-subtle)',
        }}
      >
        +15 XP
      </span>
    </div>
  );
}

// Same placeholder pattern as MascotSlot.stories.tsx — no real Knowie
// artwork asset exists in this codebase.
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
  title: 'Components/SessionHero',
  component: SessionHero,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: DESIGN_SYSTEM_ACCOUNT,
      },
    },
  },
  argTypes: {
    align: {
      control: 'radio',
      options: ['Left', 'Center'],
    },
    surface: {
      control: 'radio',
      options: ['None', 'Card'],
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 358 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SessionHero>;

export default meta;
type Story = StoryObj<typeof meta>;

// One story per real variant combination, matching Figma's own instance
// naming (align x surface) — each reproduces that instance's exact real
// text and slot content, not placeholder copy.

// The "summary head" — real instance's own default eyebrow/headline/body,
// Trailing filled with the real xpPill visual (no component yet, see the
// placeholder above).
export const LeftNone: Story = {
  name: 'Left, None (summary head)',
  args: {
    align: 'Left',
    surface: 'None',
    eyebrow: 'Session done',
    headline: 'You said 5 terms out loud',
    body: 'Two of them without any help.',
    trailing: <XpPillPlaceholder />,
  },
};

// The "proposal" shape — the one combination using Headline XL, with a
// real footnote shown.
export const LeftCard: Story = {
  name: 'Left, Card (proposal)',
  args: {
    align: 'Left',
    surface: 'Card',
    eyebrow: 'Up next',
    headline: 'Research Methods',
    body: '5 terms. About 3 minutes.',
    footnote: 'From the lesson you read on Tuesday',
    showFootnote: true,
  },
};

// The "entry" pattern (session entry / first-run intro) — Mascot filled
// with a real MascotSlot (2XL, matching the real instance exactly).
export const CenterNone: Story = {
  name: 'Center, None (session entry)',
  args: {
    align: 'Center',
    surface: 'None',
    eyebrow: 'Today',
    headline: '5 terms from Research Methods',
    body: 'About 3 minutes',
    footnote: 'From the lesson you read on Tuesday',
    showFootnote: true,
    mascot: (
      <MascotSlot size="2XL">
        <MascotPlaceholder />
      </MascotSlot>
    ),
  },
};

// The "all-clear" state — Eyebrow genuinely hidden in the real instance,
// Mascot filled with a real MascotSlot (XL, matching the real instance).
export const CenterCard: Story = {
  name: 'Center, Card (all-clear)',
  args: {
    align: 'Center',
    surface: 'Card',
    showEyebrow: false,
    headline: 'Nothing waiting',
    body: 'You have said every term you finished out loud. The dot is off until you study something new.',
    mascot: (
      <MascotSlot size="XL">
        <MascotPlaceholder />
      </MascotSlot>
    ),
  },
};
