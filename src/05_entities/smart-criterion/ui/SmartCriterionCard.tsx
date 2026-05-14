import { Card } from '@/shared/ui';
import type { TSmartCriterion } from '../model/types';

type TProps = {
  criterion: TSmartCriterion;
};

export function SmartCriterionCard({ criterion }: TProps) {
  return (
    <Card as="article" className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div
          aria-hidden="true"
          className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-primary text-white font-extrabold text-[22px] font-mono"
        >
          {criterion.letter}
        </div>
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted font-mono">
            {criterion.eng}
          </div>
          <div className="font-bold text-[17px] text-ink leading-tight">
            {criterion.title}
          </div>
        </div>
      </div>
      <p className="text-sm text-muted leading-relaxed">
        {criterion.description}
      </p>
    </Card>
  );
}
