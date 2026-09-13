import { collectTypeStyles } from './token-data';
import { pageStyle, captionStyle, descriptionStyle } from './page-style';

// Renders every typography.* style using its own generated CSS variables
// (font-family, font-weight, font-size, line-height, letter-spacing), in
// tokens.json's own order — largest first, which is already scale order.
//
// Known gap, not something patched here: font.weight's values ("regular",
// "semi-bold", "bold", "heavy") aren't valid CSS font-weight keywords — only
// "bold" actually is. The other three are invalid CSS and the browser
// silently falls back to normal weight for them. That's a real property of
// the generated tokens, worth fixing at the source rather than papered over
// in this story.
export function TypeScale() {
  const styles = collectTypeStyles();
  return (
    <div style={pageStyle}>
      {styles.map((style) => (
        <div
          key={style.name}
          style={{
            marginBottom: 24,
            paddingBottom: 20,
            borderBottom: '1px solid var(--color-border-default)',
          }}
        >
          <div
            style={{
              fontFamily: `var(${style.fontFamilyVar})`,
              fontWeight: `var(${style.fontWeightVar})`,
              fontSize: `var(${style.fontSizeVar})`,
              lineHeight: `var(${style.lineHeightVar})`,
              letterSpacing: `var(${style.letterSpacingVar})`,
              color: 'var(--color-text-primary)',
            }}
          >
            {style.name}
          </div>
          <div style={{ ...captionStyle, marginTop: 8 }}>
            {style.fontSizePx} / {style.lineHeightPx} line-height ·{' '}
            {style.fontWeightValue} · {style.letterSpacingPx} tracking ·{' '}
            {style.fontFamilyValue}
          </div>
          <div style={descriptionStyle}>{style.description}</div>
        </div>
      ))}
    </div>
  );
}
