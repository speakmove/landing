import { getTranslations } from 'next-intl/server';
import { cn } from '@/shared/model/libs/cn';
import { getList } from '@/shared/model/libs/i18n/get-list';
import { Container } from '@/shared/ui';
import { HeroWaveformDecoration } from './HeroWaveformDecoration';
import { PageHeroTitle } from './PageHeroTitle';
import { StatPills } from './StatPills';

type TStat = {
  value: string;
  label: string;
};

type TDecoration = 'waveform';

type TProps = {
  namespace: string;
  decoration?: TDecoration;
};

export const PageHero = async ({ namespace, decoration }: TProps) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t = await getTranslations(namespace as any);
  const tCommon = await getTranslations('Common');

  const stats = getList<TStat>(t, 'stats');

  const hasWaveform = decoration === 'waveform';

  return (
    <header
      className={cn(
        'relative overflow-hidden px-5 pt-16 text-center md:px-6 md:pt-20',
        hasWaveform ? 'pb-28 md:pb-36' : 'pb-10',
      )}
    >
      <div aria-hidden="true" className="page-hero-bg" />
      {hasWaveform ? <HeroWaveformDecoration /> : null}

      <Container>
        <div className="relative z-10 mx-auto max-w-190">
          <div className="section-eyebrow !mb-0">{t('crumb')}</div>

          <PageHeroTitle title={t('title')} />

          <p className="mx-auto max-w-160 text-pretty text-lg text-muted">
            {t('description')}
          </p>

          {stats.length > 0 ? (
            <StatPills stats={stats} ariaLabel={tCommon('aria.statsGrid')} />
          ) : null}
        </div>
      </Container>
    </header>
  );
};
