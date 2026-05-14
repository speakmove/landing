import { getTranslations } from 'next-intl/server';
import { MicIcon } from '@/shared/ui';
import { ChatMessage } from '@/entities/chat-message';
import { FloatBubble } from '@/entities/float-bubble';
import type { TChatMessage } from '@/entities/chat-message';
import type { TFloatBubble } from '@/entities/float-bubble';

export const HomePhonePreview = async () => {
  const t = await getTranslations('HomePage.hero.phonePreview');
  const tCommon = await getTranslations('Common');

  const messages = t.raw('messages') as unknown as TChatMessage[];
  const floatBubbles = t.raw('floatBubbles') as unknown as TFloatBubble[];

  const botName = t('botName');
  const botStatus = t('botStatus');
  const coinBalance = t('coinBalance');
  const micLabel = t('micLabel');
  const micTime = t('micTime');

  return (
    <div className="relative" aria-hidden="true">
      {/* Float bubbles — decorative, positioned outside the phone */}
      <div className="absolute -right-4 top-12 z-20 hidden lg:flex flex-col gap-3">
        {floatBubbles.map((bubble, i) => (
          <FloatBubble key={i} bubble={bubble} className="w-40" />
        ))}
      </div>

      {/* iPhone frame */}
      <div
        className="max-w-80 mx-auto rounded-[52px] p-[3.5px] shadow-[0_24px_60px_rgba(0,0,0,.22),0_0_0_1px_rgba(0,0,0,.06)] relative"
        style={{ background: 'linear-gradient(135deg,#6e6e72 0%,#2a2a2c 50%,#4a4a4d 100%)' }}
      >
        {/* Side buttons (purely decorative) */}
        <span className="absolute -left-[3px] top-[112px] w-[3.5px] h-6 rounded-l-[2px] bg-[#1d1d1f]" />
        <span className="absolute -left-[3px] top-[150px] w-[3.5px] h-[52px] rounded-l-[2px] bg-[#1d1d1f]" />
        <span className="absolute -left-[3px] top-[212px] w-[3.5px] h-[52px] rounded-l-[2px] bg-[#1d1d1f]" />
        <span className="absolute -right-[3px] top-[180px] w-[3.5px] h-[78px] rounded-r-[2px] bg-[#1d1d1f]" />

        {/* Black bezel */}
        <div className="bg-black rounded-[48.5px] p-[1.5px]">
          <div
            className="rounded-[47px] overflow-hidden flex flex-col"
            style={{
              background: 'linear-gradient(160deg,#afc78f 0%,#c2d094 35%,#d4d895 65%,#c7c887 100%)',
              minHeight: '640px',
            }}
          >
            {/* iOS status bar */}
            <div className="flex items-center justify-between px-5 pt-3 pb-1 text-[#1a1a1a]">
              <span className="font-bold text-sm tabular-nums">11:00</span>
              <div className="absolute left-1/2 top-3 -translate-x-1/2 inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#1f3aa6] rounded-full">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
                  <path d="M22 2 L2 9 L11 13 L15 22 Z" />
                </svg>
                <span className="text-white text-[9px] font-extrabold tracking-[0.08em]">
                  TELEGRAM
                </span>
              </div>
              <div className="flex items-center gap-1">
                <svg width="15" height="10" viewBox="0 0 17 11" fill="#1a1a1a">
                  <rect x="0" y="7" width="3" height="4" rx="0.5" />
                  <rect x="4.5" y="5" width="3" height="6" rx="0.5" />
                  <rect x="9" y="3" width="3" height="8" rx="0.5" />
                  <rect x="13.5" y="0" width="3" height="11" rx="0.5" opacity=".4" />
                </svg>
                <svg width="13" height="10" viewBox="0 0 16 12" fill="#1a1a1a">
                  <path d="M8 0C4.5 0 1.5 1.4 0 3.2L1.7 4.7C2.9 3.4 5.3 2.3 8 2.3S13.1 3.4 14.3 4.7L16 3.2C14.5 1.4 11.5 0 8 0ZM8 4.7C5.7 4.7 3.6 5.6 2.3 7L4 8.5C4.9 7.6 6.4 6.9 8 6.9S11.1 7.6 12 8.5L13.7 7C12.4 5.6 10.3 4.7 8 4.7ZM8 9.3c-1 0-2 .5-2.5 1.2L8 12 10.5 10.5C10 9.8 9 9.3 8 9.3Z" />
                </svg>
              </div>
            </div>

            {/* Telegram chat header */}
            <div className="flex items-center gap-2 px-3 mt-2 pb-2">
              <div className="flex items-center gap-1 pl-2 pr-1.5 py-1.5 bg-[#f1f4dd]/95 rounded-full flex-none">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1a1a1a"
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                <span className="w-[16px] h-[16px] rounded-full bg-[#1a1a1a] text-white text-[9.5px] font-bold grid place-items-center leading-none">
                  2
                </span>
              </div>
              <div className="flex-1 bg-[#f1f4dd]/95 rounded-full px-3 py-1 text-center">
                <div className="font-extrabold text-sm leading-tight">{botName}</div>
                <div className="text-[10.5px] text-[#6b7d4c] leading-tight">{botStatus}</div>
              </div>
              <div
                className="w-9 h-9 rounded-full grid place-items-center flex-none ring-[2px] ring-[#f1f4dd]/95"
                style={{ background: 'linear-gradient(135deg,#4CAF50 0%,#2E7D32 100%)' }}
              >
                <span className="text-white text-[11px] font-extrabold">{coinBalance}</span>
              </div>
            </div>

            {/* Chat messages */}
            <div className="flex-1 flex flex-col justify-end gap-1.5 px-2.5 pb-2">
              <div className="flex justify-center mb-1">
                <span className="px-3 py-[3px] bg-[#5d8a47]/85 text-white text-[11px] font-semibold rounded-full">
                  {tCommon('today')}
                </span>
              </div>

              {messages.map((msg, i) => (
                <ChatMessage key={i} message={msg} />
              ))}

              {/* Voice input mock */}
              <div className="mt-1 flex items-center gap-2 bg-white/90 rounded-full px-3 py-2 border border-line">
                <span className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center flex-none">
                  <MicIcon size={10} className="text-white" />
                </span>
                <span className="text-xs text-muted font-medium">
                  {micLabel}
                </span>
                <span className="ml-auto text-[11px] text-red-500 font-bold tabular-nums">
                  {micTime}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Float bubbles on mobile — below phone */}
      <div className="flex gap-3 mt-4 justify-center lg:hidden">
        {floatBubbles.map((bubble, i) => (
          <FloatBubble key={i} bubble={bubble} className="flex-1 max-w-40" />
        ))}
      </div>
    </div>
  );
}
