import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { translations, type LangCode, type TranslationKey } from '@/lib/translations';

export const LANGUAGES: { code: LangCode; label: string; flag: string }[] = [
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
];

interface I18nContextValue {
  lang: LangCode;
  setLang: (code: LangCode) => void;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = 'ecooctopus_lang';

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>(() => {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && saved in translations) return saved as LangCode;
    }
    return 'pt';
  });

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch {}
  }, [lang]);

  function setLang(code: LangCode) {
    setLangState(code);
  }

  function t(key: TranslationKey): string {
    return translations[lang]?.[key] ?? translations.en[key] ?? key;
  }

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
