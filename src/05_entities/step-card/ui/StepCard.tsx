import { Badge, Card } from '@/shared/ui';
import type { TStep } from '../model/types';

type TProps = {
  step: TStep;
};

export function StepCard({ step }: TProps) {
  return (
    <Card as="article" className="flex flex-col gap-3">
      <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-[color:var(--color-primary)] text-white font-bold text-[15px] tabular-nums">
        {step.num}
      </div>
      <div>
        <h3 className="text-[16px] font-bold text-[color:var(--color-ink)] mb-1.5 leading-snug">
          {step.title}
        </h3>
        <p className="text-[14px] text-[color:var(--color-muted)] leading-relaxed">
          {step.description}
        </p>
      </div>
      {step.tag && (
        <Badge tone="neutral" className="self-start">
          {step.tag}
        </Badge>
      )}
    </Card>
  );
}
