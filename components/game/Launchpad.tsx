'use client';

import { useState, useRef, useEffect } from 'react';

interface CoinLaunchpadProps {
    followers: number;
    bux: number;
    luckBonus: number;
    onFinishLaunch: (profit: number, isRug: boolean) => void;
    onPay: (amount: number) => void;
}

export default function CoinLaunchpad({ followers, bux, luckBonus, onFinishLaunch, onPay }: CoinLaunchpadProps) {
    const [step, setStep] = useState<'create' | 'trading' | 'result'>('create');
    const [coinName, setCoinName] = useState('');
    const [ticker, setTicker] = useState('');
    const [marketCap, setMarketCap] = useState(5000);
    const [chartData, setChartData] = useState<number[]>([5000]);
    const [devBag, setDevBag] = useState(0);
    const ref = useRef<NodeJS.Timeout | null>(null);

    const startTrading = () => {
        if (bux < 500) return;

        // Deduct cost
        onPay(500);

        setStep('trading');
        setMarketCap(5000);
        setChartData([5000]);

        ref.current = setInterval(() => {
            setMarketCap(prev => {
                const change = (Math.random() - 0.48 + luckBonus) * 0.1 * prev;
                let spike = Math.random() > 0.95 ? prev * 0.3 : Math.random() > 0.98 ? -prev * 0.4 : 0;
                const v = Math.max(100, prev + change + spike);
                setChartData(c => [...c.slice(-19), v]);
                setDevBag(Math.floor(v * 0.05));
                return v;
            });
        }, 800);
    };

    const finish = (isRug: boolean) => {
        if (ref.current) clearInterval(ref.current);
        onFinishLaunch(devBag, isRug);
        setStep('result');
    };

    useEffect(() => {
        if (step === 'trading' && (marketCap < 500 || marketCap > 100000)) {
            finish(false);
        }
    }, [marketCap, step]);

    useEffect(() => {
        return () => {
            if (ref.current) clearInterval(ref.current);
        };
    }, []);

    const getPath = () => {
        if (chartData.length < 2) return "";
        const max = Math.max(...chartData) * 1.2;
        const min = Math.min(...chartData) * 0.8;
        return `M 0 ${50 - ((chartData[0] - min) / (max - min)) * 50} ` + chartData.map((v, i) => `L ${(i / (chartData.length - 1)) * 100} ${50 - ((v - min) / (max - min)) * 50}`).join(' ');
    };

    if (step === 'create') return (
        <div className="bg-gray-800 p-4 rounded-lg border border-yellow-500 space-y-4">
            <h3 className="text-xl font-bold text-center text-white">LAUNCHPAD</h3>
            <div className="flex gap-2">
                <input
                    value={coinName}
                    onChange={e => setCoinName(e.target.value)}
                    className="bg-black text-white p-2 rounded w-full outline-none border border-gray-700 focus:border-yellow-500"
                    placeholder="Token Name"
                />
                <button
                    onClick={() => {
                        const names = ["ScamCoin", "MoonInu", "ElonTusk", "DogeKiller", "SafeMars", "BrickToken", "RugPull", "YoloBet", "BasedGod"];
                        const tickers = ["$SCAM", "$MOON", "$TUSK", "$KILL", "$SAFE", "$BRICK", "$RUG", "$YOLO", "$BASED"];
                        const idx = Math.floor(Math.random() * names.length);
                        setCoinName(names[idx]);
                        setTicker(tickers[idx]);
                    }}
                    className="bg-gray-700 hover:bg-gray-600 p-2 rounded text-xl"
                    title="Randomize"
                >
                    🎲
                </button>
            </div>
            <input
                value={ticker}
                onChange={e => setTicker(e.target.value)}
                className="bg-black text-white p-2 rounded w-full outline-none border border-gray-700 focus:border-yellow-500"
                placeholder="Ticker (e.g. $PEPE)"
            />
            <button
                disabled={bux < 500 || !coinName}
                onClick={startTrading}
                className={`w-full py-3 rounded font-bold transition-all ${bux >= 500 && coinName ? 'bg-yellow-500 text-black hover:bg-yellow-400 active:scale-95' : 'bg-gray-600 text-gray-400 cursor-not-allowed'}`}
            >
                DEPLOY (500 BUX)
            </button>
            {bux < 500 && <p className="text-red-400 text-xs text-center">Not enough funds.</p>}
        </div>
    );

    if (step === 'trading') return (
        <div className="bg-gray-900 p-3 rounded-lg border-2 border-yellow-500">
            <div className="flex justify-between mb-2">
                <h3 className="font-bold text-white max-w-[150px] truncate">{ticker}</h3>
                <div className="text-green-400 font-mono">${Math.floor(marketCap).toLocaleString()}</div>
            </div>
            <div className="h-24 bg-black rounded mb-3 relative overflow-hidden border border-gray-800">
                <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="w-full h-full">
                    <path d={getPath()} fill="none" stroke="#4ade80" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                </svg>
            </div>
            <div className="grid grid-cols-2 gap-2">
                <button onClick={() => finish(false)} className="bg-blue-600 hover:bg-blue-500 text-white py-3 rounded font-bold active:scale-95">JEET (SELL)</button>
                <button onClick={() => finish(true)} className="bg-red-600 hover:bg-red-500 text-white py-3 rounded font-bold active:scale-95">RUG (SCAM)</button>
            </div>
        </div>
    );

    return (
        <div className="bg-gray-800 p-6 text-center rounded-lg border border-gray-700">
            <div className="text-6xl mb-4">{devBag > 100 ? "🤑" : "💀"}</div>
            <h4 className="text-white font-bold mb-2">{devBag > 100 ? "PUMP IT!" : "REKT"}</h4>
            <div className={`font-mono text-2xl my-4 font-bold ${devBag > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {devBag > 0 ? '+' : ''}${devBag.toLocaleString()}
            </div>
            <button onClick={() => setStep('create')} className="w-full bg-white hover:bg-gray-200 text-black font-bold py-3 rounded active:scale-95">
                LAUNCH ANOTHER
            </button>
        </div>
    );
}