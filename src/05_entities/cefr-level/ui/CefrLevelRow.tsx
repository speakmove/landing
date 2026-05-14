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
        'grid grid-cols-[60px_1fr_auto] gap-3.5 items-center rounded-2xl border px-4 py-4 transition-shadow',
        isActive
          ? 'border-primary bg-white shadow-[0_0_0_3px_color-mix(in_oklab,var(--color-primary)_12%,transparent)]'
          : 'border-line bg-white',
      )}
    >
      <div className="font-mono font-extrabold text-xl text-primary px-2.5 py-1.5 bg-primary-pale rounded-[10px] text-center">
        {level.code}
      </div>

      <div>
        <div className="font-bold text-sm tracking-[-0.01em] text-ink">
          {level.title}
        </div>
        <div className="text-xs text-muted mt-0.5 leading-snug">
          {level.subtitle}
        </div>
      </div>

      {level.weeks && (
        <div className="font-mono text-xs font-bold text-muted whitespace-nowrap text-right">
          {level.weeks}
        </div>
      )}
    </li>
  );
};
