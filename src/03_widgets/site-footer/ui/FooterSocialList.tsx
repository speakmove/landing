import type { ReactElement } from 'react';
import { getList } from '@/shared/model/libs/i18n/get-list';
import { isSafeHref } from '@/shared/model/utils';
import { getTranslations } from 'next-intl/server';
import { InstagramIcon, LinkedinIcon, TelegramIcon, ThreadsIcon } from '@/shared/ui';

type TSocialLink = {
  id: string;
  label: string;
  ariaLabel: string;
  href: string;
};

const ICONS: Record<string, ReactElement> = {
  instagram: <InstagramIcon size={24} />,
  telegram: <TelegramIcon size={24} />,
  linkedin: <LinkedinIcon size={24} />,
  threads: <ThreadsIcon size={24} />,
};

export const FooterSocialList = async () => {
  const t = await getTranslations('HomePage.footer');
  const socialLinks = getList<TSocialLink>(t, 'socialLinks').filter((s) =>
    isSafeHref(s.href),
  );

  return (
    <ul className="m-0 flex list-none gap-2 p-0" aria-label={t('socialTitle')}>
      {socialLinks.map((item) => (
        <li key={item.id}>
          <a
            href={item.href}
            aria-label={item.ariaLabel}
            target="_blank"
            rel="noopener noreferrer"
            className="foot-soc"
          >
            {ICONS[item.id.toLowerCase()] ?? <span aria-hidden="true">{item.label[0]}</span>}
          </a>
        </li>
      ))}
    </ul>
  );
};
