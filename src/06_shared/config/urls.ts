import { env } from '@/shared/model/libs/env';

const BOT_USERNAME = env.NODE_ENV === 'production' ? 'speakmove_bot' : 'speakmove_dev_bot';

export const URLS = {
  telegramBot: `https://t.me/${BOT_USERNAME}`,
  telegramChannel: 'https://t.me/speakmove',
  instagram: 'https://instagram.com/speakmove',
  tiktok: 'https://tiktok.com/@speakmove',
  youtube: 'https://youtube.com/@speakmove',
  twitter: 'https://x.com/speakmove',
  icoRegistry: 'https://ico.org.uk/ESDWebPages/Search',
  contactEmail: 'mailto:hi@speakmove.app',
} as const;
