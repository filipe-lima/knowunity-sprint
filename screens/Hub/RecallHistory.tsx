'use client';

import { useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';

import { SkipForward, CheckCircle2, Mic } from 'lucide-react';

import { Scaffold } from '../../components/Scaffold/Scaffold';
import { Chips } from '../../components/Chips/Chips';
import { IconSlot } from '../../components/IconSlot/IconSlot';
import { ButtonGroup } from '../../components/ButtonGroup/ButtonGroup';
import { Button } from '../../components/Button/Button';
import { Sheet } from '../../components/Sheet/Sheet';
import { ScaffoldHeader } from '../../components/ScaffoldHeader/ScaffoldHeader';
import { TOPIC_TERMS } from '../Loop/script';

/**
 * Recall history — the other half of screen 3 (`Extra 6 — Your terms`,
 * node `13759:45818`, "Final flow" page). Restored 2026-09-16 after an
 * earlier session deleted this screen as believed out-of-scope — Hub's
 * own real "Everything you've said" row links directly here, so the
 * deletion broke a real, connected part of the flow rather than trimming
 * unused scope.
 *
 * **Re-checked live 2026-09-16** (copy + type sizes, on direct request)
 * against the same node, precisely this time:
 *
 * - **All three sections use the same bespoke row** — not just "Never
 *   said out loud". Figma's own layer name for every row is the
 *   un-componentized `bucket / NEW` frame family (real `iconSlot` glyph +
 *   term + source line), just with a different icon/color per section.
 *   Reproduced below as one `TermRow` local component, not the 3 real
 *   `ListRow` instances this screen used for the first two sections
 *   before — wrong component for 6 of the 8 rows.
 * - **Two copy corrections**, both stale Figma *layer* names vs. the real
 *   rendered characters: the first section's real heading is "Skipped,"
 *   not "Due again"; Random assignment's real subtitle is "Skipped 3
 *   weeks ago," not "Said 3 weeks ago".
 * - **Section headers are real 21px Bold** (`--font-size-lg`) — `TextBlock`
 *   was used before, but none of its 4 real variants hit 21px Bold
 *   (checked all: XL 76px, L 44px, M 18px SemiBold, S 15px SemiBold), so
 *   it doesn't fit here at all, not just a wrong prop. Rendered as a
 *   plain `<h3>` styled directly instead — see docs/component-gaps.md.
 * - **Every row's title and subtitle are both real 12px**
 *   (`--font-size-xs`), differentiated only by weight/color, not size —
 *   the previous build used `--font-size-sm` (15px) for titles. Same fix
 *   for the body paragraph, also real 12px, not 15px.
 */
// `skipped` was `accent-coral-bold` with a Loader2 (loading-spinner) glyph
// — coral is Miss's own color elsewhere, and Loader2 reads as "in
// progress," neither of which is what "skipped" means. Summary.tsx's own
// OUTCOME_STYLE already draws "Skipped" as SkipForward on text-secondary;
// matched here so the same outcome reads the same way on both screens.
const SECTION_ICON_COLOR = {
  skipped: 'var(--color-text-secondary)',
  recent: 'var(--color-feedback-success-bold)',
  never: 'var(--color-text-secondary)',
} as const;

function SectionHeading({ children }: { children: string }) {
  return (
    <h3
      style={{
        margin: 0,
        fontFamily: 'var(--font-family-default)',
        fontWeight: 'var(--font-weight-bold)',
        fontSize: 'var(--font-size-lg)',
        lineHeight: 'var(--font-line-height-lg)',
        letterSpacing: 'var(--font-tracking-tight)',
        color: 'var(--color-text-primary)',
      }}
    >
      {children}
    </h3>
  );
}

function TermRow({ icon, iconColor, term, source }: { icon: ReactNode; iconColor: string; term: string; source: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        boxSizing: 'border-box',
        gap: 'var(--space-300)',
        padding: 'var(--space-300)',
        borderRadius: 'var(--radius-400)',
        background: 'var(--color-background-surface)',
      }}
    >
      <IconSlot size="250" color={iconColor}>
        {icon}
      </IconSlot>
      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: '1 1 auto' }}>
        <p
          style={{
            margin: 0,
            fontFamily: 'var(--font-family-default)',
            fontWeight: 'var(--font-weight-semibold)',
            fontSize: 'var(--font-size-xs)',
            lineHeight: 'var(--font-line-height-xs)',
            letterSpacing: 'var(--font-tracking-loose)',
            color: 'var(--color-text-primary)',
          }}
        >
          {term}
        </p>
        <p
          style={{
            margin: 0,
            fontFamily: 'var(--font-family-default)',
            fontWeight: 'var(--font-weight-regular)',
            fontSize: 'var(--font-size-xs)',
            lineHeight: 'var(--font-line-height-xs)',
            letterSpacing: 'var(--font-tracking-loose)',
            color: 'var(--color-text-secondary)',
          }}
        >
          {source}
        </p>
      </div>
    </div>
  );
}

const BODY_COPY =
  '47 terms you have met, and where each one stands now. Saying a term once is not the same as knowing it, so this shows when, not whether.';

export function RecallHistory() {
  const router = useRouter();
  const [sheetOpen, setSheetOpen] = useState(false);

  const iconStyle = { width: '100%', height: '100%' };

  return (
    <Scaffold
      topNavigation={<ScaffoldHeader title="Recall history" onBack={() => router.push('/hub')} />}
      middleContent={
        <>
          <p
            style={{
              margin: 0,
              fontFamily: 'var(--font-family-default)',
              fontWeight: 'var(--font-weight-regular)',
              fontSize: 'var(--font-size-xs)',
              lineHeight: 'var(--font-line-height-xs)',
              letterSpacing: 'var(--font-tracking-loose)',
              color: 'var(--color-text-secondary)',
            }}
          >
            {BODY_COPY}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-200)' }}>
            <SectionHeading>Skipped</SectionHeading>
            <Chips size="XS" active text="6" showLeftIcon={false} showRightIcon={false} />
          </div>
          <TermRow
            icon={<SkipForward style={iconStyle} />}
            iconColor={SECTION_ICON_COLOR.skipped}
            term="Internal validity"
            source="Missed last session"
          />
          <TermRow
            icon={<SkipForward style={iconStyle} />}
            iconColor={SECTION_ICON_COLOR.skipped}
            term="Sampling bias"
            source="Skipped last session"
          />
          <TermRow
            icon={<SkipForward style={iconStyle} />}
            iconColor={SECTION_ICON_COLOR.skipped}
            term="Random assignment"
            source="Skipped 3 weeks ago"
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-200)' }}>
            <SectionHeading>Said recently</SectionHeading>
            <Chips size="XS" text="22" showLeftIcon={false} showRightIcon={false} />
          </div>
          <TermRow
            icon={<CheckCircle2 style={iconStyle} />}
            iconColor={SECTION_ICON_COLOR.recent}
            term="Construct validity"
            source="Said unaided today"
          />
          <TermRow
            icon={<CheckCircle2 style={iconStyle} />}
            iconColor={SECTION_ICON_COLOR.recent}
            term="Confounding variable"
            source="Said after a hint today"
          />
          <TermRow
            icon={<CheckCircle2 style={iconStyle} />}
            iconColor={SECTION_ICON_COLOR.recent}
            term="Ecological validity"
            source="Said after a hint today"
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-200)' }}>
            <SectionHeading>Never said out loud</SectionHeading>
            <Chips size="XS" text="19" showLeftIcon={false} showRightIcon={false} />
          </div>
          <TermRow
            icon={<Mic style={iconStyle} />}
            iconColor={SECTION_ICON_COLOR.never}
            term="Operational definition"
            source="From Research Methods, read Tuesday"
          />
          <TermRow
            icon={<Mic style={iconStyle} />}
            iconColor={SECTION_ICON_COLOR.never}
            term="Cell membrane"
            source="From Cell biology, read last week"
          />

          <ButtonGroup
            variant="Vertical"
            size="M"
            primary={
              <Button
                variant="Primary"
                size="M"
                // Was hand-typed '6', disagreeing with Hub's own hand-typed
                // '3 terms' badge for the identical bucket — both now read
                // from the same real script data.
                cta={`Say the ${TOPIC_TERMS['terms-you-missed'].length} that are due`}
                fill
                onClick={() => router.push('/loop?topic=terms-you-missed')}
              />
            }
            secondary={
              <Button
                variant="Secondary"
                size="M"
                cta="I can't speak right now"
                fill
                onClick={() => setSheetOpen(true)}
              />
            }
          />
        </>
      }
      showBottomSheetBackground={sheetOpen}
      bottomSheetOnly={
        sheetOpen ? (
          <Sheet
            actions={
              <>
                <Button
                  variant="Primary"
                  size="L"
                  cta="Yes, let me type"
                  onClick={() => router.push('/loop?topic=terms-you-missed&mode=text')}
                />
                <Button
                  variant="Tertiary"
                  size="M"
                  cta="No, back to home"
                  onClick={() => setSheetOpen(false)}
                />
              </>
            }
          />
        ) : undefined
      }
    />
  );
}
