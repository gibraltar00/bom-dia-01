import { supabase } from './supabase';

export interface AchievementDef {
  key: string;
  title: string;
  description: string;
  emoji: string;
  coin_reward: number;
  xp_reward: number;
  is_secret?: boolean;
}

export interface UnlockedAchievement {
  key: string;
  unlocked_at: string;
}

export interface AchievementWithStatus extends AchievementDef {
  unlocked: boolean;
  unlocked_at: string | null;
}

let catalogCache: AchievementDef[] | null = null;

export async function loadAchievementCatalog(): Promise<AchievementDef[]> {
  if (catalogCache) return catalogCache;
  const { data, error } = await supabase
    .from('achievements_catalog')
    .select('key, title, description, emoji, coin_reward, xp_reward, is_secret')
    .order('coin_reward', { ascending: true });
  if (error) throw new Error(error.message);
  catalogCache = (data ?? []) as AchievementDef[];
  return catalogCache;
}

export async function loadUserAchievements(userId: string): Promise<UnlockedAchievement[]> {
  const { data, error } = await supabase
    .from('user_achievements')
    .select('achievement_key, unlocked_at')
    .eq('user_id', userId);
  if (error) throw new Error(error.message);
  return (data ?? []).map((r) => ({ key: r.achievement_key, unlocked_at: r.unlocked_at }));
}

export interface UnlockResult {
  key: string;
  title: string;
  emoji: string;
  coins: number;
  xp: number;
  newlyUnlocked: boolean;
}

/**
 * Attempts to unlock an achievement for the given user. If already unlocked,
 * this is a no-op (returns newlyUnlocked: false). If newly unlocked, awards
 * coins and XP to the profile and returns the reward info so the UI can
 * celebrate.
 */
export async function unlockAchievement(
  userId: string,
  key: string
): Promise<UnlockResult | null> {
  const catalog = await loadAchievementCatalog();
  const def = catalog.find((a) => a.key === key);
  if (!def) return null;

  // Check if already unlocked
  const { data: existing } = await supabase
    .from('user_achievements')
    .select('achievement_key')
    .eq('user_id', userId)
    .eq('achievement_key', key)
    .maybeSingle();

  if (existing) {
    return {
      key: def.key,
      title: def.title,
      emoji: def.emoji,
      coins: def.coin_reward,
      xp: def.xp_reward,
      newlyUnlocked: false,
    };
  }

  // Insert unlock record
  const { error: insertErr } = await supabase
    .from('user_achievements')
    .insert({ user_id: userId, achievement_key: key });

  if (insertErr) {
    // Could be a race — check again
    if (insertErr.code === '23505') {
      return {
        key: def.key,
        title: def.title,
        emoji: def.emoji,
        coins: def.coin_reward,
        xp: def.xp_reward,
        newlyUnlocked: false,
      };
    }
    throw new Error(insertErr.message);
  }

  // Award rewards to profile
  if (def.coin_reward > 0 || def.xp_reward > 0) {
    const { data: prof } = await supabase
      .from('profiles')
      .select('eco_points, xp')
      .eq('id', userId)
      .maybeSingle();
    if (prof) {
      await supabase
        .from('profiles')
        .update({
          eco_points: (prof.eco_points ?? 0) + def.coin_reward,
          xp: (prof.xp ?? 0) + def.xp_reward,
        })
        .eq('id', userId);
    }
  }

  return {
    key: def.key,
    title: def.title,
    emoji: def.emoji,
    coins: def.coin_reward,
    xp: def.xp_reward,
    newlyUnlocked: true,
  };
}

/**
 * Checks and unlocks multiple achievements in sequence. Returns only the
 * ones that were newly unlocked (so the UI can celebrate all of them).
 */
export async function unlockAchievements(
  userId: string,
  keys: string[]
): Promise<UnlockResult[]> {
  const results: UnlockResult[] = [];
  for (const key of keys) {
    const r = await unlockAchievement(userId, key);
    if (r && r.newlyUnlocked) results.push(r);
  }
  return results;
}
