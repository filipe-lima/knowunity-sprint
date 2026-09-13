import { collectSpacingSteps } from './token-data';
import { pageStyle, captionStyle, descriptionStyle } from './page-style';

// Negative space tokens (offsets, not sizes) are left out — see
// token-data.ts's collectSpacingSteps.
export function SpacingScale() {
  const steps = collectSpacingSteps();
  return (
    <div style={pageStyle}>
      {steps.map((step) => (
        <div
          key={step.name}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginBottom: 14,
          }}
        >
          <div
            style={{
              width: `var(${step.cssVar})`,
              height: 16,
              flexShrink: 0,
              background: 'var(--color-interactive-primary-default)',
              borderRadius: 'var(--radius-100)',
            }}
          />
          <div style={{ ...captionStyle, width: 150, flexShrink: 0 }}>
            {step.cssVar}
          </div>
          <div style={{ fontSize: 12, width: 56, flexShrink: 0 }}>
            {step.display}
          </div>
          <div style={descriptionStyle}>{step.description}</div>
        </div>
      ))}
    </div>
  );
}
