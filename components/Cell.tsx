
import React, { useState, useEffect, useRef } from 'react';
import { Symbol } from '../types';

interface CellProps {
  symbol: Symbol | null;
  onClick: () => void;
}

const Cell: React.FC<CellProps> = ({ symbol, onClick }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [shouldAnimateChange, setShouldAnimateChange] = useState(false);
  const prevSymbolRef = useRef<Symbol | null>(null);

  useEffect(() => {
    if (symbol) {
      setIsFlipped(true);
      if (prevSymbolRef.current && prevSymbolRef.current !== symbol) {
        setShouldAnimateChange(true);
        const timer = setTimeout(() => setShouldAnimateChange(false), 800);
        return () => clearTimeout(timer);
      }
    } else {
      setIsFlipped(false);
    }
    prevSymbolRef.current = symbol;
  }, [symbol]);

  return (
    <div 
      className={`w-28 h-28 md:w-36 md:h-36 perspective-1000 cursor-pointer transition-all duration-300 ${!isFlipped ? 'hover:scale-105 hover:rotate-2' : ''} ${shouldAnimateChange ? 'animate-pop' : ''}`}
      onClick={onClick}
    >
      <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d shadow-2xl rounded-3xl ${isFlipped ? 'rotate-y-180' : ''}`}>
        
        {/* Front Side */}
        <div className="absolute w-full h-full flex items-center justify-center bg-slate-800/80 border-4 border-slate-700 rounded-3xl backface-hidden shadow-inner overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent"></div>
          <span className="text-5xl font-game text-yellow-400/20 group-hover:text-yellow-400/40 transition-colors drop-shadow-sm">?</span>
          <div className="absolute top-0 right-0 p-2 opacity-10">
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          </div>
        </div>

        {/* Back Side (X or O) */}
        <div className={`absolute w-full h-full flex items-center justify-center rounded-3xl backface-hidden rotate-y-180 shadow-2xl border-4 transition-all duration-500 overflow-hidden ${symbol === 'X' ? 'bg-gradient-to-br from-blue-600 to-blue-800 border-blue-400' : 'bg-gradient-to-br from-red-600 to-red-800 border-red-400'}`}>
          <div className="absolute inset-0 bg-white/10 opacity-50 mix-blend-overlay"></div>
          <span className={`text-7xl font-game text-white drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)] select-none ${shouldAnimateChange ? 'scale-125' : 'scale-100'}`}>
            {symbol}
          </span>
          
          {/* Visual Feedback on Steal */}
          {shouldAnimateChange && (
            <div className="absolute inset-0 animate-ping bg-white/30 rounded-3xl pointer-events-none"></div>
          )}
          
          {/* Active Glow for winner detection */}
          {symbol && (
            <div className={`absolute -inset-2 blur-xl opacity-20 rounded-3xl pointer-events-none ${symbol === 'X' ? 'bg-blue-400' : 'bg-red-400'}`}></div>
          )}
        </div>
        
      </div>

      <style>{`
        @keyframes pop {
          0% { transform: scale(1); }
          50% { transform: scale(1.2) rotate(10deg); }
          100% { transform: scale(1); }
        }
        .animate-pop {
          animation: pop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
      `}</style>
    </div>
  );
};

export default Cell;
