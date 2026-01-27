'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const Game = dynamic(() => import('../components/game/Game'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center bg-[#1a1a1a]">
      <div className="text-center">
        <div className="text-4xl mb-4">🐧</div>
        <div className="pixel-font text-cyan-400 text-sm">FISHING...</div>
      </div>
    </div>
  ),
});

export default function Home() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
    }
    setReady(true);
  }, []);

  if (!ready) return null;
  return <Game />;
}