'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion';
import { cn } from '@/shared/model/libs/cn';
import { ArrowRightIcon, Container, MOTION_DURATION, MOTION_EASE, SectionHead } from '@/shared/ui';
import { buildBotUrl } from '@/shared/model/utils';
import { PhoneJourneyMount, usePhoneJourneyContext } from '@/widgets/phone-journey';
import { SCENARIO_PHONE_CONTENT } from '../model/phone-content';
import type { TScenarioCard } from '../model/types';

type TProps = {
  cards: TScenarioCard[];
  locale: string;
  kicker: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
};

export const ScenariosDesktopJourney = ({
  cards,
  locale,
  kicker,
  title,
  subtitle,
  ctaLabel,
}: TProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const shouldReduce = useReducedMotion();
  const { setActiveContent } = usePhoneJourneyContext();

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const idx = Math.min(Math.floor(v * cards.length), cards.length - 1);
    setActiveIndex(idx);
  });

  // Push active scenario content to PhoneJourney as the index changes.
  useEffect(() => {
    const card = cards[activeIndex];
    if (!card) return;
    const content = SCENARIO_PHONE_CONTENT[card.id];
    if (content) {
      setActiveContent({ botName: content.botName, messages: content.messages });
    }
    // Don't null content on unmount — Hero slot reclaims ownership when scrolled back.
  }, [activeIndex, cards, setActiveContent]);

  return (
    <div ref={scrollRef} className="scenarios-scroll-region relative hidden lg:block">
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
        <Container className="pt-14 md:pt-20">
          <SectionHead
            kicker={kicker}
            title={title}
            titleId="scenarios-grid-heading"
            subtitle={subtitle}
          />
        </Container>
        <Container className="flex flex-1 items-center gap-12 pb-8">
          <div className="flex-shrink-0">
            <PhoneJourneyMount
              role="target"
              className="phone-preview-wrap phone-preview-wrap--scenarios"
              aspect="9 / 19.5"
            />
          </div>
          <div className="flex flex-1 flex-col gap-2">
            {cards.map((card, i) => {
              const isActive = i === activeIndex;
              return (
                <motion.a
                  key={card.id}
                  href={buildBotUrl(locale, card.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  animate={{
                    opacity: isActive ? 1 : 0.45,
                    scale: shouldReduce ? 1 : isActive ? 1 : 0.98,
                  }}
                  transition={{ duration: MOTION_DURATION.base, ease: MOTION_EASE.out }}
                  className={cn(
                    'group flex min-w-0 items-center gap-4 rounded-card border p-4 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
                    isActive
                      ? 'border-primary bg-white shadow-(--shadow-soft)'
                      : 'border-line bg-white/60',
                  )}
                  aria-label={`${ctaLabel} — ${card.title}`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="m-0 truncate text-base font-bold tracking-tight text-ink">
                        {card.title}
                      </h3>
                      <span className="shrink-0 rounded-full bg-surface px-2 py-0.5 font-mono text-mini font-semibold text-muted">
                        {card.duration}
                      </span>
                    </div>
                    <p className="m-0 mt-0.5 text-13 font-medium text-primary">{card.aiRole}</p>
                  </div>
                  <ArrowRightIcon
                    size={14}
                    className="shrink-0 text-primary opacity-0 transition-opacity group-hover:opacity-100"
                  />
                </motion.a>
              );
            })}
          </div>
        </Container>
      </div>
      {/* Spacer: gives the sticky container scroll-length === 8 stops × viewport (token --height-journey-spacer = 800vh). */}
      <div className="h-(--height-journey-spacer)" aria-hidden="true" />
    </div>
  );
};
