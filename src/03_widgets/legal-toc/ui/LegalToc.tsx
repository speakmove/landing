'use client';
import { useActiveSection } from '@/shared/model/hooks';
import { cn } from '@/shared/model/libs/cn';

type TItem = { id: string; heading: string };
type TProps = { items: TItem[]; ariaLabel: string };

export const LegalToc = ({ items, ariaLabel }: TProps) => {
  const ids = items.map((i) => i.id);
  const active = useActiveSection(ids);
  return (
    <nav aria-label={ariaLabel}>
      <ol className="m-0 flex list-none flex-col gap-0.5 p-0">
        {items.map((s) => {
          const isActive = active === s.id;
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                aria-current={isActive ? 'true' : undefined}
                className={cn(
                  'block rounded-lg px-2.5 py-1.5 font-medium text-muted transition hover:bg-surface hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
                  isActive && 'font-semibold text-primary',
                )}
              >
                {s.heading}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
