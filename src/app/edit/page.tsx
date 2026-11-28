'use client';

import dynamic from 'next/dynamic';

// Rendered client-side only: the view relies on browser APIs (Google Maps, Firebase, window).
const EditPage = dynamic(() => import('@/views/Edit'), { ssr: false });

export default function Page() {
  return <EditPage />;
}
