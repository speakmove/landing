import type { TCefrLevel } from '../model/types';

type TProps = {
  level: TCefrLevel;
};

export function CefrLevelRow({ level }: TProps) {
  const isActive = level.active === true;

  return (
    <li
      aria-current={isActive ? 'step' : undefined}
      className={[
        'grid grid-cols-[60px_1fr_auto] gap-3.5 items-center rounded-2xl border px-4 py-4 transition-shadow',
        isActive
          ? 'border-[color:var(--color-primary)] bg-white shadow-[0_0_0_3px_color-mix(in_oklab,var(--color-primary)_12%,transparent)]'
          : 'border-[color:var(--color-line)] bg-white',
      ].join(' ')}
    >
      <div className="font-mono font-extrabold text-xl text-[color:var(--color-primary)] px-2.5 py-1.5 bg-[color:var(--color-primary-pale)] rounded-[10px] text-center">
        {level.code}
      </div>

      <div>
        <div className="font-bold text-[14.5px] tracking-[-0.01em] text-[color:var(--color-ink)]">
          {level.title}
        </div>
        <div className="text-[13px] text-[color:var(--color-muted)] mt-0.5 leading-snug">
          {level.subtitle}
        </div>
      </div>

      {level.weeks && (
        <div className="font-mono text-xs font-bold text-[color:var(--color-muted)] whitespace-nowrap text-right">
          {level.weeks}
        </div>
      )}
    </li>
  );
}
