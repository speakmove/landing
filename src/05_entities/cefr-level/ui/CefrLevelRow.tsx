import { cn } from '@/shared/model/libs/cn';
import type { TCefrLevel } from '../model/types';

type TProps = {
  level: TCefrLevel;
};

export const CefrLevelRow = ({ level }: TProps) => {
  const isActive = level.active === true;

  return (
    <li
      aria-current={isActive ? 'step' : undefined}
      className={cn(
        'grid grid-cols-[60px_1fr_auto] items-center gap-3.5 rounded-[14px] border bg-white px-4 py-4 transition-shadow',
        isActive
          ? 'border-primary shadow-[0_0_0_3px_color-mix(in_oklab,var(--color-primary)_12%,transparent)]'
          : 'border-line',
      )}
    >
      <div className="rounded-[10px] bg-primary-pale px-2.5 py-1.5 text-center font-mono text-xl font-extrabold text-primary">
        {level.code}
      </div>

      <div>
        <div className="text-[14.5px] font-bold tracking-[-0.01em] text-ink">
          {level.title}
        </div>
        <div className="mt-0.5 text-[13px] leading-snug text-muted">{level.subtitle}</div>
      </div>

      {level.weeks ? (
        <div className="whitespace-nowrap text-right font-mono text-xs font-bold text-muted">
          {level.weeks}
        </div>
      ) : null}
    </li>
  );
};
