import { Coin } from '@/shared/ui';

type TProps = {
  certificateName: string;
  certificateStatus?: string;
  currentLevel?: string;
};

/**
 * Certificate medal visual — large gold SM-coin with the level letter overlay,
 * paired with the certificate name and a small status line.
 */
export const CertificateMedal = ({ certificateName, certificateStatus, currentLevel }: TProps) => {
  return (
    <div className="mt-5 flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-line-strong p-4">
      <Coin size="4xl" text={currentLevel ?? 'SM'} />
      <div className="text-center">
        <div className="text-sm font-bold text-ink">{certificateName}</div>
        {certificateStatus ? (
          <div className="mt-1 font-mono text-xs text-muted">{certificateStatus}</div>
        ) : null}
      </div>
    </div>
  );
};
