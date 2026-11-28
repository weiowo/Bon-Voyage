'use client';

import dynamic from 'next/dynamic';

// Rendered client-side only: the view relies on browser APIs (Google Maps, Firebase, window).
const VR = dynamic(() => import('@/views/VrPage'), { ssr: false });

export default function Page() {
  return <VR />;
}
