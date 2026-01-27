import React from 'react';
import Image from 'next/image';

interface ClickerAreaProps {
    onClick: (e: React.MouseEvent | React.TouchEvent) => void;
}

export const ClickerArea: React.FC<ClickerAreaProps> = ({ onClick }) => {
    return (
        <div className="relative cursor-pointer select-none active:scale-95 transition-transform duration-100 ease-out p-4 flex items-center justify-center" onClick={onClick} onTouchStart={onClick}>
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-cyan-500/20 blur-3xl rounded-full scale-75 animate-pulse" />

            {/* Penguin Character */}
            <div className="relative w-[300px] h-[300px] animate-bounce-slow drop-shadow-2xl z-10">
                <Image
                    src="/images/penguin-main.png"
                    alt="Penguin"
                    fill
                    className="object-contain"
                    priority
                />
            </div>

            {/* Tap Hint */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap z-20">
                <span className="pixel-font text-cyan-400 text-xs animate-bounce block text-center shadow-black drop-shadow-md">
                    TAP TO FISH
                </span>
            </div>
        </div>
    );
};