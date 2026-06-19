import type { TStep } from '@/entities/step-card';
import { TimelineNode } from './TimelineNode';

type TProps = {
  steps: TStep[];
};

/** Vertical timeline: nodes overlap a vertical progress line, last node accented. */
export function HowItWorksTimelineMobile({ steps }: TProps) {
  const lastIndex = steps.length - 1;

  return (
    <div className="relative">
      {/* Vertical progress line */}
      <div className="absolute top-0 bottom-0 left-5 w-px bg-line" aria-hidden="true" />

      <ol className="relative list-none space-y-8 p-0 pl-12">
        {steps.map((step, idx) => (
          <TimelineNode
            key={step.num}
            step={step}
            isAccent={idx === lastIndex}
            variant="vertical"
            index={idx}
          />
        ))}
      </ol>
    </div>
  );
}
