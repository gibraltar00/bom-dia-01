import { useEffect, useState } from 'react';
import { getPet } from '@/lib/data';
import { useI18n } from '@/lib/i18n';
import { getLocalizedPet } from '@/lib/petI18n';
import PetIllustration from './PetIllustrations';

interface PetSceneProps {
  petKey: string;
  mood?: 'happy' | 'sleepy' | 'celebrate' | 'neutral';
  rotate?: number;
  sizeScale?: number;
}

export interface SceneItemInstance {
  key: string;
  emoji: string;
  scene_layer: string;
}

interface SceneDef {
  label: string;
  sky: string;
  horizon: string;
  ground: string;
  silhouette: string;
  tint: string;
}

const SCENES: Record<string, SceneDef> = {
  octopus: {
    label: 'Coral Reef',
    sky: 'linear-gradient(to bottom, #0c4a6e 0%, #0e7490 35%, #0891b2 60%, #06b6d4 100%)',
    horizon: 'linear-gradient(to bottom, #155e75 0%, #0c4a6e 100%)',
    ground: 'linear-gradient(to bottom, #164e63 0%, #082f49 100%)',
    silhouette: '#0c4a6e',
    tint: 'radial-gradient(ellipse at 30% 20%, rgba(14,165,233,0.15), transparent 60%)',
  },
  turtle: {
    label: 'Seagrass Meadow',
    sky: 'linear-gradient(to bottom, #a7f3d0 0%, #6ee7b7 30%, #34d399 60%, #059669 100%)',
    horizon: 'linear-gradient(to bottom, #047857 0%, #065f46 100%)',
    ground: 'linear-gradient(to bottom, #064e3b 0%, #022c22 100%)',
    silhouette: '#022c22',
    tint: 'radial-gradient(ellipse at 50% 15%, rgba(110,231,183,0.2), transparent 65%)',
  },
  dolphin: {
    label: 'Open Ocean',
    sky: 'linear-gradient(to bottom, #bae6fd 0%, #7dd3fc 30%, #38bdf8 60%, #0ea5e9 100%)',
    horizon: 'linear-gradient(to bottom, #0284c7 0%, #0369a1 100%)',
    ground: 'linear-gradient(to bottom, #075985 0%, #0c4a6e 100%)',
    silhouette: '#0c4a6e',
    tint: 'radial-gradient(ellipse at 50% 20%, rgba(125,211,252,0.25), transparent 70%)',
  },
  whale: {
    label: 'Deep Blue',
    sky: 'linear-gradient(to bottom, #1e3a8a 0%, #1e40af 30%, #1d4ed8 60%, #2563eb 100%)',
    horizon: 'linear-gradient(to bottom, #1e40af 0%, #1e3a8a 100%)',
    ground: 'linear-gradient(to bottom, #172554 0%, #0f172a 100%)',
    silhouette: '#0f172a',
    tint: 'radial-gradient(ellipse at 40% 15%, rgba(96,165,250,0.15), transparent 65%)',
  },
  albatross: {
    label: 'Windy Skies',
    sky: 'linear-gradient(to bottom, #f1f5f9 0%, #e2e8f0 30%, #cbd5e1 60%, #94a3b8 100%)',
    horizon: 'linear-gradient(to bottom, #64748b 0%, #475569 100%)',
    ground: 'linear-gradient(to bottom, #334155 0%, #1e293b 100%)',
    silhouette: '#1e293b',
    tint: 'radial-gradient(ellipse at 50% 10%, rgba(255,255,255,0.3), transparent 70%)',
  },
  seal: {
    label: 'Rocky Shore',
    sky: 'linear-gradient(to bottom, #e2e8f0 0%, #cbd5e1 30%, #94a3b8 60%, #64748b 100%)',
    horizon: 'linear-gradient(to bottom, #475569 0%, #334155 100%)',
    ground: 'linear-gradient(to bottom, #1e293b 0%, #0f172a 100%)',
    silhouette: '#0f172a',
    tint: 'radial-gradient(ellipse at 60% 20%, rgba(203,213,225,0.2), transparent 65%)',
  },
  crab: {
    label: 'Sunny Sandbar',
    sky: 'linear-gradient(to bottom, #fef9c3 0%, #fef08a 30%, #fde047 60%, #facc15 100%)',
    horizon: 'linear-gradient(to bottom, #f59e0b 0%, #d97706 100%)',
    ground: 'linear-gradient(to bottom, #b45309 0%, #92400e 100%)',
    silhouette: '#92400e',
    tint: 'radial-gradient(ellipse at 50% 15%, rgba(253,224,71,0.3), transparent 70%)',
  },
  otter: {
    label: 'River Bend',
    sky: 'linear-gradient(to bottom, #fed7aa 0%, #fdba74 30%, #fb923c 60%, #f97316 100%)',
    horizon: 'linear-gradient(to bottom, #c2410c 0%, #9a3412 100%)',
    ground: 'linear-gradient(to bottom, #7c2d12 0%, #431407 100%)',
    silhouette: '#431407',
    tint: 'radial-gradient(ellipse at 40% 20%, rgba(251,146,60,0.2), transparent 65%)',
  },
  fish: {
    label: 'Coral Garden',
    sky: 'linear-gradient(to bottom, #fce7f3 0%, #fbcfe8 30%, #f9a8d4 60%, #f472b6 100%)',
    horizon: 'linear-gradient(to bottom, #db2777 0%, #be185d 100%)',
    ground: 'linear-gradient(to bottom, #9d174d 0%, #831843 100%)',
    silhouette: '#831843',
    tint: 'radial-gradient(ellipse at 50% 20%, rgba(249,168,212,0.25), transparent 70%)',
  },
};

function getScene(key: string): SceneDef {
  return SCENES[key] ?? SCENES.octopus;
}

// NPC background animals that wander each scene. Each pet's habitat gets a
// small companion animal that drifts across the background.
const NPC_ANIMALS: Record<string, { emoji: string; label: string; layer: 'sky' | 'ground' }[]> = {
  octopus: [
    { emoji: '🪼', label: 'jellyfish', layer: 'sky' },
    { emoji: '🦀', label: 'crab', layer: 'ground' },
  ],
  turtle: [
    { emoji: '🐠', label: 'fish', layer: 'sky' },
    { emoji: '🌿', label: 'seagrass', layer: 'ground' },
  ],
  dolphin: [
    { emoji: '🐟', label: 'fish', layer: 'sky' },
    { emoji: '🌊', label: 'wave', layer: 'sky' },
  ],
  whale: [
    { emoji: '✨', label: 'sparkle', layer: 'sky' },
    { emoji: '🫧', label: 'bubble', layer: 'sky' },
  ],
  albatross: [
    { emoji: '☁️', label: 'cloud', layer: 'sky' },
    { emoji: '🌬️', label: 'wind', layer: 'sky' },
  ],
  seal: [
    { emoji: '🪨', label: 'rock', layer: 'ground' },
    { emoji: '🌊', label: 'wave', layer: 'sky' },
  ],
  crab: [
    { emoji: '🐚', label: 'shell', layer: 'ground' },
    { emoji: '☀️', label: 'sun', layer: 'sky' },
  ],
  otter: [
    { emoji: '🍃', label: 'leaf', layer: 'sky' },
    { emoji: '🐟', label: 'fish', layer: 'sky' },
  ],
  fish: [
    { emoji: '🪸', label: 'coral', layer: 'ground' },
    { emoji: '🫧', label: 'bubble', layer: 'sky' },
  ],
};

export default function PetScene({ petKey, mood = 'neutral', rotate = 0, sizeScale = 100 }: PetSceneProps) {
  const { lang } = useI18n();
  const pet = getPet(petKey);
  const loc = getLocalizedPet(petKey, lang);
  const scene = getScene(petKey);
  const npcs = NPC_ANIMALS[petKey] ?? [];
  const scale = Math.max(0.25, Math.min(3, sizeScale / 100));
  const [confetti, setConfetti] = useState<number[]>([]);
  const [bubble, setBubble] = useState<string | null>(null);

  const isCelebrate = mood === 'celebrate';
  const isSleepy = mood === 'sleepy';

  useEffect(() => {
    if (!isCelebrate) return;
    setConfetti(Array.from({ length: 18 }, (_, i) => i));
    const t = setTimeout(() => setConfetti([]), 2200);
    return () => clearTimeout(t);
  }, [isCelebrate]);

  useEffect(() => {
    if (isSleepy) return;
    const show = () => {
      const phrase = loc.phrases[Math.floor(Math.random() * loc.phrases.length)];
      setBubble(phrase);
      setTimeout(() => setBubble(null), 3500);
    };
    const t = setTimeout(show, 2500);
    const interval = setInterval(show, 9000);
    return () => {
      clearTimeout(t);
      clearInterval(interval);
    };
  }, [petKey, isSleepy, loc.phrases]);

  return (
    <div
      className="pet-scene relative rounded-3xl overflow-hidden shadow-xl"
      style={{ height: 320 }}
    >
      {/* Sky layer */}
      <div className="absolute inset-0" style={{ background: scene.sky }} />

      {/* Sun/light glow */}
      <div className="absolute inset-0" style={{ background: scene.tint }} />

      {/* Light rays from top */}
      <div
        className="absolute top-0 left-0 right-0 h-1/2 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.12), transparent)' }}
      />

      {/* Horizon line (distant background) */}
      <div
        className="absolute left-0 right-0"
        style={{
          bottom: '28%',
          height: '12%',
          background: scene.horizon,
          borderRadius: '50% 50% 0 0 / 100% 100% 0 0',
          transform: 'scaleX(1.4)',
        }}
      />

      {/* Distant silhouette hills */}
      <svg
        className="absolute left-0 right-0 pointer-events-none"
        style={{ bottom: '24%', height: '20%', width: '100%' }}
        viewBox="0 0 100 20"
        preserveAspectRatio="none"
      >
        <path
          d="M0,20 L0,12 Q10,8 18,11 Q25,6 32,10 Q40,5 48,9 Q55,7 62,11 Q70,6 78,10 Q85,8 92,11 Q96,9 100,12 L100,20 Z"
          fill={scene.silhouette}
          opacity={0.5}
        />
      </svg>

      {/* Ground layer */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{ height: '28%', background: scene.ground }}
      />

      {/* Ground texture line */}
      <div
        className="absolute left-0 right-0"
        style={{ bottom: '28%', height: '2px', background: 'rgba(0,0,0,0.2)' }}
      />

      {/* NPC background animals (moving only, kept behind the pet) */}
      {npcs.slice(0, 2).map((npc, i) => {
        const isSky = npc.layer === 'sky';
        const top = isSky ? `${15 + i * 12}%` : `${10 + i * 8}%`;
        const delay = `${i * 1.3}s`;
        const duration = isSky ? '14s' : '18s';
        return (
          <div
            key={npc.label}
            className="absolute pointer-events-none select-none"
            style={{
              top,
              left: '-10%',
              animation: `npc-drift ${duration} linear infinite`,
              animationDelay: delay,
              fontSize: isSky ? '20px' : '24px',
              opacity: 0.7,
              zIndex: 1,
            }}
          >
            <span className="inline-block" style={{ animation: 'npc-bob 2s ease-in-out infinite' }}>
              {npc.emoji}
            </span>
          </div>
        );
      })}

      {/* Confetti when celebrating */}
      {confetti.length > 0 && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {confetti.map((i) => (
            <span
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${8 + ((i * 7) % 84)}%`,
                top: '15%',
                fontSize: '18px',
                animationDelay: `${i * 0.06}s`,
              }}
            >
              {['🎉', '✨', '⭐', '🌟', '💫', '🎊'][i % 6]}
            </span>
          ))}
        </div>
      )}

      {/* Pet centered, bobbing gently */}
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-10" style={{ zIndex: 5 }}>
        <div
          className={isCelebrate ? 'animate-bounce-soft' : !isSleepy ? 'animate-bob' : ''}
          style={{ transform: `rotate(${rotate}deg) scale(${scale})`, transition: 'transform 0.3s ease' }}
        >
          <PetIllustration petKey={petKey} color={pet.color} style={{ width: 150, height: 150 }} />
        </div>

        {/* Sleep Z's */}
        {isSleepy && (
          <div className="absolute" style={{ top: '35%', right: '30%' }}>
            <span className="text-2xl font-bold text-white/70 animate-bubble-rise" style={{ animationIterationCount: 'infinite', animationDuration: '2.5s' }}>z</span>
            <span className="text-lg font-bold text-white/50 animate-bubble-rise absolute" style={{ top: '-14px', right: '-12px', animationDelay: '0.5s', animationIterationCount: 'infinite', animationDuration: '2.5s' }}>z</span>
          </div>
        )}

        <div className="mt-3 text-center relative z-10">
          <p className="font-bold text-white text-lg drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">{loc.name}</p>
          <p className="text-xs text-white/80 drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]">{scene.label}</p>
        </div>
      </div>

      {/* Speech bubble */}
      {bubble && !isSleepy && (
        <div
          className="absolute left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur rounded-2xl px-4 py-2 shadow-lg max-w-[200px]"
          style={{ top: '4%', animation: 'bubble-pop 0.3s ease-out' }}
        >
          <p className="text-sm font-medium text-emerald-800 text-center">{bubble}</p>
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white/95 rotate-45" />
        </div>
      )}

    </div>
  );
}
