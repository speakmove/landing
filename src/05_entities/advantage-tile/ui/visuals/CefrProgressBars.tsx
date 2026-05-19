import { getTranslations } from 'next-intl/server';
import { cn } from '@/shared/model/libs/cn';

type TProps = {
  levels: string[];
  currentLevel?: string;
};

/**
 * CEFR level progression — horizontal bars A1 → C1 with current step highlighted.
 */
export const CefrProgressBars = async ({ levels, currentLevel }: TProps) => {
  const tCommon = await getTranslations('Common');
  return (
    <ul
      className="mt-5 flex flex-1 items-end gap-1.5 p-0"
      aria-label={tCommon('aria.cefrLevels')}
    >
      {levels.map((level) => {
        const isActive = level === currentLevel;
        return (
          <li key={level} className="flex-1 list-none">
            <span
              className={cn(
                'block rounded-t-lg py-2 text-center font-mono text-xs font-bold',
                isActive
                  ? 'bg-primary text-white shadow-mid'
                  : 'bg-primary-pale text-primary-ink',
              )}
            >
              {level}
            </span>
          </li>
        );
      })}
    </ul>
  );
};
