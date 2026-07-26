export type Difficulty = 'easy' | 'medium' | 'hard';

export type IdeaCategory = 'daily' | 'decoration' | 'toy';

export interface UpcycleIdea {
  title: string;
  description: string;
  category: IdeaCategory;
  difficulty: Difficulty;
  materials: string[];
  steps: string[];
}

export interface PetDef {
  key: string;
  name: string;
  emoji: string;
  color: string;
  price: number;
  tagline: string;
  phrases: string[];
}

export const PETS: PetDef[] = [
  { key: 'octopus', name: 'Otto the Octopus', emoji: '🐙', color: '#ef4444', price: 0, tagline: 'Your eco mascot — free starter pet.', phrases: ['Eight arms, eight upcycle projects at once!', 'I squeezed through a jar lid just to recycle it!', 'Did you know I have three hearts? All green!', 'Blue blood, green lifestyle — that is me.', 'I can open jars, bottles, and minds to recycling.'] },
  { key: 'turtle', name: 'Tina the Turtle', emoji: '🐢', color: '#16a34a', price: 12, tagline: 'Slow and steady wins the eco race.', phrases: ['I have lived 100 years — I have seen the plastic tide rise.', 'My shell is my home; the ocean is yours, keep it clean.', 'I munch on jellyfish, not plastic bags. Please tell them apart!', 'Slow steps still cross the ocean, friend.', 'I remember when this reef had no litter. Let us bring that back.'] },
  { key: 'dolphin', name: 'Dex the Dolphin', emoji: '🐬', color: '#0ea5e9', price: 18, tagline: 'Smart and playful in the waves.', phrases: ['I recognize myself in the mirror — and I see trash. Let us fix that!', 'We name each other with whistles. I call you Friend of the Sea.', 'I can flip a bottle cap off with my nose. Upcycle trick!', 'Half my brain sleeps while the other half watches for litter.', 'I pass sponges on my nose as a fashion statement. Reuse, reuse!'] },
  { key: 'whale', name: 'Willa the Whale', emoji: '🐳', color: '#1e40af', price: 25, tagline: 'Gentle giant of the deep.', phrases: ['My song travels 10,000 miles. Today I sing: recycle.', 'I eat plankton, not plastic. Please keep them separate.', 'My heart is the size of a small car — and it beats for the ocean.', 'I breathe once an hour. Every breath is precious, like every scrap.', 'The deep blue is my cathedral. Keep it pristine.'] },
  { key: 'albatross', name: 'Alby the Albatross', emoji: '🕊️', color: '#64748b', price: 20, tagline: 'Soars above the plastic tide.', phrases: ['I fly 600 miles in a day and see every plastic bottle below.', 'I lock my wings and glide for hours — zero fuel, zero waste. Be like me!', 'I scoop squid from the surface. Not bottle caps. Please.', 'My wings span 11 feet. Big enough to carry big ideas.', 'I nest on remote islands. Even they are not safe from plastic.'] },
  { key: 'seal', name: 'Sage the Seal', emoji: '🦭', color: '#475569', price: 15, tagline: 'Sleek guardian of the shore.', phrases: ['I can dive 1,000 feet deep. I bring back stories, not trash.', 'My whiskers feel fish in the dark. They also feel microplastics. Yuck.', 'I sunbathe on rocks — and on bottle caps. Less of those, please.', 'I hold my breath for two hours. Long enough to clean a whole beach.', 'I bark at my pups. Today I bark at litterbugs!'] },
  { key: 'crab', name: 'Coco the Crab', emoji: '🦀', color: '#dc2626', price: 10, tagline: 'Snappy little recycler.', phrases: ['I walk sideways — toward sustainability, obviously.', 'My claws can snip a plastic ring in half. Save a turtle, snip yours too!', 'I dig burrows in the sand. I keep finding straws in them. Stop that!', 'I molt my shell once a year. You cannot molt, so reuse instead.', 'Tide pools are my living room. Wipe your feet — and your waste.'] },
  { key: 'otter', name: 'Ollie the Otter', emoji: '🦦', color: '#78350f', price: 14, tagline: 'Playful river cleaner.', phrases: ['I use a rock as my favorite tool. Same rock, 20 years. Reuse champion!', 'I have a pocket under my arm for my rock. Where is your pocket for reuse?', 'I float on my back and crack open clams. I also crack open upcycle ideas.', 'I hold hands with my friends while sleeping so we do not drift. Hold the planet too.', 'My fur is the densest in the animal kingdom. Keep oil out of it, please.'] },
  { key: 'fish', name: 'Finn the Fish', emoji: '🐟', color: '#f472b6', price: 16, tagline: 'Tiny but mighty for the ocean.', phrases: ['I school with 10,000 friends. Together we are a tide of change.', 'I breathe through my gills. Plastic clogs them. Keep water clean.', 'I am small, but I eat algae that would smother the reef. Small job, big deal.', 'My scales reflect light like a rainbow. Plastic does not. Pick it up!', 'I was born knowing where to go. Let us make sure the reef is still there.'] },
];

export const PET_MAP: Record<string, PetDef> = Object.fromEntries(
  PETS.map((p) => [p.key, p])
);

export const DIFFICULTY_META: Record<Difficulty, { label: string; color: string; dots: number }> = {
  easy: { label: 'Easy', color: '#16a34a', dots: 1 },
  medium: { label: 'Medium', color: '#f59e0b', dots: 2 },
  hard: { label: 'Hard', color: '#ef4444', dots: 3 },
};

export const CATEGORY_META: Record<IdeaCategory, { label: string; emoji: string; color: string }> = {
  daily: { label: 'Daily Use', emoji: '♻️', color: '#0ea5e9' },
  decoration: { label: 'Decoration', emoji: '🪴', color: '#16a34a' },
  toy: { label: 'Toy', emoji: '🧸', color: '#f59e0b' },
};

export function getPet(key: string | null | undefined): PetDef {
  if (key && PET_MAP[key]) return PET_MAP[key];
  return PETS[0];
}

// --- Level / XP system ---
// XP needed to reach a given level (cumulative). Level 1 = 0 XP.
// Curve: level N requires 100 * N * (N-1) / 2 cumulative XP (triangular growth).
export function xpForLevel(level: number): number {
  if (level <= 1) return 0;
  return 50 * level * (level - 1);
}

export function levelFromXp(xp: number): number {
  let level = 1;
  while (xpForLevel(level + 1) <= xp) level++;
  return level;
}

export function levelProgress(xp: number): {
  level: number;
  currentLevelXp: number;
  nextLevelXp: number;
  intoLevel: number;
  span: number;
  pct: number;
} {
  const level = levelFromXp(xp);
  const currentLevelXp = xpForLevel(level);
  const nextLevelXp = xpForLevel(level + 1);
  const intoLevel = xp - currentLevelXp;
  const span = nextLevelXp - currentLevelXp;
  return {
    level,
    currentLevelXp,
    nextLevelXp,
    intoLevel,
    span,
    pct: span > 0 ? Math.min(100, Math.round((intoLevel / span) * 100)) : 100,
  };
}

export const LEVEL_TITLES: Record<number, string> = {
  1: 'Eco Sprout',
  2: 'Recycle Rookie',
  3: 'Upcycle Apprentice',
  4: 'Trash Tamer',
  5: 'Eco Warrior',
  6: 'Green Guardian',
  7: 'Sustainability Sage',
  8: 'Eco Legend',
  9: 'Planet Protector',
  10: 'EcOtopus Master',
};

export function levelTitle(level: number): string {
  return LEVEL_TITLES[Math.min(level, 10)] ?? 'Eco Legend';
}

// --- Reward constants ---
export const REWARDS = {
  photoCoins: 5, // coins every time you take/upload a photo
  satisfactionCoins: 10, // coins when satisfied with an idea
  satisfactionXp: 20, // xp when satisfied
  publishXp: 15, // xp for posting to community
  likeXp: 5, // xp when your post gets a like
};

// --- Sleep XP ---
// XP awarded based on hours slept. Sweet spot is 7-9h.
// <5h: 5 XP (rough night, still logged it)
// 5-6.9h: 10 XP
// 7-9h: 25 XP (ideal range)
// 9-10h: 15 XP (a bit much but okay)
// >10h: 8 XP (too much isn't great either)
export function sleepXpForHours(hours: number): number {
  if (hours < 5) return 5;
  if (hours < 7) return 10;
  if (hours <= 9) return 25;
  if (hours <= 10) return 15;
  return 8;
}

export function sleepQualityLabel(hours: number): { label: string; color: string } {
  if (hours < 5) return { label: 'Rough night', color: '#ef4444' };
  if (hours < 7) return { label: 'Short sleep', color: '#f59e0b' };
  if (hours <= 9) return { label: 'Ideal sleep', color: '#16a34a' };
  if (hours <= 10) return { label: 'A bit long', color: '#f59e0b' };
  return { label: 'Overslept', color: '#ef4444' };
}
