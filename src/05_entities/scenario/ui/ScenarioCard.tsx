import { ArrowRightIcon, Card } from '@/shared/ui';
import type { TScenario } from '../model/types';

type TProps = {
  scenario: TScenario;
};

export const ScenarioCard = ({ scenario }: TProps) => {
  return (
    <Card
      as="div"
      className="flex items-start gap-3.5 p-4 text-left transition hover:-translate-y-0.5"
    >
      <span className="mt-0.5 flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-primary-pale text-primary-ink">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      </span>
      <span className="flex-1">
        <span className="block font-bold text-sm text-ink mb-0.5">
          {scenario.title}
        </span>
        <span className="block text-xs text-muted leading-snug">
          {scenario.subtitle}
        </span>
      </span>
      <ArrowRightIcon size={18} className="ml-auto self-center text-faint flex-none" />
    </Card>
  );
}
