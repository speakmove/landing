import { BatteryIcon, SignalBarsIcon } from '@/shared/ui';

type TProps = {
  time?: string;
  carrier?: string;
  batteryLevel?: number;
};

/**
 * iOS status bar overlay rendered above the phone screen.
 * Left: clock. Right: signal bars + carrier label + battery percentage.
 * Center is left empty for the frame's Dynamic Island.
 */
export const PhoneStatusBar = ({ time = '11:24', carrier = 'LTE', batteryLevel = 60 }: TProps) => {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-2 z-30 flex h-7 items-center px-6 text-ink">
      <span className="text-base font-bold leading-none">{time}</span>

      <div className="ml-auto inline-flex items-center gap-1.5">
        <SignalBarsIcon size={18} className="text-ink" />
        <span className="text-sm font-bold leading-none">{carrier}</span>
        <BatteryIcon size={24} level={batteryLevel} className="text-ink" />
      </div>
    </div>
  );
};
