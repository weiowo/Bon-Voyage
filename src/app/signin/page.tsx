'use client';

import dynamic from 'next/dynamic';

// Rendered client-side only: the view relies on browser APIs (Google Maps, Firebase, window).
const SignIn = dynamic(() => import('@/components/SignIn'), { ssr: false });

export default function Page() {
  return <SignIn />;
}
