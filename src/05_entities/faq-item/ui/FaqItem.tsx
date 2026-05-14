import { cn } from '@/shared/model/libs/cn';
import { InlineMarkdown, PlusIcon } from '@/shared/ui';
import type { TFaqItem } from '../model/types';

type TProps = {
  item: TFaqItem;
};

export const FaqItem = ({ item }: TProps) => {
  return (
    <li>
      <details className="group border-b border-line py-4">
        <summary
          className={cn(
            'flex cursor-pointer items-start justify-between gap-4',
            'text-base font-semibold text-ink leading-snug',
            'list-none [&::-webkit-details-marker]:hidden',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
          )}
        >
          <span>{item.question}</span>
          <span
            className="mt-0.5 shrink-0 text-muted transition-transform group-open:rotate-45"
            aria-hidden="true"
          >
            <PlusIcon size={16} />
          </span>
        </summary>
        <div className="mt-3 text-sm text-muted leading-relaxed">
          <InlineMarkdown text={item.answer} />
        </div>
      </details>
    </li>
  );
};
