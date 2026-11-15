import React from 'react';
import { Shield, AlertOctagon, PhoneCall, Scale, Clock, Lock, ArrowRight, UserCheck } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n';

interface RightsGuideProps {
  language: Language;
  onAskAI: (prompt: string) => void;
}

export const RightsGuide: React.FC<RightsGuideProps> = ({ language, onAskAI }) => {
  const t = translations[language];

  const RULES = [
    {
      num: '1',
      title: t.rights.rule1Title,
      desc: t.rights.rule1Desc,
      icon: Lock,
      color: 'from-amber-600 to-amber-700',
    },
    {
      num: '2',
      title: t.rights.rule2Title,
      desc: t.rights.rule2Desc,
      icon: Scale,
      color: 'from-emerald-600 to-emerald-700',
    },
    {
      num: '3',
      title: t.rights.rule3Title,
      desc: t.rights.rule3Desc,
      icon: PhoneCall,
      color: 'from-blue-600 to-blue-700',
    },
    {
      num: '4',
      title: t.rights.rule4Title,
      desc: t.rights.rule4Desc,
      icon: Clock,
      color: 'from-purple-600 to-purple-700',
    },
    {
      num: '5',
      title: t.rights.rule5Title,
      desc: t.rights.rule5Desc,
      icon: AlertOctagon,
      color: 'from-rose-600 to-rose-700',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 text-zinc-100">
      {/* Banner */}
      <div className="bg-gradient-to-r from-rose-950 via-zinc-900 to-zinc-950 border border-rose-800/40 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
            <Shield size={26} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white">{t.rights.title}</h1>
            <p className="text-xs sm:text-sm text-zinc-400">{t.rights.subtitle}</p>
          </div>
        </div>

        <div className="mt-4 p-3 bg-rose-900/20 border border-rose-700/30 rounded-xl text-xs sm:text-sm text-rose-300 font-medium">
          ⚠️ Агар шумо ё наздиконатон боздошт шуда бошед, аввалин кор: <b>ба ҳеҷ баёноти холӣ ё норавшан бидуни ҳузури вакили дифоъ имзо нагузоред!</b>
        </div>
      </div>

      {/* Rules list */}
      <div className="space-y-3.5">
        {RULES.map((rule, idx) => {
          const Icon = rule.icon;
          return (
            <div
              key={idx}
              className="p-4 sm:p-5 bg-zinc-900/90 border border-zinc-800 rounded-2xl shadow-sm hover:border-zinc-700 transition-all flex flex-col sm:flex-row sm:items-start gap-4"
            >
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${rule.color} text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-md`}
              >
                <Icon size={20} />
              </div>

              <div className="flex-1 space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-white">{rule.title}</h3>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">{rule.desc}</p>
              </div>

              <button
                onClick={() =>
                  onAskAI(
                    `Ман дар бораи «${rule.title}» савол дорам: тибқи қонунгузории ҶТ агар ин ҳуқуқи маро поймол кунанд, ба куҷо бояд шикоят кунам?`
                  )
                }
                className="self-end sm:self-center px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 rounded-xl text-xs font-medium transition-all flex items-center gap-1 shrink-0"
              >
                <span>Тафсилоти ИИ</span>
                <ArrowRight size={12} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
