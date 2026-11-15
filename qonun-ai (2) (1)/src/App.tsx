import React, { useState, useEffect } from 'react';
import { MessageSquare, BookOpen, Calculator, Shield, Crown, Bell, X } from 'lucide-react';
import { Language, User } from './types';
import { translations } from './i18n';
import { Header } from './components/Header';
import { AuthModal } from './components/AuthModal';
import { ChatConsultation } from './components/ChatConsultation';
import { CodesDirectory } from './components/CodesDirectory';
import { FineCalculator } from './components/FineCalculator';
import { RightsGuide } from './components/RightsGuide';
import { AdminDashboard } from './components/AdminDashboard';
import { DeviceSimulator } from './components/DeviceSimulator';
import { sendHeartbeat, fetchAnnouncement, fetchAdminStats } from './services/api';

export default function App() {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('qonun_lang') as Language) || 'tg';
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('qonun_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeTab, setActiveTab] = useState<'chat' | 'codes' | 'calculator' | 'rights' | 'admin'>('chat');
  const [deviceMode, setDeviceMode] = useState<'pc' | 'ios' | 'android'>('pc');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [onlineCount, setOnlineCount] = useState(1);
  const [totalVisits, setTotalVisits] = useState(45);
  const [announcement, setAnnouncement] = useState<{ text: string; active: boolean } | null>(null);
  const [dismissAnnouncement, setDismissAnnouncement] = useState(false);

  const t = translations[language];
  const isAdmin = currentUser?.role === 'admin';

  // Prompt registration on first entry if no user is saved
  useEffect(() => {
    if (!currentUser) {
      const hasSeenPrompt = sessionStorage.getItem('qonun_auth_prompted');
      if (!hasSeenPrompt) {
        setAuthModalOpen(true);
        sessionStorage.setItem('qonun_auth_prompted', 'true');
      }
    }
  }, []);

  // Persist language change
  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('qonun_lang', lang);
  };

  // Login success
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('qonun_user', JSON.stringify(user));
  };

  // Logout
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('qonun_user');
    if (activeTab === 'admin') setActiveTab('chat');
  };

  // Heartbeat session tracking
  useEffect(() => {
    let sessionId = sessionStorage.getItem('qonun_session_id');
    if (!sessionId) {
      sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      sessionStorage.setItem('qonun_session_id', sessionId);
    }

    const doHeartbeat = async () => {
      try {
        const res = await sendHeartbeat({
          sessionId: sessionId || 'guest',
          userId: currentUser?.id,
          username: currentUser?.username,
          avatar: currentUser?.avatar,
          role: currentUser?.role,
        });
        if (res.onlineCount) {
          setOnlineCount(res.onlineCount);
        }
      } catch {}
    };

    doHeartbeat();
    const interval = setInterval(doHeartbeat, 15000);
    return () => clearInterval(interval);
  }, [currentUser]);

  // Load announcement and admin stats if admin
  useEffect(() => {
    fetchAnnouncement().then((ann) => {
      if (ann && ann.active) {
        setAnnouncement(ann);
      }
    });

    if (isAdmin) {
      fetchAdminStats({
        role: currentUser?.role,
        username: currentUser?.username,
        adminKey: 'umar2026',
      })
        .then((s) => {
          setOnlineCount(s.onlineCount);
          setTotalVisits(s.totalVisits);
        })
        .catch(() => {});
    }
  }, [isAdmin, currentUser]);

  // Content switcher
  const renderTabContent = () => {
    switch (activeTab) {
      case 'chat':
        return (
          <ChatConsultation
            language={language}
            currentUser={currentUser}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        );
      case 'codes':
        return (
          <CodesDirectory
            language={language}
            onSelectArticle={(prompt) => {
              setActiveTab('chat');
              // Let child or storage handle if needed
            }}
          />
        );
      case 'calculator':
        return (
          <FineCalculator
            language={language}
            onAskAI={(prompt) => {
              setActiveTab('chat');
            }}
          />
        );
      case 'rights':
        return (
          <RightsGuide
            language={language}
            onAskAI={(prompt) => {
              setActiveTab('chat');
            }}
          />
        );
      case 'admin':
        if (!isAdmin) {
          return (
            <div className="p-8 text-center text-zinc-400">
              <p>Дастрасӣ танҳо барои Мудири кулл (Админ)</p>
            </div>
          );
        }
        return (
          <AdminDashboard
            language={language}
            currentUser={currentUser}
            onClose={() => setActiveTab('chat')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <DeviceSimulator mode={deviceMode}>
      <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500 selection:text-white">
        {/* Top Announcement Banner (from Admin) */}
        {announcement && !dismissAnnouncement && (
          <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-emerald-100 text-xs px-4 py-2 flex items-center justify-between border-b border-emerald-700/50">
            <div className="flex items-center gap-2 max-w-4xl mx-auto flex-1">
              <Bell size={14} className="text-amber-400 shrink-0 animate-bounce" />
              <span className="font-medium line-clamp-1">{announcement.text}</span>
            </div>
            <button
              onClick={() => setDismissAnnouncement(true)}
              className="text-emerald-300 hover:text-white p-1"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Header */}
        <Header
          language={language}
          onLanguageChange={handleLanguageChange}
          currentUser={currentUser}
          onOpenAuth={() => setAuthModalOpen(true)}
          onLogout={handleLogout}
          onOpenAdmin={() => setActiveTab('admin')}
          deviceMode={deviceMode}
          onDeviceModeChange={setDeviceMode}
          onlineCount={onlineCount}
          totalVisits={totalVisits}
        />

        {/* Main Content Area */}
        <main className="flex-1 pb-16 sm:pb-0 overflow-x-hidden">
          {renderTabContent()}
        </main>

        {/* Bottom Navigation Bar (Optimized for Mobile, Android, iPhone, and PC) */}
        <nav className="fixed bottom-0 left-0 right-0 z-30 bg-zinc-900/95 backdrop-blur-md border-t border-zinc-800 text-xs py-1.5 px-2 flex justify-around items-center max-w-lg mx-auto sm:max-w-none sm:relative sm:border-t-0 sm:hidden">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex flex-col items-center py-1 px-2 rounded-lg transition-colors ${
              activeTab === 'chat' ? 'text-emerald-400 font-bold' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <MessageSquare size={19} />
            <span className="text-[10px] mt-0.5">{t.nav.chat}</span>
          </button>

          <button
            onClick={() => setActiveTab('codes')}
            className={`flex flex-col items-center py-1 px-2 rounded-lg transition-colors ${
              activeTab === 'codes' ? 'text-emerald-400 font-bold' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <BookOpen size={19} />
            <span className="text-[10px] mt-0.5">{t.nav.codes}</span>
          </button>

          <button
            onClick={() => setActiveTab('calculator')}
            className={`flex flex-col items-center py-1 px-2 rounded-lg transition-colors ${
              activeTab === 'calculator' ? 'text-emerald-400 font-bold' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Calculator size={19} />
            <span className="text-[10px] mt-0.5">{t.nav.calculator}</span>
          </button>

          <button
            onClick={() => setActiveTab('rights')}
            className={`flex flex-col items-center py-1 px-2 rounded-lg transition-colors ${
              activeTab === 'rights' ? 'text-emerald-400 font-bold' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Shield size={19} />
            <span className="text-[10px] mt-0.5">{t.nav.rights}</span>
          </button>

          {/* Admin Tab (ONLY SHOWN IF USER IS ADMIN) */}
          {isAdmin && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex flex-col items-center py-1 px-2 rounded-lg transition-colors ${
                activeTab === 'admin' ? 'text-amber-400 font-bold' : 'text-amber-500/70 hover:text-amber-300'
              }`}
            >
              <Crown size={19} />
              <span className="text-[10px] mt-0.5">Админ</span>
            </button>
          )}
        </nav>

        {/* Desktop Navigation Sub-bar */}
        <div className="hidden sm:flex items-center justify-center gap-4 bg-zinc-900/60 border-b border-zinc-800/80 py-2 px-4 text-xs font-medium">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'chat'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-100'
            }`}
          >
            <MessageSquare size={15} />
            <span>{t.nav.chat}</span>
          </button>

          <button
            onClick={() => setActiveTab('codes')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'codes'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-100'
            }`}
          >
            <BookOpen size={15} />
            <span>{t.nav.codes}</span>
          </button>

          <button
            onClick={() => setActiveTab('calculator')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'calculator'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-100'
            }`}
          >
            <Calculator size={15} />
            <span>{t.nav.calculator}</span>
          </button>

          <button
            onClick={() => setActiveTab('rights')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'rights'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-100'
            }`}
          >
            <Shield size={15} />
            <span>{t.nav.rights}</span>
          </button>

          {/* Desktop Admin Tab */}
          {isAdmin && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors border ${
                activeTab === 'admin'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                  : 'text-amber-400/80 border-amber-500/30 hover:text-amber-300 hover:border-amber-400'
              }`}
            >
              <Crown size={15} />
              <span>{t.nav.admin}</span>
            </button>
          )}
        </div>

        {/* Auth Modal */}
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          language={language}
          onLoginSuccess={handleLoginSuccess}
        />
      </div>
    </DeviceSimulator>
  );
}
