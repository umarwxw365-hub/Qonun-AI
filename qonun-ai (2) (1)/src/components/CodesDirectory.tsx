import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Scale, ArrowRight, ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';
import { LegalCode, Language } from '../types';
import { translations } from '../i18n';
import { fetchCodes } from '../services/api';

interface CodesDirectoryProps {
  language: Language;
  onSelectArticle: (articlePrompt: string) => void;
}

export const CodesDirectory: React.FC<CodesDirectoryProps> = ({ language, onSelectArticle }) => {
  const t = translations[language];
  const [codes, setCodes] = useState<LegalCode[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCodeId, setSelectedCodeId] = useState<string>('criminal');

  useEffect(() => {
    fetchCodes().then((data) => {
      setCodes(data);
    });
  }, []);

  const currentCode = codes.find((c) => c.id === selectedCodeId) || codes[0];

  const filteredHighlights = (currentCode?.highlights || []).filter(
    (h) =>
      h.article.toLowerCase().includes(search.toLowerCase()) ||
      h.nameTg.toLowerCase().includes(search.toLowerCase()) ||
      h.sanction.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6 text-zinc-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-zinc-900 via-emerald-950 to-zinc-900 border border-emerald-800/40 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <BookOpen size={26} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              {t.nav.codes} • Қонунгузории ҶТ
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400">
              Кодексҳои расмии Ҷумҳурии Тоҷикистон бо тағйиру иловаҳои соли 2026
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="mt-5 relative">
          <Search size={16} className="absolute left-3.5 top-3.5 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Ҷустуҷӯи модда (масалан: 244 Дуздӣ, Қаллобӣ, Алимент, Ҷарима)..."
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Code Selector Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        {codes.map((code) => {
          const isSelected = selectedCodeId === code.id;
          const title =
            language === 'ru'
              ? code.titleRu
              : language === 'uz'
              ? code.titleUz
              : language === 'en'
              ? code.titleEn
              : code.titleTg;

          return (
            <button
              key={code.id}
              onClick={() => setSelectedCodeId(code.id)}
              className={`px-4 py-2.5 rounded-xl font-semibold shrink-0 transition-all border flex items-center gap-2 ${
                isSelected
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-950/40'
                  : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <FileText size={14} />
              <span>{title}</span>
            </button>
          );
        })}
      </div>

      {/* Code Overview Card */}
      {currentCode && (
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-zinc-800 gap-2">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                {language === 'ru'
                  ? currentCode.titleRu
                  : language === 'uz'
                  ? currentCode.titleUz
                  : currentCode.titleTg}
              </h2>
              <p className="text-xs text-zinc-400">
                Соли қабул: {currentCode.year} • Ҳаҷм: {currentCode.articlesCount}
              </p>
            </div>
            <span className="text-xs text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30 w-fit">
              Амалкунанда дар РТ
            </span>
          </div>

          {/* Highlights List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Моддаҳои муҳим ва ҷазоҳои пешбинишуда:
            </h3>

            {filteredHighlights.length > 0 ? (
              filteredHighlights.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60">
                        {item.article}
                      </span>
                      <h4 className="text-sm font-semibold text-white">{item.nameTg}</h4>
                    </div>
                    <p className="text-xs text-zinc-400 flex items-center gap-1.5 pt-1">
                      <ShieldAlert size={13} className="text-rose-400 shrink-0" />
                      <span>Ҷазо: <b className="text-zinc-200">{item.sanction}</b></span>
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      onSelectArticle(
                        `Тибқи ${item.article}и ${currentCode.titleTg} (${item.nameTg}) кадом ҷазо ва ҳолатҳои сабуккунанда вуҷуд доранд?`
                      )
                    }
                    className="px-3.5 py-2 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1.5 shrink-0"
                  >
                    <span>Таҳлили ИИ</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-xs text-zinc-500 py-6 text-center">
                Мувофиқи дархости шумо модда ёфт нашуд
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
