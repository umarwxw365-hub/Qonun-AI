import React, { useState, useRef } from 'react';
import { X, Image, Upload, Shield, CheckCircle, AlertCircle, Key, Lock, User as UserIcon } from 'lucide-react';
import { User, Language } from '../types';
import { translations } from '../i18n';
import { registerUser, loginUser } from '../services/api';
import { PRESET_AVATARS, AvatarHelper } from './AvatarHelper';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onLoginSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  language,
  onLoginSuccess,
}) => {
  const t = translations[language];
  const [tab, setTab] = useState<'register' | 'login'>('register');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('lawyer_gold');
  const [customAvatarPreview, setCustomAvatarPreview] = useState<string | null>(null);
  const [adminKey, setAdminKey] = useState('');
  const [showAdminKeyInput, setShowAdminKeyInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle uploading avatar from phone or computer gallery
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Лутфан танҳо файли расм интихоб кунед / Пожалуйста, выберите файл изображения');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Ҳаҷми расм бояд то 5MB бошад / Размер файла не более 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setCustomAvatarPreview(result);
      setSelectedAvatar(result);
      setErrorMsg(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (tab === 'register') {
        const res = await registerUser({
          username: username.trim(),
          password,
          avatar: customAvatarPreview || selectedAvatar,
          adminKey: adminKey.trim() || undefined,
        });

        setSuccessMsg(t.auth.registrationSuccess);
        setTimeout(() => {
          onLoginSuccess(res.user);
          onClose();
        }, 600);
      } else {
        const res = await loginUser({
          username: username.trim(),
          password,
        });

        setSuccessMsg(res.user.role === 'admin' ? t.auth.welcomeAdmin : 'Воридшавӣ бомуваффақият анҷом ёфт!');
        setTimeout(() => {
          onLoginSuccess(res.user);
          onClose();
        }, 500);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Хатогӣ рӯй дод / Произошла ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 border border-emerald-900/10 dark:border-emerald-500/20 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 p-5 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X size={18} />
          </button>
          <div className="flex items-center gap-3">
            <img
              src="/assets/aistudio/QONUN_AI_________________________________eb1e2e03.png"
              alt="Qonun AI"
              className="w-11 h-11 rounded-xl object-cover border border-emerald-400/50 shadow-md shrink-0"
            />
            <div>
              <h2 className="text-xl font-bold tracking-tight">Qonun AI</h2>
              <p className="text-xs text-emerald-100">{t.appSubtitle}</p>
            </div>
          </div>

          {/* Tab Selector */}
          <div className="mt-4 flex bg-emerald-950/40 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setTab('register');
                setErrorMsg(null);
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                tab === 'register'
                  ? 'bg-white text-emerald-900 shadow-sm'
                  : 'text-emerald-100 hover:text-white'
              }`}
            >
              {t.auth.registerTab}
            </button>
            <button
              type="button"
              onClick={() => {
                setTab('login');
                setErrorMsg(null);
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                tab === 'login'
                  ? 'bg-white text-emerald-900 shadow-sm'
                  : 'text-emerald-100 hover:text-white'
              }`}
            >
              {t.auth.loginTab}
            </button>
          </div>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-zinc-900 dark:text-zinc-100">
          {errorMsg && (
            <div className="flex items-start gap-2.5 p-3 text-xs bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-200 rounded-xl">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-2.5 p-3 text-xs bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-200 rounded-xl">
              <CheckCircle size={16} className="shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Username Input */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              {t.auth.usernameLabel} <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                <UserIcon size={16} />
              </div>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t.auth.usernamePlaceholder}
                className="w-full pl-9 pr-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
              />
            </div>
            {tab === 'register' && (
              <p className="text-[11px] text-zinc-500 mt-1">
                Ҳар як корбар бояд номи нотакрор дошта бошад (Уникальный логин)
              </p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              {t.auth.passwordLabel} <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                <Lock size={16} />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.auth.passwordPlaceholder}
                className="w-full pl-9 pr-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
              />
            </div>
          </div>

          {/* Avatar Selector - Shown prominently on registration */}
          {tab === 'register' && (
            <div className="space-y-2 pt-1 border-t border-zinc-100 dark:border-zinc-800">
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                {t.auth.avatarLabel}
              </label>

              {/* Gallery Upload Option */}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="flex items-center gap-3 p-2 bg-emerald-50/60 dark:bg-emerald-950/20 rounded-xl border border-dashed border-emerald-300 dark:border-emerald-800">
                <AvatarHelper avatar={customAvatarPreview || selectedAvatar} size="lg" />
                <div className="flex-1">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors shadow-sm"
                  >
                    <Upload size={14} />
                    {t.auth.uploadFromGallery}
                  </button>
                  <p className="text-[11px] text-zinc-500 mt-1">
                    Аз расмҳои телефон ё компютери худ интихоб кунед
                  </p>
                </div>
              </div>

              {/* Presets grid */}
              <div className="pt-2">
                <p className="text-[11px] text-zinc-500 mb-1.5">{t.auth.orChoosePreset}:</p>
                <div className="flex flex-wrap gap-2">
                  {PRESET_AVATARS.map((p) => {
                    const isSelected = selectedAvatar === p.id && !customAvatarPreview;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setSelectedAvatar(p.id);
                          setCustomAvatarPreview(null);
                        }}
                        className={`p-1 rounded-full transition-all ${
                          isSelected
                            ? 'ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-zinc-900 scale-105'
                            : 'opacity-70 hover:opacity-100'
                        }`}
                        title={p.label}
                      >
                        <AvatarHelper avatar={p.id} size="md" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Admin Access Section */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowAdminKeyInput(!showAdminKeyInput)}
              className="text-[11px] flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              <Key size={12} />
              {showAdminKeyInput ? 'Калиди админро пӯшидан' : 'Ман соҳиби барнома / Админ ҳастам'}
            </button>

            {showAdminKeyInput && (
              <div className="mt-2 p-2.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl space-y-1">
                <p className="text-[11px] text-amber-800 dark:text-amber-200 font-medium">
                  Ҳуқуқи админӣ барои: <b>umarwxw365@gmail.com</b> ё ворид намудани калид:
                </p>
                <input
                  type="password"
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  placeholder="Рамзи махфии Админ (масалан: umar2026)"
                  className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-zinc-800 border border-amber-300 dark:border-amber-700 rounded-lg text-zinc-800 dark:text-white"
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-emerald-900/10 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : tab === 'register' ? (
              t.auth.submitRegister
            ) : (
              t.auth.submitLogin
            )}
          </button>

          {/* Switch tab hint */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setTab(tab === 'register' ? 'login' : 'register');
                setErrorMsg(null);
              }}
              className="text-xs text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 transition-colors"
            >
              {tab === 'register' ? t.auth.alreadyHaveAccount : t.auth.noAccount}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
