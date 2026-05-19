import type { PropsWithChildren } from 'react';

export const PhoneFrame = ({ children }: PropsWithChildren) => {
  return (
    <div className="phone-frame-outer">
      <span className="phone-side-btn phone-side-btn--silent" aria-hidden="true" />
      <span className="phone-side-btn phone-side-btn--vol-up" aria-hidden="true" />
      <span className="phone-side-btn phone-side-btn--vol-dn" aria-hidden="true" />
      <span className="phone-side-btn phone-side-btn--power" aria-hidden="true" />

      <div className="phone-frame-bezel">
        <div className="phone-frame-screen">{children}</div>
      </div>
    </div>
  );
};
