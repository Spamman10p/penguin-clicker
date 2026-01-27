import React from 'react';

interface StatsHeaderProps {
    balance: number;
    profitPerSec: number;
}

const format = (n: number): string => {
    if (n >= 1000000) return (n / 1000000).toFixed(2) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
    return n.toLocaleString();
};

export const StatsHeader: React.FC<StatsHeaderProps> = ({ balance, profitPerSec }) => {
    return (
        <div className="fixed top-0 left-0 right-0 z-50 p-4">
            <div className="glass-panel rounded-xl p-3 flex justify-between items-center shadow-lg transform transition-all hover:scale-[1.02]">
                {/* Balance Section */}
                <div className="flex flex-col">
                    <span className="text-xs text-blue-400 font-mono tracking-widest uppercase mb-1">FISH</span>
                    <div className="text-2xl pixel-font text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                        🐟 {format(Math.floor(balance))}
                    </div>
                </div>

                {/* Profit Section */}
                <div className="flex flex-col items-end">
                    <span className="text-xs text-cyan-400 font-mono tracking-widest uppercase mb-1">CATCH/SEC</span>
                    <div className="text-sm font-bold text-cyan-300 drop-shadow-md bg-cyan-900/40 px-2 py-1 rounded border border-cyan-500/30">
                        +🐟{format(profitPerSec)}/s
                    </div>
                </div>
            </div>
        </div>
    );
};