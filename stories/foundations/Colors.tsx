import type { ColorGroup } from './token-data';
import { collectSemanticColorGroups, collectPrimitiveColorGroups } from './token-data';
import {
  pageStyle,
  sectionHeadingStyle,
  captionStyle,
  descriptionStyle,
} from './page-style';

const tierHeadingStyle = {
  fontSize: 20,
  fontWeight: 700,
  marginBottom: 4,
  color: 'var(--color-text-primary)',
};

const tierCaptionStyle = {
  fontSize: 12,
  color: 'var(--color-text-secondary)',
  marginBottom: 20,
  maxWidth: 640,
};

function ColorGroupSection({ group }: { group: ColorGroup }) {
  return (
    <section style={{ marginBottom: 32 }}>
      <h2 style={sectionHeadingStyle}>{group.label}</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        {group.swatches.map((swatch) => (
          <div key={swatch.cssVar} style={{ width: 176 }}>
            <div
              style={{
                background: `var(${swatch.cssVar})`,
                height: 64,
                borderRadius: 'var(--radius-200)',
                border: '1px solid var(--color-border-default)',
              }}
            />
            <div style={{ ...captionStyle, marginTop: 8 }}>{swatch.cssVar}</div>
            <div style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>
              {swatch.hex}
            </div>
            <div style={descriptionStyle}>{swatch.description}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Colors() {
  const semanticGroups = collectSemanticColorGroups();
  const primitiveGroups = collectPrimitiveColorGroups();
  return (
    <div style={pageStyle}>
      <div style={{ marginBottom: 40 }}>
        <h1 style={tierHeadingStyle}>Semantic</h1>
        <p style={tierCaptionStyle}>
          What components actually bind to — background, interactive, text,
          border, accent, feedback, highlight, mascot.
        </p>
        {semanticGroups.map((group) => (
          <ColorGroupSection key={group.key} group={group} />
        ))}
      </div>

      <div>
        <h1 style={tierHeadingStyle}>Palette (reference only)</h1>
        <p style={tierCaptionStyle}>
          The raw colors the semantic layer above points at. Per
          design-system.md&apos;s &quot;never read a primitive directly&quot;
          rule, nothing in the product binds to these directly — they exist
          so a semantic token&apos;s actual color has somewhere to come from.
        </p>
        {primitiveGroups.map((group) => (
          <ColorGroupSection key={group.key} group={group} />
        ))}
      </div>
    </div>
  );
}
