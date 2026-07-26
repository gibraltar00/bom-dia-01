import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import PetIllustration from '@/components/PetIllustrations';
import { useI18n, LANGUAGES, type LangCode } from '@/lib/i18n';

export default function AuthScreen() {
  const { signIn, signUp } = useAuth();
  const { lang, setLang, t } = useI18n();
  const [mode, setMode] = useState<'signin' | 'signup'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    if (mode === 'signup') {
      if (!displayName.trim()) {
        setError(t('needName'));
        setBusy(false);
        return;
      }
      const { error } = await signUp(email.trim(), password, displayName.trim());
      if (error) setError(error);
    } else {
      const { error } = await signIn(email.trim(), password);
      if (error) setError(error);
    }
    setBusy(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-teal-50 to-cyan-50 flex flex-col">
      <div className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 shadow-lg shadow-emerald-900/20 sticky top-0 z-20">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-2">
          <span className="text-white font-bold text-sm shrink-0">{t('language')}</span>
          <div className="relative flex-1">
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as LangCode)}
              className="w-full appearance-none pl-3 pr-9 py-2 rounded-xl bg-white text-emerald-700 font-bold text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-300 cursor-pointer"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.flag} {l.label}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600 text-xs">▼</span>
          </div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-5">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-40 h-40 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-xl shadow-emerald-500/40 mb-5 overflow-hidden ring-4 ring-white/40">
            <PetIllustration petKey="octopus" color="#ef4444" style={{ width: '100%', height: '100%', fontSize: '8rem' }} />
          </div>
          <h1 className="text-3xl font-extrabold text-emerald-900 tracking-tight">EcOtopus</h1>
          <p className="text-emerald-700/80 mt-1">{t('tagline')}</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-emerald-900/5 border border-emerald-100 p-7">
          <div className="flex gap-1 p-1 bg-emerald-50 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                mode === 'signup' ? 'bg-white text-emerald-700 shadow-sm' : 'text-emerald-600/70'
              }`}
            >
              {t('createAccount')}
            </button>
            <button
              type="button"
              onClick={() => setMode('signin')}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                mode === 'signin' ? 'bg-white text-emerald-700 shadow-sm' : 'text-emerald-600/70'
              }`}
            >
              {t('signIn')}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-emerald-900 mb-1.5">{t('displayName')}</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder={t('displayNamePlaceholder')}
                  className="w-full px-4 py-3 rounded-xl border border-emerald-200 bg-emerald-50/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-emerald-900 mb-1.5">{t('email')}</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-emerald-200 bg-emerald-50/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-emerald-900 mb-1.5">{t.password}</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.passwordPlaceholder}
                className="w-full px-4 py-3 rounded-xl border border-emerald-200 bg-emerald-50/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
              />
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:translate-y-0"
            >
              {busy ? t('busy') : mode === 'signup' ? t('submitCreate') : t('submitSignIn')}
            </button>
          </form>
        </div>
        <p className="text-center text-xs text-emerald-700/60 mt-5">
          {t('agree')}
        </p>
      </div>
      </div>
    </div>
  );
}
