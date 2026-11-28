'use client';

import {
  createContext, useContext, useEffect, useState, type ReactNode,
} from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import UserContext, { type UserContextValue } from '@/components/UserContextComponent';

export type LatLng = { lat: number; lng: number };

const DEFAULT_LAT_LNG: LatLng = { lat: 25.03746, lng: 121.564558 };

const CurrentLatLngContext = createContext<LatLng>(DEFAULT_LAT_LNG);

export function useCurrentLatLng() {
  return useContext(CurrentLatLngContext);
}

export default function Providers({ children }: { children: ReactNode }) {
  const [currentLatLng, setCurrentLatLng] = useState<LatLng>(DEFAULT_LAT_LNG);
  const [user, setUser] = useState<UserContextValue>({});

  useEffect(() => {
    // Firebase is initialised in the browser only, never during server prerendering.
    let unsubscribe: (() => void) | undefined;
    let cancelled = false;
    import('@/utils/firebase-init').then(({ auth }) => {
      if (cancelled) return;
      unsubscribe = onAuthStateChanged(auth, (userData) => {
        if (userData) setUser(userData);
      });
    });
    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, []);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCurrentLatLng({ lat: position.coords.latitude, lng: position.coords.longitude });
      });
    }
  }, []);

  return (
    <UserContext.Provider value={user}>
      <CurrentLatLngContext.Provider value={currentLatLng}>
        {children}
      </CurrentLatLngContext.Provider>
    </UserContext.Provider>
  );
}
