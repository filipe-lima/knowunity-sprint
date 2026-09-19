'use client';

import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';

import { Brain, GraduationCap, Plus, List, ChevronRight } from 'lucide-react';

import { Scaffold } from '../../components/Scaffold/Scaffold';
import { BucketRow } from '../../components/BucketRow/BucketRow';
import { IconSlot } from '../../components/IconSlot/IconSlot';
import { Button } from '../../components/Button/Button';
import { ScaffoldHeader } from '../../components/ScaffoldHeader/ScaffoldHeader';
import { TOPIC_LABELS, type TopicSlug } from '../Loop/script';

/**
 * Recall Hub — reverted 2026-09-16 back to this project's very first real
 * build of this screen. An earlier session in between replaced this with
 * a single-proposal `SessionHero` confirm card, reasoning that
 * `sprint-context.md`'s "not a picker" decision should override the real
 * `Hub C — The queue` Figma frame (node `13759:45277`) — but re-checked
 * live against that node directly (Desktop Bridge, not a screenshot) at
 * the user's direct correction, the real frame is unambiguous, and it's
 * what the user expects. This is the same "written decision was stale,
 * live Figma is current" pattern already found and corrected this session
 * for Loop's CTA buttons and Summary's row structure — `sprint-context.md`
 * updated to match, not treated as still-binding prose.
 *
 * None of the 7 real rows here are `ListRow` instances — Figma's own
 * layer names are the bespoke `row / NEW` family (same un-componentized
 * pattern Summary's and Recall history's own rows used to hand-roll
 * separately too), each with its own leading icon/emoji, title/subtitle,
 * and a trailing element that varies per row (a `chips` badge, a real
 * `button`, or a bare chevron) — not forced into `ListRow`. **Promoted
 * 2026-09-18:** all three screens' local copies of this shape now share
 * one real `components/BucketRow/BucketRow.tsx`, closing out the
 * duplication both `eval/scorecard-01.md` and `eval/scorecard-02.md`
 * flagged. See docs/component-gaps.md.
 *
 * The four topic rows (Research Methods/Cell biology/Legal studies/Terms
 * you missed) used to be a select-then-Start picker: tapping a row only
 * moved an "Up next" badge onto it, and a separate bottom button did the
 * actual navigating, acting on whatever was selected — not necessarily
 * what was just tapped. **Collapsed to single-tap-start, 2026-09-19,**
 * after a real user test session: the tester tapped a row expecting it to
 * open, it didn't, and they ended up starting whatever was already
 * selected by default instead. That two-step model was never a confirmed
 * Figma spec to begin with (the one real frame only captures Research
 * Methods' selected state) — it was carried over from this screen's first
 * implementation as an inference, not a locked decision, so nothing here
 * is being overridden. Each row now navigates immediately, the same
 * `onActivate` mechanism "Everything you've said" already used below.
 * "Terms you missed" stays selectable — each of the 4 topics has real,
 * playable content in `screens/Loop/script.ts`, so it's just another
 * topic to tap into, same as the other three. "Everything you've said"
 * links to `/recall-history` — Figma's own real row for it ("47 terms
 * across 5 topics") is exactly Recall history's own real content, which
 * an earlier session deleted as believed out-of-scope; restored alongside
 * that fix since Hub's own real content depends on it existing.
 *
 * **"I can't speak right now" removed from this screen entirely,
 * 2026-09-19,** on direct request, once single-tap-start made it this
 * screen's second/redundant CTA. Nothing becomes unreachable: text mode
 * is still one tap away from any topic via Loop's own Idle-state escape
 * button, from Recall history's own independent button, and automatically
 * the instant a real mic-permission denial happens
 * (`screens/Loop/Loop.tsx`'s `startRecording`). `docs/SPEC.md`'s own
 * "three doors into one sheet" framing already treated this button as one
 * of three redundant doors, not uniquely load-bearing.
 */
const TOPIC_ROWS: { slug: TopicSlug; icon: ReactNode; subtitle: string }[] = [
  {
    slug: 'research-methods',
    icon: <Brain style={{ width: '100%', height: '100%' }} />,
    subtitle: 'Read Tuesday.',
  },
  {
    slug: 'cell-biology',
    icon: '🧬',
    subtitle: 'Last practised last week',
  },
  {
    slug: 'legal-studies',
    icon: '⚖️',
    subtitle: 'Read Friday. Never said out loud.',
  },
  {
    slug: 'terms-you-missed',
    icon: '🔁',
    subtitle: 'From your last two sessions',
  },
];

export function RecallHub() {
  const router = useRouter();

  const iconStyle = { width: '100%', height: '100%' };

  return (
    <Scaffold
      topNavigation={<ScaffoldHeader title="Recall hub" onBack={() => router.push('/')} />}
      middleContent={
        <>
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
            Tap a topic to start. Everything you can say out loud lives here.
          </p>

          {TOPIC_ROWS.map((row) => (
            <BucketRow
              key={row.slug}
              iconSize="300"
              icon={row.icon}
              title={TOPIC_LABELS[row.slug]}
              subtitle={row.subtitle}
              onActivate={() => router.push(`/loop?topic=${row.slug}`)}
              trailing={
                <IconSlot size="250" color="var(--color-text-secondary)">
                  <ChevronRight style={iconStyle} />
                </IconSlot>
              }
            />
          ))}

          <BucketRow
            iconSize="300"
            icon={<GraduationCap style={iconStyle} />}
            title="Statistics, section 3"
            titleColor="var(--color-text-secondary)"
            subtitle="Ready to rehearse once you finish the lesson"
            subtitleColor="var(--color-text-disabled)"
            trailing={
              // No real destination in this sprint's scope (SPEC.md) — that
              // call is already made. What wasn't applied is the visual:
              // a real Tertiary Button with no onClick looked exactly like
              // a live control that silently does nothing on tap. Its own
              // real Disabled state (already used for Loop's Skip button)
              // makes that look match the fact.
              <Button variant="Tertiary" size="S" cta="Read the lesson" state="Disabled" />
            }
          />

          <BucketRow
            iconSize="300"
            icon={<Plus style={iconStyle} />}
            title="Start a new Recall"
            titleColor="var(--color-text-secondary)"
            subtitle="Upload a set of notes, or document and choose a topic"
            subtitleColor="var(--color-text-disabled)"
            // No real upload/topic-picker destination in this sprint's
            // scope (SPEC.md) — same fact already true of the row two
            // lines below this one before it got a real disabled look.
            // Was an identical-looking chevron to "Everything you've
            // said" right below it, live-looking with no way to tell it
            // apart before tapping. Dimmed to match "Read the lesson"'s
            // own honest-disabled treatment above.
            trailing={
              <IconSlot size="250" color="var(--color-text-disabled)">
                <ChevronRight style={iconStyle} />
              </IconSlot>
            }
          />

          <BucketRow
            iconSize="300"
            icon={<List style={iconStyle} />}
            title="Everything you've said"
            subtitle="47 terms across 5 topics"
            onActivate={() => router.push('/recall-history')}
            trailing={
              <IconSlot size="250" color="var(--color-text-secondary)">
                <ChevronRight style={iconStyle} />
              </IconSlot>
            }
          />

        </>
      }
    />
  );
}
