import { useState, useEffect, useRef } from 'react';

export function formatAge(months: number): string {
  if (months < 12) return `${months} ${months === 1 ? 'mes' : 'meses'}`;
  const y = Math.floor(months / 12);
  return `${y} ${y === 1 ? 'año' : 'años'}`;
}

export function useIntersection(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null!);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

export function useScrolled(threshold = 20) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > threshold);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, [threshold]);
  return scrolled;
}

export function parseLocalDate(dateStr: string): Date {
  return new Date(`${dateStr}T12:00:00`);
}