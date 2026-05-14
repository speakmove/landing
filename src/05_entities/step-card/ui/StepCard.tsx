import { Badge, Card } from '@/shared/ui';
import type { TStep } from '../model/types';

type TProps = {
  step: TStep;
};

export const StepCard = ({ step }: TProps) => {
  return (
    <Card as="article" className="flex flex-col gap-3">
      <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-primary text-white font-bold text-sm tabular-nums">
        {step.num}
      </div>
      <div>
        <h3 className="text-base font-bold text-ink mb-1.5 leading-snug">
          {step.title}
        </h3>
        <p className="text-sm text-muted leading-relaxed">
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
