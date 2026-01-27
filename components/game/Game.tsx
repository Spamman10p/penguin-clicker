'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { BackgroundManager } from './BackgroundManager';
import { StatsHeader } from './StatsHeader';
import { ClickerArea } from './ClickerArea';
import { TabBar } from './TabBar';
import { UpgradeCard } from '../ui/UpgradeCard';
import Launchpad from './Launchpad';
// import { parseReferralParam } from '../../lib/referral';

interface GameState {
  bux: number; // Fish
  followers: number; // Colony Size
  upgrades: Record<number, number>;
  items: Record<string, number>;
  staff: Record<string, number>;
  clout: number; // Influence
}

interface Upgrade {
  id: number;
  name: string;
  cost: number;
  baseIncome: number;
  icon: string;
}

interface Asset {
  id: string;
  name: string;
  cost: number;
  income: number;
  icon: string;
}

interface Employee {
  id: string;
  name: string;
  cost: number;
  effect: string;
  icon: string;
  type: string;
  val: number;
}

const UPGRADES: Upgrade[] = [
  { id: 1, name: "Ice Fishing Rod", cost: 15, baseIncome: 1, icon: '🎣' },
  { id: 2, name: 'Snow Shovel', cost: 100, baseIncome: 5, icon: '❄️' },
  { id: 3, name: 'Ice Drill', cost: 500, baseIncome: 25, icon: '🌀' },
  { id: 4, name: 'Fish Net', cost: 2000, baseIncome: 100, icon: '🕸️' },
  { id: 5, name: 'Trawler Boat', cost: 10000, baseIncome: 450, icon: '🚢' },
];

const ASSETS: Asset[] = [
  { id: 'pebble', name: 'Shiny Pebble', cost: 50000, income: 200, icon: '🪨' },
  { id: 'hat', name: 'Top Hat', cost: 250000, income: 1200, icon: '🎩' },
  { id: 'sled', name: 'Speed Sled', cost: 1000000, income: 5000, icon: '🛷' },
  { id: 'icebreaker', name: 'Icebreaker', cost: 5000000, income: 25000, icon: '⛴️' },
  { id: 'sub', name: 'Yellow Sub', cost: 15000000, income: 80000, icon: '🚤' },
  { id: 'castle', name: 'Ice Castle', cost: 35000000, income: 200000, icon: '🏰' },
  { id: 'iceberg', name: 'Mega Iceberg', cost: 150000000, income: 900000, icon: '🗻' },
  { id: 'pole', name: 'South Pole', cost: 500000000, income: 3500000, icon: '🏁' },
];

const EMPLOYEES: Employee[] = [
  { id: 'baby', name: 'Baby Penguin', cost: 1000, effect: 'Auto-fishes 1x/sec', icon: '🐣', type: 'clicker', val: 1 },
  { id: 'scout', name: 'Ice Scout', cost: 5000, effect: 'Auto-fishes 3x/sec', icon: '🔭', type: 'clicker', val: 3 },
  { id: 'builder', name: 'Igloo Builder', cost: 15000, effect: 'Auto-fishes 10x/sec', icon: '🔨', type: 'clicker', val: 10 },
  { id: 'hunter', name: 'Master Hunter', cost: 35000, effect: 'Auto-fishes 25x/sec', icon: '🏹', type: 'clicker', val: 25 },
  { id: 'oracle', name: 'Oracle Puffin', cost: 75000, effect: '+5% Fishing Luck', icon: '🔮', type: 'luck', val: 0.05 },
  { id: 'elder', name: 'Village Elder', cost: 150000, effect: 'Auto-fishes 100x/sec', icon: '📜', type: 'clicker', val: 100 },
  { id: 'emperor', name: 'Emperor Penguin', cost: 500000, effect: '+10% Fishing Luck', icon: '👑', type: 'luck', val: 0.10 },
];

const DEFAULT_STATE: GameState = {
  bux: 0,
  followers: 1,
  upgrades: {},
  items: {},
  staff: {},
  clout: 0,
};

const format = (n: number): string => {
  if (n >= 1000000) return (n / 1000000).toFixed(2) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return n.toLocaleString();
};

export default function Game() {
  const [state, setState] = useState<GameState>(DEFAULT_STATE);
  const [income, setIncome] = useState(0);
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [clickEffects, setClickEffects] = useState<{ id: number; x: number; y: number; val: number }[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    const saved = localStorage.getItem('bricksTycoon');
    if (saved) {
      try {
        setState(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load save:', e);
      }
    }


    // Check Referral
    const params = new URLSearchParams(window.location.search);
    const refId = params.get('ref');
    if (refId && !localStorage.getItem('bricksReferralUsed')) {
      // Bonus for referral
      setState(p => ({ ...p, bux: p.bux + 1000, followers: p.followers + 50 }));
      localStorage.setItem('bricksReferralUsed', 'true');
    }

    setIsLoaded(true);
  }, []);

  // Save to LocalStorage only
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('bricksTycoon', JSON.stringify(state));
    }
  }, [state, isLoaded]);

  useEffect(() => {
    let ips = 0;

    // Upgrades (Passive $/sec)
    UPGRADES.forEach((u) => {
      ips += (state.upgrades[u.id] || 0) * u.baseIncome;
    });

    // Assets (Passive $/sec)
    ASSETS.forEach((a) => {
      if (state.items[a.id]) ips += a.income;
    });

    // Special Upgrade Effect
    if (state.upgrades[2]) {
      ips += Math.floor(state.followers * 0.01);
    }

    // Staff (Auto-clicks/sec -> Converted to $)
    let autoClicksPerSec = 0;
    EMPLOYEES.forEach((e) => {
      if (state.staff[e.id] && e.type === 'clicker') {
        autoClicksPerSec += e.val;
      }
    });

    // Calculate value of a single click (without clout multiplier first)
    const baseClickVal = 1 + Math.floor(state.followers * 0.005);
    const autoClickIncome = autoClicksPerSec * baseClickVal;

    ips += autoClickIncome;

    // Apply Clout Multiplier to total income
    const validIncome = Math.floor(ips * (1 + state.clout * 0.5));
    setIncome(validIncome);
  }, [state]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (income > 0) {
        setState((p) => ({ ...p, bux: p.bux + income }));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [income]);

  const handleClick = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const val = Math.floor((1 + Math.floor(state.followers * 0.005)) * (1 + state.clout * 0.5));
    setState((p) => ({ ...p, bux: p.bux + val }));
    let x: number, y: number;
    if ('touches' in e) {
      x = e.touches[0].clientX;
      y = e.touches[0].clientY;
    } else {
      x = e.clientX;
      y = e.clientY;
    }
    const id = Date.now();
    setClickEffects((p) => [...p, { id, x, y: y - 50, val }]);
    setTimeout(() => setClickEffects((p) => p.filter((e) => e.id !== id)), 800);
  }, [state.followers, state.clout]);

  const [showFlex, setShowFlex] = useState<{ name: string, type: string } | null>(null);

  // Clear flex toast after 5s
  useEffect(() => {
    if (showFlex) {
      const timer = setTimeout(() => setShowFlex(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [showFlex]);

  const handleFlex = (platform: 'twitter' | 'telegram') => {
    if (!showFlex) return;
    const text = `Just crafted ${showFlex.name} in Penguin Clicker! I'm fishing rich. 🐧🐟`;
    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
    } else {
      window.open(`https://t.me/share/url?url=https://penguin-clicker.netlify.app&text=${encodeURIComponent(text)}`, '_blank');
    }
    setShowFlex(null);
  };

  const buy = (type: string, item: any, cost: number) => {
    if (state.bux >= cost) {
      const key = type === 'upgrade' ? 'upgrades' : type === 'item' ? 'items' : 'staff';
      setState((p) => ({
        ...p,
        bux: p.bux - cost,
        [key]: { ...p[key as keyof GameState] as Record<string | number, number>, [item.id]: ((p[key as keyof GameState] as Record<string | number, number>)[item.id] || 0) + 1 },
        followers: p.followers + (type === 'upgrade' ? (item as Upgrade).baseIncome * 2 : 0),
      }));

      // Trigger Flex Mode
      setShowFlex({ name: item.name, type });
    }
  };

  const doPrestige = () => {
    if (state.bux < 10000000) return;
    const earned = Math.floor(state.bux / 10000000);
    setState({ ...DEFAULT_STATE, clout: state.clout + earned });
  };

  return (
    <div className="w-full h-screen relative overflow-hidden flex flex-col bg-[#1a1a1a]">
      {/* Layer 0: Background & Dynamic City */}
      <BackgroundManager level={state.clout} />

      {/* Layer 1: Stats Header */}
      <StatsHeader balance={state.bux} profitPerSec={income} />

      {/* FLEX TOAST */}
      {showFlex && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 animate-bounce cursor-pointer">
          <div className="glass-panel px-6 py-3 rounded-full border border-yellow-400 bg-black/80 flex items-center gap-3 shadow-[0_0_20px_rgba(250,204,21,0.5)]">
            <span className="text-yellow-400 text-xs font-bold whitespace-nowrap">CRAFTED {showFlex.name.toUpperCase()}!</span>
            <div className="flex gap-2">
              <button onClick={() => handleFlex('twitter')} className="text-lg hover:scale-110 transition-transform">🐦</button>
              <button onClick={() => handleFlex('telegram')} className="text-lg hover:scale-110 transition-transform">✈️</button>
            </div>
          </div>
        </div>
      )}

      {clickEffects.map((e) => (
        <div key={e.id} className="click-text pixel-font" style={{ left: e.x, top: e.y }}>+${e.val}</div>
      ))}

      {/* Layer 2: Main Clicker Area */}
      <div className="flex-1 flex items-center justify-center z-10">
        <ClickerArea onClick={handleClick} />
      </div>

      {/* Layer 3: Tab Bar */}
      <TabBar activeTab={activePanel} onTabChange={setActivePanel} />

      {/* Layer 4: Panels (Drawer) */}
      {activePanel && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-auto">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setActivePanel(null)}
          />

          {/* Panel */}
          <div className="relative w-full sm:max-w-md h-[70vh] sm:h-[80vh] slide-up z-10">
            <div className="glass-panel h-full rounded-t-3xl sm:rounded-3xl border-t-2 sm:border-2 border-yellow-500 shadow-2xl flex flex-col backdrop-blur-xl bg-black/90 mx-auto overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b border-white/10 shrink-0">
                <h2 className="text-lg font-bold text-yellow-400 uppercase pixel-font tracking-wider">{activePanel}</h2>
                <button onClick={() => setActivePanel(null)} className="w-8 h-8 rounded-full bg-white/10 text-gray-400 hover:text-white flex items-center justify-center backdrop-blur-md transition-colors hover:bg-white/20">
                  <i className="fa-solid fa-xmark" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 pb-24 scrollbar-thin scrollbar-thumb-yellow-500/20 scrollbar-track-transparent">
                {activePanel === 'upgrades' && UPGRADES.map((u) => {
                  const cost = Math.floor(u.cost * Math.pow(1.15, state.upgrades[u.id] || 0));
                  return (
                    <UpgradeCard
                      key={u.id}
                      title={u.name}
                      level={state.upgrades[u.id] || 0}
                      cost={cost}
                      baseIncome={u.baseIncome}
                      icon={u.icon}
                      canBuy={state.bux >= cost}
                      onBuy={() => buy('upgrade', u, cost)}
                    />
                  );
                })}

                {activePanel === 'flex' && <div className="grid grid-cols-2 gap-3">{ASSETS.map((a) => (
                  <div key={a.id} onClick={() => !state.items[a.id] && buy('item', a, a.cost)} className={`p-3 rounded-xl border text-center min-h-[120px] flex flex-col items-center justify-center transition-all ${state.items[a.id] ? 'border-green-500 bg-green-900/20' : state.bux >= a.cost ? 'glass-panel border-yellow-500 cursor-pointer hover:bg-white/5' : 'bg-black/40 border-gray-800 opacity-50'}`}>
                    <div className="text-4xl mb-2 filter drop-shadow-md">{a.icon}</div>
                    <div className="font-bold text-white text-xs mb-1">{a.name}</div>
                    {state.items[a.id] ? <div className="text-green-400 text-xs font-bold bg-green-900/40 px-2 py-0.5 rounded">OWNED</div> : <div className="text-yellow-400 font-mono text-xs">${format(a.cost)}</div>}
                  </div>
                ))}</div>}

                {activePanel === 'team' && EMPLOYEES.map((e) => (
                  <div key={e.id} onClick={() => !state.staff[e.id] && buy('staff', e, e.cost)} className={`p-3 rounded-xl border mb-2 flex items-center justify-between transition-all ${state.staff[e.id] ? 'border-blue-500 bg-blue-900/20' : state.bux >= e.cost ? 'glass-panel border-gray-600 cursor-pointer hover:border-blue-400' : 'bg-black/40 border-gray-800 opacity-50'}`}>
                    <div className="flex items-center gap-3"><div className="text-2xl">{e.icon}</div><div><div className="font-bold text-sm text-gray-200">{e.name}</div><div className="text-xs text-gray-500">{e.effect}</div></div></div>
                    <div className={`font-mono text-xs font-bold ${state.staff[e.id] ? 'text-blue-400' : 'text-yellow-500'}`}>{state.staff[e.id] ? 'RECRUITED' : '🐟' + format(e.cost)}</div>
                  </div>
                ))}

                {activePanel === 'launch' && <Launchpad
                  followers={state.followers}
                  bux={state.bux}
                  luckBonus={state.staff['quant'] ? 0.05 : 0}
                  onPay={(cost) => setState(p => ({ ...p, bux: p.bux - cost }))}
                  onFinishLaunch={(profit, isRug) => {
                    if (profit > 0) {
                      setState(p => ({ ...p, bux: p.bux + profit, followers: Math.floor(p.followers * (isRug ? 0.9 : 1.1)) }));
                    }
                  }}
                />}

                {activePanel === 'profile' && (
                  <div className="text-center space-y-4">
                    <div className="glass-panel p-6 rounded-xl border border-purple-500/30 bg-purple-900/10">
                      <div className="text-5xl mb-3">👑</div><h3 className="text-2xl font-bold text-white pixel-font mb-1">LVL {state.clout}</h3><p className="text-purple-300 text-xs uppercase mb-4">Clout Multiplier</p>
                      <div className="bg-black/50 p-2 rounded text-green-400 font-mono text-sm border border-white/10">x{1 + state.clout * 0.5} Earnings</div>
                    </div>

                    {/* REFERRAL HUB */}
                    <div className="glass-panel p-4 rounded-xl border border-blue-500/30 bg-blue-900/10">
                      <h3 className="text-blue-300 font-bold mb-2 text-sm uppercase">Invite & Earn</h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            const link = `https://penguin-clicker.netlify.app?ref=user`;
                            // @ts-ignore
                            if (navigator.share) {
                              navigator.share({ title: 'Penguin Clicker', text: 'Come fish with me!', url: link });
                            } else {
                              alert('Use the copy button!');
                            }
                          }}
                          className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded font-bold text-sm"
                        >
                          INVITE FRIENDS
                        </button>
                        <button
                          onClick={() => {
                            const link = `https://penguin-clicker.netlify.app?ref=user`;
                            navigator.clipboard.writeText(link);
                            alert('Link Copied!');
                          }}
                          className="bg-gray-700 hover:bg-gray-600 text-white px-4 rounded"
                        >
                          📋
                        </button>
                      </div>
                    </div>

                    {state.bux >= 10000000 ? (
                      <div className="bg-red-900/20 p-4 rounded-lg border border-red-500/50"><h3 className="text-red-400 font-bold mb-2">MIGRATE TO SOUTH</h3><button onClick={doPrestige} className="bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-6 rounded w-full shadow-lg shadow-red-900/50">PRESTIGE (+{Math.floor(state.bux / 10000000)})</button></div>
                    ) : <div className="p-4 rounded border border-gray-800 text-gray-600 text-xs">Need $10M to Prestige</div>}
                    <button onClick={() => { if (confirm('Reset?')) { localStorage.removeItem('bricksTycoon'); window.location.reload(); } }} className="text-xs text-gray-600 hover:text-red-500 underline">Delete Save</button>

                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}