import { cn } from '@/shared/model/libs/cn';

type TProps = {
  kicker?: string;
  title: string;
  titleId?: string;
  subtitle?: string;
  className?: string;
  align?: 'center' | 'start';
};

export const SectionHead = ({
  kicker,
  title,
  titleId,
  subtitle,
  className,
  align = 'center',
}: TProps) => {
  return (
    <div
      className={cn(
        'mb-10 max-w-170 md:mb-12',
        align === 'center' ? 'mx-auto text-center' : 'text-left',
        className,
      )}
    >
      {kicker ? <span className="section-eyebrow">{kicker}</span> : null}
      <h2
        id={titleId}
        className="section-title mb-3 text-balance text-ink"
      >
        {title}
      </h2>
      {subtitle ? (
        <p className="m-0 text-pretty text-[17px] text-muted">{subtitle}</p>
      ) : null}
    </div>
  );
};
