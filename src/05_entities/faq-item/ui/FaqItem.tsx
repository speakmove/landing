import { InlineMarkdown } from '@/shared/ui';
import type { TFaqItem } from '../model/types';

export const FaqItem = ({ item }: { item: TFaqItem }) => {
  return (
    <li>
      <details className="faq-details overflow-hidden rounded-14 bg-white">
        <summary className="faq-summary flex cursor-pointer list-none items-center gap-3 px-5 py-4 text-15-5 font-semibold text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
          {item.question}
        </summary>
        <div className="px-5 pb-5 text-14-5 leading-relaxed text-muted">
          <InlineMarkdown text={item.answer} />
        </div>
      </details>
    </li>
  );
};
