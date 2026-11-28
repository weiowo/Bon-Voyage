'use client';

import dynamic from 'next/dynamic';

// Rendered client-side only: the view relies on browser APIs (Google Maps, Firebase, window).
const CityAreaInHomePage = dynamic(() => import('@/components/CityInHome'), { ssr: false });

export default function Page() {
  return <CityAreaInHomePage />;
}
