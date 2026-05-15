import { getTranslations } from 'next-intl/server';

/**
 * Decorative iPhone 14 Pro mock-up of a Telegram chat with the bot.
 * The entire element is marked `aria-hidden` — it is purely visual.
 * Texts come from i18n; everything else is static design copied from the source HTML.
 */
export const HomePhonePreview = async () => {
  const t = await getTranslations('HomePage.hero.phonePreview');

  const botName = t('botName');
  const botStatus = t('botStatus');
  const coinBalance = t('coinBalance');
  const today = t('today');
  const userText = t('userText');
  const botPromptTitle = t('botPromptTitle');
  const botPromptQuestion = t('botPromptQuestion');
  const userVoiceDuration = t('userVoiceDuration');
  const botVoiceDuration = t('botVoiceDuration');
  const userVoiceTimestamp = t('userVoiceTimestamp');
  const botVoiceTimestamp = t('botVoiceTimestamp');
  const userTextTimestamp = t('userTextTimestamp');
  const botPromptTimestamp = t('botPromptTimestamp');
  const inputPlaceholder = t('inputPlaceholder');
  const langButtonUk = t('langButtonUk');
  const langButtonRu = t('langButtonRu');

  const sideCard1Title = t('sideCard1Title');
  const sideCard1Subtitle = t('sideCard1Subtitle');
  const sideCard2Title = t('sideCard2Title');
  const sideCard2Subtitle = t('sideCard2Subtitle');

  // Waveform bars — user (mint, #5b8a3b) and bot (blue, #1f3aa6).
  // 45 bars taken from source markup.
  const userWaveHeights = [
    4, 6, 8, 10, 6, 4, 6, 10, 14, 12, 8, 6, 10, 12, 8, 4, 8, 12, 16, 14, 10, 8, 6, 10, 14, 16, 12,
    8, 6, 4, 8, 10, 8, 6, 4, 6, 8, 6, 4, 6, 4, 3, 4, 3,
  ];
  const botWaveHeights = [
    4, 8, 6, 12, 8, 4, 10, 14, 12, 8, 6, 10, 14, 16, 12, 8, 6, 10, 14, 12, 8, 4, 8, 12, 16, 14, 10,
    6, 8, 12, 14, 10, 6, 8, 4, 6, 8, 6, 4, 3, 4, 3, 4, 3,
  ];

  return (
    <div className="relative" aria-hidden="true">
      {/* iPhone 14 Pro chassis: titanium frame */}
      <div
        className="relative mx-auto max-w-90 rounded-[55px] p-[3.5px] shadow-[var(--shadow-deep),0_0_0_1px_rgba(0,0,0,.06)]"
        style={{ background: 'linear-gradient(135deg, #6e6e72 0%, #2a2a2c 50%, #4a4a4d 100%)' }}
      >
        {/* Side buttons (decorative) */}
        <span className="absolute -left-[3px] top-[112px] h-6 w-[3.5px] rounded-l-[2px] bg-[#1d1d1f] shadow-[inset_-1px_0_0_rgba(255,255,255,.05)]" />
        <span className="absolute -left-[3px] top-[150px] h-[52px] w-[3.5px] rounded-l-[2px] bg-[#1d1d1f] shadow-[inset_-1px_0_0_rgba(255,255,255,.05)]" />
        <span className="absolute -left-[3px] top-[212px] h-[52px] w-[3.5px] rounded-l-[2px] bg-[#1d1d1f] shadow-[inset_-1px_0_0_rgba(255,255,255,.05)]" />
        <span className="absolute -right-[3px] top-[180px] h-[78px] w-[3.5px] rounded-r-[2px] bg-[#1d1d1f] shadow-[inset_1px_0_0_rgba(255,255,255,.05)]" />

        {/* Black bezel + display */}
        <div className="rounded-[51.5px] bg-black p-[1.5px]">
          <div
            className="relative flex min-h-180 flex-col overflow-hidden rounded-[50px]"
            style={{
              background:
                'linear-gradient(160deg, #afc78f 0%, #c2d094 35%, #d4d895 65%, #c7c887 100%)',
            }}
          >
            {/* Telegram doodle wallpaper */}
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full select-none"
              viewBox="0 0 360 720"
              preserveAspectRatio="xMidYMid slice"
              fill="none"
              stroke="#2f4a18"
              strokeWidth={1.3}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ opacity: 0.22 }}
            >
              <g transform="translate(28,110)">
                <path d="M0 14 Q0 0 14 0 Q18 0 20 4 Q22 14 30 14" />
              </g>
              <g transform="translate(110,120) rotate(20)">
                <path d="M0 8 Q0 0 8 0 Q16 0 16 8 Q12 16 8 16 Q4 16 0 8 M2 8 L14 8" />
              </g>
              <g transform="translate(180,60)">
                <path d="M9 14 C0 8 0 0 9 4 C18 0 18 8 9 14 Z" />
              </g>
              <g transform="translate(280,90) rotate(-12)">
                <path d="M0 6 Q5 0 14 6 Q18 0 22 6 L22 12 Q18 18 14 12 Q5 18 0 12 Z" />
                <circle cx="20" cy="6" r=".8" fill="#2f4a18" stroke="none" />
              </g>
              <g transform="translate(330,90) rotate(-5)">
                <circle cx="8" cy="8" r="8" />
                <circle cx="5" cy="6" r=".8" fill="#2f4a18" stroke="none" />
                <circle cx="11" cy="6" r=".8" fill="#2f4a18" stroke="none" />
                <path d="M4 10 Q8 14 12 10" />
              </g>
              <g transform="translate(310,180)">
                <path d="M2 4 L14 4 L12 14 L4 14 Z M14 6 Q18 6 18 9 Q18 12 14 12" />
              </g>
              <g transform="translate(140,170) rotate(-10)">
                <path d="M0 8 Q-4 0 4 2 Q8 4 8 8 Q8 4 12 2 Q20 0 16 8 Q20 12 12 12 Q8 14 8 8 Q8 14 4 12 Q-4 12 0 8 Z" />
              </g>
              <g transform="translate(70,200)">
                <path d="M0 16 Q-2 20 2 20 Q6 20 6 16 L6 4 L20 2 L20 14 Q18 18 22 18 Q26 18 26 14 L26 0" />
              </g>
              <g transform="translate(200,260)">
                <path d="M0 10 Q0 4 5 4 Q7 0 12 2 Q17 0 20 4 Q26 4 26 10 Q26 14 22 14 L4 14 Q0 14 0 10" />
              </g>
              <g transform="translate(290,220) rotate(8)">
                <path d="M0 8 Q0 0 11 0 Q22 0 22 8 L0 8 M7 8 L7 16 L15 16 L15 8" />
              </g>
              <g transform="translate(40,290)">
                <path d="M9 0 L11 6 L18 6 L12 10 L14 17 L9 13 L4 17 L6 10 L0 6 L7 6 Z" />
              </g>
              <g transform="translate(310,300)">
                <circle cx="8" cy="8" r="5" />
                <line x1="8" y1="0" x2="8" y2="2" />
                <line x1="8" y1="14" x2="8" y2="16" />
                <line x1="0" y1="8" x2="2" y2="8" />
                <line x1="14" y1="8" x2="16" y2="8" />
                <line x1="2.3" y1="2.3" x2="3.7" y2="3.7" />
                <line x1="12.3" y1="12.3" x2="13.7" y2="13.7" />
                <line x1="13.7" y1="2.3" x2="12.3" y2="3.7" />
                <line x1="3.7" y1="12.3" x2="2.3" y2="13.7" />
              </g>
              <g transform="translate(220,360)">
                <path d="M0 6 Q0 0 6 0 Q9 1 12 0 Q18 0 18 6 Q18 14 9 16 Q0 14 0 6 M9 0 Q11 -3 14 -2" />
              </g>
              <g transform="translate(280,360) rotate(-6)">
                <path d="M2 7 L0 0 L7 5 L13 5 L20 0 L18 7 Q20 14 10 16 Q0 14 2 7 Z" />
                <circle cx="7" cy="9" r=".8" fill="#2f4a18" stroke="none" />
                <circle cx="13" cy="9" r=".8" fill="#2f4a18" stroke="none" />
              </g>
              <g transform="translate(50,400)">
                <path d="M0 4 Q0 0 12 0 Q24 0 24 4 M0 6 L24 6 Q24 8 22 8 Q22 10 20 10 L4 10 Q2 10 2 8 Q0 8 0 6 M0 12 Q0 16 12 16 Q24 16 24 12" />
              </g>
              <g transform="translate(195,430)">
                <circle cx="8" cy="8" r="3" />
                <path d="M8 0 Q11 3 8 5 M8 16 Q5 13 8 11 M0 8 Q3 5 5 8 M16 8 Q13 11 11 8" />
              </g>
              <g transform="translate(160,470)">
                <path d="M5 0 L3 4 L7 4 Z M0 6 L10 6 L11 18 Q5 21 -1 18 Z M2 9 L4 12 M6 9 L8 12 M3 12 L5 15 M7 12 L9 15" />
              </g>
              <g transform="translate(80,510)">
                <circle cx="9" cy="9" r="9" />
                <circle cx="9" cy="9" r="3" />
              </g>
              <g transform="translate(305,520) rotate(8)">
                <path d="M0 8 Q0 0 8 0 Q16 0 16 8 Z M2 8 L8 18 L14 8 M4 12 L12 12" />
              </g>
              <g transform="translate(150,540)">
                <path d="M0 8 A 9 9 0 1 0 12 0 A 7 7 0 1 1 0 8 Z" />
              </g>
              <g transform="translate(245,560)">
                <path d="M0 8 Q4 4 8 8 Q12 12 16 8 Q20 4 24 8" />
              </g>
              <g transform="translate(30,580)">
                <path d="M0 12 L4 12 Q4 4 12 4 Q20 4 20 12 Q20 16 14 16 Q10 16 10 12 Q10 9 12 9 M22 4 L24 0 M22 4 L20 0" />
              </g>
              <g transform="translate(60,650)">
                <circle cx="9" cy="9" r="9" />
                <circle cx="9" cy="9" r="3" />
              </g>
              <g transform="translate(280,660) rotate(15)">
                <path d="M0 6 Q5 0 14 6 Q18 0 22 6 L22 12 Q18 18 14 12 Q5 18 0 12 Z" />
                <circle cx="20" cy="6" r=".8" fill="#2f4a18" stroke="none" />
              </g>
              <g transform="translate(170,680)">
                <path d="M9 0 L11 6 L18 6 L12 10 L14 17 L9 13 L4 17 L6 10 L0 6 L7 6 Z" />
              </g>
            </svg>

            {/* iOS status bar */}
            <div className="relative z-10 flex items-center justify-between px-6 pt-3 text-[#1a1a1a]">
              <span className="text-[15px] font-bold tabular-nums">11:00</span>
              <div className="absolute left-1/2 top-2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-[#1f3aa6] px-3 py-1 shadow-[0_2px_6px_rgba(0,0,0,.18)]">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="white">
                  <path d="M22 2 L2 9 L11 13 L15 22 Z" />
                </svg>
                <span className="text-[10px] font-extrabold tracking-[0.08em] text-white">
                  TELEGRAM
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg width="17" height="11" viewBox="0 0 17 11" fill="#1a1a1a">
                  <rect x="0" y="7" width="3" height="4" rx="0.5" />
                  <rect x="4.5" y="5" width="3" height="6" rx="0.5" />
                  <rect x="9" y="3" width="3" height="8" rx="0.5" />
                  <rect x="13.5" y="0" width="3" height="11" rx="0.5" opacity=".4" />
                </svg>
                <svg width="14" height="10" viewBox="0 0 16 12" fill="#1a1a1a">
                  <path d="M8 0C4.5 0 1.5 1.4 0 3.2L1.7 4.7C2.9 3.4 5.3 2.3 8 2.3S13.1 3.4 14.3 4.7L16 3.2C14.5 1.4 11.5 0 8 0ZM8 4.7C5.7 4.7 3.6 5.6 2.3 7L4 8.5C4.9 7.6 6.4 6.9 8 6.9S11.1 7.6 12 8.5L13.7 7C12.4 5.6 10.3 4.7 8 4.7ZM8 9.3c-1 0-2 .5-2.5 1.2L8 12 10.5 10.5C10 9.8 9 9.3 8 9.3Z" />
                </svg>
                <div className="flex items-center">
                  <span className="mr-1 text-[10px] font-extrabold tabular-nums">35</span>
                  <div className="relative h-3 w-6 rounded-[3px] border-[1.2px] border-[#1a1a1a]/60">
                    <div className="absolute bottom-[1.5px] left-[1.5px] top-[1.5px] w-[35%] rounded-[1px] bg-[#1a1a1a]" />
                  </div>
                  <div className="ml-[1px] h-[5px] w-[2px] rounded-r-[1px] bg-[#1a1a1a]/60" />
                </div>
              </div>
            </div>

            {/* Header pills */}
            <div className="relative z-10 mt-3 flex items-center gap-2 px-3 pb-1">
              <div className="flex flex-none items-center gap-1 rounded-full bg-[#f1f4dd]/95 py-2 pl-2.5 pr-2 shadow-[0_2px_6px_rgba(0,0,0,.07)]">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1a1a1a"
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                <span className="grid h-[18px] w-[18px] place-items-center rounded-full bg-[#1a1a1a] text-[10.5px] font-bold leading-none text-white">
                  2
                </span>
              </div>
              <div className="flex-1 rounded-full bg-[#f1f4dd]/95 px-4 py-1.5 text-center shadow-[0_2px_6px_rgba(0,0,0,.07)]">
                <div className="text-[15px] font-extrabold leading-tight">{botName}</div>
                <div className="text-[11.5px] leading-tight text-[#6b7d4c]">{botStatus}</div>
              </div>
              <div
                className="grid h-10 w-10 flex-none place-items-center rounded-full shadow-[0_2px_6px_rgba(0,0,0,.1)] ring-[2.5px] ring-[#f1f4dd]/95"
                style={{ background: 'linear-gradient(135deg, #db8cfc 0%, #b06bf0 100%)' }}
              >
                <span className="text-[12px] font-extrabold text-white">{coinBalance}</span>
              </div>
            </div>

            {/* Chat area */}
            <div className="relative z-10 flex flex-1 flex-col justify-end gap-1.5 px-3 pb-2">
              <div className="mb-1 flex justify-center">
                <span className="rounded-full bg-[#5d8a47]/85 px-3 py-[3px] text-[12px] font-semibold text-white backdrop-blur-sm">
                  {today}
                </span>
              </div>

              {/* 1. User voice message (right, mint) */}
              <div className="flex justify-end">
                <div className="relative inline-flex flex-col gap-1 rounded-[18px] rounded-br-[3px] bg-[#dbf3c9] px-3 pb-1.5 pt-2.5 shadow-[0_1px_2px_rgba(0,0,0,.06)]">
                  <svg
                    width="12"
                    height="13"
                    viewBox="0 0 12 13"
                    className="pointer-events-none absolute -right-[9px] bottom-0"
                  >
                    <path d="M0 0 L0 13 L11 13 Q5 6 0 0 Z" fill="#dbf3c9" />
                  </svg>
                  <div className="flex items-center gap-3">
                    <span className="grid h-12 w-12 flex-none place-items-center rounded-full bg-[#5b8a3b] text-white shadow-[0_2px_5px_rgba(91,138,59,.4)]">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 12 12"
                        fill="currentColor"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        strokeLinejoin="round"
                        strokeLinecap="round"
                      >
                        <path d="M4 1.8 L4 10.2 L10.4 6 Z" />
                      </svg>
                    </span>
                    <div className="flex flex-col items-start gap-1">
                      <svg width="142" height="18" viewBox="0 0 142 18" className="block">
                        <g fill="#5b8a3b">
                          {userWaveHeights.map((h, i) => (
                            <rect
                              key={i}
                              x={i * 3.2}
                              y={9 - h / 2}
                              width="1.6"
                              height={h}
                              rx="0.8"
                            />
                          ))}
                        </g>
                      </svg>
                      <span className="inline-flex items-center gap-1.5 text-[12px] font-medium leading-none text-[#5b8a3b]">
                        {userVoiceDuration}
                        <span className="block h-1 w-1 rounded-full bg-[#5b8a3b]" />
                      </span>
                    </div>
                  </div>
                  <span className="mt-0.5 inline-flex items-center gap-0.5 self-end whitespace-nowrap text-[11px] leading-none text-[#5b8a3b]">
                    {userVoiceTimestamp}
                    <svg
                      width="14"
                      height="9"
                      viewBox="0 0 15 11"
                      fill="none"
                      stroke="#5b8a3b"
                      strokeWidth={1.6}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 5.5 L4 8.5 L9 2" />
                      <path d="M8 8.5 L13 2" />
                    </svg>
                  </span>
                </div>
              </div>

              {/* 2. Bot voice reply (left, white) */}
              <div className="flex justify-start">
                <div className="relative inline-flex flex-col gap-1 rounded-[18px] rounded-bl-[3px] bg-white px-3 pb-1.5 pt-2.5 shadow-[0_1px_2px_rgba(0,0,0,.06)]">
                  <svg
                    width="12"
                    height="13"
                    viewBox="0 0 12 13"
                    className="pointer-events-none absolute -left-[9px] bottom-0"
                  >
                    <path d="M12 0 L12 13 L1 13 Q7 6 12 0 Z" fill="white" />
                  </svg>
                  <div className="flex items-center gap-3">
                    <span className="grid h-12 w-12 flex-none place-items-center rounded-full bg-[#1f3aa6] text-white shadow-[0_2px_5px_rgba(31,58,166,.4)]">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 12 12"
                        fill="currentColor"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        strokeLinejoin="round"
                        strokeLinecap="round"
                      >
                        <path d="M4 1.8 L4 10.2 L10.4 6 Z" />
                      </svg>
                    </span>
                    <div className="flex flex-col items-start gap-1">
                      <svg width="142" height="18" viewBox="0 0 142 18" className="block">
                        <g fill="#1f3aa6">
                          {botWaveHeights.map((h, i) => (
                            <rect
                              key={i}
                              x={i * 3.2}
                              y={9 - h / 2}
                              width="1.6"
                              height={h}
                              rx="0.8"
                            />
                          ))}
                        </g>
                      </svg>
                      <span className="inline-flex items-center gap-1.5 text-[12px] font-medium leading-none text-[#1f3aa6]">
                        {botVoiceDuration}
                        <span className="block h-1 w-1 rounded-full bg-[#1f3aa6]" />
                      </span>
                    </div>
                  </div>
                  <span className="mt-0.5 self-end whitespace-nowrap text-[11px] leading-none text-[#9aa0b3]">
                    {botVoiceTimestamp}
                  </span>
                </div>
              </div>

              {/* 3. User text bubble (right, mint) */}
              <div className="flex justify-end">
                <div className="relative inline-flex max-w-[80%] items-end gap-1.5 rounded-[18px] rounded-br-[3px] bg-[#dbf3c9] py-2 pl-3.5 pr-2.5 shadow-[0_1px_2px_rgba(0,0,0,.06)]">
                  <svg
                    width="12"
                    height="13"
                    viewBox="0 0 12 13"
                    className="pointer-events-none absolute -right-[9px] bottom-0"
                  >
                    <path d="M0 0 L0 13 L11 13 Q5 6 0 0 Z" fill="#dbf3c9" />
                  </svg>
                  <span className="text-[14.5px] text-[#0c1f04]">{userText}</span>
                  <span className="inline-flex items-center gap-0.5 whitespace-nowrap pb-[1px] text-[10.5px] leading-none text-[#5b8a3b]">
                    {userTextTimestamp}
                    <svg
                      width="14"
                      height="9"
                      viewBox="0 0 15 11"
                      fill="none"
                      stroke="#5b8a3b"
                      strokeWidth={1.6}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 5.5 L4 8.5 L9 2" />
                      <path d="M8 8.5 L13 2" />
                    </svg>
                  </span>
                </div>
              </div>

              {/* 4. Bot reply bubble + inline keyboard */}
              <div className="flex justify-start">
                <div className="flex w-65 flex-col items-stretch gap-1">
                  <div className="relative rounded-[18px] rounded-bl-[3px] bg-white px-3 py-2 shadow-[0_1px_2px_rgba(0,0,0,.06)]">
                    <svg
                      width="12"
                      height="13"
                      viewBox="0 0 12 13"
                      className="pointer-events-none absolute -left-[9px] bottom-0"
                    >
                      <path d="M12 0 L12 13 L1 13 Q7 6 12 0 Z" fill="white" />
                    </svg>
                    <div className="text-[13px] font-bold leading-tight text-[#1f3aa6]">
                      {botName}
                    </div>
                    <div className="mt-1 text-[14px] font-medium leading-snug text-[#1a1a1a]">
                      {botPromptTitle}
                    </div>
                    <div className="mt-1 text-[13px] leading-snug text-[#5a6471]">
                      {botPromptQuestion}
                    </div>
                    <div className="mt-1 text-right text-[10.5px] leading-none text-[#9aa0b3]">
                      {botPromptTimestamp}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <span className="rounded-[10px] bg-white/65 py-2 text-center text-[12.5px] font-semibold text-[#1f1f1f] shadow-[0_1px_2px_rgba(0,0,0,.04)] backdrop-blur-sm">
                      {langButtonUk}
                    </span>
                    <span className="rounded-[10px] bg-white/65 py-2 text-center text-[12.5px] font-semibold text-[#1f1f1f] shadow-[0_1px_2px_rgba(0,0,0,.04)] backdrop-blur-sm">
                      {langButtonRu}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Input bar */}
            <div className="relative z-10 flex items-center gap-2 px-3 py-3">
              <div className="grid h-10 w-10 flex-none place-items-center rounded-full bg-[#f1f4dd]/95 shadow-[0_2px_6px_rgba(0,0,0,.07)]">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#5b8a3b"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                </svg>
              </div>
              <div className="flex flex-1 items-center justify-between rounded-full bg-[#f1f4dd]/95 py-2.5 pl-4 pr-3 shadow-[0_2px_6px_rgba(0,0,0,.07)]">
                <span className="text-[14px] text-[#7a8a5e]">{inputPlaceholder}</span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#5b8a3b"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="9.5" />
                  <path d="M12 2.5 A 9.5 9.5 0 0 1 12 21.5" />
                  <circle cx="9" cy="10" r="1.1" fill="#5b8a3b" stroke="none" />
                  <circle cx="15" cy="10" r="1.1" fill="#5b8a3b" stroke="none" />
                  <path d="M8.5 14 Q12 17 15.5 14" />
                </svg>
              </div>
              <div className="grid h-10 w-10 flex-none place-items-center rounded-full bg-[#f1f4dd]/95 shadow-[0_2px_6px_rgba(0,0,0,.07)]">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#5b8a3b"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="9" y="2" width="6" height="12" rx="3" />
                  <path d="M5 10v2a7 7 0 0 0 14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="22" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating side cards (hidden on mobile) */}
      <div className="absolute -left-7 top-32 z-20 hidden items-center gap-2.5 rounded-2xl border border-line bg-white px-3.5 py-2.5 shadow-(--shadow-mid) sm:flex">
        <span className="grid h-7 w-7 flex-none place-items-center rounded-lg bg-gold-pale text-[#7a5a12]">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </span>
        <div>
          <div className="text-[13px] font-bold">{sideCard1Title}</div>
          <div className="text-[11.5px] text-muted">{sideCard1Subtitle}</div>
        </div>
      </div>
      <div className="absolute -right-5 bottom-15 z-20 hidden items-center gap-2.5 rounded-2xl border border-line bg-white px-3.5 py-2.5 shadow-(--shadow-mid) sm:flex">
        <span className="grid h-7 w-7 flex-none place-items-center rounded-lg bg-primary-pale text-primary-ink">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
        <div>
          <div className="text-[13px] font-bold">{sideCard2Title}</div>
          <div className="text-[11.5px] text-muted">{sideCard2Subtitle}</div>
        </div>
      </div>
    </div>
  );
};
