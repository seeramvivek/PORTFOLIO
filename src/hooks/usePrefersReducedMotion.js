import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

export default function usePrefersReducedMotion() {
  const get = () => typeof window !== 'undefined' && window.matchMedia && window.matchMedia(QUERY).matches;
  const [reduced, setReduced] = useState(get);
  useEffect(() => {
    if (!window.matchMedia) return undefined;
    const mq = window.matchMedia(QUERY);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);
  return reduced;
}
