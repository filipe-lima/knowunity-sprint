import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { ButtonGroup } from './ButtonGroup';
import { Button } from '../Button/Button';
import { ButtonIcon } from '../ButtonIcon/ButtonIcon';

// Quoted directly from docs/design-system.md.
const DESIGN_SYSTEM_ACCOUNT = `
**buttonGroup** for the bottom action block, in the bottomContent slot. It is the only sanctioned way to put two actions side by side. Horizontal holds a buttonIcon then a button. Vertical holds two buttons, primary above secondary. Do not assemble a group by hand out of loose buttons.

Confirmed against all four real variants directly (Horizontal/Vertical × M/L): Vertical's two children are always Primary then Secondary buttons; Horizontal's are a Secondary buttonIcon then a Primary button. Real item spacing: Vertical/M is 0 (the two buttons sit flush); Vertical/L is Space/200; Horizontal/M is Space/100; Horizontal/L is Space/200. Every real button child fills the full row width (confirmed via layoutSizingHorizontal on Hub's own instance) — reproduced below via Button's own new \`fill\` prop, not something this component can force from outside.
`.trim();

// This codebase has no built icon asset library — same resolution as
// every other icon slot so far (ButtonIcon's own stories use the same
// placeholder shape).
function PlaceholderGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" aria-hidden="true">
      <path d="M12 4v16M4 12h16" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}

const meta = {
  title: 'Components/ButtonGroup',
  component: ButtonGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: DESIGN_SYSTEM_ACCOUNT,
      },
    },
  },
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

// The real Recall Hub / Summary shape: Vertical, size M, a Primary/M CTA
// above a Secondary/M action — matches the real instance exactly.
export const VerticalM: Story = {
  args: {
    variant: 'Vertical',
    size: 'M',
    primary: <Button variant="Primary" size="M" cta="Start Research Methods" fill />,
    secondary: <Button variant="Secondary" size="M" cta="I can't speak right now" fill />,
  },
};

export const VerticalL: Story = {
  args: {
    variant: 'Vertical',
    size: 'L',
    primary: <Button variant="Primary" size="L" cta="Continue" fill />,
    secondary: <Button variant="Secondary" size="L" cta="Try again" fill />,
  },
};

export const HorizontalM: Story = {
  args: {
    variant: 'Horizontal',
    size: 'M',
    icon: (
      <ButtonIcon variant="Secondary" size="M" icon={<PlaceholderGlyph />} aria-label="Add" />
    ),
    primary: <Button variant="Primary" size="M" cta="Continue" fill />,
  },
};

export const HorizontalL: Story = {
  args: {
    variant: 'Horizontal',
    size: 'L',
    icon: (
      <ButtonIcon variant="Secondary" size="L" icon={<PlaceholderGlyph />} aria-label="Add" />
    ),
    primary: <Button variant="Primary" size="L" cta="Continue" fill />,
  },
};
