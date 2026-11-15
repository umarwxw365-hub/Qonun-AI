import React from 'react';
import { Scale, Award, ShieldAlert, GraduationCap, UserCheck, ShieldCheck, User } from 'lucide-react';

interface AvatarProps {
  avatar: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const PRESET_AVATARS = [
  { id: 'lawyer_gold', label: 'Адвокати калон (Старший юрист)', color: 'from-amber-500 to-yellow-600', icon: Scale },
  { id: 'lawyer_man', label: 'Ҳуқуқшинос (Юрист)', color: 'from-emerald-600 to-teal-700', icon: Award },
  { id: 'judge', label: 'Судя (Судья)', color: 'from-rose-600 to-red-800', icon: ShieldCheck },
  { id: 'student_boy', label: 'Донишҷӯи ҳуқуқшиносӣ', color: 'from-blue-600 to-indigo-700', icon: GraduationCap },
  { id: 'student_girl', label: 'Коршиноси ҳуқуқ', color: 'from-purple-600 to-pink-700', icon: UserCheck },
  { id: 'citizen_dushanbe', label: 'Шаҳрванд (Гражданин)', color: 'from-slate-600 to-zinc-800', icon: User },
  { id: 'eagle_emblem', label: 'Ҳомии қонун (Защитник)', color: 'from-amber-600 to-orange-700', icon: ShieldAlert },
];

export const AvatarHelper: React.FC<AvatarProps> = ({ avatar, className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-20 h-20 text-xl',
  };

  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 24,
    xl: 38,
  };

  // If avatar is custom uploaded base64 data URL
  if (avatar && (avatar.startsWith('data:image') || avatar.startsWith('http'))) {
    return (
      <img
        src={avatar}
        alt="User profile avatar"
        className={`rounded-full object-cover border-2 border-emerald-500/40 shadow-sm ${sizeClasses[size]} ${className}`}
      />
    );
  }

  const preset = PRESET_AVATARS.find((p) => p.id === avatar) || PRESET_AVATARS[0];
  const Icon = preset.icon;

  return (
    <div
      className={`rounded-full bg-gradient-to-br ${preset.color} text-white flex items-center justify-center shadow-sm border border-white/20 shrink-0 ${sizeClasses[size]} ${className}`}
      title={preset.label}
    >
      <Icon size={iconSizes[size]} strokeWidth={2.2} />
    </div>
  );
};
