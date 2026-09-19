'use client';

import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';

import { CheckCircle2, Check, Info, SkipForward } from 'lucide-react';

import { Scaffold } from '../../components/Scaffold/Scaffold';
import { TopBar } from '../../components/TopBar/TopBar';
import { SessionHero } from '../../components/SessionHero/SessionHero';
import { XpPill } from '../../components/XpPill/XpPill';
import { BucketRow } from '../../components/BucketRow/BucketRow';
import { ButtonGroup } from '../../components/ButtonGroup/ButtonGroup';
import { Button } from '../../components/Button/Button';
import { MascotSlot } from '../../components/MascotSlot/MascotSlot';
import { MascotArt } from '../../components/shared/MascotArt';

/**
 * Screen 2 from docs/SPEC.md — Summary. Rebuilt 2026-09-16 against the real
 * Figma instances (`Summary 2 — All clear`, node `13759:45704`;
 * `Summary 3 — Continued a learning goal`, node `13759:45754`), checked
 * live via the Desktop Bridge — not a screenshot, not prose. **Updated
 * 2026-09-18, on direct request, superseding this comment's own earlier
 * "one row per resolved outcome" line:** rows are now grouped by outcome
 * (at most 4 — unaided/hint/flagged/skipped — never a term-name list),
 * each a bare count and that bucket's summed score. Both real frames still
 * show one row per term; this is a deliberate departure, same category as
 * the button-order override below, not an unnoticed drift — see
 * `OUTCOME_ORDER`'s own comment further down. Each row carries a real
 * status icon and XP score; `SessionHero`'s own `trailing` slot (built for
 * exactly this,
 * per its own Storybook story) holds the session's total `XpPill`; a real
 * `TopBar` (`Centered`, "Results") header, missing before. Bottom actions:
 * the real all-clear instance has exactly ONE button ("Back to Recall,"
 * Primary/L, no `ButtonGroup`) — there is no "Try again" button on either
 * real instance, contradicting this project's own earlier assumption
 * (SPEC.md said so too, itself stale). The partial instance uses a real
 * `ButtonGroup` (Vertical, L — not M). **Updated 2026-09-17, on direct
 * request, overriding this file's own real instance:** "Back to Recall"
 * is now Primary (and sits on top, per `ButtonGroup` Vertical's own
 * "primary above secondary" rule), "Keep going, N terms left" is now
 * Secondary — the real committed Figma frame (node `13759:45754`) still
 * has them the other way around; this is a deliberate departure, pushed
 * back into that frame too (`COMMITED FLOW FINAL WITHOUT COMPONENTS`),
 * not an unnoticed drift. See `docs/sprint-context.md` and
 * `docs/SPEC.md` §2 for the same note.
 *
 * Row icon/color, confirmed by resolving each icon's real bound Figma
 * variable (not guessed): "Said it unaided" uses a check-circle icon on
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

// Score rendering shared by every BucketRow instance below — kept local
// since only this screen needs a numeric trailing value styled this way.
function ScoreTrailing({ score }: { score: number }) {
  return (
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
  );
}

// Exactly 4 real outcomes, matching the current mechanic: multiple attempts
// on a miss are always available, but only one hint ever. Resolved
// 2026-09-18: a hint-less retry scores and reads identically to a hinted
// pass (was previously its own "Said it after a retry" tier, an open
// judgment call in docs/SPEC.md — now closed). "Almost there" and
// "Revealed, then said back unaided" are gone too — the first was never
// actually reachable (Loop's outcomeRow() never records a bare Almost as
// a terminal outcome), and the second belonged to the "Reveal" flow
// removed entirely from the app.
//
// Exported so screens/Loop/Loop.tsx can show the same score on its own
// Success verdict's XpPill instead of duplicating these numbers — the
// same "don't hand-type a fact that already lives elsewhere" fix already
// applied to Hub/Recall history's term counts.
export const OUTCOME_SCORE: Record<string, number> = {
  'Said it unaided': 15,
  'Said it after a hint': 8,
  'Flagged for review': 0,
  Skipped: 0,
};

const OUTCOME_STYLE: Record<string, { icon: ReactNode; color: string; score: number }> = {
  'Said it unaided': { icon: <CheckCircle2 style={{ width: '100%', height: '100%' }} />, color: 'var(--color-feedback-success-bold)', score: OUTCOME_SCORE['Said it unaided'] },
  'Said it after a hint': { icon: <Check style={{ width: '100%', height: '100%' }} />, color: 'var(--color-accent-blue-bold)', score: OUTCOME_SCORE['Said it after a hint'] },
  'Flagged for review': { icon: <Info style={{ width: '100%', height: '100%' }} />, color: 'var(--color-text-secondary)', score: OUTCOME_SCORE['Flagged for review'] },
  Skipped: { icon: <SkipForward style={{ width: '100%', height: '100%' }} />, color: 'var(--color-text-secondary)', score: OUTCOME_SCORE.Skipped },
};

// Resolved 2026-09-18, on direct request: Summary groups rows by outcome
// instead of showing one per term — at most 4 cards, each a bare count
// ("2 terms") and that bucket's summed score, never term names. A
// deliberate departure from the real committed Figma frames (`Summary 2`,
// node `13759:45704`; `Summary 3`, node `13759:45754`), which show one row
// per term — same category of override as the Primary/Secondary button
// swap above, pushed back into Figma too where reachable. This fixed order
// keeps row order stable regardless of which term hit which outcome first.
const OUTCOME_ORDER = ['Said it unaided', 'Said it after a hint', 'Flagged for review', 'Skipped'] as const;

export interface SummaryProps {
  /** The topic this session was actually played on — carried through so
   *  "Keep going" resumes the same topic instead of silently falling back
   *  to research-methods (docs/SPEC.md's Open item #12). */
  topic: string;
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
}

export function Summary({
  topic,
  termsCount,
  unaidedSummary,
  results,
  isAllClear,
}: SummaryProps) {
  const router = useRouter();

  const totalXp = results.reduce((sum, row) => sum + (OUTCOME_STYLE[row.outcome]?.score ?? 0), 0);

  // On direct request: the all-clear closing line now reacts to what
  // actually happened this session instead of a fixed sentence — and
  // drops "The dot on Recall is off until you study something new."
  // unconditionally, in every branch.
  const flaggedCount = results.filter((row) => row.outcome === 'Flagged for review').length;
  const skippedCount = results.filter((row) => row.outcome === 'Skipped').length;
  const allClearBody = (() => {
    const base = 'You have said every term you finished out loud.';
    if (flaggedCount === 0 && skippedCount === 0) return base;
    const parts: string[] = [];
    if (flaggedCount > 0) parts.push(`${flaggedCount} ${flaggedCount === 1 ? 'is' : 'are'} flagged for review`);
    if (skippedCount > 0) parts.push(`${skippedCount} ${skippedCount === 1 ? 'was' : 'were'} skipped`);
    return `${base} ${parts.join(', ')}.`;
  })();

  return (
    <Scaffold
      // Deliberately no back control, unlike Hub/Recall history's labeled
      // ScaffoldHeader or Loop's own TopBar chevron — this is a terminal
      // screen reached only after a session actually ends, and there's no
      // real "back" destination that would make sense (Loop is already
      // finished; going back to it mid-completed-session isn't a real
      // state). The two real exits are the bottom actions below ("Back to
      // Recall" / "Keep going"), not a header control. Stated here so this
      // reads as a deliberate choice, not an unexplained omission.
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
          {OUTCOME_ORDER.map((outcome) => {
            const count = results.filter((row) => row.outcome === outcome).length;
            if (count === 0) return null;
            const style = OUTCOME_STYLE[outcome];
            return (
              <BucketRow
                key={outcome}
                icon={style.icon}
                iconColor={style.color}
                title={outcome}
                subtitle={`${count} term${count === 1 ? '' : 's'}`}
                trailing={<ScoreTrailing score={style.score * count} />}
              />
            );
          })}
          {isAllClear ? (
            // Was a hand-rolled div + two <p> tags, sitting directly on
            // background/page with no card — every BucketRow above it
            // sits on background/surface. SessionHero's own Center/Card
            // story is already built for exactly this moment (named
            // 'Center, Card (all-clear)') and SessionHero is already
            // imported and used once above (line ~181) — reached for a
            // second time here instead of re-inventing it from tokens.
            <SessionHero
              align="Center"
              surface="Card"
              showEyebrow={false}
              headline="Nothing queued"
              body={allClearBody}
              mascot={
                <MascotSlot size="XL" crop="Full">
                  <MascotArt pose="approving" />
                </MascotSlot>
              }
            />
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
              <Button variant="Primary" size="L" cta="Back to Recall" fill onClick={() => router.push('/hub')} />
            }
            secondary={
              <Button
                variant="Secondary"
                size="L"
                // Relabeled 2026-09-19: this restarts the whole topic from
                // its first term (Loop always begins a session at
                // termIndex 0) — it doesn't resume only the remaining
                // terms, so the label no longer promises a count this
                // button can't actually honor.
                cta="Practice this topic again"
                fill
                onClick={() => router.push(`/loop?topic=${topic}`)}
              />
            }
          />
        )
      }
    />
  );
}
