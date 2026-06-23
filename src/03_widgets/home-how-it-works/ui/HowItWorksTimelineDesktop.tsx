import type { TStep } from '@/entities/step-card';
import { TimelineNode } from './TimelineNode';

type TProps = {
  steps: TStep[];
};

/** Horizontal timeline: nodes on a single progress line, last node accented. */
export function HowItWorksTimelineDesktop({ steps }: TProps) {
  const lastIndex = steps.length - 1;

  return (
    <div className="relative">
      {/* Progress line behind the nodes */}
      <div className="absolute top-5 right-0 left-0 h-px bg-line" aria-hidden="true" />

      <ol className="relative grid list-none grid-cols-4 gap-6 p-0">
        {steps.map((step, idx) => (
          <TimelineNode
            key={step.num}
            step={step}
            isAccent={idx === lastIndex}
            variant="horizontal"
            index={idx}
          />
        ))}
      </ol>
    </div>
  );
}
