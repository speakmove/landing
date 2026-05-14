import { Icon } from '@/shared/ui';
import type { TScenario } from '../model/types';

type TProps = {
  scenario: TScenario;
};

const ChildIcon = () => (
  <Icon size={20} strokeWidth={2}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
    <circle cx="10" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M17 3.13a4 4 0 0 1 0 7.75" />
  </Icon>
);

const SelfIcon = () => (
  <Icon size={20} strokeWidth={2}>
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </Icon>
);

const ChevronRight = () => (
  <Icon size={18} strokeWidth={2}>
    <path d="M9 18l6-6-6-6" />
  </Icon>
);

export const ScenarioCard = ({ scenario }: TProps) => {
  const isChild = scenario.id === 'child';

  return (
    <button
      type="button"
      className="flex cursor-pointer items-start gap-3.5 rounded-2xl border border-line bg-white p-4 text-left shadow-(--shadow-soft) transition hover:-translate-y-0.5 hover:shadow-(--shadow-mid) hover:border-[color-mix(in_oklab,var(--color-primary)_35%,var(--color-line))] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <span
        className={
          isChild
            ? 'grid h-10 w-10 flex-none place-items-center rounded-xl bg-primary-pale text-primary-ink'
            : 'grid h-10 w-10 flex-none place-items-center rounded-xl bg-gold-pale text-[#7a5a12]'
        }
      >
        {isChild ? <ChildIcon /> : <SelfIcon />}
      </span>
      <span className="flex-1">
        <span className="mb-0.5 block text-[15px] font-bold text-ink">{scenario.title}</span>
        <span className="block text-[13px] leading-snug text-muted">{scenario.subtitle}</span>
      </span>
      <span className="ml-auto self-center text-faint">
        <ChevronRight />
      </span>
    </button>
  );
};
