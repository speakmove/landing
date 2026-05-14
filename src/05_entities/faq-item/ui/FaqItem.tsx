import { InlineMarkdown } from '@/shared/ui/InlineMarkdown';
import type { TFaqItem } from '../model/types';

type TProps = {
  item: TFaqItem;
};

export const FaqItem = ({ item }: TProps) => {
  return (
    <li>
      <details className="group border-b border-line py-4">
        <summary
          className={[
            'flex cursor-pointer items-start justify-between gap-4',
            'text-base font-semibold text-ink leading-snug',
            'list-none [&::-webkit-details-marker]:hidden',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
          ].join(' ')}
        >
          <span>{item.question}</span>
          <span
            className="mt-0.5 shrink-0 text-muted transition-transform group-open:rotate-45"
            aria-hidden="true"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 3v10M3 8h10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </summary>
        <div className="mt-3 text-sm text-muted leading-relaxed">
          <InlineMarkdown text={item.answer} />
        </div>
      </details>
    </li>
  );
}
