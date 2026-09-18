'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

import { Loop } from '../../screens/Loop/Loop';

function LoopPageContent() {
  const searchParams = useSearchParams();
  const topic = searchParams.get('topic') ?? undefined;
  const initialTextMode = searchParams.get('mode') === 'text';

  return <Loop topic={topic} initialTextMode={initialTextMode} />;
}

export default function LoopPage() {
  return (
    <Suspense fallback={null}>
      <LoopPageContent />
    </Suspense>
  );
}
