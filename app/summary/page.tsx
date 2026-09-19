'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { Summary, type SummaryResultRow } from '../../screens/Summary/Summary';

// Fallback only, used when sessionStorage has no real session — e.g. a
// direct/fresh load of /summary with nothing actually played this visit.
// The real path always has real per-term results written by
// screens/Loop/Loop.tsx's goToNextTerm just before navigating here (see
// its own comment); this fixture data is what used to render
// unconditionally, regardless of what really happened
// (eval/scorecard-03.md's most severe UX-judgment finding, confirmed live
// by actually finishing a real session and seeing this fixture data
// instead).
//
// Real content from the all-clear instance (Summary 2 — All clear, node
// 13752:39607): 3 rows, the extra "Nothing queued" block.
//
// Row 2 was `{ term: 'Said after a hint today', outcome: 'Said it after a
// hint' }` — 'Said after a hint today' is a *source line*, not a term
// name (compare screens/Hub/RecallHistory.tsx's real row for the same
// content: `term="Confounding variable" source="Said after a hint
// today"`). Fixed to match that real, already-correct pairing.
const FALLBACK_ALL_CLEAR_RESULTS: SummaryResultRow[] = [
  { term: 'Construct validity', outcome: 'Said it unaided' },
  { term: 'Confounding variable', outcome: 'Said it after a hint' },
  { term: 'Internal validity', outcome: 'Flagged for review', flagged: true },
];

// Real content from the partial instance (Summary 3 — Continued a
// learning goal, node 13752:39657): 5 rows.
//
// 'Ecological validity' used to read 'Revealed, then said back unaided' —
// a leftover from the "Reveal" flow removed entirely from the app
// (docs/SPEC.md). That outcome can no longer actually be produced by real
// play, so this mock fixture was updated to only use the 4 outcomes the
// app can generate; see RecallHistory.tsx's matching row for the same
// term, updated the same way.
const FALLBACK_PARTIAL_RESULTS: SummaryResultRow[] = [
  { term: 'Construct validity', outcome: 'Said it unaided' },
  { term: 'Confounding variable', outcome: 'Said it after a hint' },
  { term: 'Ecological validity', outcome: 'Said it after a hint' },
  { term: 'Internal validity', outcome: 'Flagged for review', flagged: true },
  { term: 'Sampling bias', outcome: 'Skipped', flagged: true },
];

const UNAIDED_COUNT_WORDS = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight'];

// Mirrors docs/SPEC.md's own spelled-out phrasing style ("Two of them
// without any help.") rather than rendering a bare digit.
function unaidedSummaryFor(results: SummaryResultRow[]): string {
  const count = results.filter((row) => row.outcome === 'Said it unaided').length;
  if (count === 0) return 'None of them without any help yet.';
  const word = UNAIDED_COUNT_WORDS[count] ?? String(count);
  return `${word} of them without any help.`;
}

interface StoredSession {
  topic: string;
  results: SummaryResultRow[];
}

function SummaryPageContent() {
  const searchParams = useSearchParams();
  const queryAllClear = searchParams.get('allClear') === '1';
  const queryTopic = searchParams.get('topic') ?? 'research-methods';

  // undefined = not read yet, null = read and genuinely empty (fallback
  // case). Read in an effect, not during render, so a server-rendered or
  // freshly-loaded pass never has to guess at sessionStorage before it
  // exists.
  const [session, setSession] = useState<StoredSession | null | undefined>(undefined);

  useEffect(() => {
    const raw = sessionStorage.getItem('knowie:lastSession');
    setSession(raw ? (JSON.parse(raw) as StoredSession) : null);
  }, []);

  if (session === undefined) return null;

  if (session) {
    const isAllClear = !session.results.some((row) => row.flagged);
    return (
      <Summary
        topic={session.topic}
        termsCount={session.results.length}
        unaidedSummary={unaidedSummaryFor(session.results)}
        results={session.results}
        isAllClear={isAllClear}
      />
    );
  }

  return queryAllClear ? (
    <Summary
      topic={queryTopic}
      termsCount={FALLBACK_ALL_CLEAR_RESULTS.length}
      unaidedSummary={unaidedSummaryFor(FALLBACK_ALL_CLEAR_RESULTS)}
      results={FALLBACK_ALL_CLEAR_RESULTS}
      isAllClear
    />
  ) : (
    <Summary
      topic={queryTopic}
      termsCount={FALLBACK_PARTIAL_RESULTS.length}
      unaidedSummary={unaidedSummaryFor(FALLBACK_PARTIAL_RESULTS)}
      results={FALLBACK_PARTIAL_RESULTS}
      isAllClear={false}
    />
  );
}

export default function SummaryPage() {
  return (
    <Suspense fallback={null}>
      <SummaryPageContent />
    </Suspense>
  );
}
