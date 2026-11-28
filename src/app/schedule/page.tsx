'use client';

import dynamic from 'next/dynamic';

// Rendered client-side only: the view relies on browser APIs (Google Maps, Firebase, window).
const Schedule = dynamic(() => import('@/views/SchedulePlan'), { ssr: false });

export default function Page() {
  return <Schedule />;
}
