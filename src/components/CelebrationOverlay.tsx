import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

export interface Celebration {
  id: number;
  emoji: string;
  title: string;
  subtitle: string;
}

let toastId = 0;
const listeners = new Set<(c: Celebration) => void>();

export function pushCelebration(c: Omit<Celebration, 'id'>) {
  const full: Celebration = { ...c, id: ++toastId };
  listeners.forEach((fn) => fn(full));
}

export function CelebrationOverlay() {
  const [active, setActive] = useState<Celebration | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (c: Celebration) => {
      setActive(c);
      setVisible(true);
    };
    listeners.add(handler);
    return () => {
      listeners.delete(handler);
    };
  }, []);

  useEffect(() => {
    if (!visible || !active) return;
    const t = setTimeout(() => setVisible(false), 4000);
    return () => clearTimeout(t);
  }, [visible, active]);

  if (!active) return null;

  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
      }`}
    >
      <div className="flex items-center gap-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-2xl shadow-2xl shadow-amber-500/30 px-5 py-4 max-w-sm">
        <span className="text-4xl animate-bounce">{active.emoji}</span>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm leading-tight">Achievement unlocked!</p>
          <p className="font-extrabold text-base leading-tight">{active.title}</p>
          <p className="text-xs text-white/90 leading-tight mt-0.5">{active.subtitle}</p>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="flex-shrink-0 w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
