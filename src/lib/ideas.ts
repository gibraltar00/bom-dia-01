import type { IdeaCategory, UpcycleIdea } from './data';
import type { LangCode } from './translations';
import {
  pickEntryLocalized,
  getTwists,
  getAdjectives,
  getKnownMaterials,
} from './ideasI18n';

export function generateIdeas(materialTag: string, lang: LangCode = 'en'): UpcycleIdea[] {
  const entry = pickEntryLocalized(materialTag, lang);
  return [...entry.daily, ...entry.decoration, ...entry.toy];
}

export function generateIdeasForPhoto(materialTag: string, lang: LangCode = 'en'): UpcycleIdea[] {
  return generateIdeas(materialTag, lang);
}

export function generateIdeasForCategory(materialTag: string, category: IdeaCategory, lang: LangCode = 'en'): UpcycleIdea[] {
  const entry = pickEntryLocalized(materialTag, lang);
  return entry[category].slice(0, 3);
}

export function generateExtraIdeasForCategory(materialTag: string, category: IdeaCategory, lang: LangCode = 'en'): UpcycleIdea[] {
  const entry = pickEntryLocalized(materialTag, lang);
  return entry[category].slice(3);
}

export function generateInfiniteIdeas(materialTag: string, category: IdeaCategory, count: number, lang: LangCode = 'en'): UpcycleIdea[] {
  const entry = pickEntryLocalized(materialTag, lang);
  const base = entry[category];
  const twists = getTwists(lang);
  const adjectives = getAdjectives(lang);
  const result: UpcycleIdea[] = [];
  for (let i = 0; i < count; i++) {
    const src = base[i % base.length];
    const twist = twists[i % twists.length];
    const adj = adjectives[i % adjectives.length];
    result.push({
      title: `${adj} ${src.title}`,
      description: `${src.description} ${twist}`,
      category,
      difficulty: src.difficulty,
      materials: src.materials,
      steps: [...src.steps, twist],
    });
  }
  return result;
}

export function getKnownMaterialsForLang(lang: LangCode): string[] {
  return getKnownMaterials(lang);
}

export const KNOWN_MATERIALS = getKnownMaterials('en');

export function categoryLabel(c: IdeaCategory): string {
  return c.charAt(0).toUpperCase() + c.slice(1);
}
