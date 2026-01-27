import React from 'react';
import Image from 'next/image';

interface BackgroundManagerProps {
    level?: number;
}

export const BackgroundManager: React.FC<BackgroundManagerProps> = ({ level = 1 }) => {
    // In the future, this can switch images based on level
    // For now, we use the single Cyberpunk City asset

    return (
        <div className="fixed inset-0 z-0 overflow-hidden">
            <div className="absolute inset-0 bg-black" />

            {/* City Background */}
            <div className="absolute inset-0 transition-opacity duration-1000 ease-in-out">
                <Image
                    src="/images/mountains-bg.png"
                    alt="Antarctic Mountains"
                    fill
                    priority
                    className="object-cover object-center opacity-80"
                    style={{
                        // Subtle parallax or scaling effect could go here
                        transform: 'scale(1.05)',
                    }}
                />

                {/* Overlay Gradients for depth and text readability */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/60 to-transparent" />
                <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/80 to-transparent" />

                {/* CRT Scanline Effect Overlay (from global.css) */}
                <div className="absolute inset-0 crt-overlay opacity-30 pointer-events-none" />
            </div>
        </div>
    );
};