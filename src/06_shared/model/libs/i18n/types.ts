import type ruMessages from '../../../../../messages/ru.json';
import type { routing } from './routing';

export type TLocale = (typeof routing.locales)[number];
export type TMessages = typeof ruMessages;
