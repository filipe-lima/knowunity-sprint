import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn } from 'storybook/test';

import { ScaffoldHeader } from './ScaffoldHeader';

const DESIGN_SYSTEM_ACCOUNT = `
Promoted 2026-09-17 from \`screens/Hub/ScaffoldHeader.tsx\`, shared by two real screens (\`RecallHub\`, \`RecallHistory\`) — this file's own promotion rule for anything built inline that a second screen needs.

Not a real Figma component of its own. \`docs/design-system.md\`: "if the header sits on a static screen, use a plain row in the slot instead" — a bare \`buttonIcon\` next to a centered title, no \`appBar\`/\`TopBar\` involved.

**Live-checked against Hub C's real \`appBar\` instance on promotion:** its real back icon (\`arrow-left\`) sits in a real 48×48 button — exactly \`ButtonIcon\` Tertiary/M's own real size — and its real title text is 15px SemiBold, exactly this component's own type. Both already matched before promotion. The one deliberate divergence: appBar's real layout is left-aligned (icon then text); this component centers the title independent of the button instead, matching \`design-system.md\`'s own rule for a static screen.

**When to reach for it.** A static (non-scrolling) screen's top navigation that needs a back action plus a centered title — \`Hub\`, \`Recall history\`.
`.trim();

const meta = {
  title: 'Components/ScaffoldHeader',
  component: ScaffoldHeader,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: DESIGN_SYSTEM_ACCOUNT,
      },
    },
  },
} satisfies Meta<typeof ScaffoldHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Recall hub',
    onBack: fn(),
  },
  play: async ({ args, canvas }) => {
    const backButton = canvas.getByLabelText('Back');
    await backButton.click();
    await expect(args.onBack).toHaveBeenCalledTimes(1);
  },
};
