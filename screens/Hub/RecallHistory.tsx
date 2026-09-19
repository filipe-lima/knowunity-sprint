'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { SkipForward, CheckCircle2, Mic } from 'lucide-react';

import { Scaffold } from '../../components/Scaffold/Scaffold';
import { Chips } from '../../components/Chips/Chips';
import { BucketRow } from '../../components/BucketRow/BucketRow';
import { ButtonGroup } from '../../components/ButtonGroup/ButtonGroup';
import { Button } from '../../components/Button/Button';
import { Sheet } from '../../components/Sheet/Sheet';
import { MascotSlot } from '../../components/MascotSlot/MascotSlot';
import { MascotArt } from '../../components/shared/MascotArt';
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
 *   term + source line), just with a different icon/color per section —
 *   not the 3 real `ListRow` instances this screen used for the first two
 *   sections before (wrong component for 6 of the 8 rows). **Promoted
 *   2026-09-18:** shares the same real `components/BucketRow/
 *   BucketRow.tsx` Summary and Hub also use now, instead of this screen's
 *   own separate `TermRow` copy — closing out the duplication both
 *   `eval/scorecard-01.md` and `eval/scorecard-02.md` flagged.
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
          <BucketRow
            titleSize="xs"
            icon={<SkipForward style={iconStyle} />}
            iconColor={SECTION_ICON_COLOR.skipped}
            title="Internal validity"
            subtitle="Missed last session"
          />
          <BucketRow
            titleSize="xs"
            icon={<SkipForward style={iconStyle} />}
            iconColor={SECTION_ICON_COLOR.skipped}
            title="Sampling bias"
            subtitle="Skipped last session"
          />
          <BucketRow
            titleSize="xs"
            icon={<SkipForward style={iconStyle} />}
            iconColor={SECTION_ICON_COLOR.skipped}
            title="Random assignment"
            subtitle="Skipped 3 weeks ago"
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-200)' }}>
            <SectionHeading>Said recently</SectionHeading>
            <Chips size="XS" text="22" showLeftIcon={false} showRightIcon={false} />
          </div>
          <BucketRow
            titleSize="xs"
            icon={<CheckCircle2 style={iconStyle} />}
            iconColor={SECTION_ICON_COLOR.recent}
            title="Construct validity"
            subtitle="Said unaided today"
          />
          <BucketRow
            titleSize="xs"
            icon={<CheckCircle2 style={iconStyle} />}
            iconColor={SECTION_ICON_COLOR.recent}
            title="Confounding variable"
            subtitle="Said after a hint today"
          />
          <BucketRow
            titleSize="xs"
            icon={<CheckCircle2 style={iconStyle} />}
            iconColor={SECTION_ICON_COLOR.recent}
            title="Ecological validity"
            subtitle="Said after a hint today"
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-200)' }}>
            <SectionHeading>Never said out loud</SectionHeading>
            <Chips size="XS" text="19" showLeftIcon={false} showRightIcon={false} />
          </div>
          <BucketRow
            titleSize="xs"
            icon={<Mic style={iconStyle} />}
            iconColor={SECTION_ICON_COLOR.never}
            title="Operational definition"
            subtitle="From Research Methods, read Tuesday"
          />
          <BucketRow
            titleSize="xs"
            icon={<Mic style={iconStyle} />}
            iconColor={SECTION_ICON_COLOR.never}
            title="Cell membrane"
            subtitle="From Cell biology, read last week"
          />
        </>
      }
      // Was inside middleContent's own scrollable fragment, at the tail end
      // of 8 stacked rows — meaning it scrolled away with the list instead
      // of staying reachable, unlike every other screen's real bottomContent
      // action. Moved into the slot Scaffold actually built for this.
      bottomContent={
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
      }
      showBottomSheetBackground={sheetOpen}
      bottomSheetOnly={
        sheetOpen ? (
          <>
            {/* Every other place Knowie speaks to the student carries the
                mascot — this screen inlines its own Sheet rather than
                sharing screens/CannotSpeak/CannotSpeakSheet.tsx, so it
                needed the same fix separately. */}
            <MascotSlot size="XL" crop="Full">
              <MascotArt pose="standby" />
            </MascotSlot>
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
                  cta="Back to Recall Hub"
                  onClick={() => {
                    setSheetOpen(false);
                    router.push('/hub');
                  }}
                />
              </>
            }
            />
          </>
        ) : undefined
      }
    />
  );
}
