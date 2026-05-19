import { Badge } from '@/shared/ui';
import type { TStep } from '../model/types';

type TProps = {
  step: TStep;
};

export const StepCard = ({ step }: TProps) => {
  return (
    <article className="card-hover relative flex h-full flex-col rounded-card border border-line bg-white p-6 shadow-(--shadow-soft)">
      <div className="font-mono text-xs font-bold tracking-[0.08em] text-primary">{step.num}</div>
      <h3 className="mt-2 mb-1.5 text-17 font-bold leading-snug text-ink">{step.title}</h3>
      <p className="m-0 text-sm leading-[1.5] text-muted">{step.description}</p>
      {step.tag ? (
        <Badge tone="neutral" className="mt-3 self-start">
          {step.tag}
        </Badge>
      ) : null}
    </article>
  );
};
