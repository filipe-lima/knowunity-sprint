import { collectRadiusSteps } from './token-data';
import { pageStyle, captionStyle, descriptionStyle } from './page-style';

export function RadiusScale() {
  const steps = collectRadiusSteps();
  return (
    <div style={{ ...pageStyle, display: 'flex', flexWrap: 'wrap', gap: 24 }}>
      {steps.map((step) => (
        <div key={step.name} style={{ width: 140 }}>
          <div
            style={{
              width: 80,
              height: 80,
              background: 'var(--color-interactive-primary-default)',
              borderRadius: `var(${step.cssVar})`,
            }}
          />
          <div style={{ ...captionStyle, marginTop: 8 }}>{step.cssVar}</div>
          <div style={{ fontSize: 12 }}>{step.display}</div>
          <div style={descriptionStyle}>{step.description}</div>
        </div>
      ))}
    </div>
  );
}
