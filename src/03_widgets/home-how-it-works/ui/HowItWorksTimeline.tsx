import type { TStep } from '@/entities/step-card';
import { HowItWorksTimelineDesktop } from './HowItWorksTimelineDesktop';
import { HowItWorksTimelineMobile } from './HowItWorksTimelineMobile';

type TProps = {
  steps: TStep[];
};

/** Picks the horizontal (lg+) or vertical (below lg) timeline by breakpoint. */
export function HowItWorksTimeline({ steps }: TProps) {
  return (
    <>
      <div className="hidden lg:block">
        <HowItWorksTimelineDesktop steps={steps} />
      </div>
      <div className="lg:hidden">
        <HowItWorksTimelineMobile steps={steps} />
      </div>
    </>
  );
}
