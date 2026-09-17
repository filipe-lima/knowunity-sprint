import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { MessageCircle, Search, PlusCircle, FileQuestion, Trophy } from 'lucide-react';

import { Navbar } from './Navbar';
import { Avatar } from '../Avatar/Avatar';

const DESIGN_SYSTEM_ACCOUNT = `
Read from the real Figma "Navbar" component, found via the Desktop Bridge connection inside \`Home E — Knowie's message\` while building the Home screen — this project's first real usage.

**States and options.** Confirmed real componentProperties on the one instance checked: Scrim (boolean, false here), # of tabs (5), Border (No). Composed of 5 real Navigation Button instances (Icon, Has Label — false on every real tab here, Label, State — Active/Inactive) plus a trailing Avatar.

**What each state means.** Active uses interactive/primary (mapped to --color-interactive-primary-default); Inactive uses text/secondary. One real tab (trophy-02) resolved to a Figma variable (palette/blue/tint) with no match in this codebase's tokens at all — exposed as an optional per-tab \`color\` override rather than baked into the component, since it may be a Figma authoring mistake, not a deliberate signal.

**Not fully confirmed.** Only the 5-tab real instance was checked; \`# of tabs\` being a real Figma property suggests other counts may exist but aren't confirmed here.

**When to reach for it.** The bottom-most element of a full app screen — confirmed real usage: Home.
`.trim();

const meta = {
  title: 'Components/Navbar',
  component: Navbar,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: DESIGN_SYSTEM_ACCOUNT,
      },
    },
  },
} satisfies Meta<typeof Navbar>;

export default meta;
type Story = StoryObj<typeof meta>;

const ICON_STYLE = { width: '100%', height: '100%' };

// The real 5-tab instance, first tab Active — matches Home's own usage.
export const FiveTabs: Story = {
  args: {
    tabs: [
      { icon: <MessageCircle style={ICON_STYLE} />, state: 'Active', 'aria-label': 'My AI chat' },
      { icon: <Search style={ICON_STYLE} />, state: 'Inactive', 'aria-label': 'Search' },
      { icon: <PlusCircle style={ICON_STYLE} />, state: 'Inactive', 'aria-label': 'Add' },
      { icon: <FileQuestion style={ICON_STYLE} />, state: 'Inactive', 'aria-label': 'Quiz' },
      {
        icon: <Trophy style={ICON_STYLE} />,
        state: 'Inactive',
        'aria-label': 'Trophy',
        // The one confirmed real anomaly — see the component's own doc
        // comment. Reproduced here since this story matches the real
        // instance exactly.
        color: 'var(--color-accent-blue-on-subtle)',
      },
    ],
    avatar: (
      <Avatar type="Initial" size="Large" shape="Circle" initials="H" aria-label="Your profile" />
    ),
  },
};
