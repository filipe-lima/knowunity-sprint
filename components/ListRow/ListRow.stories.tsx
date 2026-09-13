import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { ListRow } from './ListRow';
import { IconSlot } from '../IconSlot/IconSlot';
import { ButtonIcon } from '../ButtonIcon/ButtonIcon';

// Verbatim from the Figma component set "listRow" (node 13734:32134, file
// u3BZUg8k5p3mrOrKAnYO5c, page "New components") — its own description
// field, unedited.
const FIGMA_DESCRIPTION = `
**What it is.** The one row this feature is built from. A tappable strip at Radius/400 with an optional leading slot, a title and optional subtitle, and an optional trailing slot. Two sizes: M for rows that own a screen, S for rows that summarise inside one.

**When to reach for it.** Any list. Hub rows, Home continue rows, picker rows, plan steps, session summary buckets, Your terms, suggested questions.

**Don't.** Don't dim the subtitle in state=Locked. The title goes to text/disabled and the subtitle stays on text/secondary on purpose, because the subtitle is the line that names what unlocks the row. A locked row with a dimmed subtitle stops explaining itself and starts just refusing.

Leading and trailing are slots, not axes. An empty slot collapses out of the layout on its own. Preferred values are iconSlot, chips, button and buttonIcon, with allowPreferredValuesOnly off so an emoji text layer still drops in.

**Also documented, not independently re-verified beyond spot-checking Pressed/Surface vs Pressed/Stacking:** state=Pressed fills interactive/pressed regardless of the surface axis, which makes surface inert whenever a row is pressed — confirmed pixel-identical here. Whether that's the intended final behavior or a gap is still an open question upstream, not something resolved in this build.

**A deliberate departure from the "Don't" above, not an oversight:** an axe-core accessibility scan found the real Locked pairing (title on text/disabled, subtitle on text/secondary) fails contrast at 3.69:1 against a required 4.5:1 -- on the row's primary, load-bearing label. Reversed on an explicit decision: the title now stays on text/secondary (legible, still visually one step down from Default) and the subtitle takes the dim treatment instead, so a locked row still says what it is even though the reason it's locked reads as de-emphasized.
`.trim();

// A plain placeholder glyph — no real icon asset library exists in this
// codebase yet (see IconSlot.tsx).
function PlaceholderGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" aria-hidden="true">
      <path d="M12 4v16M4 12h16" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}

function ChevronGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" aria-hidden="true">
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const meta = {
  title: 'Components/ListRow',
  component: ListRow,
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
    state: {
      control: 'radio',
      options: ['Default', 'Selected', 'Locked', 'Pressed'],
    },
    size: {
      control: 'radio',
      options: ['M', 'S'],
    },
    surface: {
      control: 'radio',
      options: ['Surface', 'Stacking'],
    },
    showSubtitle: { control: 'boolean' },
  },
  args: {
    title: 'Cell biology',
    subtitle: '12 terms · practiced 2d ago',
  },
} satisfies Meta<typeof ListRow>;

export default meta;
type Story = StoryObj<typeof meta>;

// One story per state (the axis with the most distinct visual identity),
// with size/surface left as controls — same approach as Button's
// variant x state stories, where the less consequential axis (size) is a
// control rather than a multiplied set of stories.
//
// Leading/trailing use real components already in this codebase
// (IconSlot, ButtonIcon) rather than placeholders — Figma's own
// description names iconSlot/chips/button/buttonIcon as this slot's
// preferred content, and two of those four already exist here.

export const Default: Story = {
  args: {
    state: 'Default',
    leading: (
      <IconSlot size="200">
        <PlaceholderGlyph />
      </IconSlot>
    ),
    trailing: (
      <ButtonIcon variant="Tertiary" size="S" aria-label="Open" icon={<ChevronGlyph />} />
    ),
  },
};

export const Selected: Story = {
  args: { state: 'Selected' },
};

export const Locked: Story = {
  args: { state: 'Locked', subtitle: 'Unlocks after Cell membranes' },
};

export const Pressed: Story = {
  args: { state: 'Pressed' },
};

// The documented role change at size=S (Caption M Bold, not a smaller
// Headline XXS Bold) — its own story rather than only a control, since
// it's a named, deliberate difference worth finding directly.
export const SizeS: Story = {
  name: 'Size S (row that summarises, not owns, a screen)',
  args: { size: 'S' },
};

// surface=Stacking, given its own story since the difference from
// surface=Surface only shows once a row sits on something already on
// background/surface — easy to miss via controls alone.
export const SurfaceStacking: Story = {
  args: { surface: 'Stacking' },
};

// Leading/trailing both omitted — demonstrates the documented collapse
// behavior ("An empty slot collapses out of the layout on its own") rather
// than reserving fixed empty space.
export const NoSlots: Story = {
  name: 'No leading or trailing (slots collapse)',
  args: {},
};

export const NoSubtitle: Story = {
  args: { showSubtitle: false },
};
