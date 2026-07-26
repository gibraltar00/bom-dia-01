import { useEffect, useState } from 'react';
import { X, Sparkles, Trophy, Star, Lock } from 'lucide-react';
import PetAvatar from './PetAvatar';
import PetScene from './PetScene';
import { supabase } from '@/lib/supabase';
import { getPet, levelProgress, levelTitle, CATEGORY_META, DIFFICULTY_META } from '@/lib/data';
import { loadAchievementCatalog, loadUserAchievements, type AchievementWithStatus } from '@/lib/achievements';
import { useI18n } from '@/lib/i18n';
import { translations } from '@/lib/translations';
import { getLocalizedPet } from '@/lib/petI18n';

interface UserProfile {
  id: string;
  display_name: string;
  bio: string | null;
  active_pet: string;
  eco_points: number;
  xp: number;
  avatar_angle: number | null;
  avatar_size: number | null;
  created_at: string;
}

interface UserPost {
  id: string;
  image_url: string;
  idea_title: string;
  idea_category: 'daily' | 'decoration' | 'toy';
  idea_difficulty: 'easy' | 'medium' | 'hard';
  created_at: string;
}

interface Props {
  userId: string;
  onClose: () => void;
}

export default function PublicProfileModal({ userId, onClose }: Props) {
  const { t, lang } = useI18n();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<UserPost[]>([]);
  const [achievements, setAchievements] = useState<AchievementWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [profRes, postsRes] = await Promise.all([
          supabase
            .from('profiles')
            .select('id, display_name, bio, active_pet, eco_points, xp, avatar_angle, avatar_size, created_at')
            .eq('id', userId)
            .maybeSingle(),
          supabase
            .from('community_posts')
            .select('id, image_url, idea_title, idea_category, idea_difficulty, created_at')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(12),
        ]);
        if (!active) return;
        if (profRes.error) throw new Error(profRes.error.message);
        if (!profRes.data) {
          setError(t('profileNotFound'));
          setLoading(false);
          return;
        }
        setProfile(profRes.data as UserProfile);
        setPosts((postsRes.data ?? []) as UserPost[]);

        const [catalog, unlocked] = await Promise.all([
          loadAchievementCatalog(),
          loadUserAchievements(userId),
        ]);
        if (!active) return;
        const unlockedMap = new Map(unlocked.map((u) => [u.key, u.unlocked_at]));
        setAchievements(
          catalog.map((c) => ({
            ...c,
            unlocked: unlockedMap.has(c.key),
            unlocked_at: unlockedMap.get(c.key) ?? null,
          }))
        );
      } catch (e) {
        if (!active) return;
        setError(e instanceof Error ? e.message : t('couldNotLoad'));
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, [userId]);

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {loading ? (
          <div className="p-20 text-center text-emerald-700/60">{t('loading')}</div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button onClick={onClose} className="px-4 py-2 rounded-xl bg-emerald-500 text-white font-semibold">
              {t('close')}
            </button>
          </div>
        ) : profile ? (
          <>
            <div className="sticky top-0 bg-white flex items-center justify-between px-5 py-4 border-b border-emerald-100 z-10">
              <h2 className="font-bold text-emerald-900">{t('profile')}</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-emerald-700/60 hover:bg-emerald-50"
              >
                <X size={18} />
              </button>
            </div>

            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-b-3xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 bg-white/20 px-2.5 py-1 rounded-full text-xs font-bold">
                    <Sparkles size={13} /> {t('level')} {levelProgress(profile.xp ?? 0).level}
                  </span>
                  <span className="ml-2 text-sm font-semibold text-white/90">
                    {translations[lang][`level${Math.min(levelProgress(profile.xp ?? 0).level, 10)}` as keyof typeof translations[typeof lang]]}
                  </span>
                </div>
                <div className="inline-flex items-center gap-1.5 bg-amber-400/30 px-3 py-1.5 rounded-full text-sm font-bold">
                  🪙 {profile.eco_points}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <PetAvatar
                  petKey={profile.active_pet}
                  size={80}
                  rotate={profile.avatar_angle ?? 0}
                  sizeScale={profile.avatar_size ?? 100}
                />
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl font-bold truncate">{profile.display_name}</h1>
                  <p className="text-white/80 text-sm truncate">{getLocalizedPet(profile.active_pet, lang).name}</p>
                  <div className="mt-2">
                    <div className="h-2 rounded-full bg-white/20 overflow-hidden">
                      <div
                        className="h-full bg-white rounded-full transition-all duration-500"
                        style={{ width: `${levelProgress(profile.xp ?? 0).pct}%` }}
                      />
                    </div>
                    <p className="text-xs text-white/70 mt-1">
                      {levelProgress(profile.xp ?? 0).intoLevel} / {levelProgress(profile.xp ?? 0).span} XP {t('xpToLevel')} {levelProgress(profile.xp ?? 0).level + 1}
                    </p>
                  </div>
                </div>
              </div>
              {profile.bio && <p className="text-white/90 text-sm mt-4">{profile.bio}</p>}
              <p className="text-white/60 text-xs mt-3">
                {t('joined')} {new Date(profile.created_at).toLocaleDateString()}
              </p>
            </div>

            <div className="p-5 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Star size={18} className="text-amber-500 fill-amber-500" />
                  <h3 className="font-bold text-emerald-900">{t('theirPet')}</h3>
                </div>
                <PetScene petKey={profile.active_pet} />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Trophy size={18} className="text-amber-500" />
                  <h3 className="font-bold text-emerald-900">
                    {t('achievements')} ({`${achievements.filter((a) => a.unlocked).length}/${achievements.length}`})
                  </h3>
                </div>
                {achievements.length === 0 ? (
                  <p className="text-sm text-emerald-700/60">{t('noAchievementsYet')}</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {achievements.map((a) => {
                      const isSecret = (a as AchievementWithStatus & { is_secret?: boolean }).is_secret;
                      const showAsMystery = isSecret && !a.unlocked;
                      return (
                        <div
                          key={a.key}
                          className={`rounded-2xl p-3 border transition-all ${
                            a.unlocked
                              ? 'bg-white border-amber-200 shadow-sm'
                              : showAsMystery
                                ? 'bg-slate-100/60 border-dashed border-slate-300'
                                : 'bg-emerald-50/40 border-dashed border-emerald-200 opacity-60'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <span className={`text-2xl ${a.unlocked ? '' : 'grayscale opacity-50'}`}>
                              {showAsMystery ? '❔' : a.emoji}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-emerald-900 text-sm leading-tight">
                                {showAsMystery ? '???' : a.title}
                              </p>
                              <p className="text-xs text-emerald-700/60 leading-tight mt-0.5">
                                {showAsMystery ? t('secretAchievement') : a.description}
                              </p>
                            </div>
                          </div>
                          {!a.unlocked && showAsMystery && (
                            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                              <Lock size={10} /> {t('secret')}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-bold text-emerald-900 mb-3">{t('creations')} ({posts.length})</h3>
                {posts.length === 0 ? (
                  <p className="text-sm text-emerald-700/60">{t('noPostsYetShort')}</p>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {posts.map((p) => {
                      const cat = CATEGORY_META[p.idea_category];
                      const diff = DIFFICULTY_META[p.idea_difficulty];
                      return (
                        <div key={p.id} className="bg-white rounded-2xl border border-emerald-100 overflow-hidden">
                          <img src={p.image_url} alt={p.idea_title} className="w-full h-32 object-cover" />
                          <div className="p-3">
                            <p className="font-semibold text-emerald-900 text-sm leading-tight">{p.idea_title}</p>
                            <div className="flex items-center gap-1.5 mt-2">
                              <span className="text-xs" style={{ color: cat.color }}>{cat.emoji}</span>
                              <span className="text-xs" style={{ color: diff.color }}>{p.idea_difficulty === 'easy' ? t('diffEasy') : p.idea_difficulty === 'medium' ? t('diffMedium') : t('diffHard')}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
