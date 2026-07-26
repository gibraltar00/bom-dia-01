import { useEffect, useRef, useState } from 'react';
import { Camera, Sparkles, Check, X, RefreshCw, ImageIcon, SwitchCamera, AlertCircle, ArrowLeft, Plus } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { generateIdeasForCategory, generateExtraIdeasForCategory, generateInfiniteIdeas, getKnownMaterialsForLang } from '@/lib/ideas';
import { CATEGORY_META, DIFFICULTY_META, REWARDS, levelFromXp, type IdeaCategory, type UpcycleIdea, PETS } from '@/lib/data';
import { unlockAchievements, unlockAchievement } from '@/lib/achievements';
import { pushCelebration } from '@/components/CelebrationOverlay';
import { useI18n } from '@/lib/i18n';
import { getRecyclingTips } from '@/lib/tipsI18n';
import { getLocalizedPet } from '@/lib/petI18n';

type Stage = 'capture' | 'category' | 'material' | 'loading' | 'ideas' | 'satisfaction' | 'done';
type CameraState = 'idle' | 'requesting' | 'live' | 'denied';

export default function ScanScreen() {
  const { user, profile, refreshProfile } = useAuth();
  const { t, lang } = useI18n();
  const [stage, setStage] = useState<Stage>('capture');
  const [tip] = useState(() => {
    const tips = getRecyclingTips(lang);
    return tips[Math.floor(Math.random() * tips.length)];
  });
  const [mascot] = useState(() => {
    const pet = PETS[Math.floor(Math.random() * PETS.length)];
    const loc = getLocalizedPet(pet.key, lang);
    const phrase = loc.phrases[Math.floor(Math.random() * loc.phrases.length)];
    return { pet, phrase, name: loc.name };
  });
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [category, setCategory] = useState<IdeaCategory | null>(null);
  const [material, setMaterial] = useState<string>('mixed');
  const [ideas, setIdeas] = useState<UpcycleIdea[]>([]);
  const [extraIdeas, setExtraIdeas] = useState<UpcycleIdea[]>([]);
  const [infiniteIdeas, setInfiniteIdeas] = useState<UpcycleIdea[]>([]);
  const [showExtra, setShowExtra] = useState(false);
  const [chosenIndex, setChosenIndex] = useState<number | null>(null);
  const [satisfied, setSatisfied] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scanId, setScanId] = useState<string | null>(null);
  const [cameraState, setCameraState] = useState<CameraState>('idle');
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

  const fileRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
  }

  async function startCamera() {
    setError(null);
    setCameraState('requesting');
    stopCamera();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode }, audio: false });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraState('live');
    } catch (e) {
      const err = e as DOMException;
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraState('denied');
        setError(t('cameraDenied'));
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraState('denied');
        setError(t('noCamera'));
      } else {
        setCameraState('idle');
        setError(err.message || 'Could not start the camera.');
      }
    }
  }

  async function switchCamera() {
    const next = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(next);
    if (cameraState === 'live') {
      stopCamera();
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: next }, audio: false });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (e) {
        setError((e as Error).message || 'Could not switch camera.');
      }
    }
  }

  function capturePhoto() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const w = video.videoWidth || 720;
    const h = video.videoHeight || 960;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, w, h);
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
        stopCamera();
        setCameraState('idle');
        handleFile(file);
      },
      'image/jpeg',
      0.9
    );
  }

  function openGallery() {
    stopCamera();
    setCameraState('idle');
    fileRef.current?.click();
  }

  useEffect(() => () => stopCamera(), []);

  async function handleFile(file: File) {
    setError(null);
    setBusy(true);
    try {
      if (!user) throw new Error('Not signed in');
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const path = `${user.id}/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from('scans').upload(path, file, { upsert: false });
      if (upErr) throw new Error(upErr.message);
      const { data } = supabase.storage.from('scans').getPublicUrl(path);
      setPhotoUrl(data.publicUrl);
      if (profile) {
        const newPoints = profile.eco_points + REWARDS.photoCoins;
        await supabase.from('profiles').update({ eco_points: newPoints }).eq('id', user.id);
        await refreshProfile();
        pushCelebration({
          emoji: '🪙',
          title: `+${REWARDS.photoCoins} ${t('ecoCoins')}`,
          subtitle: t('thanksScanning'),
        });
      }
      setStage('category');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setBusy(false);
    }
  }

  function chooseCategory(cat: IdeaCategory) {
    setCategory(cat);
    setStage('material');
  }

  async function generate() {
    if (!category) return;
    setStage('loading');
    const generated = generateIdeasForCategory(material, category, lang);
    setIdeas(generated);
    setExtraIdeas(generateExtraIdeasForCategory(material, category, lang));
    setInfiniteIdeas(generateInfiniteIdeas(material, category, 4, lang));
    setShowExtra(false);
    try {
      const { data, error } = await supabase
        .from('scans')
        .insert({
          photo_url: photoUrl,
          material_tag: material,
          suggestions: generated as unknown as Record<string, unknown>[],
        })
        .select('id')
        .maybeSingle();
      if (error) throw new Error(error.message);
      if (data) setScanId(data.id);
    } catch (e) {
      console.warn('scan insert failed', e);
    }
    setTimeout(() => setStage('ideas'), 700);
  }

  function chooseIdea(i: number) {
    setChosenIndex(i);
    setStage('satisfaction');
  }

  async function submitSatisfaction(value: boolean) {
    setSatisfied(value);
    if (scanId) {
      await supabase.from('scans').update({ chosen_index: chosenIndex, satisfied: value }).eq('id', scanId);
    }
    if (value && profile) {
      const newPoints = profile.eco_points + REWARDS.satisfactionCoins;
      const newXp = profile.xp + REWARDS.satisfactionXp;
      await supabase
        .from('profiles')
        .update({ eco_points: newPoints, xp: newXp })
        .eq('id', user!.id);
      await refreshProfile();
      const unlocked = await unlockAchievement(user!.id, 'first_idea');
      if (unlocked && unlocked.newlyUnlocked) {
        pushCelebration({
          emoji: unlocked.emoji,
          title: unlocked.title,
          subtitle: `+${unlocked.coins} coins, +${unlocked.xp} XP`,
        });
        await refreshProfile();
      }
      // Check level achievements
      const newLevel = levelFromXp(newXp);
      const lvKeys: string[] = [];
      if (newLevel >= 5) lvKeys.push('level_5');
      if (newLevel >= 10) lvKeys.push('level_10');
      const lvUnlocked = await unlockAchievements(user!.id, lvKeys);
      for (const a of lvUnlocked) {
        pushCelebration({
          emoji: a.emoji,
          title: a.title,
          subtitle: `+${a.coins} coins, +${a.xp} XP`,
        });
      }
      await refreshProfile();
    }
    setStage('done');
  }

  function reset() {
    setStage('capture');
    setPhotoUrl(null);
    setCategory(null);
    setMaterial('mixed');
    setIdeas([]);
    setExtraIdeas([]);
    setInfiniteIdeas([]);
    setShowExtra(false);
    setChosenIndex(null);
    setSatisfied(null);
    setScanId(null);
    setError(null);
  }

  if (stage === 'capture') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-emerald-900">{t('scanTitle')}</h1>
          <p className="text-emerald-700/70 mt-1">{t('scanSubtitle')}</p>
        </div>

        <div className="flex items-start gap-3 mb-6 animate-fade-in">
          <div className="relative flex-shrink-0">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-md"
              style={{ background: `${mascot.pet.color}1a`, boxShadow: `0 0 0 2px ${mascot.pet.color}40` }}
            >
              {mascot.pet.emoji}
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white" style={{ backgroundColor: mascot.pet.color }} />
          </div>
          <div className="relative bg-white rounded-2xl rounded-tl-sm shadow-sm border border-emerald-100 px-4 py-3 max-w-[85%]">
            <p className="text-xs font-semibold text-emerald-500 mb-0.5">{mascot.name}</p>
            <p className="text-sm font-medium text-emerald-800 leading-snug">{mascot.phrase}</p>
          </div>
        </div>

        {cameraState === 'live' ? (
          <div className="relative rounded-3xl overflow-hidden bg-black shadow-xl">
            <video ref={videoRef} playsInline muted className="w-full h-80 object-cover" />
            <button
              onClick={switchCamera}
              className="absolute top-3 right-3 w-10 h-10 rounded-full bg-black/50 backdrop-blur text-white flex items-center justify-center hover:bg-black/70 transition-colors"
              title={t('switchCamera')}
            >
              <SwitchCamera size={20} />
            </button>
            <div className="absolute inset-x-0 bottom-0 p-5 flex items-center justify-center gap-4 bg-gradient-to-t from-black/60 to-transparent">
              <button
                onClick={capturePhoto}
                disabled={busy}
                className="w-20 h-20 rounded-full bg-white border-4 border-emerald-400 shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform disabled:opacity-60"
                aria-label={t('takePhoto')}
              >
                <span className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center">
                  <Camera size={26} className="text-white" />
                </span>
              </button>
            </div>
          </div>
        ) : (
          <>
          <div className="space-y-3">
            <button
              onClick={startCamera}
              disabled={cameraState === 'requesting' || busy}
              className="w-full flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold shadow-lg shadow-emerald-500/20 hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:translate-y-0"
            >
              <span className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <Camera size={24} />
              </span>
              <span className="text-left">
                <span className="block">{cameraState === 'requesting' ? t('requestingCamera') : t('useCamera')}</span>
                <span className="block text-sm font-normal text-white/80">{t('takePhotoNow')}</span>
              </span>
            </button>

            <button
              onClick={openGallery}
              disabled={busy}
              className="w-full flex items-center gap-4 p-5 rounded-2xl bg-white border border-emerald-200 text-emerald-800 font-semibold hover:border-emerald-400 hover:bg-emerald-50 transition-all disabled:opacity-60"
            >
              <span className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                <ImageIcon size={24} />
              </span>
              <span className="text-left">
                <span className="block">{t('chooseGallery')}</span>
                <span className="block text-sm font-normal text-emerald-700/60">{t('pickExistingPhoto')}</span>
              </span>
            </button>
          </div>

          <div className="mt-5 flex items-start gap-2.5 px-1">
            <span className="text-lg leading-none mt-0.5">♻️</span>
            <p key={tip} className="text-sm text-emerald-700/70 leading-relaxed animate-fade-in">
              {tip}
            </p>
          </div>
          </>
        )}

        {cameraState === 'denied' && (
          <div className="mt-4 flex items-start gap-2 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
            <span>{error || t('cameraUnavailable')}</span>
          </div>
        )}
        {cameraState !== 'denied' && error && <p className="text-sm text-red-600 mt-4 text-center">{error}</p>}
        {busy && <p className="text-sm text-emerald-600 mt-3 text-center">{t('uploading')}</p>}

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
        <canvas ref={canvasRef} className="hidden" />
      </div>
    );
  }

  if (stage === 'category') {
    const cats: IdeaCategory[] = ['daily', 'decoration', 'toy'];
    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-emerald-900 mb-1">{t('whatMake')}</h1>
        <p className="text-emerald-700/70 mb-5">{t('whatMakeSubtitle')}</p>
        {photoUrl && <img src={photoUrl} alt="scan" className="w-full h-48 object-cover rounded-2xl mb-5" />}
        <div className="space-y-3">
          {cats.map((c) => {
            const meta = CATEGORY_META[c];
            return (
              <button
                key={c}
                onClick={() => chooseCategory(c)}
                className="w-full flex items-center gap-4 p-5 rounded-2xl bg-white border border-emerald-100 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-500/10 transition-all text-left group"
              >
                <span
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
                  style={{ background: `${meta.color}1a` }}
                >
                  {meta.emoji}
                </span>
                <span className="flex-1">
                  <span className="block font-bold text-emerald-900 group-hover:text-emerald-600 transition-colors">
                    {c === 'daily' && t('catDaily')}
                    {c === 'decoration' && t('catDecoration')}
                    {c === 'toy' && t('catToy')}
                  </span>
                  <span className="block text-sm text-emerald-700/60">
                    {c === 'daily' && t('catDailyDesc')}
                    {c === 'decoration' && t('catDecorationDesc')}
                    {c === 'toy' && t('catToyDesc')}
                  </span>
                </span>
                <Sparkles size={20} className="text-emerald-400" />
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (stage === 'material') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <button
          onClick={() => setStage('category')}
          className="inline-flex items-center gap-1.5 text-sm text-emerald-700 hover:text-emerald-900 mb-4"
        >
          <ArrowLeft size={16} /> {t('back')}
        </button>
        <h1 className="text-2xl font-bold text-emerald-900 mb-1">{t('whatMaterial')}</h1>
        <p className="text-emerald-700/70 mb-5">{t('whatMaterialSubtitle')}</p>
        {photoUrl && <img src={photoUrl} alt="scan" className="w-full h-40 object-cover rounded-2xl mb-5" />}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {getKnownMaterialsForLang(lang).map((m) => (
            <button
              key={m}
              onClick={() => setMaterial(m)}
              className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all capitalize ${
                material === m
                  ? 'border-emerald-500 bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                  : 'border-emerald-200 bg-white text-emerald-700 hover:border-emerald-400'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
        <button
          onClick={generate}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold shadow-lg shadow-emerald-500/30 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
        >
          <Sparkles size={18} /> {t('showIdeas')}
        </button>
      </div>
    );
  }

  if (stage === 'loading') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 mb-4 animate-pulse">
          <Sparkles size={28} />
        </div>
        <p className="font-semibold text-emerald-900">{t('ottoThinking')}</p>
        <p className="text-sm text-emerald-700/60 mt-1">{t('cookingIdeas')} {category && (category === 'daily' ? t('catDaily') : category === 'decoration' ? t('catDecoration') : t('catToy')).toLowerCase()}.</p>
      </div>
    );
  }

  if (stage === 'ideas') {
    const catMeta = category ? CATEGORY_META[category] : null;
    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <button
          onClick={() => setStage('material')}
          className="inline-flex items-center gap-1.5 text-sm text-emerald-700 hover:text-emerald-900 mb-4"
        >
          <ArrowLeft size={16} /> {t('back')}
        </button>
        <h1 className="text-2xl font-bold text-emerald-900 mb-1">
          {catMeta?.emoji} {category === 'daily' ? t('catDaily') : category === 'decoration' ? t('catDecoration') : t('catToy')} {t('ideasTitle')}
        </h1>
        <p className="text-emerald-700/70 mb-5">{t('ideasSubtitle')}</p>
        <div className="space-y-4">
          {ideas.map((idea, i) => {
            const diff = DIFFICULTY_META[idea.difficulty];
            return (
              <button
                key={i}
                onClick={() => chooseIdea(i)}
                className="w-full text-left bg-white rounded-2xl border border-emerald-100 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-500/10 transition-all p-5 group"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-bold text-emerald-900 group-hover:text-emerald-600 transition-colors">{idea.title}</h3>
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 flex-shrink-0"
                    style={{ background: `${diff.color}1a`, color: diff.color }}
                  >
                    {idea.difficulty === 'easy' ? t('diffEasy') : idea.difficulty === 'medium' ? t('diffMedium') : t('diffHard')}
                    <span className="flex gap-0.5">
                      {[1, 2, 3].map((d) => (
                        <span
                          key={d}
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: d <= diff.dots ? diff.color : `${diff.color}40` }}
                        />
                      ))}
                    </span>
                  </span>
                </div>
                <p className="text-sm text-emerald-700/80 mb-3">{idea.description}</p>
                <div className="text-xs text-emerald-700/60">
                  <span className="font-semibold">{t('materials')}:</span> {idea.materials.join(', ')}
                </div>
              </button>
            );
          })}

          {showExtra &&
            extraIdeas.map((idea, i) => {
              const realIndex = ideas.length + i;
              const diff = DIFFICULTY_META[idea.difficulty];
              return (
                <button
                  key={realIndex}
                  onClick={() => chooseIdea(realIndex)}
                  className="w-full text-left bg-white rounded-2xl border border-emerald-100 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-500/10 transition-all p-5 group"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-bold text-emerald-900 group-hover:text-emerald-600 transition-colors">{idea.title}</h3>
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 flex-shrink-0"
                      style={{ background: `${diff.color}1a`, color: diff.color }}
                    >
                      {idea.difficulty === 'easy' ? t('diffEasy') : idea.difficulty === 'medium' ? t('diffMedium') : t('diffHard')}
                      <span className="flex gap-0.5">
                        {[1, 2, 3].map((d) => (
                          <span
                            key={d}
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ background: d <= diff.dots ? diff.color : `${diff.color}40` }}
                          />
                        ))}
                      </span>
                    </span>
                  </div>
                  <p className="text-sm text-emerald-700/80 mb-3">{idea.description}</p>
                  <div className="text-xs text-emerald-700/60">
                    <span className="font-semibold">{t('materials')}:</span> {idea.materials.join(', ')}
                  </div>
                </button>
              );
            })}
        </div>

        {!showExtra && extraIdeas.length > 0 && (
          <button
            onClick={() => setShowExtra(true)}
            className="w-full mt-4 py-3.5 rounded-xl bg-white border border-dashed border-emerald-300 text-emerald-700 font-semibold hover:bg-emerald-50 hover:border-emerald-500 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles size={18} /> {t('showMoreIdeas')} {extraIdeas.length} {t('moreIdeas')}
          </button>
        )}
        {showExtra && (
          <>
            {infiniteIdeas.map((idea, i) => {
              const realIndex = ideas.length + extraIdeas.length + i;
              const diff = DIFFICULTY_META[idea.difficulty];
              return (
                <button
                  key={`inf-${i}`}
                  onClick={() => chooseIdea(realIndex)}
                  className="w-full text-left bg-white rounded-2xl border border-emerald-100 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-500/10 transition-all p-5 group"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-bold text-emerald-900 group-hover:text-emerald-600 transition-colors">{idea.title}</h3>
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 flex-shrink-0"
                      style={{ background: `${diff.color}1a`, color: diff.color }}
                    >
                      {idea.difficulty === 'easy' ? t('diffEasy') : idea.difficulty === 'medium' ? t('diffMedium') : t('diffHard')}
                      <span className="flex gap-0.5">
                        {[1, 2, 3].map((d) => (
                          <span
                            key={d}
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ background: d <= diff.dots ? diff.color : `${diff.color}40` }}
                          />
                        ))}
                      </span>
                    </span>
                  </div>
                  <p className="text-sm text-emerald-700/80 mb-3">{idea.description}</p>
                  <div className="text-xs text-emerald-700/60">
                    <span className="font-semibold">{t('materials')}:</span> {idea.materials.join(', ')}
                  </div>
                </button>
              );
            })}
            <button
              onClick={() => {
                const more = generateInfiniteIdeas(material, category!, infiniteIdeas.length + 3, lang);
                setInfiniteIdeas((prev) => [...prev, ...more]);
              }}
              className="w-full mt-4 py-3.5 rounded-xl bg-white border border-dashed border-emerald-300 text-emerald-700 font-semibold hover:bg-emerald-50 hover:border-emerald-500 transition-all flex items-center justify-center gap-2"
            >
              <Plus size={18} /> {t('askMoreIdeas')}
            </button>
          </>
        )}
      </div>
    );
  }

  if (stage === 'satisfaction') {
    const allIdeas = [...ideas, ...extraIdeas, ...infiniteIdeas];
    const chosen = allIdeas[chosenIndex!];
    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <button
          onClick={() => setStage('ideas')}
          className="inline-flex items-center gap-1.5 text-sm text-emerald-700 hover:text-emerald-900 mb-4"
        >
          <ArrowLeft size={16} /> {t('back')}
        </button>
        <h1 className="text-2xl font-bold text-emerald-900 mb-1">{t('youPicked')}</h1>
        <div className="bg-white rounded-2xl border border-emerald-100 p-5 mb-6">
          <h3 className="font-bold text-emerald-900 text-lg">{chosen.title}</h3>
          <p className="text-sm text-emerald-700/80 mt-1">{chosen.description}</p>
          <ol className="mt-4 space-y-2">
            {chosen.steps.map((s, i) => (
              <li key={i} className="flex gap-3 text-sm text-emerald-800">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                  {i + 1}
                </span>
                {s}
              </li>
            ))}
          </ol>
        </div>
        <h2 className="font-semibold text-emerald-900 mb-3">{t('satisfied')}</h2>
        <div className="flex gap-3">
          <button
            onClick={() => submitSatisfaction(true)}
            className="flex-1 py-4 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20"
          >
            <Check size={20} /> {t('yesLove')}
          </button>
          <button
            onClick={() => submitSatisfaction(false)}
            className="flex-1 py-4 rounded-xl bg-white border border-emerald-200 text-emerald-700 font-semibold hover:border-red-300 hover:text-red-600 transition-colors flex items-center justify-center gap-2"
          >
            <X size={20} /> {t('notReally')}
          </button>
        </div>
        <p className="text-xs text-emerald-700/50 mt-3 text-center">
          {t('satisfactionReward')} {REWARDS.satisfactionCoins} {t('ecoPoints')} {t('and')} {REWARDS.satisfactionXp} XP.
        </p>
      </div>
    );
  }

  // done
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-emerald-100 text-emerald-600 mb-4">
        <Check size={36} />
      </div>
      <h1 className="text-2xl font-bold text-emerald-900">{t('niceWork')}</h1>
      <p className="text-emerald-700/70 mt-1 mb-6">
        {satisfied ? `${t('earnedPoints')} ${REWARDS.satisfactionCoins} ${t('ecoPoints')} ${t('and')} ${REWARDS.satisfactionXp} XP!` : t('savedToScans')}
      </p>
      <button
        onClick={reset}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors"
      >
        <RefreshCw size={18} /> {t('scanAnother')}
      </button>
    </div>
  );
}
