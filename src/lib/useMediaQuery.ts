import { useCallback, useSyncExternalStore } from 'react';

/**
 * Whether a CSS media query currently matches, e.g. `useMediaQuery('(max-width: 800px)')`.
 * It re-renders when the match changes, such as when the window is resized,
 * and returns false during server rendering.
 */
export default function useMediaQuery(query: string): boolean {
  const subscribe = useCallback((onChange: () => void) => {
    const mql = window.matchMedia(query);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}
