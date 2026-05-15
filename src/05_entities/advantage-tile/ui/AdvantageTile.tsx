import { getTranslations } from 'next-intl/server';
import { cn } from '@/shared/model/libs/cn';
import { Icon } from '@/shared/ui';
import type { TAdvantageTile } from '../model/types';

type TProps = {
  tile: TAdvantageTile;
  className?: string;
};

const VoiceIcon = () => (
  <Icon size={20} strokeWidth={2}>
    <rect x="9" y="2" width="6" height="12" rx="3" />
    <path d="M5 10v2a7 7 0 0 0 14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="22" />
  </Icon>
);

const CoinsIcon = () => (
  <Icon size={20} strokeWidth={2}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </Icon>
);

const CefrIcon = () => (
  <Icon size={20} strokeWidth={2}>
    <path d="M3 3v18h18" />
    <rect x="7" y="12" width="3" height="6" />
    <rect x="12" y="8" width="3" height="10" />
    <rect x="17" y="5" width="3" height="13" />
  </Icon>
);

const HomeworkIcon = () => (
  <Icon size={20} strokeWidth={2}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="9" y1="13" x2="15" y2="13" />
    <line x1="9" y1="17" x2="15" y2="17" />
  </Icon>
);

const CertificateIcon = () => (
  <Icon size={20} strokeWidth={2}>
    <circle cx="12" cy="8" r="6" />
    <polyline points="9 14 6 22 12 18 18 22 15 14" />
  </Icon>
);

const TILE_ICONS: Record<string, () => React.ReactElement> = {
  voice: VoiceIcon,
  coins: CoinsIcon,
  cefr: CefrIcon,
  homework: HomeworkIcon,
  certificate: CertificateIcon,
};

const TILE_ICON_TONE: Record<string, string> = {
  voice: 'bg-primary-pale text-primary',
  coins: 'bg-gold-pale text-[#7a5a12]',
  cefr: 'bg-primary-pale text-primary',
  homework: 'bg-gold-pale text-[#7a5a12]',
  certificate: 'bg-primary-pale text-primary',
};

/** Returns badge className based on the discriminated kind */
const badgeClass = (kind: string | undefined): string => {
  if (kind === 'coming-soon') return 'bg-primary-pale text-primary-ink';
  // 'new' and 'feature' both use gold accent
  return 'bg-gold-accent text-[#4a2e07]';
};

export const AdvantageTile = async ({ tile, className }: TProps) => {
  const tCommon = await getTranslations('Common');
  const IconCmp = TILE_ICONS[tile.id] ?? VoiceIcon;
  const iconTone = TILE_ICON_TONE[tile.id] ?? 'bg-primary-pale text-primary';

  return (
    <article
      className={cn(
        'card-hover relative flex h-full flex-col overflow-hidden rounded-[18px] border border-line bg-white p-6 shadow-(--shadow-soft)',
        className,
      )}
    >
      {tile.badge ? (
        <span
          className={cn(
            'absolute right-4.5 top-4.5 rounded-full px-2 py-1 text-[10.5px] font-extrabold uppercase tracking-[0.04em]',
            badgeClass(tile.badge.kind),
          )}
        >
          {tile.badge.text}
        </span>
      ) : null}

      <div className={cn('grid h-10 w-10 place-items-center rounded-[11px]', iconTone)}>
        <IconCmp />
      </div>

      <h3 className="mt-3.5 mb-1.5 text-xl font-bold tracking-[-0.01em] text-ink">{tile.title}</h3>
      <p className="m-0 text-[14.5px] leading-[1.5] text-muted">{tile.description}</p>

      {tile.vizEquals ? (
        <div className="mt-4.5">
          <span className="inline-block rounded-lg border border-gold bg-gold-pale px-3 py-1.5 font-mono text-sm font-bold text-ink">
            {tile.vizEquals}
          </span>
          {tile.vizCap ? (
            <p className="mt-1.5 text-xs text-muted">{tile.vizCap}</p>
          ) : null}
        </div>
      ) : null}

      {tile.levels && tile.levels.length > 0 ? (
        <ul
          className="mt-4.5 flex flex-1 items-end gap-1 p-0"
          aria-label={tCommon('aria.cefrLevels')}
        >
          {tile.levels.map((level) => (
            <li key={level} className="flex-1 list-none">
              <span
                className={cn(
                  'block rounded-t-md py-1 text-center font-mono text-[10.5px] font-bold',
                  tile.currentLevel === level
                    ? 'bg-primary text-white shadow-[0_4px_12px_rgba(4,120,87,.25)]'
                    : 'bg-primary-pale text-primary-ink',
                )}
              >
                {level}
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      {tile.items && tile.items.length > 0 ? (
        <ul
          className="mt-4.5 flex flex-col gap-1.5 p-0"
          aria-label={tCommon('aria.tasks')}
        >
          {tile.items.map((item, idx) => {
            const isStar = idx === tile.items!.length - 1;
            return (
              <li
                key={item.label}
                className="flex items-center gap-2 rounded-[10px] bg-surface px-2.5 py-2 text-[13px]"
              >
                <span
                  className={cn(
                    'grid h-4.5 w-4.5 flex-none place-items-center rounded-[5px] text-[11px]',
                    isStar
                      ? 'bg-gold-accent text-[#4a2e07]'
                      : 'bg-primary text-white',
                  )}
                >
                  {isStar ? '★' : '✓'}
                </span>
                <span className="text-ink">{item.label}</span>
                {item.reward ? (
                  <span className="ml-auto font-mono text-[11px] font-bold text-[#7a5a12]">
                    {item.reward}
                  </span>
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : null}

      {tile.certificateName ? (
        <div className="mt-4.5 flex items-center gap-3 rounded-xl border border-dashed border-line-strong p-2.5">
          <span className="coin xl" aria-hidden="true">
            <span>{tile.currentLevel ?? 'A2'}</span>
          </span>
          <div>
            <div className="text-[13.5px] font-bold text-ink">{tile.certificateName}</div>
            {tile.certificateStatus ? (
              <div className="font-mono text-[12px] text-muted">{tile.certificateStatus}</div>
            ) : null}
          </div>
        </div>
      ) : null}
    </article>
  );
};
