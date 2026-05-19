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
      <div className="howitworks-phone-outer w-full max-w-90 mx-auto rounded-[36px] p-2.5 shadow-[0_40px_80px_rgba(10,22,18,.18),0_20px_40px_rgba(10,22,18,.14)]">
        <div className="howitworks-phone-screen rounded-card-lg px-2.5 py-3 overflow-hidden flex flex-col gap-2">
          {/* Chat header */}
          <div className="flex items-center gap-2.5 px-2 pb-2.5 border-b border-line -mx-1">
            <div className="howitworks-avatar-grad w-[34px] h-[34px] rounded-full grid place-items-center font-black text-white flex-none text-mini">
              SM
            </div>
            <div>
              <div className="font-bold text-sm text-ink">{preview.botName}</div>
              <div className="text-mini text-muted">{preview.botStatus}</div>
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
