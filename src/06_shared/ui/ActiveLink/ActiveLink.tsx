'use client';

import type { ComponentRef, ReactNode, Ref } from 'react';
import { Link, usePathname } from '@/shared/model/libs/i18n/navigation';
import { cn } from '@/shared/model/libs/cn';

type TProps = {
  href: string;
  className?: string;
  activeClassName?: string;
  onClick?: () => void;
  children: ReactNode;
  ref?: Ref<ComponentRef<typeof Link>>;
};

/**
 * Locale-aware link with current-route styling. Compares the next-intl
 * pathname (locale stripped) against the supplied `href` and applies
 * `activeClassName` + `aria-current="page"` when they match.
 *
 * Anchors (hrefs containing `#`) never get active styles — they jump within
 * a page rather than identifying it.
 */
export const ActiveLink = ({
  href,
  className,
  activeClassName,
  onClick,
  children,
  ref,
}: TProps) => {
  const pathname = usePathname();
  const isAnchor = href.includes('#');
  const isActive =
    !isAnchor && (pathname === href || pathname.startsWith(`${href}/`));

  return (
    <Link
      ref={ref}
      href={href}
      onClick={onClick}
      aria-current={isActive ? 'page' : undefined}
      className={cn(className, isActive && activeClassName)}
    >
      {children}
    </Link>
  );
};
