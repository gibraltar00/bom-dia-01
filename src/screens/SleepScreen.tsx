import { useEffect, useState } from 'react';
import { Moon, Plus, TrendingUp, Sparkles, Lightbulb } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import {
  sleepXpForHours,
  sleepQualityLabel,
  levelProgress,
  levelTitle,
  levelFromXp,
  getPet,
} from '@/lib/data';
import { unlockAchievement, unlockAchievements } from '@/lib/achievements';
import { pushCelebration } from '@/components/CelebrationOverlay';
import PetScene from '@/components/PetScene';
import PetIllustration from '@/components/PetIllustrations';
import { useI18n } from '@/lib/i18n';
import { translations } from '@/lib/translations';
interface SleepLog {
  id: string;
  hours: number;
  xp_awarded: number;
  logged_date: string;
}

// Pet reactions based on sleep hours
function petReaction(hours: number, t: (key: any) => string): { message: string; mood: 'happy' | 'sleepy' | 'celebrate' | 'neutral'; tip: string } {
  if (hours < 5) {
    return {
      message: t('sleepReaction0'),
      mood: 'sleepy',
      tip: t('sleepTip0'),
    };
  }
  if (hours < 7) {
    return {
      message: t('sleepReaction1'),
      mood: 'sleepy',
      tip: t('sleepTip1'),
    };
  }
  if (hours <= 9) {
    return {
      message: t('sleepReaction2'),
      mood: 'celebrate',
      tip: t('sleepTip2'),
    };
  }
  if (hours <= 10) {
    return {
      message: t('sleepReaction3'),
      mood: 'happy',
      tip: t('sleepTip3'),
    };
  }
  return {
    message: t('sleepReaction4'),
    mood: 'sleepy',
    tip: t('sleepTip4'),
  };
}

export default function SleepScreen() {
  const { user, profile, refreshProfile } = useAuth();
  const { t, lang } = useI18n();
  const [logs, setLogs] = useState<SleepLog[]>([]);
  const [hours, setHours] = useState(7.5);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [todayLogged, setTodayLogged] = useState<SleepLog | null>(null);
  const [loadError, setLoadError] = useState(false);

  async function load() {
    if (!user) return;
    try {
    const { data } = await supabase
      .from('sleep_logs')
      .select('id, hours, xp_awarded, logged_date')
      .eq('user_id', user.id)
      .order('logged_date', { ascending: false })
      .limit(14);
    const rows = (data ?? []) as SleepLog[];
    setLogs(rows);
    const today = new Date().toISOString().slice(0, 10);
    setTodayLogged(rows.find((r) => r.logged_date === today) ?? null);
    // Load achievements for level checks
    } catch (e) {
      console.warn('sleep screen load failed', e);
      setLoadError(true);
    }
  }

  useEffect(() => {
    load();
  }, [user]);

  async function logSleep() {
    if (!user || !profile) return;
    setBusy(true);
    setMessage(null);
    try {
      const xp = sleepXpForHours(hours);
      const today = new Date().toISOString().slice(0, 10);

      if (todayLogged) {
        const { error } = await supabase
          .from('sleep_logs')
          .update({ hours, xp_awarded: xp })
          .eq('id', todayLogged.id);
        if (error) throw new Error(error.message);
        const diff = xp - todayLogged.xp_awarded;
        if (diff !== 0) {
          await supabase
            .from('profiles')
            .update({ xp: Math.max(0, profile.xp + diff) })
            .eq('id', user.id);
          await refreshProfile();
        }
        setMessage(`${t('updated')} ${diff >= 0 ? '+' : ''}${diff} XP.`);
      } else {
        const { error } = await supabase.from('sleep_logs').insert({
          hours,
          xp_awarded: xp,
          logged_date: today,
        });
        if (error) throw new Error(error.message);
        await supabase
          .from('profiles')
          .update({ xp: profile.xp + xp })
          .eq('id', user.id);
        await refreshProfile();
        setMessage(`${t('logged')} +${xp} XP.`);
        // Unlock sleep achievement
        if (hours >= 7) {
          const a = await unlockAchievement(user.id, 'well_rested');
          if (a && a.newlyUnlocked) {
            pushCelebration({
              emoji: a.emoji,
              title: a.title,
              subtitle: `+${a.coins} coins, +${a.xp} XP`,
            });
            await refreshProfile();
          }
        }
        // Secret: Night Owl — less than 3 hours
        if (hours < 3) {
          const a = await unlockAchievement(user.id, 'night_owl');
          if (a && a.newlyUnlocked) {
            pushCelebration({
              emoji: a.emoji,
              title: a.title,
              subtitle: `+${a.coins} coins, +${a.xp} XP`,
            });
            await refreshProfile();
          }
        }
        // Check level achievements
        const newXp = (profile.xp ?? 0) + xp;
        const newLevel = levelFromXp(newXp);
        const keys: string[] = [];
        if (newLevel >= 5) keys.push('level_5');
        if (newLevel >= 10) keys.push('level_10');
        if (newLevel >= 20) keys.push('eco_legend');
        const unlockedLv = await unlockAchievements(user.id, keys);
        for (const a of unlockedLv) {
          pushCelebration({
            emoji: a.emoji,
            title: a.title,
            subtitle: `+${a.coins} coins, +${a.xp} XP`,
          });
        }
        await refreshProfile();
      }
      await load();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Failed to log sleep');
    } finally {
      setBusy(false);
    }
  }

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6 text-center">
        <p className="text-emerald-700/60">{t('loading')}</p>
      </div>
    );
  }
  if (loadError) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6 text-center">
        <p className="text-red-500 mb-3">{t('couldNotLoadProfile')}</p>
        <button onClick={() => { setLoadError(false); load(); }} className="px-4 py-2 rounded-xl bg-emerald-500 text-white font-semibold">{t('tryAgain')}</button>
      </div>
    );
  }

  const lp = levelProgress(profile.xp ?? 0);
  const quality = sleepQualityLabel(hours);
  const previewXp = sleepXpForHours(hours);
  const pet = getPet(profile.active_pet);
  const reaction = petReaction(hours, t);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 mb-2">
          <Moon size={28} />
        </div>
        <h1 className="text-2xl font-bold text-emerald-900">{t('sleepTitle')}</h1>
        <p className="text-emerald-700/70 mt-1">{t('sleepSubtitle')}</p>
      </div>

      {/* Pet scene with reaction */}
      <div className="mb-6">
        <PetScene petKey={profile.active_pet} mood={reaction.mood} rotate={0} sizeScale={profile.avatar_size ?? 100} />
        <div className="mt-3 bg-white rounded-2xl border border-indigo-100 p-4">
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden"
              style={{ background: `${pet.color}22` }}
            >
              <PetIllustration petKey={pet.key} color={pet.color} style={{ width: '32px', height: '32px' }} />
            </div>
            <div>
              <p className="text-sm font-medium text-emerald-900 leading-snug">{reaction.message}</p>
              <div className="flex items-start gap-1.5 mt-2 text-xs text-indigo-700">
                <Lightbulb size={14} className="flex-shrink-0 mt-0.5" />
                <span>{reaction.tip}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Current level summary */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-5 text-white shadow-xl shadow-indigo-500/20 mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center gap-1.5 bg-white/20 px-2.5 py-1 rounded-full text-xs font-bold">
            <Sparkles size={13} /> {t('level')} {lp.level}
          </span>
          <span className="text-sm font-semibold text-white/90">{translations[lang][`level${Math.min(lp.level, 10)}` as keyof typeof translations[typeof lang]]}</span>
        </div>
        <div className="h-2 rounded-full bg-white/20 overflow-hidden">
          <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${lp.pct}%` }} />
        </div>
        <p className="text-xs text-white/70 mt-1.5">
          {lp.intoLevel} / {lp.span} XP {t('xpToLevel')} {lp.level + 1}
        </p>
      </div>

      {/* Creativity hint */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-4 mb-6 flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
          <Lightbulb size={18} />
        </div>
        <div>
          <p className="text-sm font-semibold text-amber-900">{t('sleepFuelsCreativity')}</p>
          <p className="text-xs text-amber-700/80 mt-0.5">
            {t('sleepCreativityDesc')}
          </p>
        </div>
      </div>

      {/* Sleep input */}
      <div className="bg-white rounded-3xl border border-emerald-100 p-6 mb-6">
        <h2 className="font-bold text-emerald-900 mb-1">
          {todayLogged ? t('updateLastNight') : t('howSleep')}
        </h2>
        <p className="text-sm text-emerald-700/60 mb-5">
          {todayLogged ? t('alreadyLogged') : t('dragHours')}
        </p>

        <div className="text-center mb-5">
          <div className="text-6xl font-bold text-emerald-900">{hours.toFixed(1)}h</div>
          <span
            className="inline-block mt-2 text-sm font-semibold px-3 py-1 rounded-full"
            style={{ background: `${quality.color}1a`, color: quality.color }}
          >
            {quality.label}
          </span>
        </div>

        <input
          type="range"
          min={0}
          max={14}
          step={0.5}
          value={hours}
          onChange={(e) => setHours(parseFloat(e.target.value))}
          className="w-full h-2 bg-emerald-100 rounded-full appearance-none cursor-pointer accent-emerald-500 mb-2"
        />
        <div className="flex justify-between text-xs text-emerald-700/40 mb-5">
          <span>0h</span>
          <span>{t('ideal')}</span>
          <span>14h</span>
        </div>

        <div className="flex items-center justify-between bg-emerald-50 rounded-xl px-4 py-3 mb-4">
          <span className="text-sm font-medium text-emerald-700">{t('xpYouEarn')}</span>
          <span className="text-lg font-bold text-emerald-600">+{previewXp} XP</span>
        </div>

        <button
          onClick={logSleep}
          disabled={busy}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-lg shadow-indigo-500/30 hover:-translate-y-0.5 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {busy ? t('saving') : (
            <>
              <Plus size={18} /> {todayLogged ? t('updateLog') : t('logSleep')}
            </>
          )}
        </button>

        {message && (
          <p className="text-sm text-emerald-600 mt-3 text-center font-medium">{message}</p>
        )}
      </div>

      {/* History */}
      <div>
        <h2 className="font-bold text-emerald-900 mb-3 flex items-center gap-2">
          <TrendingUp size={18} /> {t('recentSleep')}
        </h2>
        {logs.length === 0 ? (
          <p className="text-sm text-emerald-700/60">{t('noSleepYet')}</p>
        ) : (
          <div className="space-y-2">
            {logs.map((log) => {
              const q = sleepQualityLabel(parseFloat(String(log.hours)));
              const d = new Date(log.logged_date + 'T00:00:00');
              return (
                <div
                  key={log.id}
                  className="flex items-center justify-between bg-white rounded-xl border border-emerald-100 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🌙</span>
                    <div>
                      <p className="font-semibold text-emerald-900 text-sm">
                        {parseFloat(String(log.hours)).toFixed(1)}h
                      </p>
                      <p className="text-xs text-emerald-700/50">
                        {d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: `${q.color}1a`, color: q.color }}
                    >
                      {q.label}
                    </span>
                    <span className="text-sm font-bold text-emerald-600">+{log.xp_awarded} XP</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
