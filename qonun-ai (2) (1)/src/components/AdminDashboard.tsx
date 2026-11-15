import React, { useState, useEffect } from 'react';
import { Crown, Users, Eye, MessageSquare, ShieldCheck, RefreshCw, Send, Radio, Clock, AlertCircle } from 'lucide-react';
import { AdminStats, Language, User } from '../types';
import { translations } from '../i18n';
import { fetchAdminStats, setAdminAnnouncement } from '../services/api';
import { AvatarHelper } from './AvatarHelper';

interface AdminDashboardProps {
  language: Language;
  currentUser: User | null;
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  language,
  currentUser,
  onClose,
}) => {
  const t = translations[language];
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [announcementText, setAnnouncementText] = useState('');
  const [announcementSuccess, setAnnouncementSuccess] = useState(false);

  const loadStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAdminStats({
        role: currentUser?.role || 'user',
        username: currentUser?.username || '',
        adminKey: 'umar2026', // fallback
      });
      setStats(data);
      if (data.announcement) {
        setAnnouncementText(data.announcement.text || '');
      }
    } catch (err: any) {
      setError(err.message || 'Дастрасӣ танҳо барои Мудири кулл (Админ)');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 15000); // refresh stats every 15s
    return () => clearInterval(interval);
  }, [currentUser]);

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementText.trim()) return;

    try {
      await setAdminAnnouncement({
        text: announcementText.trim(),
        active: true,
        role: currentUser?.role || 'user',
        adminKey: 'umar2026',
      });
      setAnnouncementSuccess(true);
      setTimeout(() => setAnnouncementSuccess(false), 3000);
      loadStats();
    } catch (err: any) {
      setError(err.message || 'Хатогӣ дар интишори эълон');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6 text-zinc-100">
      {/* Top Banner with Crown */}
      <div className="relative overflow-hidden bg-gradient-to-r from-amber-950 via-zinc-900 to-emerald-950 border border-amber-500/40 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10">
              <Crown size={32} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black tracking-tight text-white">{t.admin.title}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/30 text-amber-300 border border-amber-400/40">
                  {t.admin.onlyForOwner}
                </span>
              </div>
              <p className="text-sm text-zinc-400 mt-1">{t.admin.subtitle}</p>
            </div>
          </div>

          <button
            onClick={loadStats}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium rounded-xl border border-zinc-700 transition-colors"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Навсозӣ (Обновить)</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-rose-950/40 border border-rose-800 text-rose-300 rounded-xl text-sm">
          <AlertCircle size={18} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Real-time Online Users Count */}
        <div className="bg-zinc-900/90 border border-emerald-500/30 rounded-2xl p-5 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              {t.admin.onlineUsers}
            </span>
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-4xl font-black font-mono text-white">
              {stats?.onlineCount ?? 1}
            </span>
            <span className="text-xs text-emerald-400 font-medium">дар ин лаҳза</span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-2">
            Фаъолияти фаврии меҳмонон ва корбарон
          </p>
        </div>

        {/* Total Visits */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">{t.admin.totalVisits}</span>
            <Eye size={18} className="text-blue-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-4xl font-black font-mono text-white">
              {stats?.totalVisits ?? 0}
            </span>
            <span className="text-xs text-zinc-400">заходов</span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-2">
            Шумораи умумии кушодани барнома
          </p>
        </div>

        {/* Total Registered Users */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">{t.admin.registeredUsers}</span>
            <Users size={18} className="text-amber-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-4xl font-black font-mono text-white">
              {stats?.totalRegisteredUsers ?? 0}
            </span>
            <span className="text-xs text-zinc-400">ҳисобҳо</span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-2">
            Ҳамаи корбарони ба қайд гирифташуда
          </p>
        </div>

        {/* Total Legal Queries Answered */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">{t.admin.consultationsCount}</span>
            <MessageSquare size={18} className="text-emerald-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-4xl font-black font-mono text-white">
              {stats?.totalQueries ?? 0}
            </span>
            <span className="text-xs text-zinc-400">машварат</span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-2">
            Ҳамагӣ саволҳои ҳуқуқӣ ба ИИ
          </p>
        </div>
      </div>

      {/* Global Announcement Manager */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 shadow-sm">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
          <Radio size={16} className="text-amber-400" />
          <span>{t.admin.announcementManager}</span>
        </h3>
        <p className="text-xs text-zinc-400 mb-3">
          Матне, ки дар болои ҳама саҳифаҳо ба корбарон нишон дода мешавад:
        </p>
        <form onSubmit={handleBroadcast} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={announcementText}
            onChange={(e) => setAnnouncementText(e.target.value)}
            placeholder={t.admin.announcementPlaceholder}
            className="flex-1 px-4 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-semibold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 shrink-0 transition-all"
          >
            <Send size={14} />
            <span>{t.admin.broadcastBtn}</span>
          </button>
        </form>
        {announcementSuccess && (
          <p className="text-xs text-emerald-400 font-medium mt-2">
            ✓ {t.admin.announcementUpdated}
          </p>
        )}
      </div>

      {/* Dual Table: Registered Users & Recent Queries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Registered Users List */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 shadow-sm overflow-hidden">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
            <Users size={16} className="text-amber-400" />
            <span>{t.admin.userAudit}</span>
            <span className="text-xs text-zinc-500 font-normal">
              ({stats?.registeredUsersList?.length || 0})
            </span>
          </h3>

          <div className="overflow-x-auto max-h-80 overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950 text-zinc-400 border-b border-zinc-800 sticky top-0">
                <tr>
                  <th className="py-2.5 px-3">Корбар (Username)</th>
                  <th className="py-2.5 px-3">{t.admin.role}</th>
                  <th className="py-2.5 px-3">Саволҳо</th>
                  <th className="py-2.5 px-3">{t.admin.joined}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {stats?.registeredUsersList?.map((u) => (
                  <tr key={u.id} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="py-2.5 px-3 flex items-center gap-2.5">
                      <AvatarHelper avatar={u.avatar} size="sm" />
                      <span className="font-semibold text-zinc-200">{u.username}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          u.role === 'admin'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-zinc-800 text-zinc-300'
                        }`}
                      >
                        {u.role === 'admin' ? 'Админ' : 'Корбар'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-zinc-300">
                      {u.consultationsCount || 0}
                    </td>
                    <td className="py-2.5 px-3 text-zinc-400 text-[11px]">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Inquiries Audit Log */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 shadow-sm overflow-hidden">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
            <MessageSquare size={16} className="text-emerald-400" />
            <span>{t.admin.recentQueries}</span>
            <span className="text-xs text-zinc-500 font-normal">
              ({stats?.recentQueries?.length || 0})
            </span>
          </h3>

          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
            {stats?.recentQueries && stats.recentQueries.length > 0 ? (
              stats.recentQueries.map((q) => (
                <div
                  key={q.id}
                  className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800/80 hover:border-zinc-700 transition-colors text-xs"
                >
                  <div className="flex items-center justify-between text-zinc-400 mb-1">
                    <span className="font-semibold text-amber-300 flex items-center gap-1.5">
                      <ShieldCheck size={13} className="text-emerald-400" />
                      @{q.username}
                    </span>
                    <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                      <Clock size={10} />
                      {new Date(q.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-zinc-200 font-medium">{q.prompt}</p>
                  <p className="text-[11px] text-zinc-400 mt-1 italic line-clamp-2">
                    {q.responseSnippet}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-xs text-zinc-500 text-center py-8">
                Ҳоло саволҳои нав сабт нашудаанд
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
