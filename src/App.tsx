import { useState, Suspense, lazy, Component, type ReactNode } from 'react';
import { Camera, Users, User, Moon, ShoppingBag, Globe } from 'lucide-react';
import { AuthProvider, useAuth } from '@/lib/auth';
import AuthScreen from '@/screens/AuthScreen';
import { CelebrationOverlay } from '@/components/CelebrationOverlay';
import { WavesBackground } from '@/components/WavesBackground';
import { useI18n, I18nProvider, LANGUAGES, type LangCode } from '@/lib/i18n';

const ScanScreen = lazy(() => import('@/screens/ScanScreen'));
const SleepScreen = lazy(() => import('@/screens/SleepScreen'));
const CommunityScreen = lazy(() => import('@/screens/CommunityScreen'));
const StoreScreen = lazy(() => import('@/screens/StoreScreen'));
const ProfileScreen = lazy(() => import('@/screens/ProfileScreen'));

type Tab = 'scan' | 'sleep' | 'community' | 'store' | 'profile';

class ScreenErrorBoundary extends Component<
  { children: ReactNode; onRetry: () => void; errorText: string; retryText: string },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('Screen crashed:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <p className="text-red-500 mb-3">{this.props.errorText}</p>
          <button
            onClick={() => {
              this.setState({ hasError: false });
              this.props.onRetry();
            }}
            className="px-4 py-2 rounded-xl bg-emerald-500 text-white font-semibold"
          >
            {this.props.retryText}
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function Loading() {
  const { t } = useI18n();
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center text-emerald-700/60">
      {t('loading')}
    </div>
  );
}

function LanguageSelector({ isDark }: { isDark: boolean }) {
  const { lang, setLang, t } = useI18n();
  const [open, setOpen] = useState(false);
  const current = LANGUAGES.find((l) => l.code === lang);
  return (
    <div className="fixed top-3 right-3 z-50">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl shadow-md text-sm font-semibold transition-all ${
          isDark ? 'bg-slate-800 text-emerald-300 border border-slate-700' : 'bg-white text-emerald-700 border border-emerald-100'
        }`}
      >
        <Globe size={16} />
        <span className="text-base">{current?.flag}</span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className={`absolute top-full right-0 mt-1 rounded-xl shadow-xl border max-h-64 overflow-y-auto z-50 ${
            isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-emerald-100'
          }`}>
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => { setLang(l.code as LangCode); setOpen(false); }}
                className={`w-full flex items-center gap-2 px-4 py-2 text-sm text-left transition-colors ${
                  lang === l.code
                    ? isDark ? 'bg-emerald-900/40 text-emerald-300 font-bold' : 'bg-emerald-50 text-emerald-700 font-bold'
                    : isDark ? 'text-slate-300 hover:bg-slate-700' : 'text-emerald-800 hover:bg-emerald-50'
                }`}
              >
                <span className="text-base">{l.flag}</span>
                {l.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function Shell() {
  const { session, loading, profile } = useAuth();
  const { t } = useI18n();
  const [tab, setTab] = useState<Tab>('scan');

  const isDark = profile?.dark_mode ?? false;
  const bgClass = isDark
    ? 'bg-gradient-to-b from-slate-900 via-slate-800 to-blue-950'
    : 'bg-gradient-to-b from-sky-200 via-cyan-200 to-blue-300';

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-emerald-950' : 'bg-emerald-50'}`}>
        <div className="text-center">
          <div className="text-5xl mb-3 animate-bounce">🐙</div>
          <p className={isDark ? 'text-emerald-300' : 'text-emerald-700/70'}>{t('loadingEco')}</p>
        </div>
      </div>
    );
  }

  if (!session) return <AuthScreen />;

  return (
    <div className={`min-h-screen relative overflow-hidden ${bgClass} pb-16 transition-colors duration-500`}>
      <WavesBackground isDark={isDark} />
      <div className="relative z-10">
        <CelebrationOverlay />
        <ScreenErrorBoundary onRetry={() => setTab('scan')} errorText={t('somethingWrong')} retryText={t('tryAgain')}>
          <Suspense fallback={<Loading />}>
            {tab === 'scan' && <ScanScreen />}
            {tab === 'sleep' && <SleepScreen />}
            {tab === 'community' && <CommunityScreen />}
            {tab === 'store' && <StoreScreen />}
            {tab === 'profile' && <ProfileScreen />}
          </Suspense>
        </ScreenErrorBoundary>

        <LanguageSelector isDark={isDark} />
      </div>

      <nav className="fixed bottom-0 inset-x-0 max-w-2xl mx-auto px-2 pt-1 pb-2 flex justify-around z-40">
        <NavButton active={tab === 'scan'} onClick={() => setTab('scan')} icon={<Camera size={18} />} label={t('navScan')} isDark={isDark} />
        <NavButton active={tab === 'sleep'} onClick={() => setTab('sleep')} icon={<Moon size={18} />} label={t('navSleep')} isDark={isDark} />
        <NavButton active={tab === 'community'} onClick={() => setTab('community')} icon={<Users size={18} />} label={t('navCommunity')} isDark={isDark} />
        <NavButton active={tab === 'store'} onClick={() => setTab('store')} icon={<ShoppingBag size={18} />} label={t('navStore')} isDark={isDark} />
        <NavButton active={tab === 'profile'} onClick={() => setTab('profile')} icon={<User size={18} />} label={t('navProfile')} isDark={isDark} />
      </nav>
    </div>
  );
}

function NavButton({
  active,
  onClick,
  icon,
  label,
  isDark = false,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  isDark?: boolean;
}) {
  const activeColor = isDark ? '#10b981' : '#047857';
  const inactiveColor = isDark ? '#38bdf8' : '#0284c7';
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-0 px-2 py-1 rounded-lg transition-colors"
      style={{ color: active ? activeColor : inactiveColor }}
    >
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <AuthProvider>
        <Shell />
      </AuthProvider>
    </I18nProvider>
  );
}
