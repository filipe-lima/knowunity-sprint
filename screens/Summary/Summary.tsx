'use client';

import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';

import { CheckCircle2, Check, Info, SkipForward } from 'lucide-react';

import { Scaffold } from '../../components/Scaffold/Scaffold';
import { TopBar } from '../../components/TopBar/TopBar';
import { SessionHero } from '../../components/SessionHero/SessionHero';
import { XpPill } from '../../components/XpPill/XpPill';
import { IconSlot } from '../../components/IconSlot/IconSlot';
import { ButtonGroup } from '../../components/ButtonGroup/ButtonGroup';
import { Button } from '../../components/Button/Button';
import { MascotSlot } from '../../components/MascotSlot/MascotSlot';
import { MascotArt } from '../../components/shared/MascotArt';

/**
 * Screen 2 from docs/SPEC.md — Summary. Rebuilt 2026-09-16 against the real
 * Figma instances (`Summary 2 — All clear`, node `13759:45704`;
 * `Summary 3 — Continued a learning goal`, node `13759:45754`), checked
 * live via the Desktop Bridge — not a screenshot, not prose. One row per
 * resolved outcome (never a fixed 5-bucket list — that was a prior
 * session's mistake, reverted here), each carrying a real status icon and
 * XP score; `SessionHero`'s own `trailing` slot (built for exactly this,
 * per its own Storybook story) holds the session's total `XpPill`; a real
 * `TopBar` (`Centered`, "Results") header, missing before. Bottom actions:
 * the real all-clear instance has exactly ONE button ("Back to Recall,"
 * Primary/L, no `ButtonGroup`) — there is no "Try again" button on either
 * real instance, contradicting this project's own earlier assumption
 * (SPEC.md said so too, itself stale). The partial instance uses a real
 * `ButtonGroup` (Vertical, L — not M) with "Keep going, N terms left"
 * (Primary) and "Back to Recall" (Secondary).
 *
 * Row icon/color, confirmed by resolving each icon's real bound Figma
 * variable (not guessed): "Said it unaided" and "Revealed, then said back
 * unaided" share the identical check-circle icon on
 * `feedback/success/bold`; "Said it after a hint" uses a plain check on
 * `accent/blue/bold`; "Flagged for review" and "Skipped" both use
 * `text/secondary` (info-circle / skip-forward respectively). Follows
 * `components/VerdictBadge/VerdictBadge.tsx`'s existing variant→{glyph,
 * color} pattern — this project's established precedent for icon+token
 * color mapping.
 *
 * The mascot "all clear" block is not part of SessionHero's own Mascot
 * slot (genuinely empty on both real instances) — a separate, bespoke
 * block (un-componentized Figma FRAME, "all clear / NEW") with its own
 * real copy, present only when all-clear. No existing component fits this
 * shape (KnowieMessage is mascot + one message + an Actions slot that
 * defaults to real buttons — wrong shape for a no-actions block), so it's
 * built inline here from tokens — see docs/component-gaps.md.
 */
export interface SummaryResultRow {
  /** The term itself, e.g. "Construct validity". */
  term: string;
  /** What happened, e.g. "Said it unaided". Drives the row's icon/color
   *  and XP score below — must be one of the fixed outcome strings Loop
   *  produces. */
  outcome: string;
  /** True only for a dispute-confirmed "Flagged for review" outcome. */
  flagged?: boolean;
}

// Figma calls this frame `bucket / NEW` — a bespoke, un-componentized row,
// not a real ListRow instance (same distinction this project already
// draws elsewhere for un-componentized Figma content). Logged in
// docs/component-gaps.md.
function ResultRow({ icon, color, title, subtitle, score }: { icon: ReactNode; color: string; title: string; subtitle: string; score: number }) {
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
      <IconSlot size="250" color={color}>
        {icon}
      </IconSlot>
      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: '1 1 auto' }}>
        <p
          style={{
            margin: 0,
            fontFamily: 'var(--font-family-default)',
            fontWeight: 'var(--font-weight-semibold)',
            fontSize: 'var(--font-size-sm)',
            lineHeight: 'var(--font-line-height-xs)',
            letterSpacing: 'var(--font-tracking-loose)',
            color: 'var(--color-text-primary)',
          }}
        >
          {title}
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
          {subtitle}
        </p>
      </div>
      <span
        style={{
          fontFamily: 'var(--font-family-default)',
          fontWeight: 'var(--font-weight-semibold)',
          fontSize: 'var(--font-size-sm)',
          color: 'var(--color-text-primary)',
        }}
      >
        {score}
      </span>
    </div>
  );
}

// sprint-context.md's scoring table: unaided 15, hinted 8, almost-there 5,
// say-it-back-after-reveal 5, miss/reveal/skip/dispute 0. "Said it after a
// retry" (Loop's real committed-flow bare try-again) has no tier of its
// own there — grouped with "hinted" as the closest, same open judgment
// call already flagged in docs/SPEC.md's Open list.
const OUTCOME_STYLE: Record<string, { icon: ReactNode; color: string; score: number }> = {
  'Said it unaided': { icon: <CheckCircle2 style={{ width: '100%', height: '100%' }} />, color: 'var(--color-feedback-success-bold)', score: 15 },
  'Said it after a hint': { icon: <Check style={{ width: '100%', height: '100%' }} />, color: 'var(--color-accent-blue-bold)', score: 8 },
  'Said it after a retry': { icon: <Check style={{ width: '100%', height: '100%' }} />, color: 'var(--color-accent-blue-bold)', score: 8 },
  'Almost there': { icon: <Check style={{ width: '100%', height: '100%' }} />, color: 'var(--color-accent-blue-bold)', score: 5 },
  'Revealed, then said back unaided': { icon: <CheckCircle2 style={{ width: '100%', height: '100%' }} />, color: 'var(--color-feedback-success-bold)', score: 5 },
  'Flagged for review': { icon: <Info style={{ width: '100%', height: '100%' }} />, color: 'var(--color-text-secondary)', score: 0 },
  Skipped: { icon: <SkipForward style={{ width: '100%', height: '100%' }} />, color: 'var(--color-text-secondary)', score: 0 },
};

export interface SummaryProps {
  /** For the headline, "You said {termsCount} terms out loud". */
  termsCount: number;
  /** For the body, "{unaidedCount} of them without any help." — kept as
   *  a plain number to render; SPEC.md's own real copy spells it out
   *  ("Two of them...") rather than using the digit, so callers should
   *  pass the spelled-out phrase, not just a number, if they want to
   *  match that exactly. */
  unaidedSummary: string;
  results: SummaryResultRow[];
  isAllClear: boolean;
  /** Required when `isAllClear` is false — drives the primary button's
   *  "Keep going, N terms left" label. */
  remainingCount?: number;
}

export function Summary({
  termsCount,
  unaidedSummary,
  results,
  isAllClear,
  remainingCount,
}: SummaryProps) {
  const router = useRouter();

  const totalXp = results.reduce((sum, row) => sum + (OUTCOME_STYLE[row.outcome]?.score ?? 0), 0);

  return (
    <Scaffold
      topNavigation={<TopBar variant="Centered" title="Results" />}
      middleContent={
        <>
          <SessionHero
            align="Left"
            surface="None"
            eyebrow="Session done"
            headline={`You said ${termsCount} terms out loud`}
            body={unaidedSummary}
            trailing={<XpPill size="M" label={`+${totalXp} XP`} />}
          />
          {results.map((row, i) => {
            const style = OUTCOME_STYLE[row.outcome] ?? OUTCOME_STYLE.Skipped;
            return (
              <ResultRow
                key={`${row.term}-${i}`}
                icon={style.icon}
                color={style.color}
                title={row.outcome}
                subtitle={row.term}
                score={style.score}
              />
            );
          })}
          {isAllClear ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 'var(--space-200)',
                textAlign: 'center',
              }}
            >
              <MascotSlot size="XL" crop="Full">
                <MascotArt pose="approving" />
              </MascotSlot>
              <p
                style={{
                  margin: 0,
                  fontFamily: 'var(--font-family-default)',
                  fontWeight: 'var(--font-weight-bold)',
                  fontSize: 'var(--font-size-lg)',
                  lineHeight: 'var(--font-line-height-md)',
                  letterSpacing: 'var(--font-tracking-none)',
                  color: 'var(--color-text-primary)',
                }}
              >
                Nothing queued
              </p>
              <p
                style={{
                  margin: 0,
                  fontFamily: 'var(--font-family-default)',
                  fontWeight: 'var(--font-weight-regular)',
                  fontSize: 'var(--font-size-sm)',
                  lineHeight: 'var(--font-line-height-sm)',
                  letterSpacing: 'var(--font-tracking-loose)',
                  color: 'var(--color-text-secondary)',
                }}
              >
                You have said every term you finished out loud. The dot on
                Recall is off until you study something new.
              </p>
            </div>
          ) : null}
        </>
      }
      bottomContent={
        isAllClear ? (
          <Button variant="Primary" size="L" cta="Back to Recall" fill onClick={() => router.push('/hub')} />
        ) : (
          <ButtonGroup
            variant="Vertical"
            size="L"
            primary={
              <Button
                variant="Primary"
                size="L"
                cta={`Keep going, ${remainingCount} terms left`}
                fill
                onClick={() => router.push('/loop')}
              />
            }
            secondary={
              <Button variant="Secondary" size="L" cta="Back to Recall" fill onClick={() => router.push('/hub')} />
            }
          />
        )
      }
    />
  );
}
