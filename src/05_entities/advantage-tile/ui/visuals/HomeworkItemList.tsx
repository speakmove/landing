import { getTranslations } from 'next-intl/server';
import { cn } from '@/shared/model/libs/cn';
import { CheckIcon } from '@/shared/ui';

type TItem = {
  label: string;
  reward?: string;
};

type TProps = {
  items: TItem[];
};

/**
 * Homework task list with reward pills. Last item gets the gold "star" treatment.
 */
export const HomeworkItemList = async ({ items }: TProps) => {
  const tCommon = await getTranslations('Common');
  return (
    <ul
      className="mt-5 flex flex-col gap-2 p-0"
      aria-label={tCommon('aria.tasks')}
    >
      {items.map((item, idx) => {
        const isStar = idx === items.length - 1;
        return (
          <li
            key={item.label}
            className="flex items-center gap-2 rounded-xl bg-surface px-3 py-2 text-sm"
          >
            <span
              className={cn(
                'grid h-5 w-5 flex-none place-items-center rounded-md text-xs',
                isStar ? 'bg-gold-accent text-ink' : 'bg-primary text-white',
              )}
            >
              {isStar ? '★' : <CheckIcon size={12} />}
            </span>
            <span className="text-ink">{item.label}</span>
            {item.reward ? (
              <span className="ml-auto font-mono text-xs font-bold text-gold">
                {item.reward}
              </span>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
};
