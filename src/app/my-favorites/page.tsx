'use client';

import dynamic from 'next/dynamic';

// Rendered client-side only: the view relies on browser APIs (Google Maps, Firebase, window).
const MyLovedArticles = dynamic(() => import('@/views/MyFavorites'), { ssr: false });

export default function Page() {
  return <MyLovedArticles />;
}
