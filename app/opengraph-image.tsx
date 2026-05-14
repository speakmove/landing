import { ImageResponse } from 'next/og';

export const alt = 'SpeakMove';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #047857 0%, #064e3b 100%)',
          color: 'white',
          fontSize: 120,
          fontWeight: 800,
          letterSpacing: '-0.025em',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        SpeakMove
      </div>
    ),
    { ...size },
  );
}
