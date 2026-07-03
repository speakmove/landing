import { env } from '@/shared/model/libs/env';

const BOT_USERNAME = env.NEXT_PUBLIC_DEV_MODE ? 'speakmove_dev_bot' : 'speakmove_bot';
const BOT_CHANNEL = env.NEXT_PUBLIC_DEV_MODE ? 'speakmove_dev' : '@speakmove';

export const URLS = {
  telegramBot: `https://t.me/${BOT_USERNAME}`,
  telegramChannel: `https://t.me/${BOT_CHANNEL}`,
  instagram: 'https://instagram.com/speakmove',
  tiktok: 'https://tiktok.com/@speakmove',
  youtube: 'https://youtube.com/@speakmove',
  twitter: 'https://x.com/speakmove',
  icoRegistry: 'https://ico.org.uk/ESDWebPages/Search',
  contactEmail: 'mailto:hi@speakmove.app',
} as const;
