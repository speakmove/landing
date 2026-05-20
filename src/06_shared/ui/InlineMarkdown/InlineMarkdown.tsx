import type { ReactNode } from 'react';
import { Link } from '@/shared/model/libs/i18n/navigation';

type TProps = {
  text: string;
};

// Supports:
// - **bold**         → <strong>
// - ~~strikethrough~~ → <s>
// - `code`           → <code>
// - [label](href)    → <Link> for internal (starts with /) or <a> for external

const TOKEN_RE = /(\*\*[^*]+\*\*|~~[^~]+~~|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;

export const InlineMarkdown = ({ text }: TProps) => {
  const parts = text.split(TOKEN_RE).filter((part) => part.length > 0);
  return <>{parts.map((part, idx) => renderPart(part, idx))}</>;
};

const renderPart = (part: string, key: number): ReactNode => {
  if (part.startsWith('**') && part.endsWith('**')) {
    return <strong key={key}>{part.slice(2, -2)}</strong>;
  }
  if (part.startsWith('~~') && part.endsWith('~~')) {
    return (
      <s key={key} className="text-muted opacity-75">
        {part.slice(2, -2)}
      </s>
    );
  }
  if (part.startsWith('`') && part.endsWith('`')) {
    return (
      <code
        key={key}
        className="rounded bg-surface px-1.5 py-0.5 font-mono text-[0.9em]"
      >
        {part.slice(1, -1)}
      </code>
    );
  }
  const linkMatch = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
  if (linkMatch) {
    const [, label, href] = linkMatch;
    if (href && href.startsWith('/')) {
      return (
        <Link
          key={key}
          href={href}
          className="text-primary underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {label}
        </Link>
      );
    }
    if (href) {
      return (
        <a
          key={key}
          href={href}
          rel={href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
          target={href.startsWith('http') ? '_blank' : undefined}
          className="text-primary underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {label}
        </a>
      );
    }
  }
  return <span key={key}>{part}</span>;
}
