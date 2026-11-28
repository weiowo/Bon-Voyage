'use client';

import dynamic from 'next/dynamic';
import { useCurrentLatLng } from '@/app/providers';

// Rendered client-side only: the view relies on browser APIs (Google Maps, Firebase, window).
const Category = dynamic(() => import('@/views/Category'), { ssr: false });

export default function Page() {
  const currentLatLng = useCurrentLatLng();
  return <Category currentLatLng={currentLatLng} />;
}
