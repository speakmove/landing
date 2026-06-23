'use client';
import { useEffect, useState } from 'react';

export function useActiveSection(ids: string[], rootMargin = '-20% 0px -75% 0px'): string | null {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    if (ids.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          const first = visible[0];
          if (first) setActive(first.target.id);
        }
      },
      { rootMargin, threshold: 0 },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids, rootMargin]);
  return active;
}
