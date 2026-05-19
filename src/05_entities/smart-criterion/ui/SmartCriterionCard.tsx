import type { TSmartCriterion } from '../model/types';

type TProps = {
  criterion: TSmartCriterion;
};

export const SmartCriterionCard = ({ criterion }: TProps) => {
  return (
    <article className="card-hover flex h-full flex-col gap-4 rounded-card border border-line bg-white p-6 shadow-(--shadow-soft)">
      <div className="flex items-center gap-3">
        <div
          aria-hidden="true"
          className="grid h-12 w-12 flex-none place-items-center rounded-full bg-primary font-mono text-22 font-extrabold text-white"
        >
          {criterion.letter}
        </div>
        <div>
          <div className="font-mono text-mini font-semibold uppercase tracking-wider text-muted">
            {criterion.eng}
          </div>
          <div className="text-17 font-bold leading-tight text-ink">
            {criterion.title}
          </div>
        </div>
      </div>
      <p className="m-0 text-sm leading-relaxed text-muted">{criterion.description}</p>
    </article>
  );
};
