import type { CSSProperties } from 'react';
import { PET_MAP } from '@/lib/data';

interface IllustrationProps {
  petKey: string;
  color: string;
  style?: CSSProperties;
}

export default function PetIllustration({ petKey, style }: IllustrationProps) {
  const pet = PET_MAP[petKey] ?? PET_MAP.octopus;
  const size = (style?.width as string | number | undefined) ?? '100%';
  return (
    <span
      style={{
        fontSize: typeof size === 'number' ? `${size}px` : size,
        lineHeight: 1,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.18))',
        ...style,
      }}
    >
      {pet.emoji}
    </span>
  );
}
