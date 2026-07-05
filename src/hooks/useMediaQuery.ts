import { useEffect, useState } from 'react';

const DESKTOP_BREAKPOINT = 1024;

export function useIsDesktop(): boolean {
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT}px)`).matches,
  );

  useEffect(() => {
    const media = window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT}px)`);
    const handler = (event: MediaQueryListEvent) => setIsDesktop(event.matches);
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, []);

  return isDesktop;
}

export const BREAKPOINT_DESKTOP = DESKTOP_BREAKPOINT;
