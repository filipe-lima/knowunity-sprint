'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

import { Summary, type SummaryResultRow } from '../../screens/Summary/Summary';

// Real content from the all-clear instance (Summary 2 — All clear, node
// 13752:39607): 3 rows, the extra "Nothing queued" block.
//
// Row 2 was `{ term: 'Said after a hint today', outcome: 'Said it after a
// hint' }` — 'Said after a hint today' is a *source line*, not a term
// name (compare screens/Hub/RecallHistory.tsx's real row for the same
// content: `term="Confounding variable" source="Said after a hint
// today"`). Fixed to match that real, already-correct pairing.
const ALL_CLEAR_RESULTS: SummaryResultRow[] = [
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
const PARTIAL_RESULTS: SummaryResultRow[] = [
  { term: 'Construct validity', outcome: 'Said it unaided' },
  { term: 'Confounding variable', outcome: 'Said it after a hint' },
  { term: 'Ecological validity', outcome: 'Said it after a hint' },
  { term: 'Internal validity', outcome: 'Flagged for review', flagged: true },
  { term: 'Sampling bias', outcome: 'Skipped', flagged: true },
];

function SummaryPageContent() {
  const searchParams = useSearchParams();
  const isAllClear = searchParams.get('allClear') === '1';
  const topic = searchParams.get('topic') ?? 'research-methods';

  return isAllClear ? (
    <Summary
      topic={topic}
      termsCount={3}
      unaidedSummary="Two of them without any help."
      results={ALL_CLEAR_RESULTS}
      isAllClear
    />
  ) : (
    <Summary
      topic={topic}
      termsCount={5}
      unaidedSummary="Two of them without any help."
      results={PARTIAL_RESULTS}
      isAllClear={false}
      remainingCount={2}
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
