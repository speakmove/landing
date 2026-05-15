import type { PropsWithChildren } from 'react';

export const PhoneFrame = ({ children }: PropsWithChildren) => {
  return (
    <div
      className="max-w-80 mx-auto rounded-[52px] p-[3.5px] shadow-[0_24px_60px_rgba(0,0,0,.22),0_0_0_1px_rgba(0,0,0,.06)] relative"
      style={{ background: 'linear-gradient(135deg,#6e6e72 0%,#2a2a2c 50%,#4a4a4d 100%)' }}
    >
      {/* Side buttons (purely decorative) */}
      <span className="absolute -left-[3px] top-[112px] w-[3.5px] h-6 rounded-l-[2px] bg-[#1d1d1f]" aria-hidden="true" />
      <span className="absolute -left-[3px] top-[150px] w-[3.5px] h-[52px] rounded-l-[2px] bg-[#1d1d1f]" aria-hidden="true" />
      <span className="absolute -left-[3px] top-[212px] w-[3.5px] h-[52px] rounded-l-[2px] bg-[#1d1d1f]" aria-hidden="true" />
      <span className="absolute -right-[3px] top-[180px] w-[3.5px] h-[78px] rounded-r-[2px] bg-[#1d1d1f]" aria-hidden="true" />

      {/* Black bezel */}
      <div className="bg-black rounded-[48.5px] p-[1.5px]">
        <div
          className="rounded-[47px] overflow-hidden flex flex-col min-h-160"
        >
          {children}
        </div>
      </div>
    </div>
  );
};
