import { useEffect, useRef, useState, useCallback } from 'react';
import { Send, Trash2, ArrowLeft, MessageCircle, Search } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import PetAvatar from './PetAvatar';
import { useI18n } from '@/lib/i18n';

interface ChatMessage {
  id: string;
  user_id: string;
  body: string;
  created_at: string;
}

interface Conversation {
  id: string;
  other_user_id: string;
  other_user_name: string;
  other_user_pet: string;
  last_message: string;
  last_message_at: string;
}

const MAX_LEN = 500;

export default function ChatPanel() {
  const { user } = useAuth();
  const { t } = useI18n();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ id: string; display_name: string; active_pet: string }>>([]);
  const [searching, setSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load conversations list
  const loadConversations = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('chat_conversations')
        .select('id, user1_id, user2_id, created_at')
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      if (!data || data.length === 0) {
        setConversations([]);
        return;
      }
      // Get other user IDs
      const otherIds = data.map((c) => (c.user1_id === user.id ? c.user2_id : c.user1_id));
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, display_name, active_pet')
        .in('id', otherIds);
      const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));

      // Get last message for each conversation
      const convsWithProfiles = data.map((c) => {
        const otherId = c.user1_id === user.id ? c.user2_id : c.user1_id;
        const prof = profileMap.get(otherId);
        return {
          id: c.id,
          other_user_id: otherId,
          other_user_name: prof?.display_name ?? 'Eco Explorer',
          other_user_pet: prof?.active_pet ?? 'octopus',
          last_message: '',
          last_message_at: c.created_at,
        };
      });

      // Fetch last message per conversation
      const updated: Conversation[] = [];
      for (const conv of convsWithProfiles) {
        const { data: lastMsg } = await supabase
          .from('chat_messages')
          .select('body, created_at')
          .eq('conversation_id', conv.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        updated.push({
          ...conv,
          last_message: lastMsg?.body ?? '',
          last_message_at: lastMsg?.created_at ?? conv.last_message_at,
        });
      }
      updated.sort((a, b) => new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime());
      setConversations(updated);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load conversations');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Load messages for active conversation
  const loadMessages = useCallback(async (convId: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('id, user_id, body, created_at')
        .eq('conversation_id', convId)
        .order('created_at', { ascending: true })
        .limit(200);
      if (error) throw new Error(error.message);
      setMessages(data ?? []);
    } catch (e) {
      console.warn('load messages failed', e);
    }
  }, []);

  useEffect(() => {
    if (activeConversation) {
      loadMessages(activeConversation.id);
    } else {
      setMessages([]);
    }
  }, [activeConversation, loadMessages]);

  // Realtime: subscribe to new messages in the active conversation
  useEffect(() => {
    if (!activeConversation) return;
    const channel = supabase
      .channel(`chat_conv_${activeConversation.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `conversation_id=eq.${activeConversation.id}` },
        (payload) => {
          const newRow = payload.new as ChatMessage;
          setMessages((prev) => {
            if (prev.some((m) => m.id === newRow.id)) return prev;
            return [...prev, newRow];
          });
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'chat_messages', filter: `conversation_id=eq.${activeConversation.id}` },
        (payload) => {
          const oldRow = payload.old as { id: string };
          setMessages((prev) => prev.filter((m) => m.id !== oldRow.id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeConversation]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Search for users to start a conversation
  async function searchUsers(query: string) {
    if (!query.trim() || !user) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, display_name, active_pet')
        .ilike('display_name', `%${query}%`)
        .neq('id', user.id)
        .limit(10);
      if (error) throw new Error(error.message);
      setSearchResults(data ?? []);
    } catch (e) {
      console.warn('search failed', e);
    } finally {
      setSearching(false);
    }
  }

  // Start or open a conversation with a user
  async function startConversation(otherUserId: string, otherUserName: string, otherUserPet: string) {
    if (!user) return;
    // Check if conversation already exists
    const existing = conversations.find((c) => c.other_user_id === otherUserId);
    if (existing) {
      setActiveConversation(existing);
      setShowSearch(false);
      setSearchQuery('');
      return;
    }
    // Create conversation with sorted IDs
    const [user1, user2] = [user.id, otherUserId].sort();
    try {
      const { data, error } = await supabase
        .from('chat_conversations')
        .upsert({ user1_id: user1, user2_id: user2 })
        .select('id')
        .maybeSingle();
      if (error) throw new Error(error.message);
      if (data) {
        const newConv: Conversation = {
          id: data.id,
          other_user_id: otherUserId,
          other_user_name: otherUserName,
          other_user_pet: otherUserPet,
          last_message: '',
          last_message_at: new Date().toISOString(),
        };
        setConversations((prev) => [newConv, ...prev]);
        setActiveConversation(newConv);
        setShowSearch(false);
        setSearchQuery('');
        setSearchResults([]);
      }
    } catch (e) {
      console.warn('start conversation failed', e);
      setError(e instanceof Error ? e.message : 'Failed to start conversation');
    }
  }

  async function sendMessage() {
    const body = draft.trim();
    if (!user || !body || sending || !activeConversation) return;
    setSending(true);
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({ body: body.slice(0, MAX_LEN), conversation_id: activeConversation.id })
        .select('id, user_id, body, created_at')
        .maybeSingle();
      if (error) throw new Error(error.message);
      if (data) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === data.id)) return prev;
          return [...prev, data];
        });
        // Update conversation last message
        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeConversation.id
              ? { ...c, last_message: body, last_message_at: data.created_at }
              : c
          )
        );
      }
      setDraft('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to send message');
    } finally {
      setSending(false);
    }
  }

  async function deleteMessage(msg: ChatMessage) {
    try {
      const { error } = await supabase.from('chat_messages').delete().eq('id', msg.id);
      if (error) throw new Error(error.message);
      setMessages((prev) => prev.filter((m) => m.id !== msg.id));
    } catch (e) {
      console.warn('delete failed', e);
    }
  }

  function formatTime(iso: string): string {
    const d = new Date(iso);
    const now = new Date();
    const sameDay = d.toDateString() === now.toDateString();
    if (sameDay) {
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // --- Message view (inside a conversation) ---
  if (activeConversation) {
    return (
      <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden flex flex-col" style={{ height: 520 }}>
        <div className="flex items-center gap-3 px-4 py-3 border-b border-emerald-100 bg-emerald-50/50">
          <button
            onClick={() => setActiveConversation(null)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-emerald-700 hover:bg-emerald-100 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <PetAvatar petKey={activeConversation.other_user_pet} size={32} />
          <div>
            <h3 className="font-bold text-emerald-900 text-sm">{activeConversation.other_user_name}</h3>
            <span className="text-xs text-emerald-600/60">{t('privateChat')}</span>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-emerald-50/20">
          {error && (
            <div className="text-center py-4">
              <p className="text-sm text-red-500 mb-2">{error}</p>
              <button onClick={() => setError(null)} className="px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-sm font-semibold">
                {t('dismiss')}
              </button>
            </div>
          )}
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-2 select-none">💬</div>
              <p className="text-emerald-700/60 text-sm">{t('noMessagesYet')}</p>
            </div>
          )}
          {messages.map((msg) => {
            const isMine = msg.user_id === user?.id;
            return (
              <div key={msg.id} className={`flex gap-2 ${isMine ? 'flex-row-reverse' : ''}`}>
                <div className={`max-w-[75%] ${isMine ? 'items-end' : 'items-start'} flex flex-col`}>
                  <span className="text-[10px] text-emerald-600/50 mb-0.5">{formatTime(msg.created_at)}</span>
                  <div
                    className={`rounded-2xl px-3.5 py-2 text-sm break-words ${
                      isMine
                        ? 'bg-emerald-500 text-white rounded-tr-sm'
                        : 'bg-white border border-emerald-100 text-emerald-900 rounded-tl-sm'
                    }`}
                  >
                    {msg.body}
                  </div>
                  {isMine && (
                    <button
                      onClick={() => deleteMessage(msg)}
                      className="text-emerald-600/30 hover:text-red-500 mt-0.5 transition-colors"
                      title={t('deleteMessage')}
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="border-t border-emerald-100 p-3 bg-white">
          <div className="flex items-end gap-2">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value.slice(0, MAX_LEN))}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              rows={1}
              placeholder={t('typeMessage')}
              className="flex-1 resize-none px-4 py-2.5 rounded-xl border border-emerald-200 bg-emerald-50/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-emerald-900 placeholder:text-emerald-700/40"
              style={{ maxHeight: 100 }}
            />
            <button
              onClick={sendMessage}
              disabled={!draft.trim() || sending}
              className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            >
              <Send size={18} />
            </button>
          </div>
          {draft.length > 0 && (
            <p className="text-[10px] text-emerald-600/40 mt-1 text-right">{draft.length}/{MAX_LEN}</p>
          )}
        </div>
      </div>
    );
  }

  // --- Conversation list view ---
  return (
    <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden flex flex-col" style={{ height: 520 }}>
      <div className="flex items-center gap-2 px-4 py-3 border-b border-emerald-100 bg-emerald-50/50">
        <MessageCircle size={18} className="text-emerald-600" />
        <h3 className="font-bold text-emerald-900">{t('messages')}</h3>
        <button
          onClick={() => setShowSearch(!showSearch)}
          className="ml-auto w-8 h-8 rounded-full flex items-center justify-center text-emerald-600 hover:bg-emerald-100 transition-colors"
          title={t('newChat')}
        >
          <Search size={16} />
        </button>
      </div>

      {showSearch && (
        <div className="px-4 py-3 border-b border-emerald-100 bg-emerald-50/30">
          <input
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              searchUsers(e.target.value);
            }}
            placeholder={t('searchUser')}
            className="w-full px-4 py-2.5 rounded-xl border border-emerald-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-emerald-900 placeholder:text-emerald-700/40"
            autoFocus
          />
          {searching && <p className="text-xs text-emerald-600/50 mt-2">{t('searching')}</p>}
          {searchResults.length > 0 && (
            <div className="mt-2 space-y-1 max-h-40 overflow-y-auto">
              {searchResults.map((r) => (
                <button
                  key={r.id}
                  onClick={() => startConversation(r.id, r.display_name, r.active_pet)}
                  className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-emerald-100 transition-colors text-left"
                >
                  <PetAvatar petKey={r.active_pet} size={32} />
                  <span className="font-medium text-emerald-900 text-sm">{r.display_name}</span>
                </button>
              ))}
            </div>
          )}
          {searchQuery.trim() && searchResults.length === 0 && !searching && (
            <p className="text-xs text-emerald-600/50 mt-2">{t('noUsersFound')}</p>
          )}
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {loading && (
          <p className="text-center text-emerald-700/50 text-sm py-8">{t('loadingConversations')}</p>
        )}
        {error && (
          <div className="text-center py-6">
            <p className="text-sm text-red-500 mb-2">{error}</p>
            <button onClick={loadConversations} className="px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-sm font-semibold">
              {t('tryAgain')}
            </button>
          </div>
        )}
        {!loading && !error && conversations.length === 0 && !showSearch && (
          <div className="text-center py-12">
            <div className="text-4xl mb-2 select-none">💬</div>
            <p className="text-emerald-700/60 text-sm mb-1">{t('noConversations')}</p>
            <p className="text-emerald-600/50 text-xs">{t('noConversationsDesc')}</p>
          </div>
        )}
        {conversations.map((conv) => (
          <button
            key={conv.id}
            onClick={() => setActiveConversation(conv)}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-emerald-50 transition-colors text-left border-b border-emerald-50"
          >
            <PetAvatar petKey={conv.other_user_pet} size={40} />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-emerald-900 text-sm truncate">{conv.other_user_name}</p>
              <p className="text-xs text-emerald-600/60 truncate">
                {conv.last_message || t('noMessagesYetShort')}
              </p>
            </div>
            <span className="text-[10px] text-emerald-600/40 flex-shrink-0">
              {conv.last_message ? formatTime(conv.last_message_at) : ''}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
