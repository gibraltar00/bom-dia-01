import { getPet, type PetDef } from '@/lib/data';
import PetIllustration from './PetIllustrations';

interface PetAvatarProps {
  petKey: string;
  size?: number;
  bounce?: boolean;
  bob?: boolean;
  rotate?: number;
  sizeScale?: number;
}

export default function PetAvatar({ petKey, size = 112, bounce = false, bob = false, rotate = 0, sizeScale = 100 }: PetAvatarProps) {
  const pet: PetDef = getPet(petKey);
  const innerAnim = bounce ? 'animate-bounce-soft' : bob ? 'animate-bob' : '';
  const scale = Math.max(0.25, Math.min(3, sizeScale / 100));
  const transform = `rotate(${rotate}deg) scale(${scale})`;

  return (
    <div
      className="relative flex items-center justify-center rounded-3xl overflow-hidden"
      style={{
        width: size,
        height: size,
        background: `${pet.color}1a`,
        boxShadow: `0 0 0 3px ${pet.color}40`,
      }}
    >
      <div
        className={innerAnim}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform,
          transition: 'transform 0.3s ease',
        }}
      >
        <PetIllustration petKey={petKey} color={pet.color} style={{ width: `${size * 0.85}px`, height: `${size * 0.85}px`, position: 'relative', zIndex: 4 }} />
      </div>
    </div>
  );
}
