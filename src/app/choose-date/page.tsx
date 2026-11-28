'use client';

import dynamic from 'next/dynamic';

// Rendered client-side only: the view relies on browser APIs (Google Maps, Firebase, window).
const ChooseDate = dynamic(() => import('@/views/ChooseDate'), { ssr: false });

export default function Page() {
  return <ChooseDate />;
}
