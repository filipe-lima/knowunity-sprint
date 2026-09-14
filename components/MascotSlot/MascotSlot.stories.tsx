import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { MascotSlot } from './MascotSlot';
import { MascotArt } from '../shared/MascotArt';

// No Figma description exists on this component (its own metadata field is
// literally null) — mascotSlot predates the file's documentation pass and
// only received a "live edit" for size/crop, not a written description.
// This is docs/design-system.md's own account instead, quoted directly
// rather than presented as something Figma itself says:
const DESIGN_SYSTEM_ACCOUNT = `
No Figma description exists for this component — it predates the file's documentation pass. This is docs/design-system.md's own account instead:

**mascotSlot** for every Knowie placement in product UI. Two axes: size (XL / 2XL / 3XL / 4XL) and, as of 11 September, crop (Full / Peek). Peek is the clipped window used when Knowie sits above the recall card mid-loop (what "knowie peek / NEW" used to be as its own hand-built frame — it no longer needs to exist separately). The pose is still an instance-level swap that no property tracks: a pose property was attempted and could not be wired through this session's tooling, so if a screen depends on a specific expression, say so in the annotation rather than assuming the component carries it. One caveat: size=XL, crop=Peek is currently a no-op — XL's native height already equals the crop height, so there's nothing to crop. If XL needs a real peek effect, that's a design decision still to make, not a build gap.

**Not independently confirmed in this build:** checked the live Figma component three ways (the component set's own property list, and each of the four size variants' own properties) and none show a "crop" axis actually wired today — only "size" is real and live. "crop" below is implemented from this written account, using the one concrete number it gives (crop height = XL's own height), not from a confirmed Figma property.
`.trim();

// A plain placeholder — no real Knowie artwork asset exists in this
// codebase (it's a multi-layer illustration with its own pose-swap
// property in Figma). Same resolution as every icon slot so far.
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
  title: 'Components/MascotSlot',
  component: MascotSlot,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: DESIGN_SYSTEM_ACCOUNT,
      },
    },
  },
  argTypes: {
    size: {
      control: 'radio',
      options: ['XL', '2XL', '3XL', '4XL'],
    },
    crop: {
      control: 'radio',
      options: ['Full', 'Peek'],
    },
  },
  args: {
    children: <MascotPlaceholder />,
  },
} satisfies Meta<typeof MascotSlot>;

export default meta;
type Story = StoryObj<typeof meta>;

// One story per size — these are the four real, confirmed Figma variants
// — at the documented default, crop="Full".

export const XL: Story = {
  args: { size: 'XL', crop: 'Full' },
};

export const TwoXL: Story = {
  args: { size: '2XL', crop: 'Full' },
};

export const ThreeXL: Story = {
  args: { size: '3XL', crop: 'Full' },
};

export const FourXL: Story = {
  args: { size: '4XL', crop: 'Full' },
};

// Two supplementary stories for the documented (but Figma-unconfirmed)
// crop behavior: the specific no-op case design-system.md calls out, and
// one size where the clip is actually visible.

export const XLPeek: Story = {
  name: 'XL, Peek (documented no-op)',
  args: { size: 'XL', crop: 'Peek' },
};

export const TwoXLPeek: Story = {
  name: '2XL, Peek',
  args: { size: '2XL', crop: 'Peek' },
};

// The real Knowie artwork (components/shared/MascotArt), not the
// placeholder circle every story above still uses deliberately (those
// exist to demonstrate size/crop mechanics, not artwork) — see
// MascotArt's own doc comment for where these two poses came from.

export const RealArtworkStandby: Story = {
  name: 'Real artwork — standby',
  args: { size: '3XL', crop: 'Full', children: <MascotArt pose="standby" /> },
};

export const RealArtworkApproving: Story = {
  name: 'Real artwork — approving',
  args: { size: '3XL', crop: 'Full', children: <MascotArt pose="approving" /> },
};
