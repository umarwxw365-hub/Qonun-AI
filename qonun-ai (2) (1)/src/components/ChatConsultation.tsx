import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Volume2, VolumeX, Copy, Check, Scale, Shield, Sparkles, BookOpen, Clock, History, Plus, Trash2, Search, X, MessageSquare } from 'lucide-react';
import { Language, User, ChatMessage, ConversationSession } from '../types';
import { translations } from '../i18n';
import { askLegalAI, fetchChatHistory, deleteChatSession, clearChatHistory } from '../services/api';
import { AvatarHelper } from './AvatarHelper';

interface ChatConsultationProps {
  language: Language;
  currentUser: User | null;
  onOpenAuth: () => void;
}

export const ChatConsultation: React.FC<ChatConsultationProps> = ({
  language,
  currentUser,
  onOpenAuth,
}) => {
  const t = translations[language];

  const createWelcomeMessage = (): ChatMessage => ({
    id: 'msg-welcome',
    sender: 'assistant',
    text: `${t.chat.welcomeTitle}!\n\n${t.chat.welcomeDesc}\n\n⚖️ *${t.chat.disclaimer}*`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    category: 'general',
  });

  // Initial welcome message tailored to language
  const [messages, setMessages] = useState<ChatMessage[]>(() => [createWelcomeMessage()]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [currentlySpeakingId, setCurrentlySpeakingId] = useState<string | null>(null);

  // Authenticated-only conversation history state (completely disabled for guests)
  const [conversations, setConversations] = useState<ConversationSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historySearch, setHistorySearch] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Load conversation history ONLY when user is logged in / registered; clear everything for guests
  useEffect(() => {
    if (!currentUser) {
      setConversations([]);
      setActiveSessionId(null);
      setHistoryOpen(false);
      setHistorySearch('');
      setMessages([createWelcomeMessage()]);
      return;
    }

    const storageKey = `qonun_history_${currentUser.username.toLowerCase()}`;
    let localSaved: ConversationSession[] = [];
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) localSaved = JSON.parse(raw);
    } catch {
      localSaved = [];
    }
    if (localSaved.length > 0) {
      setConversations(localSaved);
    }

    fetchChatHistory(currentUser).then((serverList) => {
      if (Array.isArray(serverList) && serverList.length > 0) {
        setConversations(serverList);
        try {
          localStorage.setItem(storageKey, JSON.stringify(serverList));
        } catch {}
      }
    });
  }, [currentUser?.id, currentUser?.username]);

  // Handle Speech Recognition (Web Speech API)
  const toggleVoiceRecording = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(t.chat.voiceUnsupported);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'ru' ? 'ru-RU' : language === 'uz' ? 'uz-UZ' : language === 'en' ? 'en-US' : 'tg-TJ';
      // Many browsers map tg-TJ to fallback or ru-RU
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsRecording(false);
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsRecording(false);
    }
  };

  // Handle Text-to-Speech (read legal answer aloud)
  const toggleSpeechAudio = (messageId: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (currentlySpeakingId === messageId) {
      window.speechSynthesis.cancel();
      setCurrentlySpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean markdown stars and hashes for smoother speech
    const cleanSpeechText = text.replace(/[*#_~`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanSpeechText);

    // Select suitable voice
    if (language === 'ru') utterance.lang = 'ru-RU';
    else if (language === 'uz') utterance.lang = 'uz-UZ';
    else if (language === 'en') utterance.lang = 'en-US';
    else utterance.lang = 'ru-RU'; // Fallback for Tajik phonetics

    utterance.rate = 1.0;

    utterance.onend = () => {
      setCurrentlySpeakingId(null);
    };

    utterance.onerror = () => {
      setCurrentlySpeakingId(null);
    };

    window.speechSynthesis.speak(utterance);
    setCurrentlySpeakingId(messageId);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleNewChat = () => {
    setActiveSessionId(null);
    setMessages([createWelcomeMessage()]);
    setHistoryOpen(false);
  };

  const handleSelectConversation = (session: ConversationSession) => {
    setActiveSessionId(session.id);
    setMessages([createWelcomeMessage(), ...session.messages]);
    setHistoryOpen(false);
  };

  const handleDeleteConversation = async (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    if (!currentUser) return;
    const updated = await deleteChatSession(currentUser, sessionId).catch(() =>
      conversations.filter((c) => c.id !== sessionId)
    );
    setConversations(updated);
    try {
      localStorage.setItem(`qonun_history_${currentUser.username.toLowerCase()}`, JSON.stringify(updated));
    } catch {}
    if (activeSessionId === sessionId) {
      handleNewChat();
    }
  };

  const handleClearAllHistory = async () => {
    if (!currentUser) return;
    await clearChatHistory(currentUser).catch(() => {});
    setConversations([]);
    try {
      localStorage.removeItem(`qonun_history_${currentUser.username.toLowerCase()}`);
    } catch {}
    handleNewChat();
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMessage: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: nowTime,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Build conversation history for multi-turn conversational intelligence
      const recentHistory = messages.slice(-8).map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        text: m.text,
      }));

      const response = await askLegalAI({
        prompt: query,
        language,
        history: recentHistory,
        username: currentUser?.username || 'Меҳмон',
        userId: currentUser?.id || 'guest',
        sessionId: currentUser ? activeSessionId : null,
      });

      const assistantMessage: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'assistant',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        category: response.category,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Save into local authenticated user history ONLY if user is signed in (never for guests)
      if (currentUser) {
        const resolvedSessionId = response.sessionId || activeSessionId || `conv_${Date.now()}`;
        setActiveSessionId(resolvedSessionId);
        const nowIso = new Date().toISOString();

        setConversations((prev) => {
          const existingIdx = prev.findIndex((c) => c.id === resolvedSessionId);
          let nextList: ConversationSession[];
          if (existingIdx >= 0) {
            const target = prev[existingIdx];
            const updatedSession: ConversationSession = {
              ...target,
              updatedAt: nowIso,
              messages: [...target.messages, userMessage, assistantMessage],
            };
            nextList = [updatedSession, ...prev.filter((_, i) => i !== existingIdx)];
          } else {
            const newSession: ConversationSession = {
              id: resolvedSessionId,
              title: query.length > 60 ? query.slice(0, 57) + '...' : query,
              language,
              createdAt: nowIso,
              updatedAt: nowIso,
              messages: [userMessage, assistantMessage],
            };
            nextList = [newSession, ...prev];
          }
          const trimmed = nextList.slice(0, 50);
          try {
            localStorage.setItem(`qonun_history_${currentUser.username.toLowerCase()}`, JSON.stringify(trimmed));
          } catch {}
          return trimmed;
        });
      }
    } catch (err: any) {
      const errorMessage: ChatMessage = {
        id: `err_${Date.now()}`,
        sender: 'assistant',
        text: `⚠️ Хатогӣ: ${err.message || 'Пайвастшавӣ ба сервери ҳуқуқӣ қатъ шуд'}. Лутфан саволи худро такроран диҳед.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Render nicely formatted legal text with bold and headers
  const formatLegalText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      if (line.startsWith('### ') || line.startsWith('## ')) {
        return (
          <h3 key={idx} className="text-base font-bold text-amber-300 mt-2 mb-1 flex items-center gap-1.5">
            <Scale size={16} className="text-amber-400" />
            {line.replace(/^#+\s*/, '')}
          </h3>
        );
      }
      if (line.startsWith('---')) {
        return <hr key={idx} className="my-2.5 border-zinc-700/60" />;
      }
      if (line.startsWith('- ') || line.startsWith('• ')) {
        return (
          <li key={idx} className="ml-4 list-disc text-zinc-200 text-sm py-0.5">
            {renderBoldText(line.substring(2))}
          </li>
        );
      }
      if (/^\d+\.\s/.test(line)) {
        return (
          <div key={idx} className="ml-2 text-sm text-zinc-200 py-0.5 flex gap-1.5">
            <span className="font-semibold text-emerald-400">{line.match(/^\d+\./)?.[0]}</span>
            <span>{renderBoldText(line.replace(/^\d+\.\s*/, ''))}</span>
          </div>
        );
      }
      if (line.trim() === '') {
        return <div key={idx} className="h-2" />;
      }
      return (
        <p key={idx} className="text-sm text-zinc-200 leading-relaxed">
          {renderBoldText(line)}
        </p>
      );
    });
  };

  const renderBoldText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-semibold text-amber-200 dark:text-amber-300">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  const filteredConversations = conversations.filter((c) => {
    if (!historySearch.trim()) return true;
    const q = historySearch.toLowerCase();
    return (
      c.title.toLowerCase().includes(q) ||
      c.messages.some((m) => m.text.toLowerCase().includes(q))
    );
  });

  return (
    <div className="relative flex flex-col h-[calc(100vh-4rem)] max-w-5xl mx-auto bg-zinc-950 text-zinc-100 overflow-hidden">
      {/* Slide-over Conversation History Drawer (STRICTLY visible ONLY for registered / logged-in users) */}
      {currentUser && historyOpen && (
        <div className="absolute inset-0 z-40 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setHistoryOpen(false)}
          />
          <aside className="relative z-50 w-80 max-w-[85vw] h-full bg-zinc-900 border-r border-zinc-800 flex flex-col shadow-2xl">
            <div className="p-3.5 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-amber-300">
                <History size={16} />
                <span>{t.chat.historyTitle}</span>
              </div>
              <button
                onClick={() => setHistoryOpen(false)}
                className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-3 border-b border-zinc-800 space-y-2">
              <button
                onClick={handleNewChat}
                className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus size={14} />
                <span>{t.chat.newChat}</span>
              </button>

              <div className="relative">
                <Search size={14} className="absolute left-2.5 top-2.5 text-zinc-500" />
                <input
                  type="text"
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  placeholder={t.chat.searchHistory}
                  className="w-full pl-8 pr-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
              {filteredConversations.length === 0 ? (
                <div className="text-center py-8 px-4 text-xs text-zinc-500">
                  {t.chat.noHistory}
                </div>
              ) : (
                filteredConversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv)}
                    className={`group p-2.5 rounded-xl cursor-pointer border transition-all flex items-start justify-between gap-2 ${
                      activeSessionId === conv.id
                        ? 'bg-emerald-950/60 border-emerald-600/60 text-white'
                        : 'bg-zinc-950/50 border-zinc-800/80 hover:bg-zinc-800/70 text-zinc-300'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 text-xs font-medium truncate">
                        <MessageSquare size={12} className="text-emerald-400 shrink-0" />
                        <span className="truncate">{conv.title}</span>
                      </div>
                      <div className="text-[10px] text-zinc-500 mt-1 flex items-center gap-2">
                        <span>{conv.messages.length} {t.chat.messagesCount}</span>
                        <span>•</span>
                        <span>{new Date(conv.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleDeleteConversation(e, conv.id)}
                      className="p-1 text-zinc-500 hover:text-rose-400 rounded transition-colors shrink-0"
                      title={t.chat.deleteChat}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {conversations.length > 0 && (
              <div className="p-3 border-t border-zinc-800">
                <button
                  onClick={handleClearAllHistory}
                  className="w-full py-2 px-3 bg-zinc-800 hover:bg-rose-950/80 hover:text-rose-300 text-zinc-300 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Trash2 size={13} />
                  <span>{t.chat.clearHistory}</span>
                </button>
              </div>
            )}
          </aside>
        </div>
      )}

      {/* Sample Question Chips Carousel + Authenticated History Controls */}
      <div className="bg-zinc-900/80 border-b border-zinc-800 p-2.5 px-4 shrink-0">
        <div className="flex items-center justify-between gap-2 mb-1.5 text-xs text-zinc-400 font-medium">
          <div className="flex items-center gap-2">
            <Sparkles size={13} className="text-amber-400" />
            <span>{t.chat.samplePromptsTitle}</span>
          </div>

          {currentUser && (
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => setHistoryOpen(true)}
                className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-amber-300 border border-amber-500/30 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-colors"
              >
                <History size={12} />
                <span>{t.chat.historyTitle}</span>
                {conversations.length > 0 && (
                  <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-200 rounded-full text-[10px]">
                    {conversations.length}
                  </span>
                )}
              </button>
              <button
                onClick={handleNewChat}
                className="px-2.5 py-1 bg-emerald-700/80 hover:bg-emerald-600 text-white rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors"
                title={t.chat.newChat}
              >
                <Plus size={12} />
                <span className="hidden sm:inline">{t.chat.newChat}</span>
              </button>
            </div>
          )}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          {/* CONVERSATIONAL AI GREETING CHIP */}
          <button
            onClick={() => handleSendMessage(language === 'tg' ? 'Салом! Ту кӣ ҳастӣ ва созандаи ту кист?' : 'Привет! Кто ты и кто твой создатель?')}
            className="shrink-0 px-3 py-1.5 bg-sky-950/70 hover:bg-sky-900/90 text-sky-300 border border-sky-600/50 rounded-full transition-all text-left flex items-center gap-1.5 shadow-sm font-medium"
          >
            <Sparkles size={13} className="text-sky-400" />
            <span>{language === 'tg' ? 'Ту кӣ ҳастӣ ва созандаи ту кист?' : 'Кто ты и кто твой создатель?'}</span>
          </button>

          {/* DIRECT ARTICLE INQUIRIES */}
          <button
            onClick={() => handleSendMessage(language === 'tg' ? 'Дар кадом моддаи Кодекси ҷиноятӣ оид ба дуздӣ гуфта шудааст ва чӣ ҷазо дорад?' : 'В какой статье говорится о воровстве (краже) по закону РТ?')}
            className="shrink-0 px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 rounded-full transition-all text-left flex items-center gap-1.5 shadow-sm font-semibold"
          >
            <Scale size={13} className="text-amber-400" />
            <span>{language === 'tg' ? 'Дар кадом модда оид ба дуздӣ гуфта шудааст? (Моддаи 244)' : 'В какой статье о воровстве? (Статья 244)'}</span>
          </button>

          <button
            onClick={() => handleSendMessage(t.chat.prompt1)}
            className="shrink-0 px-3 py-1.5 bg-emerald-950/70 hover:bg-emerald-900/90 text-emerald-300 border border-emerald-700/50 rounded-full transition-all text-left flex items-center gap-1.5 shadow-sm"
          >
            <Shield size={13} className="text-emerald-400" />
            <span className="font-medium">Дуздӣ аз хона (Банди «в» қ. 2 м. 244)</span>
          </button>

          {/* STATE LANGUAGE LAW (№ 553 / № 13) */}
          <button
            onClick={() => handleSendMessage(language === 'tg' ? 'Дар кадом қонун ва модда оид ба забони давлатӣ ва ҷаримаи овезаҳо гуфта шудааст?' : 'В какой статье говорится о Законе о государственном языке РТ и штрафах?')}
            className="shrink-0 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 rounded-full transition-all text-left flex items-center gap-1.5 shadow-sm"
          >
            <BookOpen size={13} className="text-amber-400" />
            <span className="font-medium">Қонуни забони давлатӣ (Моддаи 89 КоАП)</span>
          </button>

          {/* AMBIGUITY / CLARIFICATION TEST CHIP */}
          <button
            onClick={() => handleSendMessage(language === 'tg' ? 'Бахшиш, маънои инҷо чӣ буд?' : 'Бахшиш, что это значит?')}
            className="shrink-0 px-3 py-1.5 bg-purple-950/70 hover:bg-purple-900/90 text-purple-300 border border-purple-700/50 rounded-full transition-all text-left flex items-center gap-1.5 shadow-sm"
          >
            <span>Бахшиш, маънои инҷо чӣ буд?</span>
          </button>

          <button
            onClick={() => handleSendMessage(t.chat.prompt2)}
            className="shrink-0 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 rounded-full transition-all"
          >
            {t.chat.prompt2}
          </button>
          <button
            onClick={() => handleSendMessage(t.chat.prompt3)}
            className="shrink-0 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 rounded-full transition-all"
          >
            {t.chat.prompt3}
          </button>
          <button
            onClick={() => handleSendMessage(t.chat.prompt4)}
            className="shrink-0 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 rounded-full transition-all"
          >
            {t.chat.prompt4}
          </button>
          <button
            onClick={() => handleSendMessage(t.chat.prompt5)}
            className="shrink-0 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 rounded-full transition-all"
          >
            {t.chat.prompt5}
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const isSpeaking = currentlySpeakingId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
            >
              {/* Avatar Icon */}
              <div className="shrink-0 mt-1">
                {isUser ? (
                  <AvatarHelper avatar={currentUser?.avatar || 'citizen_dushanbe'} size="md" />
                ) : (
                  <img
                    src="/assets/aistudio/QONUN_AI_________________________________eb1e2e03.png"
                    alt="Qonun AI"
                    className="w-9 h-9 rounded-xl object-cover border border-emerald-500/40 shadow-md shadow-emerald-600/20"
                  />
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={`relative rounded-2xl p-4 shadow-sm text-sm ${
                  isUser
                    ? 'bg-emerald-700 text-white rounded-tr-none'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-tl-none'
                }`}
              >
                {!isUser && (
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800 text-xs text-zinc-400">
                    <span className="font-semibold text-amber-400 flex items-center gap-1.5">
                      <Scale size={14} />
                      Qonun AI • Ҳуқуқшиноси ҶТ
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleSpeechAudio(msg.id, msg.text)}
                        className={`p-1 rounded hover:bg-zinc-800 transition-colors ${
                          isSpeaking ? 'text-emerald-400 animate-pulse' : 'text-zinc-400'
                        }`}
                        title={isSpeaking ? t.chat.stopAudio : t.chat.playAudio}
                      >
                        {isSpeaking ? <VolumeX size={15} /> : <Volume2 size={15} />}
                      </button>
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="p-1 rounded hover:bg-zinc-800 text-zinc-400 transition-colors"
                        title={t.chat.copy}
                      >
                        {copiedId === msg.id ? (
                          <Check size={15} className="text-emerald-400" />
                        ) : (
                          <Copy size={15} />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="space-y-1">
                  {isUser ? <p className="whitespace-pre-wrap">{msg.text}</p> : formatLegalText(msg.text)}
                </div>

                {/* Timestamp */}
                <div
                  className={`text-[10px] mt-2 flex items-center gap-1 ${
                    isUser ? 'text-emerald-200 justify-end' : 'text-zinc-500'
                  }`}
                >
                  <Clock size={10} />
                  <span>{msg.timestamp}</span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex gap-3 max-w-2xl mr-auto">
            <img
              src="/assets/aistudio/QONUN_AI_________________________________eb1e2e03.png"
              alt="Qonun AI"
              className="w-9 h-9 rounded-xl object-cover border border-emerald-500/40 shrink-0 mt-1 shadow-md"
            />
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl rounded-tl-none p-4 text-xs text-amber-300 flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.4s]" />
              </div>
              <span>{t.chat.analyzingLaw}</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div className="p-3 sm:p-4 bg-zinc-900 border-t border-zinc-800 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2 max-w-4xl mx-auto"
        >
          {/* Voice Input Button */}
          <button
            type="button"
            onClick={toggleVoiceRecording}
            className={`p-3 rounded-xl border transition-all ${
              isRecording
                ? 'bg-rose-600 text-white border-rose-500 animate-pulse'
                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700'
            }`}
            title={isRecording ? t.chat.voiceListening : 'Овозӣ пурсидан (Голосовой ввод)'}
          >
            {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
          </button>

          {/* Text Input Field */}
          <div className="relative flex-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.chat.inputPlaceholder}
              disabled={loading}
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-700 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-emerald-900/30 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            <Send size={16} />
            <span className="hidden sm:inline">{t.chat.sendButton}</span>
          </button>
        </form>

        <p className="text-[11px] text-center text-zinc-500 mt-2">
          Қонунҳои амалкунандаи ҶТ • Кодекси ҷиноятӣ, КоАП, Оила, Меҳнат, Гражданӣ
        </p>
      </div>
    </div>
  );
};
