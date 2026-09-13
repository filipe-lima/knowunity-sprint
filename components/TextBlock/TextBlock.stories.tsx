import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { TextBlock } from './TextBlock';

// Verbatim from the Figma component set "textBlock" (node 9003:9039, file
// u3BZUg8k5p3mrOrKAnYO5c, page "🎨 Mascot & components") — its own
// description field, unedited, UNCONFIRMED note included.
const FIGMA_DESCRIPTION = `
**What it is.** A Header plus optional Caption, 4px apart, where the variant sets both type styles: XL is Display M 76 over Headline XS Regular 18, L is Headline XL 44 over 18, M is Body M Bold 18 over Caption M Regular 12, S is Body S Bold 15 over Caption S Regular 9. showCaption defaults to true.

**When to use it.** XL and L for screen titles, M and S for list rows and cards. UNCONFIRMED: the only textBlock instance in the file belongs to the library twin, so this is read from the type scale alone.

**Don't.** Don't treat the four variants as one smooth scale. M drops the header to 18px, the same size as the XL and L captions, so L to M changes the role rather than the size.
`.trim();

const meta = {
  title: 'Components/TextBlock',
  component: TextBlock,
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
      options: ['XL', 'L', 'M', 'S'],
    },
    title: { control: 'text' },
    caption: { control: 'text' },
    showCaption: { control: 'boolean' },
  },
  args: {
    title: 'Header',
    caption: 'Caption',
  },
} satisfies Meta<typeof TextBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

// One story per variant — textBlock has no state axis (it's static
// content, not an interactive control), so there's no state to multiply
// against the way Button/ButtonIcon's stories do.

export const XL: Story = {
  args: { variant: 'XL', title: 'Five terms today', caption: 'From Cell biology' },
};

export const L: Story = {
  args: { variant: 'L', title: 'Session summary', caption: 'Great work' },
};

export const M: Story = {
  args: { variant: 'M', title: 'Cell biology', caption: '12 terms · practiced 2d ago' },
};

export const S: Story = {
  args: { variant: 'S', title: 'Photosynthesis', caption: 'Missed last session' },
};

// showCaption's documented default is true; this is the false case, given
// its own story since it changes layout (the gap collapses, not just the
// caption's visibility).
export const NoCaption: Story = {
  args: { variant: 'M', title: 'Cell biology', showCaption: false },
};
