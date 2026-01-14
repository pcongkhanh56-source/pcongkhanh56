
import React from 'react';
import { Team, GameState } from '../types';

interface ResultModalProps {
  gameState: GameState;
  winner: Team | null;
  onReset: () => void;
}

const ResultModal: React.FC<ResultModalProps> = ({ gameState, winner, onReset }) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-purple-900/90 backdrop-blur-md animate-in fade-in duration-500">
      <div className="text-center transform animate-in zoom-in duration-700">
        <div className="mb-8">
          {gameState === 'winner' ? (
            <>
              <div className="text-8xl mb-4">🏆</div>
              <h2 className="text-6xl font-game text-yellow-300 drop-shadow-xl mb-2">CHIẾN THẮNG!</h2>
              <p className="text-3xl font-bold text-white uppercase tracking-widest">
                CHÚC MỪNG {winner?.name}
              </p>
            </>
          ) : (
            <>
              <div className="text-8xl mb-4">🤝</div>
              <h2 className="text-6xl font-game text-blue-300 drop-shadow-xl mb-2">HÒA NHAU!</h2>
              <p className="text-3xl font-bold text-white uppercase tracking-widest">
                CẢ HAI ĐỀU RẤT GIỎI
              </p>
            </>
          )}
        </div>

        <button 
          onClick={onReset}
          className="px-12 py-5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full font-game text-2xl text-purple-900 shadow-2xl hover:scale-110 active:scale-95 transition-all"
        >
          CHƠI LẠI TỪ ĐẦU
        </button>
      </div>

      {/* Confetti-like effect using simple CSS */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
        }
        .confetti {
          position: absolute;
          width: 10px;
          height: 10px;
          background: yellow;
          animation: float 3s linear infinite;
          pointer-events: none;
        }
      `}</style>
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {Array(20).fill(0).map((_, i) => (
          <div 
            key={i} 
            className="confetti" 
            style={{
              left: `${Math.random() * 100}%`,
              bottom: '-20px',
              animationDelay: `${Math.random() * 3}s`,
              backgroundColor: ['#fbbf24', '#f87171', '#60a5fa', '#34d399'][i % 4]
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ResultModal;
