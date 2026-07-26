import { useEffect, useState, useCallback, useRef } from 'react';
import { Heart, MessageSquareText, Trash2, Camera, X, ImageIcon, Send, SwitchCamera, AlertCircle, Eye } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { CATEGORY_META, DIFFICULTY_META, REWARDS, type IdeaCategory, type Difficulty } from '@/lib/data';
import { unlockAchievements } from '@/lib/achievements';
import { pushCelebration } from '@/components/CelebrationOverlay';
import PetAvatar from '@/components/PetAvatar';
import ChatPanel from '@/components/ChatPanel';
import PublicProfileModal from '@/components/PublicProfileModal';
import { useI18n } from '@/lib/i18n';

interface Post {
  id: string;
  image_url: string;
  caption: string;
  idea_title: string;
  idea_category: IdeaCategory;
  idea_difficulty: Difficulty;
  material_tag: string;
  created_at: string;
  user_id: string;
  author_name?: string;
  author_pet?: string;
  author_angle?: number;
  author_size?: number;
  like_count: number;
  liked_by_me: boolean;
  views: number;
}

type CameraState = 'idle' | 'requesting' | 'live' | 'denied';

export default function CommunityScreen() {
  const { user, profile, refreshProfile } = useAuth();
  const { t } = useI18n();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  // View toggle: feed vs chat
  const [view, setView] = useState<'feed' | 'chat'>('feed');
  const [profileUserId, setProfileUserId] = useState<string | null>(null);

  // Composer state
  const [showComposer, setShowComposer] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<IdeaCategory>('daily');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [material, setMaterial] = useState('plastic');
  const [posting, setPosting] = useState(false);
  const [composerError, setComposerError] = useState<string | null>(null);

  // Camera state
  const [cameraState, setCameraState] = useState<CameraState>('idle');
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
  }

  async function startCamera() {
    setComposerError(null);
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
        setComposerError(t('cameraDenied'));
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraState('denied');
        setComposerError(t('noCamera'));
      } else {
        setCameraState('idle');
        setComposerError(err.message || 'Could not start the camera.');
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
        setComposerError((e as Error).message || 'Could not switch camera.');
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
        const file = new File([blob], `community-${Date.now()}.jpg`, { type: 'image/jpeg' });
        stopCamera();
        setCameraState('idle');
        uploadPhoto(file);
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

  async function uploadPhoto(file: File) {
    if (!user) return;
    setComposerError(null);
    setPosting(true);
    try {
      const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
      const path = `${user.id}/community-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from('scans').upload(path, file, { upsert: false });
      if (upErr) throw new Error(upErr.message);
      const { data: pub } = supabase.storage.from('scans').getPublicUrl(path);
      setPhotoUrl(pub.publicUrl);
    } catch (e) {
      setComposerError(e instanceof Error ? e.message : 'Failed to upload photo');
    } finally {
      setPosting(false);
    }
  }

  // Cleanup camera on unmount or when composer closes
  useEffect(() => () => stopCamera(), []);
  useEffect(() => {
    if (!showComposer) {
      stopCamera();
      setCameraState('idle');
    }
  }, [showComposer]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('community_posts')
        .select('id, image_url, caption, idea_title, idea_category, idea_difficulty, material_tag, created_at, user_id')
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw new Error(error.message);
      if (!data) {
        setPosts([]);
        return;
      }
      const authorIds = Array.from(new Set(data.map((p) => p.user_id)));
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, display_name, active_pet, avatar_angle, avatar_size')
        .in('id', authorIds);
      const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));
      const { data: likes } = await supabase.from('post_likes').select('post_id, user_id');
      const likeCounts = new Map<string, number>();
      const likedByMe = new Set<string>();
      for (const l of likes ?? []) {
        likeCounts.set(l.post_id, (likeCounts.get(l.post_id) ?? 0) + 1);
        if (l.user_id === user?.id) likedByMe.add(l.post_id);
      }
      const mapped: Post[] = data.map((p) => {
        const prof = profileMap.get(p.user_id);
        return {
          ...p,
          author_name: prof?.display_name ?? 'Eco Explorer',
          author_pet: prof?.active_pet ?? 'octopus',
          author_angle: prof?.avatar_angle ?? 0,
          author_size: prof?.avatar_size ?? 100,
          like_count: likeCounts.get(p.id) ?? 0,
          liked_by_me: likedByMe.has(p.id),
          views: (p as { views?: number }).views ?? 0,
        };
      });
      setPosts(mapped);
      // Record a view for each post not authored by the current user.
      if (user) {
        const others = mapped.filter((p) => p.user_id !== user.id);
        if (others.length) {
          await supabase
            .from('post_views')
            .insert(others.map((p) => ({ post_id: p.id })))
            .then(() => {}, () => {});
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load feed');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    load();
  }, [load]);

  function resetComposer() {
    setPhotoUrl(null);
    setCaption('');
    setTitle('');
    setCategory('daily');
    setDifficulty('easy');
    setMaterial('plastic');
    setComposerError(null);
    stopCamera();
    setCameraState('idle');
  }

  async function submitPost() {
    if (!user || !photoUrl) return;
    setPosting(true);
    setComposerError(null);
    try {
      const { error } = await supabase.from('community_posts').insert({
        image_url: photoUrl,
        caption: caption.trim(),
        idea_title: title.trim() || 'My upcycled creation',
        idea_category: category,
        idea_difficulty: difficulty,
        material_tag: material,
      });
      if (error) throw new Error(error.message);
      // Award XP for publishing
      if (profile) {
        await supabase
          .from('profiles')
          .update({ xp: profile.xp + REWARDS.publishXp })
          .eq('id', user.id);
        await refreshProfile();
      }
      // Count posts for achievements
      const { count } = await supabase
        .from('community_posts')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id);
      const postCount = count ?? 0;
      const keys: string[] = [];
      if (postCount >= 1) keys.push('first_post');
      if (postCount >= 5) keys.push('five_posts');
      const unlocked = await unlockAchievements(user.id, keys);
      for (const a of unlocked) {
        pushCelebration({
          emoji: a.emoji,
          title: a.title,
          subtitle: `+${a.coins} coins, +${a.xp} XP`,
        });
      }
      await refreshProfile();
      resetComposer();
      setShowComposer(false);
      await load();
    } catch (e) {
      setComposerError(e instanceof Error ? e.message : 'Failed to post');
    } finally {
      setPosting(false);
    }
  }

  async function toggleLike(post: Post) {
    if (!user) return;
    setPosts((prev) =>
      prev.map((p) =>
        p.id === post.id
          ? {
              ...p,
              liked_by_me: !p.liked_by_me,
              like_count: p.liked_by_me ? p.like_count - 1 : p.like_count + 1,
            }
          : p
      )
    );
    try {
      if (post.liked_by_me) {
        await supabase.from('post_likes').delete().eq('post_id', post.id).eq('user_id', user.id);
      } else {
        await supabase.from('post_likes').insert({ post_id: post.id });
        if (post.user_id !== user.id) {
          const { data: author } = await supabase
            .from('profiles')
            .select('xp')
            .eq('id', post.user_id)
            .maybeSingle();
          if (author) {
            await supabase
              .from('profiles')
              .update({ xp: author.xp + REWARDS.likeXp })
              .eq('id', post.user_id);
          }
          const { data: authorPosts } = await supabase
            .from('community_posts')
            .select('id')
            .eq('user_id', post.user_id);
          if (authorPosts && authorPosts.length > 0) {
            const postIds = authorPosts.map((p) => p.id);
            const { count: totalLikes } = await supabase
              .from('post_likes')
              .select('id', { count: 'exact', head: true })
              .in('post_id', postIds);
            const likeTotal = totalLikes ?? 0;
            const keys: string[] = [];
            if (likeTotal >= 1) keys.push('first_like');
            if (likeTotal >= 10) keys.push('ten_likes');
            await unlockAchievements(post.user_id, keys);
          }
        }
      }
    } catch (e) {
      console.warn('like failed', e);
      load();
    }
  }

  async function deletePost(post: Post) {
    try {
      const { error } = await supabase.from('community_posts').delete().eq('id', post.id);
      if (error) throw new Error(error.message);
      const url = post.image_url;
      const match = url.match(/\/scans\/(.+)$/);
      if (match) {
        await supabase.storage.from('scans').remove([match[1]]);
      }
      setPosts((prev) => prev.filter((p) => p.id !== post.id));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete post');
    } finally {
      setConfirmDelete(null);
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center text-emerald-700/60">
        {t('loadingFeed')}
      </div>
    );
  }
  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-red-600 mb-3">{error}</p>
        <button onClick={load} className="px-4 py-2 rounded-xl bg-emerald-500 text-white font-semibold">
          {t('tryAgain')}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-emerald-900">{t('community')}</h1>
        {view === 'feed' && (
          <button
            onClick={() => setShowComposer(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 text-white font-semibold text-sm hover:bg-emerald-600 transition-colors shadow-md shadow-emerald-500/20"
          >
            <Camera size={16} /> {t('share')}
          </button>
        )}
      </div>

      {/* View toggle */}
      <div className="flex bg-emerald-100 rounded-xl p-1">
        <button
          onClick={() => setView('feed')}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
            view === 'feed' ? 'bg-white text-emerald-700 shadow-sm' : 'text-emerald-700/60'
          }`
          }
        >
          {view === 'feed' ? t('feed') : undefined}
        </button>
        <button
          onClick={() => setView('chat')}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
            view === 'chat' ? 'bg-white text-emerald-700 shadow-sm' : 'text-emerald-700/60'
          }`}
        >
          {t('chat')}
        </button>
      </div>

      {view === 'chat' && <ChatPanel />}

      {view === 'feed' && posts.length === 0 && (
        <div className="text-center py-16">
          <div className="text-5xl mb-3">🌱</div>
          <h2 className="text-xl font-bold text-emerald-900">{t('noPostsYetCommunity')}</h2>
          <p className="text-emerald-700/70 mt-1">{t('noPostsCommunityDesc')}</p>
        </div>
      )}

      {view === 'feed' && posts.map((post) => {
        const cat = CATEGORY_META[post.idea_category];
        const diff = DIFFICULTY_META[post.idea_difficulty];
        return (
          <article
            key={post.id}
            className="bg-white rounded-2xl border border-emerald-100 overflow-hidden shadow-sm"
          >
            <div className="flex items-center gap-3 p-4">
              <button
                onClick={() => setProfileUserId(post.user_id)}
                className="flex-shrink-0 rounded-full hover:ring-2 hover:ring-emerald-300 transition-all"
                title={t('viewProfile')}
              >
                <PetAvatar
                  petKey={post.author_pet ?? 'octopus'}
                  size={40}
                  rotate={post.author_angle ?? 0}
                  sizeScale={post.author_size ?? 100}
                />
              </button>
              <div className="flex-1 min-w-0">
                <button
                  onClick={() => setProfileUserId(post.user_id)}
                  className="font-semibold text-emerald-900 truncate hover:underline text-left"
                >
                  {post.author_name}
                </button>
                <p className="text-xs text-emerald-700/60">
                  {new Date(post.created_at).toLocaleDateString()}
                </p>
              </div>
              <span
                className="text-xs font-semibold px-2 py-1 rounded-full"
                style={{ background: `${cat.color}1a`, color: cat.color }}
              >
                {cat.emoji} {post.idea_category === 'daily' ? t('catDaily') : post.idea_category === 'decoration' ? t('catDecoration') : t('catToy')}
              </span>
              {post.user_id === user?.id && (
                <button
                  onClick={() => setConfirmDelete(post.id)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-emerald-700/40 hover:text-red-500 hover:bg-red-50 transition-colors"
                  title={t('delete')}
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
            <img src={post.image_url} alt={post.idea_title} className="w-full h-72 object-cover bg-emerald-50" />
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-emerald-900">{post.idea_title}</h3>
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1"
                  style={{ background: `${diff.color}1a`, color: diff.color }}
                >
                  {post.idea_difficulty === 'easy' ? t('diffEasy') : post.idea_difficulty === 'medium' ? t('diffMedium') : t('diffHard')}
                </span>
              </div>
              {post.caption && <p className="text-sm text-emerald-800/90 mb-3">{post.caption}</p>}
              <div className="flex items-center gap-4 text-sm">
                <button
                  onClick={() => toggleLike(post)}
                  className={`flex items-center gap-1.5 font-medium transition-colors ${
                    post.liked_by_me ? 'text-rose-500' : 'text-emerald-700/70 hover:text-rose-500'
                  }`}
                >
                  <Heart size={18} fill={post.liked_by_me ? 'currentColor' : 'none'} />
                  {post.like_count}
                </button>
                <span className="flex items-center gap-1.5 text-emerald-700/50">
                  <Eye size={16} /> {post.views}
                </span>
                <span className="flex items-center gap-1.5 text-emerald-700/50">
                  <MessageSquareText size={18} />
                  <span className="capitalize">{post.material_tag}</span>
                </span>
              </div>
            </div>
          </article>
        );
      })}

      {/* Composer modal */}
      {showComposer && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[92vh] overflow-y-auto">
            <div className="sticky top-0 bg-white flex items-center justify-between px-5 py-4 border-b border-emerald-100 z-10">
              <h2 className="font-bold text-emerald-900">{t('shareCreation')}</h2>
              <button
                onClick={() => { setShowComposer(false); resetComposer(); }}
                className="w-8 h-8 rounded-full flex items-center justify-center text-emerald-700/60 hover:bg-emerald-50"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {composerError && (
                <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 flex items-start gap-2">
                  <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                  {composerError}
                </p>
              )}

              {/* Photo area: live camera capture or preview */}
              {photoUrl ? (
                <div className="relative">
                  <img src={photoUrl} alt="preview" className="w-full h-56 object-cover rounded-2xl" />
                  <button
                    onClick={() => setPhotoUrl(null)}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : cameraState === 'live' ? (
                <div className="relative rounded-2xl overflow-hidden bg-black shadow-lg">
                  <video ref={videoRef} playsInline muted className="w-full h-64 object-cover" />
                  <button
                    onClick={switchCamera}
                    className="absolute top-3 right-3 w-10 h-10 rounded-full bg-black/50 backdrop-blur text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                    title="Switch camera"
                  >
                    <SwitchCamera size={20} />
                  </button>
                  <div className="absolute inset-x-0 bottom-0 p-5 flex items-center justify-center gap-4 bg-gradient-to-t from-black/60 to-transparent">
                    <button
                      onClick={capturePhoto}
                      disabled={posting}
                      className="w-18 h-18 rounded-full bg-white border-4 border-emerald-400 shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform disabled:opacity-60"
                      aria-label={t('capturePhoto')}
                    >
                      <span className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center">
                        <Camera size={24} className="text-white" />
                      </span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={startCamera}
                    disabled={cameraState === 'requesting' || posting}
                    className="w-full flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold shadow-lg shadow-emerald-500/20 hover:-translate-y-0.5 transition-all disabled:opacity-60"
                  >
                    <span className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                      <Camera size={24} />
                    </span>
                    <span className="text-left flex-1">
                      <span className="block text-base">{cameraState === 'requesting' ? t('startingCamera') : t('capturePhoto')}</span>
                      <span className="block text-xs text-white/70">{t('useCameraCapture')}</span>
                    </span>
                  </button>
                  <button
                    onClick={openGallery}
                    disabled={posting}
                    className="w-full flex items-center gap-4 p-5 rounded-2xl bg-white border-2 border-emerald-200 text-emerald-700 font-semibold hover:border-emerald-400 hover:bg-emerald-50/50 transition-all disabled:opacity-60"
                  >
                    <span className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                      <ImageIcon size={24} />
                    </span>
                    <span className="text-left flex-1">
                      <span className="block text-base">{t('chooseGallery')}</span>
                      <span className="block text-xs text-emerald-600/60">{t('pickExistingPhoto')}</span>
                    </span>
                  </button>
                </div>
              )}
              <canvas ref={canvasRef} className="hidden" />
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadPhoto(f); }}
              />

              {/* Only show the rest of the form once we have a photo */}
              {photoUrl && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-emerald-900 mb-1">{t('title')}</label>
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder={t('titlePlaceholder')}
                      className="w-full px-4 py-3 rounded-xl border border-emerald-200 bg-emerald-50/40 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-emerald-900 mb-1">{t('caption')}</label>
                    <textarea
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      rows={3}
                      placeholder={t('captionPlaceholder')}
                      className="w-full px-4 py-3 rounded-xl border border-emerald-200 bg-emerald-50/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-emerald-900 mb-1.5">{t('category')}</label>
                    <div className="flex gap-2">
                      {(Object.keys(CATEGORY_META) as IdeaCategory[]).map((k) => {
                        const m = CATEGORY_META[k];
                        return (
                          <button
                            key={k}
                            onClick={() => setCategory(k)}
                            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
                              category === k ? 'text-white shadow-md' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            }`}
                            style={category === k ? { background: m.color } : {}}
                          >
                            {m.emoji} {k === 'daily' ? t('catDaily') : k === 'decoration' ? t('catDecoration') : t('catToy')}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-emerald-900 mb-1.5">{t('difficulty')}</label>
                    <div className="flex gap-2">
                      {(Object.keys(DIFFICULTY_META) as Difficulty[]).map((k) => {
                        const m = DIFFICULTY_META[k];
                        return (
                          <button
                            key={k}
                            onClick={() => setDifficulty(k)}
                            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
                              difficulty === k ? 'text-white shadow-md' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            }`}
                            style={difficulty === k ? { background: m.color } : {}}
                          >
                            {k === 'easy' ? t('diffEasy') : k === 'medium' ? t('diffMedium') : t('diffHard')}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-emerald-900 mb-1">{t('material')}</label>
                    <select
                      value={material}
                      onChange={(e) => setMaterial(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-emerald-200 bg-emerald-50/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 capitalize"
                    >
                      {['plastic', 'paper', 'glass', 'metal', 'fabric', 'cardboard', 'wood', 'other'].map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={submitPost}
                    disabled={!photoUrl || posting}
                    className="w-full py-3.5 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {posting ? t('posting') : (<><Send size={18} /> {t('postToCommunity')}</>)}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {profileUserId && (
        <PublicProfileModal userId={profileUserId} onClose={() => setProfileUserId(null)} />
      )}

      {confirmDelete && (
        <div
          className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center p-4 z-50"
          onClick={() => setConfirmDelete(null)}
        >
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-emerald-900 mb-2">{t('deletePost')}</h3>
            <p className="text-sm text-emerald-700/70 mb-5">{t('deletePostDesc')}</p>
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
