import React from 'react';
import { Smartphone, Laptop, Wifi, Battery, Signal } from 'lucide-react';

interface DeviceSimulatorProps {
  mode: 'pc' | 'ios' | 'android';
  children: React.ReactNode;
}

export const DeviceSimulator: React.FC<DeviceSimulatorProps> = ({ mode, children }) => {
  if (mode === 'pc') {
    return <div className="w-full min-h-screen bg-zinc-950">{children}</div>;
  }

  const isIos = mode === 'ios';

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-2 sm:p-6">
      {/* Device frame container */}
      <div
        className={`relative w-full max-w-[420px] h-[860px] bg-zinc-900 border-[8px] ${
          isIos ? 'border-zinc-800 rounded-[50px]' : 'border-zinc-800 rounded-[36px]'
        } shadow-2xl overflow-hidden flex flex-col`}
      >
        {/* Device Status Bar */}
        <div className="bg-zinc-950 text-zinc-400 text-[11px] px-6 py-2 flex items-center justify-between z-30 shrink-0 select-none">
          <span className="font-semibold">{isIos ? '09:41' : '12:00'}</span>

          {/* Notch or Camera punch-hole */}
          {isIos ? (
            <div className="w-24 h-4 bg-zinc-900 rounded-full mx-auto" />
          ) : (
            <div className="w-3.5 h-3.5 bg-zinc-900 rounded-full mx-auto" />
          )}

          <div className="flex items-center gap-1.5">
            <Signal size={12} />
            <Wifi size={12} />
            <Battery size={14} />
          </div>
        </div>

        {/* Inner screen content */}
        <div className="flex-1 overflow-y-auto bg-zinc-950 flex flex-col">
          {children}
        </div>

        {/* iOS Home Indicator Bar or Android Nav Bar */}
        {isIos ? (
          <div className="h-5 bg-zinc-950 flex items-center justify-center shrink-0">
            <div className="w-32 h-1 bg-zinc-600 rounded-full" />
          </div>
        ) : (
          <div className="h-6 bg-zinc-950 flex items-center justify-around text-zinc-500 text-xs shrink-0 border-t border-zinc-900">
            <span>◀</span>
            <span>●</span>
            <span>■</span>
          </div>
        )}
      </div>
    </div>
  );
};
