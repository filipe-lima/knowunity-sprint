'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

import { Loop } from '../../screens/Loop/Loop';

function LoopPageContent() {
  const searchParams = useSearchParams();
  const topic = searchParams.get('topic') ?? undefined;

  return <Loop topic={topic} />;
}

export default function LoopPage() {
  return (
    <Suspense fallback={null}>
      <LoopPageContent />
    </Suspense>
  );
}
