import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Scaffold } from './Scaffold';
import { TopBar } from '../TopBar/TopBar';
import { ListRow } from '../ListRow/ListRow';
import { Button } from '../Button/Button';
import { Sheet } from '../Sheet/Sheet';

// Quoted directly from docs/design-system.md's "The scaffold" section —
// the file itself doesn't enforce any of this, which is why it's written
// down there and reproduced here rather than paraphrased.
const DESIGN_SYSTEM_ACCOUNT = `
One vertical auto-layout root, sized by its size variant, with a fixed header and four slots. All four slots stretch their child on insert, none declare a minimum or maximum, and none restrict what can be dropped in.

**Panel Header (fixed, not a slot).** Holds the status bar only. Never put content here, and never hide it to reclaim the height.

**topNavigation.** Back and close actions, the screen title, streak and counter chips, right-hand actions. Hugs its content, so it grows with what you put in it. Gate it with showTopNavSlot; do not delete the contents to hide it.

**middleContent.** The screen body, and the only slot that scrolls. It carries the screen's horizontal margins and a vertical rhythm between its direct children, both from tokens/tokens.json.

**bottomContent.** The thumb zone: the primary CTA (as a buttonGroup), the bottom navigation bar, or the chat input. One of those three, never two. It hugs its content and carries its own generous vertical padding. Gate it with showBottomNavSlot.

**bottomSheetOnly.** Sheet content and the home indicator region. Pair it with showBottomSheetBackground when the sheet needs a scrim behind it. Leave it empty on ordinary screens.

Two warnings. The scaffold's main component set is not on any page in the file; it survives only because instances point at it. And the slots' preferred-value lists are a convenience, not a constraint, so a wrong component will drop into a slot without complaint.

**Don't.** Never build a screen outside the scaffold, and never put content in the Panel Header or outside the four slots.
`.trim();

const meta = {
  title: 'Components/Scaffold',
  component: Scaffold,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: DESIGN_SYSTEM_ACCOUNT,
      },
    },
  },
} satisfies Meta<typeof Scaffold>;

export default meta;
type Story = StoryObj<typeof meta>;

// A plain screen: topNavigation (TopBar, Centered), a short middleContent
// list, and a single bottomContent action — the shape most real screens
// in this file take.
export const Default: Story = {
  args: {
    topNavigation: <TopBar variant="Centered" title="Recall Hub" />,
    middleContent: (
      <>
        <ListRow title="Research Methods" subtitle="5 terms. About 3 minutes." state="Selected" />
        <ListRow title="Cell biology" subtitle="Last practised last week" />
        <ListRow title="Statistics, section 3" subtitle="Ready to rehearse once you finish the lesson" state="Locked" />
      </>
    ),
    bottomContent: <Button variant="Primary" size="L" cta="Start Research Methods" />,
  },
};

// showTopNavSlot's real, documented gating behavior — content stays
// defined but the region collapses rather than reserving empty space.
export const NoTopNav: Story = {
  args: {
    ...Default.args,
    showTopNavSlot: false,
  },
};

// bottomSheetOnly + showBottomSheetBackground — the real, scaffold-owned
// mechanism for the Cannot-speak sheet. The scrim is a plain overlay; the
// sheet content is the real Sheet component, unmodified.
export const WithSheetOpen: Story = {
  args: {
    ...Default.args,
    showBottomSheetBackground: true,
    bottomSheetOnly: <Sheet />,
  },
};
