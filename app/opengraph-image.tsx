import { ImageResponse } from 'next/og';

export const alt = 'SpeakMove';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const TEXT = {
  TITLE: {
    FIRST_PART: 'Speak',
    SECOND_PART: 'Move',
  },
  DESCRIPTION: 'Speak English for real life in the UK',
};

const MARK_BAR_HEIGHTS = [16, 40, 76, 56, 32, 20];
const MARK_BAR_OPACITIES = [0.55, 0.82, 1, 0.92, 0.78, 0.55];

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        padding: '0 96px',
        fontFamily: 'system-ui, sans-serif',
        background:
          'radial-gradient(900px 460px at 18% -10%, rgba(11, 224, 155, 0.16), transparent 60%), radial-gradient(700px 500px at 100% 110%, rgba(245, 183, 0, 0.14), transparent 55%), linear-gradient(160deg, #0b1220 0%, #0d2318 55%, #0a1a12 100%)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 108,
          height: 108,
          borderRadius: '50%',
          background: '#0e6e3b',
          marginBottom: 40,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {MARK_BAR_HEIGHTS.map((height, index) => (
            <div
              key={height}
              style={{
                width: 6,
                height,
                borderRadius: 3,
                background: '#ffffff',
                opacity: MARK_BAR_OPACITIES[index],
              }}
            />
          ))}
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          fontSize: 88,
          fontWeight: 800,
          letterSpacing: '-0.03em',
          color: '#f4f6f2',
          lineHeight: 1,
        }}
      >
        {TEXT.TITLE.FIRST_PART}
        <span style={{ color: '#5be0a8' }}>{TEXT.TITLE.SECOND_PART}</span>
      </div>
      <div
        style={{
          display: 'flex',
          marginTop: 26,
          fontSize: 30,
          fontWeight: 500,
          letterSpacing: '-0.01em',
          color: '#a7b3ac',
        }}
      >
        {TEXT.DESCRIPTION}
      </div>
    </div>,
    { ...size },
  );
}
