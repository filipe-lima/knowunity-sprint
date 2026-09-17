'use client';

import { useState, type KeyboardEvent, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';

import { Brain, GraduationCap, Plus, List, ChevronRight } from 'lucide-react';

import { Scaffold } from '../../components/Scaffold/Scaffold';
import { Chips } from '../../components/Chips/Chips';
import { IconSlot } from '../../components/IconSlot/IconSlot';
import { ButtonGroup } from '../../components/ButtonGroup/ButtonGroup';
import { Button } from '../../components/Button/Button';
import { Sheet } from '../../components/Sheet/Sheet';
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
 * pattern as Home's now-excluded Continue-studying rows and Summary's
 * result rows), each with its own leading icon/emoji, title/subtitle, and
 * a trailing element that varies per row (a `chips` badge, a real
 * `button`, or a bare chevron) — not a single reusable shape, so built as
 * one local `HubRow` component taking a flexible `trailing` slot rather
 * than forced into `ListRow`. See docs/component-gaps.md.
 *
 * The four topic rows (Research Methods/Cell biology/Legal studies/Terms
 * you missed) are the real selectable picker: tapping one moves the "Up
 * next" `chips` badge (`active`, per the one real instance confirmed —
 * Research Methods) onto it and updates the bottom CTA — this
 * interaction isn't directly provable from one static Figma frame, but
 * matches this screen's very first implementation, built against the
 * same real node with deeper access to the source file. **"Terms you
 * missed" made selectable 2026-09-16, on direct request** — the real
 * frame shows it informational-only (no chevron), but each of the 4
 * topics now has real, playable content in `screens/Loop/script.ts`, so
 * treating it as a picker option matches the other three. "Everything
 * you've said" links to `/recall-history` — Figma's own real row for it
 * ("47 terms across 5 topics") is exactly Recall history's own real
 * content, which an earlier session deleted as believed out-of-scope;
 * restored alongside this fix since Hub's own real content depends on it
 * existing.
 */
const TOPIC_ROWS: { slug: TopicSlug; icon: ReactNode; subtitle: string; badge: string }[] = [
  {
    slug: 'research-methods',
    icon: <Brain style={{ width: '100%', height: '100%' }} />,
    subtitle: '5 terms. About 3 minutes. Read Tuesday.',
    badge: 'Up next',
  },
  {
    slug: 'cell-biology',
    icon: '🧬',
    subtitle: 'Last practised last week',
    badge: '1 of 6',
  },
  {
    slug: 'legal-studies',
    icon: '⚖️',
    subtitle: 'Read Friday. Never said out loud.',
    badge: '0 of 4',
  },
  {
    slug: 'terms-you-missed',
    icon: '🔁',
    subtitle: 'From your last two sessions',
    badge: '3 terms',
  },
];

// ListRow-style rows have no built-in interactive affordance of their own
// (no role, no keyboard handling) — same resolution as every other
// tappable custom row in this project: this screen is responsible for
// real, keyboard-reachable interactivity, not just a mouse-only onClick.
function rowA11yProps(onActivate: () => void) {
  return {
    role: 'button' as const,
    tabIndex: 0,
    onClick: onActivate,
    onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onActivate();
      }
    },
  };
}

function HubRow({
  icon,
  title,
  titleColor = 'var(--color-text-primary)',
  subtitle,
  trailing,
  onActivate,
}: {
  icon: ReactNode;
  title: string;
  /** Confirmed live against the real locked row (Hub C, node
   *  13759:45277): its title alone is bound to text/disabled, everything
   *  else on the row (subtitle, "Read the lesson" button + icon) stays at
   *  its normal color. Not an opacity/overlay treatment on the row. */
  titleColor?: string;
  subtitle: string;
  trailing?: ReactNode;
  onActivate?: () => void;
}) {
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
        cursor: onActivate ? 'pointer' : undefined,
      }}
      {...(onActivate ? rowA11yProps(onActivate) : {})}
    >
      <IconSlot size="300" color="var(--color-text-primary)">
        {typeof icon === 'string' ? <span style={{ fontSize: 'var(--font-size-lg)' }}>{icon}</span> : icon}
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
            color: titleColor,
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
      {trailing}
    </div>
  );
}

export function RecallHub() {
  const router = useRouter();
  const [selected, setSelected] = useState<TopicSlug>('research-methods');
  const [sheetOpen, setSheetOpen] = useState(false);

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
            Tap a row, then start. Everything you can say out loud lives here.
          </p>

          {TOPIC_ROWS.map((row) => {
            const isSelected = row.slug === selected;
            return (
              <HubRow
                key={row.slug}
                icon={row.icon}
                title={TOPIC_LABELS[row.slug]}
                subtitle={row.subtitle}
                onActivate={() => setSelected(row.slug)}
                trailing={
                  <Chips
                    size="XS"
                    color="Primary"
                    active={isSelected}
                    text={isSelected ? 'Up next' : row.badge}
                  />
                }
              />
            );
          })}

          <HubRow
            icon={<GraduationCap style={iconStyle} />}
            title="Statistics, section 3"
            titleColor="var(--color-text-disabled)"
            subtitle="Ready to rehearse once you finish the lesson"
            trailing={<Button variant="Tertiary" size="S" cta="Read the lesson" />}
          />

          <HubRow
            icon={<Plus style={iconStyle} />}
            title="Start a new Recall"
            subtitle="Upload a set of notes, or document and choose a topic"
            trailing={
              <IconSlot size="250" color="var(--color-text-secondary)">
                <ChevronRight style={iconStyle} />
              </IconSlot>
            }
          />

          <HubRow
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

          <ButtonGroup
            variant="Vertical"
            size="L"
            primary={
              <Button
                variant="Primary"
                size="L"
                cta={`Start ${TOPIC_LABELS[selected]}`}
                fill
                onClick={() => router.push(`/loop?topic=${selected}`)}
              />
            }
            secondary={
              <Button
                variant="Secondary"
                size="L"
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
                  onClick={() => router.push('/loop')}
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
