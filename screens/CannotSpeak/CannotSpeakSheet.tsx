'use client';

import { useRouter } from 'next/navigation';

import { Scaffold } from '../../components/Scaffold/Scaffold';
import { Sheet } from '../../components/Sheet/Sheet';
import { Button } from '../../components/Button/Button';

/**
 * Screen 1 from docs/SPEC.md — the Cannot-speak sheet. No Figma frame of
 * its own (checked directly: none of the 17 real screens in "COMMITED FLOW
 * FINAL USING COMPONENTS" matches "speak"/"sheet"/"cannot") — SPEC.md's own
 * account is that its "file" is just `components/Sheet/Sheet.tsx`'s real
 * `Default` story, already built. `Sheet`'s real defaults (confirmed via
 * the Storybook MCP `docs-show`, not assumed) already match SPEC.md's copy
 * exactly: title "Can't speak right now?", body, footnote, and a default
 * `actions` pair — so the only real work here is the screen-level wiring,
 * not new content.
 *
 * Per SPEC.md, this sheet is never its own destination in the real app —
 * "There's one sheet, three doors into it (Hub's secondary, Loop's escape
 * control, an OS permission denial)." None of those doors exist yet as
 * built screens (Hub is next, Loop after that), so there's no real
 * predecessor screen to link from today. This route exists so the sheet
 * itself is a real, reachable, testable artifact in the meantime — once
 * Hub is built, this stops being a standalone route and becomes a state of
 * Hub's own Scaffold (`bottomSheetOnly` + `showBottomSheetBackground`),
 * exactly like the Storybook `Scaffold` "With Sheet Open" story already
 * demonstrates. Flagged as a build-order decision, not a permanent route.
 *
 * `middleContent` is required on Scaffold but has no real content here —
 * there is no real screen "behind" this sheet yet. Left empty rather than
 * inventing placeholder Hub content ahead of schedule.
 *
 * Both actions navigate to their real, SPEC.md-specified destinations
 * (`/hub`, `/loop`) using next/navigation — not stubbed or left inert.
 * Both routes 404 today because neither screen is built yet (Hub is
 * screen 3, Loop is screen 4, in that build order) — expected, not a bug
 * in this screen; per the build-screen skill, flagged rather than hidden.
 */
export function CannotSpeakSheet() {
  const router = useRouter();

  return (
    <Scaffold
      middleContent={<></>}
      showBottomSheetBackground
      bottomSheetOnly={
        <Sheet
          actions={
            <>
              <Button
                variant="Primary"
                size="L"
                cta="Yes, let me type"
                onClick={() => router.push('/loop?mode=text')}
              />
              <Button
                variant="Tertiary"
                size="M"
                cta="No, back to home"
                onClick={() => router.push('/hub')}
              />
            </>
          }
        />
      }
    />
  );
}
