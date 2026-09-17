'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

import { Summary, type SummaryResultRow } from '../../screens/Summary/Summary';

// Real content from the all-clear instance (Summary 2 — All clear, node
// 13752:39607): 3 rows, the extra "Nothing queued" block.
const ALL_CLEAR_RESULTS: SummaryResultRow[] = [
  { term: 'Construct validity', outcome: 'Said it unaided' },
  { term: 'Said after a hint today', outcome: 'Said it after a hint' },
  { term: 'Internal validity', outcome: 'Flagged for review', flagged: true },
];

// Real content from the partial instance (Summary 3 — Continued a
// learning goal, node 13752:39657): 5 rows. Two of the five don't follow
// the clean title=outcome/subtitle=term pattern in the real file (see
// Summary.tsx's own doc comment and the plan) — reproduced here matching
// the clean majority pattern, not the two outliers.
const PARTIAL_RESULTS: SummaryResultRow[] = [
  { term: 'Construct validity', outcome: 'Said it unaided' },
  { term: 'Said after a hint today', outcome: 'Said it after a hint' },
  { term: 'Confounding variable', outcome: 'Ecological validity' },
  { term: 'Internal validity', outcome: 'Flagged for review', flagged: true },
  { term: 'Sampling bias', outcome: 'Skipped', flagged: true },
];

function SummaryPageContent() {
  const searchParams = useSearchParams();
  const isAllClear = searchParams.get('allClear') === '1';

  return isAllClear ? (
    <Summary
      termsCount={3}
      unaidedSummary="Two of them without any help."
      results={ALL_CLEAR_RESULTS}
      isAllClear
    />
  ) : (
    <Summary
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
