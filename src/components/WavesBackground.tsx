interface WavesBackgroundProps {
  isDark: boolean;
}

export function WavesBackground({ isDark }: WavesBackgroundProps) {
  const waveColor = isDark ? 'rgba(16, 185, 129, 0.10)' : 'rgba(16, 185, 129, 0.14)';
  const waveColor2 = isDark ? 'rgba(56, 189, 248, 0.08)' : 'rgba(14, 165, 233, 0.12)';

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      <svg
        className="absolute bottom-0 left-0 w-[200%] h-[45%] animate-waves-slow"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        style={{ opacity: 1 }}
      >
        <path
          fill={waveColor}
          d="M0,160 C240,260 480,60 720,140 C960,220 1200,100 1440,180 L1440,320 L0,320 Z"
        />
      </svg>
      <svg
        className="absolute bottom-0 left-0 w-[200%] h-[38%] animate-waves-medium"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          fill={waveColor2}
          d="M0,200 C200,120 520,280 720,200 C920,120 1240,280 1440,200 L1440,320 L0,320 Z"
        />
      </svg>
      <svg
        className="absolute bottom-0 left-0 w-[200%] h-[30%] animate-waves-fast"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          fill={waveColor}
          d="M0,240 C300,180 540,300 720,240 C900,180 1180,300 1440,240 L1440,320 L0,320 Z"
        />
      </svg>
    </div>
  );
}
