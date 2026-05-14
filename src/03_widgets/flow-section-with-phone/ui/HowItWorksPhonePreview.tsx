import { ChatMessage } from '@/entities/chat-message';
import type { TChatMessage } from '@/entities/chat-message';

type TPhonePreview = {
  botName: string;
  botStatus: string;
  messages: TChatMessage[];
};

type TProps = {
  preview: TPhonePreview;
};

/** Minimal phone shell for HowItWorks page — no floatBubbles needed */
export const HowItWorksPhonePreview = ({ preview }: TProps) => {
  return (
    <div aria-hidden="true" className="lg:sticky lg:top-[88px]">
      <div
        className="w-full max-w-90 mx-auto rounded-[36px] p-2.5 shadow-[0_40px_80px_rgba(10,22,18,.18),0_20px_40px_rgba(10,22,18,.14)]"
        style={{ background: '#0b1220' }}
      >
        <div
          className="rounded-[28px] px-2.5 py-3 overflow-hidden flex flex-col gap-2"
          style={{ background: '#eef2f0', minHeight: '520px' }}
        >
          {/* Chat header */}
          <div className="flex items-center gap-2.5 px-2 pb-2.5 border-b border-[#dfe4e0] -mx-1">
            <div
              className="w-[34px] h-[34px] rounded-full grid place-items-center font-black text-[11.5px] text-white flex-none"
              style={{ background: 'linear-gradient(135deg,#4CAF50 0%,#2E7D32 100%)' }}
            >
              SM
            </div>
            <div>
              <div className="font-bold text-sm text-ink">
                {preview.botName}
              </div>
              <div className="text-[11.5px] text-muted">
                {preview.botStatus}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 flex flex-col justify-end gap-1.5 px-1 pb-2">
            {preview.messages.map((msg, i) => (
              <ChatMessage key={i} message={msg} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
