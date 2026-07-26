import { useEffect, useState } from 'react';
import { Star, Sparkles, Trash2, Trophy, Lock, Sun, Moon, RotateCw, ZoomIn } from 'lucide-react';
import PetAvatar from '@/components/PetAvatar';
import PetScene from '@/components/PetScene';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import {
  PETS,
  PET_MAP,
  getPet,
  levelProgress,
  CATEGORY_META,
  DIFFICULTY_META,
} from '@/lib/data';
import {
  loadAchievementCatalog,
  loadUserAchievements,
  type AchievementWithStatus,
} from '@/lib/achievements';
import { useI18n } from '@/lib/i18n';
import { getLocalizedPet } from '@/lib/petI18n';
import { translations } from '@/lib/translations';

interface MyPost {
  id: string;
  image_url: string;
  caption: string;
  idea_title: string;
  idea_category: 'daily' | 'decoration' | 'toy';
  idea_difficulty: 'easy' | 'medium' | 'hard';
  created_at: string;
}

export default function ProfileScreen() {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const { t, lang } = useI18n();
  const [ownedPets, setOwnedPets] = useState<string[]>([]);
  const [posts, setPosts] = useState<MyPost[]>([]);
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [activePet, setActivePet] = useState('octopus');
  const [avatarAngle, setAvatarAngle] = useState(0);
  const [avatarSize, setAvatarSize] = useState(100);
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [achievements, setAchievements] = useState<AchievementWithStatus[]>([]);

  const [loadError, setLoadError] = useState(false);

  async function loadAll() {
    if (!user) return;
    try {
    const [pets, p] = await Promise.all([
      supabase.from('owned_pets').select('pet_key').eq('user_id', user.id),
      supabase
        .from('community_posts')
        .select('id, image_url, caption, idea_title, idea_category, idea_difficulty, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }),
    ]);
    setOwnedPets((pets.data ?? []).map((r) => r.pet_key));
    setPosts((p.data ?? []) as MyPost[]);
    // Load achievements
    const [catalog, unlocked] = await Promise.all([
      loadAchievementCatalog(),
      loadUserAchievements(user.id),
    ]);
    const unlockedMap = new Map(unlocked.map((u) => [u.key, u.unlocked_at]));
    setAchievements(
      catalog.map((c) => ({
        ...c,
        unlocked: unlockedMap.has(c.key),
        unlocked_at: unlockedMap.get(c.key) ?? null,
      }))
    );
    } catch (e) {
      console.warn('profile load failed', e);
      setLoadError(true);
    }
  }

  useEffect(() => {
    loadAll();
  }, [user]);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name);
      setBio(profile.bio ?? '');
      setActivePet(profile.active_pet);
      setAvatarAngle(profile.avatar_angle ?? 0);
      setAvatarSize(profile.avatar_size ?? 100);
    }
  }, [profile]);

  async function saveProfile() {
    if (!user) return;
    setBusy(true);
    await supabase
      .from('profiles')
      .update({ display_name: displayName.trim(), bio: bio.trim(), active_pet: activePet, avatar_angle: avatarAngle, avatar_size: avatarSize })
      .eq('id', user.id);
    await refreshProfile();
    setEditing(false);
    setBusy(false);
  }

  async function deletePost(post: MyPost) {
    if (!user) return;
    try {
      const { error } = await supabase.from('community_posts').delete().eq('id', post.id);
      if (error) throw new Error(error.message);
      const match = post.image_url.match(/\/scans\/(.+)$/);
      if (match) {
        await supabase.storage.from('scans').remove([match[1]]);
      }
      setPosts((prev) => prev.filter((p) => p.id !== post.id));
    } catch (e) {
      console.warn('delete failed', e);
    } finally {
      setConfirmDelete(null);
    }
  }

  async function toggleDarkMode() {
    if (!user || !profile) return;
    const next = !profile.dark_mode;
    await supabase.from('profiles').update({ dark_mode: next }).eq('id', user.id);
    await refreshProfile();
  }

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6 text-center">
        <p className="text-emerald-700/60">{t('loadingProfile')}</p>
      </div>
    );
  }
  if (loadError) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6 text-center">
        <p className="text-red-500 mb-3">{t('couldNotLoadProfile')}</p>
        <button onClick={() => { setLoadError(false); loadAll(); }} className="px-4 py-2 rounded-xl bg-emerald-500 text-white font-semibold">{t('tryAgain')}</button>
      </div>
    );
  }
  const pet = getPet(profile.active_pet);
  const loc = getLocalizedPet(profile.active_pet, lang);
  const lp = levelProgress(profile.xp ?? 0);
  const isDark = profile.dark_mode ?? false;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header card with level + XP */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-6 text-white shadow-xl shadow-emerald-500/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="inline-flex items-center gap-1.5 bg-white/20 px-2.5 py-1 rounded-full text-xs font-bold">
              <Sparkles size={13} /> {t('level')} {lp.level}
            </span>
            <span className="ml-2 text-sm font-semibold text-white/90">{translations[lang][`level${Math.min(lp.level, 10)}` as keyof typeof translations[typeof lang]]}</span>
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
            <p className="text-white/80 text-sm truncate">{loc.name}</p>
            <div className="mt-2">
              <div className="h-2 rounded-full bg-white/20 overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-500"
                  style={{ width: `${lp.pct}%` }}
                />
              </div>
              <p className="text-xs text-white/70 mt-1">
                {lp.intoLevel} / {lp.span} XP {t('xpToLevel')} {lp.level + 1}
              </p>
            </div>
          </div>
        </div>
        {profile.bio && <p className="text-white/90 text-sm mt-4">{profile.bio}</p>}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setEditing(true)}
            className="flex-1 py-2 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur text-sm font-semibold transition-colors"
          >
            {t('editProfile')}
          </button>
          <button
            onClick={signOut}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-sm font-semibold transition-colors"
          >
            {t('signOut')}
          </button>
        </div>
      </div>

      {/* Favorite pet showcase with scene */}
      <div className="mt-6">
        <div className="flex items-center gap-2 mb-3">
          <Star size={18} className="text-amber-500 fill-amber-500" />
          <h2 className="font-bold text-emerald-900">{t('favoritePet')}</h2>
        </div>
        <PetScene petKey={profile.active_pet} />
      </div>

      {/* Achievements */}
      <div className="mt-6">
        <div className="flex items-center gap-2 mb-3">
          <Trophy size={18} className="text-amber-500" />
          <h2 className="font-bold text-emerald-900">
            {t('achievements')} ({`${achievements.filter((a) => a.unlocked).length}/${achievements.length}`})
          </h2>
        </div>
        {achievements.length === 0 ? (
          <p className="text-sm text-emerald-700/60">{t('loadingAchievements')}</p>
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
                  {a.unlocked ? (
                    <div className="flex items-center gap-1.5 mt-2">
                      {a.coin_reward > 0 && (
                        <span className="text-xs font-bold text-amber-600">+{a.coin_reward} 🪙</span>
                      )}
                      {a.xp_reward > 0 && (
                        <span className="text-xs font-bold text-emerald-600">+{a.xp_reward} XP</span>
                      )}
                    </div>
                  ) : showAsMystery ? (
                    <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                      <Lock size={10} /> {t('secret')}
                    </p>
                  ) : (
                    <p className="text-xs text-emerald-700/40 mt-2">{t('locked')}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Dark / Light mode toggle */}
      <div className="mt-6">
        <div className="flex items-center gap-2 mb-3">
          {isDark ? <Moon size={18} className="text-emerald-400" /> : <Sun size={18} className="text-amber-500" />}
          <h2 className={`font-bold ${isDark ? 'text-slate-100' : 'text-emerald-900'}`}>{t('appearance')}</h2>
        </div>
        <div className="flex gap-3">
          <button
            onClick={toggleDarkMode}
            disabled={busy}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border-2 transition-all disabled:opacity-60 ${
              !isDark
                ? 'border-amber-400 bg-amber-50 text-amber-800 shadow-sm'
                : 'border-slate-600 bg-slate-800 text-slate-300 hover:border-amber-400/50'
            }`}
          >
            <Sun size={18} /> {t('lightMode')}
          </button>
          <button
            onClick={toggleDarkMode}
            disabled={busy}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border-2 transition-all disabled:opacity-60 ${
              isDark
                ? 'border-emerald-400 bg-slate-800 text-emerald-300 shadow-sm'
                : 'border-slate-200 bg-white text-slate-500 hover:border-emerald-300'
            }`}
          >
            <Moon size={18} /> {t('darkMode')}
          </button>
        </div>
      </div>


      {/* Edit modal */}
      {editing && (
        <div
          className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center p-4 z-50"
          onClick={() => setEditing(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 w-full max-w-md max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold text-emerald-900 mb-4">{t('editProfile')}</h2>
            <label className="block text-sm font-medium text-emerald-900 mb-1">{t('displayName')}</label>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-emerald-200 bg-emerald-50/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 mb-4"
            />
            <label className="block text-sm font-medium text-emerald-900 mb-1">{t('bio')}</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-emerald-200 bg-emerald-50/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 mb-4 resize-none"
            />
            <label className="block text-sm font-medium text-emerald-900 mb-2">{t('favoritePet')}</label>
            <div className="grid grid-cols-6 gap-2 mb-5">
              {PETS.filter((p) => ownedPets.includes(p.key)).map((p) => (
                <button
                  key={p.key}
                  onClick={() => setActivePet(p.key)}
                  className={`aspect-square rounded-xl flex items-center justify-center transition-all overflow-hidden ${
                    activePet === p.key
                      ? 'bg-emerald-500 scale-110 shadow-md'
                      : 'bg-emerald-50 hover:bg-emerald-100'
                  }`}
                  title={p.name}
                >
                  {p.emoji}
                </button>
              ))}
            </div>
            <label className="block text-sm font-medium text-emerald-900 mb-2 flex items-center gap-1.5">
              <RotateCw size={14} /> {t('photoAngle')}
            </label>
            <div className="flex items-center gap-3 mb-5">
              <input
                type="range"
                min={0}
                max={359}
                value={avatarAngle}
                onChange={(e) => setAvatarAngle(Number(e.target.value))}
                className="flex-1 accent-emerald-500"
              />
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center text-3xl flex-shrink-0" style={{ transform: `rotate(${avatarAngle}deg)` }}>
                {PET_MAP[activePet]?.emoji ?? '🐙'}
              </div>
              <button
                onClick={() => setAvatarAngle(0)}
                className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
              >
                {t('reset')}
              </button>
            </div>
            <label className="block text-sm font-medium text-emerald-900 mb-2 flex items-center gap-1.5">
              <ZoomIn size={14} /> {t('petSize')}
            </label>
            <div className="flex items-center gap-3 mb-5">
              <input
                type="range"
                min={50}
                max={200}
                value={avatarSize}
                onChange={(e) => setAvatarSize(Number(e.target.value))}
                className="flex-1 accent-emerald-500"
              />
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center flex-shrink-0 overflow-hidden">
                <span
                  className="leading-none"
                  style={{
                    fontSize: `${(avatarSize / 100) * 28}px`,
                    transform: `rotate(${avatarAngle}deg)`,
                  }}
                >
                  {PET_MAP[activePet]?.emoji ?? '🐙'}
                </span>
              </div>
              <button
                onClick={() => setAvatarSize(100)}
                className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
              >
                {t('reset')}
              </button>
            </div>
            <div className="flex gap-3">
              <button
                onClick={saveProfile}
                disabled={busy}
                className="flex-1 py-3 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors disabled:opacity-60"
              >
                {busy ? t('saving') : t('save')}
              </button>
              <button
                onClick={() => setEditing(false)}
                className="px-5 py-3 rounded-xl bg-emerald-50 text-emerald-700 font-semibold hover:bg-emerald-100 transition-colors"
              >
                {t('cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pet collection */}
      <div className="mt-6">
        <h2 className="font-bold text-emerald-900 mb-3">{t('myPets')} ({ownedPets.length}/{PETS.length})</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {PETS.map((p) => {
            const owned = ownedPets.includes(p.key);
            const isFavorite = profile.active_pet === p.key;
            return (
              <div
                key={p.key}
                className={`relative rounded-2xl p-3 flex flex-col items-center justify-center text-center transition-all ${
                  owned
                    ? isDark
                      ? 'bg-slate-800 border border-slate-700'
                      : 'bg-white border border-emerald-100 shadow-sm'
                    : isDark
                      ? 'bg-slate-800/50 border border-dashed border-slate-600'
                      : 'bg-emerald-50/50 border border-dashed border-emerald-200'
                }`}
                title={p.name}
              >
                {isFavorite && (
                  <Star
                    size={14}
                    className="absolute top-1 right-1 text-amber-500 fill-amber-500"
                  />
                )}
                <span className={`text-3xl leading-none ${owned ? '' : 'opacity-30 grayscale'}`}>
                  {p.emoji}
                </span>
                <span className={`text-[10px] mt-1 ${owned ? (isDark ? 'text-slate-300' : 'text-emerald-700/70') : isDark ? 'text-slate-500' : 'text-emerald-700/40'}`}>
                  {owned ? p.name.split(' ')[0] : t('locked')}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* My creations */}
      <div className="mt-6">
        <h2 className="font-bold text-emerald-900 mb-3">{t('myCreations')} ({posts.length})</h2>
        {posts.length === 0 ? (
          <p className="text-sm text-emerald-700/60">{t('noPostsYet')}</p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {posts.map((p) => {
              const cat = CATEGORY_META[p.idea_category];
              const diff = DIFFICULTY_META[p.idea_difficulty];
              return (
                <div key={p.id} className="bg-white rounded-2xl border border-emerald-100 overflow-hidden">
                  <img src={p.image_url} alt={p.idea_title} className="w-full h-32 object-cover" />
                  <div className="p-3">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold text-emerald-900 text-sm leading-tight">{p.idea_title}</p>
                      <button
                        onClick={() => setConfirmDelete(p.id)}
                        className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-emerald-700/40 hover:text-red-500 hover:bg-red-50 transition-colors"
                        title={t('deleteCreation')}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="text-xs" style={{ color: cat.color }}>{cat.emoji}</span>
                      <span className="text-xs" style={{ color: diff.color }}>{idea.difficulty === 'easy' ? t('diffEasy') : idea.difficulty === 'medium' ? t('diffMedium') : t('diffHard')}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {confirmDelete && (
        <div
          className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center p-4 z-50"
          onClick={() => setConfirmDelete(null)}
        >
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-emerald-900 mb-2">{t('deleteCreation')}</h3>
            <p className="text-sm text-emerald-700/70 mb-5">{t('deleteCreationDesc')}</p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  const post = posts.find((p) => p.id === confirmDelete);
                  if (post) deletePost(post);
                }}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors"
              >
                {t('delete')}
              </button>
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-3 rounded-xl bg-emerald-50 text-emerald-700 font-semibold hover:bg-emerald-100 transition-colors"
              >
                {t('cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
