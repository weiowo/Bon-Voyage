'use client';

import dynamic from 'next/dynamic';

// Rendered client-side only: the view relies on browser APIs (Google Maps, Firebase, window).
const City = dynamic(() => import('@/views/City'), { ssr: false });

export default function Page() {
  return <City />;
}
