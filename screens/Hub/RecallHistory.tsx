'use client';

import { useRouter } from 'next/navigation';

import { SkipForward, CheckCircle2, Mic } from 'lucide-react';

import { Scaffold } from '../../components/Scaffold/Scaffold';
import { Chips } from '../../components/Chips/Chips';
import { BucketRow } from '../../components/BucketRow/BucketRow';
import { ScaffoldHeader } from '../../components/ScaffoldHeader/ScaffoldHeader';

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
 *
 * **Bottom actions removed entirely, 2026-09-19,** on direct request —
 * "Say the N that are due" and "I can't speak right now" both had a real
 * destination that's already reachable elsewhere: Hub's own "Terms you
 * missed" row already routes to `/loop?topic=terms-you-missed` directly,
 * and once there, Loop's own Idle-state escape button covers text mode
 * the same way it does for every other topic. Neither became unreachable,
 * just no longer duplicated on this screen too.
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

// Section rows as real data, not hand-typed JSX — each heading's count
// badge reads off the same array's .length that renders the rows below
// it, so the number can never disagree with what's actually shown again
// (it used to: "Skipped" read "6" beside 3 rendered rows, "Said recently"
// read "22" beside 3, "Never said out loud" read "19" beside 2).
const SKIPPED_TERMS = [
  { title: 'Internal validity', subtitle: 'Missed last session' },
  { title: 'Sampling bias', subtitle: 'Skipped last session' },
  { title: 'Random assignment', subtitle: 'Skipped 3 weeks ago' },
];

const SAID_RECENTLY_TERMS = [
  { title: 'Construct validity', subtitle: 'Said unaided today' },
  { title: 'Confounding variable', subtitle: 'Said after a hint today' },
  { title: 'Ecological validity', subtitle: 'Said after a hint today' },
];

const NEVER_SAID_TERMS = [
  { title: 'Operational definition', subtitle: 'From Research Methods, read Tuesday' },
  { title: 'Cell membrane', subtitle: 'From Cell biology, read last week' },
];

export function RecallHistory() {
  const router = useRouter();

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
            <Chips size="XS" active text={String(SKIPPED_TERMS.length)} showLeftIcon={false} showRightIcon={false} />
          </div>
          {SKIPPED_TERMS.map((term) => (
            <BucketRow
              key={term.title}
              titleSize="xs"
              icon={<SkipForward style={iconStyle} />}
              iconColor={SECTION_ICON_COLOR.skipped}
              title={term.title}
              subtitle={term.subtitle}
            />
          ))}

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-200)' }}>
            <SectionHeading>Said recently</SectionHeading>
            <Chips size="XS" text={String(SAID_RECENTLY_TERMS.length)} showLeftIcon={false} showRightIcon={false} />
          </div>
          {SAID_RECENTLY_TERMS.map((term) => (
            <BucketRow
              key={term.title}
              titleSize="xs"
              icon={<CheckCircle2 style={iconStyle} />}
              iconColor={SECTION_ICON_COLOR.recent}
              title={term.title}
              subtitle={term.subtitle}
            />
          ))}

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-200)' }}>
            <SectionHeading>Never said out loud</SectionHeading>
            <Chips size="XS" text={String(NEVER_SAID_TERMS.length)} showLeftIcon={false} showRightIcon={false} />
          </div>
          {NEVER_SAID_TERMS.map((term) => (
            <BucketRow
              key={term.title}
              titleSize="xs"
              icon={<Mic style={iconStyle} />}
              iconColor={SECTION_ICON_COLOR.never}
              title={term.title}
              subtitle={term.subtitle}
            />
          ))}
        </>
      }
    />
  );
}
