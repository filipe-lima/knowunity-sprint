'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Search, Brain, FileQuestion, Plus, MessageCircle, PlusCircle, Trophy } from 'lucide-react';

import { Scaffold } from '../../components/Scaffold/Scaffold';
import { Chips } from '../../components/Chips/Chips';
import { ChipMarker } from '../../components/ChipMarker/ChipMarker';
import { KnowieMessage } from '../../components/KnowieMessage/KnowieMessage';
import { Button } from '../../components/Button/Button';
import { MascotArt } from '../../components/shared/MascotArt';
import { ChatInput } from '../../components/ChatInput/ChatInput';
import { ButtonIcon } from '../../components/ButtonIcon/ButtonIcon';
import { Navbar } from '../../components/Navbar/Navbar';
import { Avatar } from '../../components/Avatar/Avatar';

/**
 * Home — the real entry point into Recall, built 2026-09-16 against the
 * live Figma instance `Home E — Knowie's message` (node `13759:45221`,
 * "Final flow" page), checked directly via the Desktop Bridge, screenshot
 * captured and reviewed. Not in docs/SPEC.md's original screen list
 * (sprint-context.md's "3 screens + a sheet, not more" decision) — added
 * on explicit request; see docs/sprint-context.md's updated decision and
 * docs/SPEC.md's new Home section.
 *
 * **Deliberately excluded, on explicit request:** the real frame's
 * "Continue studying" section (heading, "View all" button, and the two
 * hardcoded material rows, `row / NEW`) — not built here at all, not a
 * silent gap. Everything else in the frame is built:
 *
 * - Header: "Hi Filipe" + a streak `Chips` instance ("7 day streak").
 *   Figma's own instance shows both `showLeftIcon`/`showRightIcon` as
 *   `false` despite a visible icon in the real screenshot — reproduced
 *   here WITH a leading icon (matching the visible screenshot over the
 *   possibly-stale boolean), flagged in docs/component-gaps.md.
 * - `KnowieMessage` — its own default `message` already matches the real
 *   instance close to verbatim (confirmed via `docs-show` earlier this
 *   session). `actions` now wired, 2026-09-17, on direct request: real
 *   default "Start" routes straight into the session it just proposed
 *   (`/loop?topic=research-methods`, the same entry screen reached from
 *   Hub — skipping Hub entirely, since the message already named the
 *   topic) rather than the previously-documented "Start → Hub"; "Not now"
 *   dismisses the card for this visit (`dismissed` state, `middleContent`
 *   renders `null`). This directly overrides `sprint-context.md`'s "No
 *   dismissal... on `KnowieMessage`" line, now removed there — same
 *   "live instruction overrides a written decision" pattern as this
 *   session's other corrections.
 * - Chip row: `Chips` × 4 (Scan, Recall, Quiz, Upload) — the real Figma
 *   layer name for Recall is literally `chip / Recall / NEW (brain glyph
 *   pending library)`, i.e. Figma's own source doesn't have a resolved
 *   brain asset either. Placeholder `Brain` glyph used, flagged the same
 *   way Figma itself flags it. `ChipMarker` (`Dot`) overlays it as the
 *   "ready" marker (sprint-context.md's chip precedence: NEW > ready >
 *   plain — this mock is the returning-student "ready" state, matching
 *   the rest of this flow's default assumptions). Scan/Quiz/Upload are
 *   inert — no real destination exists in this sprint's scope.
 * - Composer: reuses `ChatInput` — its own doc comment already says it
 *   was built for this exact "Home's 'Ask Knowie'" surface. The real
 *   frame shows a second "camera" icon inside the field
 *   (`iconSlot / camera glyph missing` — unresolved in Figma's own source
 *   too) that `ChatInput` has no slot for; not reproduced, flagged in
 *   docs/component-gaps.md rather than modifying the shared component for
 *   one screen's extra icon.
 * - `Navbar` + `Avatar` — both new components this session
 *   (`components/Navbar`, `components/Avatar`); see their own doc
 *   comments for what's confirmed vs. flagged.
 */
export function Home() {
  const router = useRouter();
  const [dismissed, setDismissed] = useState(false);

  const iconStyle = { width: '100%', height: '100%' };

  return (
    <Scaffold
      topNavigation={
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            boxSizing: 'border-box',
            padding: 'var(--space-400)',
          }}
        >
          <p
            style={{
              margin: 0,
              fontFamily: 'var(--font-family-default)',
              fontWeight: 'var(--font-weight-bold)',
              fontSize: 'var(--font-size-lg)',
              color: 'var(--color-text-primary)',
            }}
          >
            Hi Filipe
          </p>
          <Chips
            size="M"
            color="Primary"
            text="7 day streak"
            leadingIcon={<Trophy style={iconStyle} />}
            showRightIcon={false}
          />
        </div>
      }
      middleContent={
        dismissed ? null : (
          <KnowieMessage
            mascot={<MascotArt pose="standby" />}
            actions={
              <>
                <Button
                  variant="Primary"
                  size="S"
                  cta="Start"
                  onClick={() => router.push('/loop?topic=research-methods')}
                />
                <Button variant="Tertiary" size="S" cta="Not now" onClick={() => setDismissed(true)} />
              </>
            }
          />
        )
      }
      bottomContent={
        <>
          <div style={{ display: 'flex', gap: 'var(--space-200)', flexWrap: 'wrap' }}>
            <Chips size="S" color="Primary" text="Scan" leadingIcon={<Search style={iconStyle} />} />
            <div style={{ position: 'relative', display: 'inline-flex' }}>
              <Chips
                size="S"
                color="Primary"
                text="Recall"
                leadingIcon={<Brain style={iconStyle} />}
                onClick={() => router.push('/hub')}
                style={{ cursor: 'pointer' }}
              />
              <ChipMarker
                variant="Dot"
                style={{ position: 'absolute', top: '-2px', right: '-2px' }}
              />
            </div>
            <Chips size="S" color="Primary" text="Quiz" leadingIcon={<FileQuestion style={iconStyle} />} />
            <Chips size="S" color="Primary" text="Upload" leadingIcon={<Plus style={iconStyle} />} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-200)' }}>
            <ButtonIcon variant="Secondary" size="M" icon={<Plus style={iconStyle} />} aria-label="Add attachment" />
            <div style={{ flex: '1 1 auto' }}>
              <ChatInput status="Inactive" value="Ask Knowie..." />
            </div>
          </div>
          <Navbar
            tabs={[
              { icon: <MessageCircle style={iconStyle} />, state: 'Active', 'aria-label': 'My AI chat' },
              { icon: <Search style={iconStyle} />, state: 'Inactive', 'aria-label': 'Search' },
              { icon: <PlusCircle style={iconStyle} />, state: 'Inactive', 'aria-label': 'Add' },
              { icon: <FileQuestion style={iconStyle} />, state: 'Inactive', 'aria-label': 'Quiz' },
              {
                icon: <Trophy style={iconStyle} />,
                state: 'Inactive',
                'aria-label': 'Trophy',
                color: 'var(--color-accent-blue-on-subtle)',
              },
            ]}
            avatar={<Avatar type="Initial" size="Large" shape="Circle" initials="H" aria-label="Your profile" />}
          />
        </>
      }
    />
  );
}
