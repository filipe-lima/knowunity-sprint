import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { IconSlot } from './IconSlot';

// Verbatim from the Figma component set "iconSlot" (node 9003:8809, file
// u3BZUg8k5p3mrOrKAnYO5c, page "🎨 Mascot & components") — its own
// description field, unedited, library-twin NOTE included.
const FIGMA_DESCRIPTION = `
**What it is.** A sizing wrapper around one INSTANCE_SWAP property, six steps at 8 / 12 / 16 / 20 / 24 / 32px named 100 to 400. The glyph inherits text/primary from the base component.

**When to use it.** Every icon, always. Counting the library twins it is the most instantiated component in the file, and it is nested inside buttonIcon, chips and snackbar.

**Don't.** Don't resize the wrapper by hand to reach an in-between size.

**NOTE:** the library twins name this axis "Size (IGNORE)" while this set names it "size", so swapping an instance between the two loses the size setting.
`.trim();

// A plain placeholder glyph — this codebase has no built icon asset
// library yet to source a real one from (see IconSlot.tsx). Same pattern
// already used in ButtonIcon.stories.tsx.
function PlaceholderGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" aria-hidden="true">
      <path
        d="M12 4v16M4 12h16"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </svg>
  );
}

const meta = {
  title: 'Components/IconSlot',
  component: IconSlot,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: FIGMA_DESCRIPTION,
      },
    },
  },
  argTypes: {
    size: {
      control: 'radio',
      options: ['100', '150', '200', '250', '300', '400'],
    },
  },
  args: {
    children: <PlaceholderGlyph />,
  },
} satisfies Meta<typeof IconSlot>;

export default meta;
type Story = StoryObj<typeof meta>;

// One story per size — iconSlot has no state axis (it's not interactive),
// so there's no state to multiply against the way Button/ButtonIcon's
// stories do.

export const Size100: Story = {
  args: { size: '100' },
};

export const Size150: Story = {
  args: { size: '150' },
};

export const Size200: Story = {
  args: { size: '200' },
};

export const Size250: Story = {
  args: { size: '250' },
};

export const Size300: Story = {
  args: { size: '300' },
};

export const Size400: Story = {
  args: { size: '400' },
};
