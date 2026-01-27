import React from 'react';

interface UpgradeCardProps {
    title: string;
    level: number;
    cost: number;
    baseIncome: number;
    icon: string;
    canBuy: boolean;
    onBuy: () => void;
}

const format = (n: number) => {
    if (n >= 1000000) return (n / 1000000).toFixed(2) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
    return n.toLocaleString();
};

export const UpgradeCard: React.FC<UpgradeCardProps> = ({
    title, level, cost, baseIncome, icon, canBuy, onBuy
}) => {
    return (
        <div
            onClick={onBuy}
            className={`
        relative overflow-hidden p-3 mb-3 rounded-xl border transition-all duration-200
        ${canBuy
                    ? 'glass-panel border-yellow-500/30 hover:border-yellow-500/80 cursor-pointer active:scale-[0.98]'
                    : 'bg-black/40 border-gray-800 opacity-60 grayscale-[0.8]'
                }
      `}
        >
            <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                    {/* Icon Box */}
                    <div className={`
            w-12 h-12 rounded-lg flex items-center justify-center text-2xl
            ${canBuy ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/10 border border-yellow-500/20' : 'bg-gray-800'}
          `}>
                        {icon}
                    </div>

                    {/* Info */}
                    <div>
                        <div className="font-bold text-white text-sm leading-tight">{title}</div>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-400 bg-black/50 px-1.5 py-0.5 rounded font-mono">
                                Lvl {level}
                            </span>
                            <span className="text-xs text-green-400 font-mono">
                                +${baseIncome}/s
                            </span>
                        </div>
                    </div>
                </div>

                {/* Price/Buy */}
                <div className="flex flex-col items-end">
                    <div className={`font-bold font-mono text-sm ${canBuy ? 'text-yellow-400' : 'text-gray-500'}`}>
                        ${format(cost)}
                    </div>
                    {canBuy && (
                        <div className="text-[10px] text-black bg-yellow-500 px-2 py-0.5 rounded-full font-bold mt-1 shadow-sm">
                            BUY
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};