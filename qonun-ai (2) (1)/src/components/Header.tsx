import React from 'react';
import { Scale, Globe, Shield, Smartphone, Laptop, Crown, LogIn, LogOut, Radio } from 'lucide-react';
import { Language, User } from '../types';
import { translations } from '../i18n';
import { AvatarHelper } from './AvatarHelper';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenAdmin: () => void;
  deviceMode: 'pc' | 'ios' | 'android';
  onDeviceModeChange: (mode: 'pc' | 'ios' | 'android') => void;
  onlineCount: number;
  totalVisits: number;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenAdmin,
  deviceMode,
  onDeviceModeChange,
  onlineCount,
  totalVisits,
}) => {
  const t = translations[language];
  const isAdmin = currentUser?.role === 'admin';

  return (
    <header className="sticky top-0 z-40 bg-zinc-900/95 backdrop-blur-md border-b border-emerald-900/40 text-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2">
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5">
          <img
            src="/assets/aistudio/QONUN_AI_________________________________eb1e2e03.png"
            alt="Qonun AI"
            className="w-10 h-10 rounded-xl object-cover shadow-md shadow-emerald-500/20 border border-emerald-500/40 shrink-0"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black tracking-tight text-white font-serif">Qonun AI</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                РТ 2026
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 hidden sm:block leading-none">
              Қонунгузории расмии Ҷумҳурии Тоҷикистон
            </p>
          </div>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* EXCLUSIVE ADMIN ONLY METRICS BADGE */}
          {isAdmin && (
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-2 px-2.5 py-1 bg-gradient-to-r from-amber-950/80 to-zinc-900 border border-amber-500/50 rounded-full text-xs text-amber-300 hover:border-amber-400 transition-all shadow-sm group"
              title="Панели Админ: Омори зиндаи корбарон"
            >
              <Crown size={14} className="text-amber-400 animate-pulse" />
              <span className="hidden md:inline font-semibold">Админ:</span>
              <span className="flex items-center gap-1 font-mono text-[11px] text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                {onlineCount} онлайн
              </span>
              <span className="text-zinc-500 hidden sm:inline">|</span>
              <span className="text-zinc-300 font-mono text-[11px] hidden sm:inline">
                {totalVisits} боздид
              </span>
            </button>
          )}

          {/* Device Switcher (PC, iPhone, Android) */}
          <div className="hidden lg:flex items-center bg-zinc-800/80 border border-zinc-700/60 p-0.5 rounded-lg text-xs">
            <button
              onClick={() => onDeviceModeChange('pc')}
              className={`px-2 py-1 rounded-md flex items-center gap-1 transition-colors ${
                deviceMode === 'pc' ? 'bg-emerald-600 text-white font-medium' : 'text-zinc-400 hover:text-white'
              }`}
              title="Намуди компютер (PC Desktop)"
            >
              <Laptop size={13} />
              <span>PC</span>
            </button>
            <button
              onClick={() => onDeviceModeChange('ios')}
              className={`px-2 py-1 rounded-md flex items-center gap-1 transition-colors ${
                deviceMode === 'ios' ? 'bg-emerald-600 text-white font-medium' : 'text-zinc-400 hover:text-white'
              }`}
              title="Намуди iPhone (iOS)"
            >
              <Smartphone size={13} />
              <span>iOS</span>
            </button>
            <button
              onClick={() => onDeviceModeChange('android')}
              className={`px-2 py-1 rounded-md flex items-center gap-1 transition-colors ${
                deviceMode === 'android' ? 'bg-emerald-600 text-white font-medium' : 'text-zinc-400 hover:text-white'
              }`}
              title="Намуди Android"
            >
              <Smartphone size={13} />
              <span>Android</span>
            </button>
          </div>

          {/* Language Switcher (4 Languages: Тоҷикӣ, Русский, English, O'zbekcha) */}
          <div className="relative flex items-center bg-zinc-800/80 border border-zinc-700/70 rounded-lg px-2 py-1 text-xs">
            <Globe size={14} className="text-zinc-400 mr-1.5 shrink-0" />
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as Language)}
              className="bg-transparent text-zinc-100 font-medium focus:outline-none cursor-pointer pr-1"
            >
              <option value="tg" className="bg-zinc-800 text-white">🇹🇯 Тоҷикӣ</option>
              <option value="ru" className="bg-zinc-800 text-white">🇷🇺 Русский</option>
              <option value="en" className="bg-zinc-800 text-white">🇬🇧 English</option>
              <option value="uz" className="bg-zinc-800 text-white">🇺🇿 O'zbekcha</option>
            </select>
          </div>

          {/* User Account / Profile */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={isAdmin ? onOpenAdmin : undefined}
                className="flex items-center gap-2 pl-1 pr-2.5 py-1 bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700/70 rounded-full transition-all"
                title={isAdmin ? 'Панели Мудир (Админ)' : currentUser.username}
              >
                <AvatarHelper avatar={currentUser.avatar} size="sm" />
                <span className="text-xs font-medium text-zinc-200 max-w-[90px] truncate">
                  {currentUser.username}
                </span>
                {isAdmin && (
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-bold border border-amber-500/30">
                    Админ
                  </span>
                )}
              </button>

              <button
                onClick={onLogout}
                className="p-2 rounded-lg bg-zinc-800/60 hover:bg-zinc-700/80 text-zinc-400 hover:text-rose-300 transition-colors"
                title={t.auth.logout}
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
            >
              <LogIn size={14} />
              <span>{t.auth.loginTab} / {t.auth.registerTab}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
