import type { TFaqItem } from '../model/types';

type TTextSegment =
  | { type: 'text'; value: string }
  | { type: 'bold'; value: string }
  | { type: 'code'; value: string };

function parseInlineMarkdown(input: string): TTextSegment[] {
  const segments: TTextSegment[] = [];

  // Split by **bold** first
  const boldParts = input.split(/\*\*(.+?)\*\*/g);

  boldParts.forEach((part, index) => {
    // Even indices are plain text, odd indices are bold matches
    if (index % 2 === 1) {
      segments.push({ type: 'bold', value: part });
    } else {
      // Split plain text by `code`
      const codeParts = part.split(/`(.+?)`/g);
      codeParts.forEach((codePart, codeIndex) => {
        if (codeIndex % 2 === 1) {
          segments.push({ type: 'code', value: codePart });
        } else if (codePart) {
          segments.push({ type: 'text', value: codePart });
        }
      });
    }
  });

  return segments;
}

function InlineMarkdown({ text }: { text: string }) {
  const segments = parseInlineMarkdown(text);
  return (
    <>
      {segments.map((seg, i) => {
        if (seg.type === 'bold') {
          return <strong key={i}>{seg.value}</strong>;
        }
        if (seg.type === 'code') {
          return (
            <code
              key={i}
              className="rounded bg-[color:var(--color-surface)] px-1 py-0.5 text-[0.9em] font-mono"
            >
              {seg.value}
            </code>
          );
        }
        return <span key={i}>{seg.value}</span>;
      })}
    </>
  );
}

type TProps = {
  item: TFaqItem;
};

export function FaqItem({ item }: TProps) {
  return (
    <li>
      <details className="group border-b border-[color:var(--color-line)] py-4">
        <summary
          className={[
            'flex cursor-pointer items-start justify-between gap-4',
            'text-[16px] font-semibold text-[color:var(--color-ink)] leading-snug',
            'list-none [&::-webkit-details-marker]:hidden',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-primary)]',
          ].join(' ')}
        >
          <span>{item.question}</span>
          <span
            className="mt-0.5 shrink-0 text-[color:var(--color-muted)] transition-transform group-open:rotate-45"
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
        <div className="mt-3 text-[15px] text-[color:var(--color-muted)] leading-relaxed">
          <InlineMarkdown text={item.answer} />
        </div>
      </details>
    </li>
  );
}
