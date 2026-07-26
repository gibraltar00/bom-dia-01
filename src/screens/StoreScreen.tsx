import { useEffect, useState, useCallback } from 'react';
import { ShoppingBag, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { PETS, PET_MAP } from '@/lib/data';
import { pushCelebration } from '@/components/CelebrationOverlay';
import PetAvatar from '@/components/PetAvatar';
import { useI18n } from '@/lib/i18n';
import { getLocalizedPet } from '@/lib/petI18n';

export default function StoreScreen() {
  const { user, profile, refreshProfile } = useAuth();
  const { t, lang } = useI18n();
  const [ownedPets, setOwnedPets] = useState<string[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const pets = await supabase.from('owned_pets').select('pet_key').eq('user_id', user.id);
      if (pets.error) throw pets.error;
      setOwnedPets((pets.data ?? []).map((r) => r.pet_key));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load store');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  async function buyPet(petKey: string, price: number) {
    if (!user || !profile) return;
    if (ownedPets.includes(petKey)) return;
    if ((profile.eco_points ?? 0) < price) {
      setError(t('notEnoughCoins'));
      return;
    }
    setBusy(petKey);
    setError(null);
    try {
      const { error: insErr } = await supabase
        .from('owned_pets')
        .insert({ user_id: user.id, pet_key: petKey });
      if (insErr) throw new Error(insErr.message);
      await supabase
        .from('profiles')
        .update({ eco_points: profile.eco_points - price })
        .eq('id', user.id);
      await refreshProfile();
      setOwnedPets((prev) => [...prev, petKey]);
      pushCelebration({
        emoji: PET_MAP[petKey]?.emoji ?? '🎉',
        title: `${getLocalizedPet(petKey, lang).name} ${t('petUnlocked')}`,
        subtitle: `-${price} 🪙`,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to buy pet');
    } finally {
      setBusy(null);
    }
  }

  const isDark = profile?.dark_mode ?? false;
  const coins = profile?.eco_points ?? 0;

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6 text-center">
        <p className={isDark ? 'text-emerald-300' : 'text-emerald-700/60'}>{t('loadingStore')}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ShoppingBag size={22} className={isDark ? 'text-emerald-400' : 'text-emerald-600'} />
          <h1 className={`text-xl font-bold ${isDark ? 'text-slate-100' : 'text-emerald-900'}`}>{t('store')}</h1>
        </div>
        <span className="inline-flex items-center gap-1.5 bg-amber-400/20 px-3 py-1.5 rounded-full text-sm font-bold text-amber-600">
          🪙 {coins}
        </span>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">✕</button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {PETS.map((p) => {
          const owned = ownedPets.includes(p.key);
          const isFavorite = profile?.active_pet === p.key;
          const canAfford = coins >= p.price;
          const loc = getLocalizedPet(p.key, lang);
          return (
            <div
              key={p.key}
              className={`rounded-3xl p-4 flex flex-col items-center text-center transition-all ${
                isDark
                  ? 'bg-slate-800 border border-slate-700'
                  : 'bg-white border border-emerald-100 shadow-sm'
              }`}
            >
              <div className="relative">
                <PetAvatar petKey={p.key} size={96} />
                {isFavorite && (
                  <span className="absolute -top-1 -right-1 text-lg">⭐</span>
                )}
              </div>
              <p className={`mt-3 font-bold ${isDark ? 'text-slate-100' : 'text-emerald-900'}`}>{loc.name}</p>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-emerald-700/60'}`}>{loc.tagline}</p>
              {owned ? (
                <span className={`mt-3 inline-flex items-center gap-1 text-sm font-semibold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                  <Check size={14} /> {t('owned')}
                </span>
              ) : (
                <button
                  onClick={() => buyPet(p.key, p.price)}
                  disabled={busy === p.key || !canAfford}
                  className={`mt-3 w-full py-2.5 rounded-xl font-semibold text-sm transition-colors disabled:opacity-50 ${
                    canAfford
                      ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                      : isDark
                        ? 'bg-slate-700 text-slate-400'
                        : 'bg-emerald-100 text-emerald-700/50'
                  }`}
                >
                  {busy === p.key ? t('buying') : p.price === 0 ? t('free') : `🪙 ${p.price}`}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
