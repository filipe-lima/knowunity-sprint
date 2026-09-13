import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { ListItem } from './ListItem';

// "listItem"'s own Figma description field is literally null, and it
// isn't covered by docs/design-system.md at all. This is a from-scratch
// account, built directly from the real component set's own properties
// and diffing real variant instances, not from written prose.
const ACCOUNT = `
Found via a real "listItem" instance's mainComponent, not from docs/design-system.md (which doesn't cover this component at all, and doesn't mention it alongside the separate, also-real ListRow) -- the same technique used for MascotSlot, BottomSheet and ChatInput.

**States and options.** Three axes: trailing (Icon / Icon & Text / Switch / Checkbox / None), variant (Filled / Filled Compact / Transparent), state (Default / Pressed / Selected) -- 45 real combinations, the largest component set found this session.

**A real, confirmed constraint:** trailing="Switch" only exists under variant="Transparent" -- there is no Filled or Filled Compact + Switch combination anywhere in the real file.

**What each variant means.** Transparent has no fill and small Radius/200 corners -- a plain in-list row. Filled and Filled Compact both fill background/surface with Radius/600 and a bottom-lit inner-shadow bezel (like a small card), differing only in vertical padding and bezel offset.

**A real, confirmed gap:** state="Selected" was checked directly against the real trailing="Icon" instance and shows no root-level fill or stroke difference at all -- its signal (if any) lives on the trailing control itself, not a row treatment.

**A real, confirmed typography gap:** the title/subtitle text nodes are not bound to any font-size/weight/lineHeight token in Figma at all (unlike every colour/space/radius value here, which are all properly bound) -- raw 17px/600 and 14px/400. Reproduced with the nearest real tokens (font/size/md + semibold, font/size/sm + regular) since this codebase never hand-types a type value, flagged as an approximation of an unbound original.

**Not reproduced pixel-for-pixel:** the real nested "Checkbox" and "switch" instances are both separate, real, unbuilt components with their own variants -- represented here as small, faithful local visuals instead.

**When to reach for it / Don't.** Not written yet -- this component predates docs/design-system.md's documentation pass entirely.

**Since fixed, not just flagged:** an axe-core scan found the Checkbox and Switch trailing controls had no accessible name at all. Both now take a trailingAriaLabel prop, defaulting to title.
`.trim();

function LeadingIconGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" aria-hidden="true">
      <path d="M4 19.5V6a2 2 0 012-2h11a2 2 0 012 2v13" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 19.5A2.5 2.5 0 016.5 17H19" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LeadingImagePlaceholder() {
  return <div style={{ width: '100%', height: '100%', background: 'var(--color-accent-blue-subtle)' }} aria-hidden="true" />;
}

const meta = {
  title: 'Components/ListItem',
  component: ListItem,
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
    variant: {
      control: 'radio',
      options: ['Transparent', 'Filled', 'Filled Compact'],
    },
    state: {
      control: 'radio',
      options: ['Default', 'Pressed', 'Selected'],
    },
    trailing: {
      control: 'radio',
      options: ['Icon', 'Icon & Text', 'Switch', 'Checkbox', 'None'],
    },
  },
  args: {
    showIcon: false,
    showIllustration: false,
    showImage: false,
    showEmoji: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: 358 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

// One story per trailing option, matching Figma's own variant names —
// each with only one leading-media boolean enabled, since a real row
// only ever shows one (Figma's own default has all four true
// simultaneously, an authoring artifact, not real usage).

export const Icon: Story = {
  args: { trailing: 'Icon' },
};

export const IconAndText: Story = {
  name: 'Icon & Text',
  args: { trailing: 'Icon & Text' },
};

export const Switch: Story = {
  args: { trailing: 'Switch' },
};

export const Checkbox: Story = {
  args: { trailing: 'Checkbox' },
};

export const None: Story = {
  args: { trailing: 'None' },
};

// Supplementary stories demonstrating the other three real states/
// variants not covered above, plus the other two leading-media options.

export const Pressed: Story = {
  args: { trailing: 'Icon', state: 'Pressed' },
};

export const Selected: Story = {
  args: { trailing: 'Checkbox', state: 'Selected' },
};

export const Filled: Story = {
  args: { trailing: 'Icon & Text', variant: 'Filled' },
};

export const FilledCompact: Story = {
  args: { trailing: 'Icon', variant: 'Filled Compact' },
};

export const LeadingIcon: Story = {
  name: 'Leading: Icon',
  args: { trailing: 'None', showEmoji: false, showIcon: true, leadingIcon: <LeadingIconGlyph /> },
};

export const LeadingImage: Story = {
  name: 'Leading: Image',
  args: { trailing: 'None', showEmoji: false, showImage: true, leadingImage: <LeadingImagePlaceholder /> },
};
