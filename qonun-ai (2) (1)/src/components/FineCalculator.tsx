import React, { useState } from 'react';
import { Calculator, AlertCircle, ArrowRight, ShieldCheck, Car, HelpCircle } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n';

interface FineCalculatorProps {
  language: Language;
  onAskAI: (prompt: string) => void;
}

export const FineCalculator: React.FC<FineCalculatorProps> = ({ language, onAskAI }) => {
  const t = translations[language];
  const [indicators, setIndicators] = useState<number>(2);
  const INDICATOR_SOMONI = 72; // 1 indicator = 72 Somoni in RT (2026)

  const PRESET_FINES = [
    {
      titleTg: 'Суръати барзиёд аз 20 то 40 км/соат',
      titleRu: 'Превышение скорости на 20-40 км/ч',
      article: 'Моддаи 333 КҲМ ҶТ',
      indicators: 2,
    },
    {
      titleTg: 'Гузаштан аз чароғаки сурх (Светофор)',
      titleRu: 'Проезд на запрещающий сигнал светофора',
      article: 'Моддаи 319 КҲМ ҶТ',
      indicators: 3,
    },
    {
      titleTg: 'Роҳбарӣ бе камарбанди бехатарӣ',
      titleRu: 'Управление ТС без ремня безопасности',
      article: 'Моддаи 333² КҲМ ҶТ',
      indicators: 1,
    },
    {
      titleTg: 'Сиёҳкунии шишаҳо бе иҷозатномаи расмӣ',
      titleRu: 'Тонировка стекол без спецразрешения',
      article: 'Моддаи 330 КҲМ ҶТ',
      indicators: 20,
    },
    {
      titleTg: 'Ронандагӣ дар ҳолати мастӣ',
      titleRu: 'Управление в состоянии опьянения',
      article: 'Моддаи 332 КҲМ ҶТ',
      indicators: 50,
    },
    {
      titleTg: 'Вайрон кардани Қонуни забони давлатӣ (№ 553 / № 13)',
      titleRu: 'Нарушение Закона о государственном языке (вывески, реклама)',
      article: 'Моддаи 89 КҲМ ҶТ',
      indicators: 15,
    },
    {
      titleTg: 'Вайрон кардани Қонуни танзим (тӯю маъракаҳо)',
      titleRu: 'Нарушение Закона об упорядочении традиций',
      article: 'Моддаи 481 КҲМ ҶТ',
      indicators: 150,
    },
  ];

  const totalSomoni = indicators * INDICATOR_SOMONI;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 text-zinc-100">
      {/* Title */}
      <div className="bg-gradient-to-r from-emerald-950 via-zinc-900 to-zinc-950 border border-emerald-800/40 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Calculator size={26} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white">{t.calc.title}</h1>
            <p className="text-xs sm:text-sm text-zinc-400">{t.calc.subtitle}</p>
          </div>
        </div>

        <div className="mt-4 p-3 bg-emerald-900/30 border border-emerald-500/30 rounded-xl text-xs sm:text-sm text-emerald-300 font-medium flex items-center gap-2">
          <ShieldCheck size={18} className="shrink-0 text-emerald-400" />
          <span>{t.calc.indicatorValue}</span>
        </div>
      </div>

      {/* Main Calculation Card */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
              {t.calc.enterIndicators}
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="0"
                step="0.5"
                value={indicators}
                onChange={(e) => setIndicators(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full text-2xl font-mono font-bold px-4 py-3 bg-zinc-950 border border-zinc-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <span className="text-sm font-semibold text-zinc-400 shrink-0">нишондиҳанда</span>
            </div>

            <p className="text-xs text-zinc-500 mt-2">
              Формула: {indicators} × 72 сомонӣ = {totalSomoni.toLocaleString()} сомонӣ
            </p>
          </div>

          <div className="bg-zinc-950 p-5 rounded-2xl border border-emerald-500/30 flex flex-col items-center justify-center text-center">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              {t.calc.totalFine}
            </span>
            <div className="mt-2 text-4xl sm:text-5xl font-black font-mono text-emerald-400">
              {totalSomoni.toLocaleString()} <span className="text-xl font-normal text-zinc-300">TJS</span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">сомонӣ ба буҷети давлатӣ</p>
          </div>
        </div>
      </div>

      {/* Common Fines in Tajikistan */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
          <Car size={18} className="text-amber-400" />
          <span>{t.calc.presetsTitle}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PRESET_FINES.map((f, i) => {
            const cost = f.indicators * INDICATOR_SOMONI;
            return (
              <div
                key={i}
                className="p-3.5 bg-zinc-950 border border-zinc-800/80 rounded-xl hover:border-zinc-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
                    <span className="text-amber-400 font-semibold">{f.article}</span>
                    <span className="font-mono">{f.indicators} нишондиҳанда</span>
                  </div>
                  <h4 className="text-xs font-semibold text-zinc-200">
                    {language === 'ru' ? f.titleRu : f.titleTg}
                  </h4>
                </div>

                <div className="mt-3 pt-2 border-t border-zinc-800 flex items-center justify-between">
                  <span className="text-sm font-black font-mono text-emerald-400">
                    {cost.toLocaleString()} сомонӣ
                  </span>
                  <button
                    onClick={() => {
                      setIndicators(f.indicators);
                      onAskAI(
                        `Тибқи ${f.article} (${f.titleTg}) тартиби пардохти ҷарима ва имконияти тахфифи 50% дар давоми 14 рӯз чӣ гуна аст?`
                      );
                    }}
                    className="text-[11px] text-zinc-400 hover:text-emerald-400 flex items-center gap-1 font-medium transition-colors"
                  >
                    <span>Машварат бо ИИ</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
