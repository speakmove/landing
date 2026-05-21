import { CheckIcon, MicIcon } from '@/shared/ui';
import type { TPhoneFloatBubble } from '@/entities/phone-mockup';
import { cn } from '@/shared/model/libs/cn';

type TProps = {
  bubbles: TPhoneFloatBubble[];
};

const POSITIONS = ['absolute -left-7 top-32', 'absolute -right-6 bottom-15'] as const;
const ICON_BG = [
  'bg-gold-pale text-gold-mid',
  'bg-primary-pale text-primary-ink',
] as const;

/**
 * Decorative cards floating beside the phone frame.
 * First card uses the coin glyph, the second uses a checkmark — keep order in i18n.
 */
export const FloatingBubbleCards = ({ bubbles }: TProps) => {
  return (
    <>
      {bubbles.map((bubble, idx) => {
        const position = POSITIONS[idx] ?? POSITIONS[0];
        const bgClass = ICON_BG[idx] ?? ICON_BG[0];
        const Icon = idx === 0 ? MicIcon : CheckIcon;
        return (
          <div
            key={bubble.title}
            className={cn(
              position,
              'z-20 flex items-center gap-2.5 rounded-2xl border border-line bg-white px-3.5 py-2.5 shadow-(--shadow-mid)',
            )}
          >
            <span className={cn('grid h-7 w-7 flex-none place-items-center rounded-lg', bgClass)}>
              <Icon size={14} />
            </span>
            <div>
              <div className="text-13 font-bold">{bubble.title}</div>
              <div className="text-11-5 text-muted">{bubble.subtitle}</div>
            </div>
          </div>
        );
      })}
    </>
  );
};
