
import React, { useState, useEffect, useMemo } from 'react';
import { Team, Question, Symbol } from '../types';
import Cell from './Cell';
import QuizModal from './QuizModal';

interface GameScreenProps {
  board: (Symbol | null)[];
  teams: Team[];
  turnIndex: number;
  questions: Question[];
  onCellClaim: (index: number) => void;
  onTurnMiss: () => void;
  isGameOver: boolean;
}

const GameScreen: React.FC<GameScreenProps> = ({ 
  board, teams, turnIndex, questions, onCellClaim, onTurnMiss, isGameOver 
}) => {
  const [selectedCellIndex, setSelectedCellIndex] = useState<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  
  const currentTeam = teams[turnIndex % teams.length];
  const currentSymbol: Symbol = turnIndex % 2 === 0 ? 'X' : 'O';

  // Pool câu hỏi chưa dùng (nếu hết thì reset pool)
  const [questionPool, setQuestionPool] = useState<Question[]>([]);

  useEffect(() => {
    setQuestionPool([...questions]);
  }, [questions]);

  const handleCellClick = (index: number) => {
    if (isGameOver) return;
    
    // Lấy câu hỏi ngẫu nhiên từ pool
    let pool = questionPool.length > 0 ? [...questionPool] : [...questions];
    const randomIndex = Math.floor(Math.random() * pool.length);
    const question = pool[randomIndex];
    
    // Cập nhật pool
    const newPool = pool.filter((_, i) => i !== randomIndex);
    setQuestionPool(newPool.length > 0 ? newPool : [...questions]);
    
    setCurrentQuestion(question);
    setSelectedCellIndex(index);
  };

  const handleQuizResult = (correct: boolean) => {
    const cellIdx = selectedCellIndex!;
    setSelectedCellIndex(null);
    setCurrentQuestion(null);

    if (correct) {
      onCellClaim(cellIdx);
      try { new Audio('https://www.soundjay.com/buttons/sounds/button-3.mp3').play(); } catch(e) {}
    } else {
      onTurnMiss();
      try { new Audio('https://www.soundjay.com/buttons/sounds/button-10.mp3').play(); } catch(e) {}
    }
  };

  const isStealAttempt = selectedCellIndex !== null && board[selectedCellIndex] !== null && board[selectedCellIndex] !== currentSymbol;

  return (
    <div className="flex flex-col items-center w-full max-w-4xl px-4 animate-in fade-in zoom-in duration-500">
      {/* Turn Indicator */}
      <div className={`mb-8 p-6 rounded-3xl border-4 transition-all duration-500 w-full flex justify-between items-center shadow-2xl relative overflow-hidden ${currentSymbol === 'X' ? 'bg-blue-600/90 border-blue-400' : 'bg-red-600/90 border-red-400'}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent pointer-events-none"></div>
        
        <div className="relative z-10">
          <p className="text-xs uppercase tracking-[0.3em] font-black text-white/60 mb-1">Lượt thi đấu</p>
          <h2 className="text-5xl font-game text-yellow-300 drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]">{currentTeam.name}</h2>
          <div className="flex items-center gap-2 mt-2">
            <span className="w-3 h-3 rounded-full bg-green-400 animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.5)]"></span>
            <p className="text-sm font-bold text-white/80 italic">Đang nắm giữ {currentSymbol}</p>
          </div>
        </div>

        <div className="relative z-10 flex flex-col items-center bg-black/20 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-game text-5xl shadow-2xl transform transition-transform hover:scale-110 ${currentSymbol === 'X' ? 'text-blue-200' : 'text-red-200'}`}>
            {currentSymbol}
          </div>
        </div>
      </div>

      {/* The 3x3 Grid */}
      <div className="grid grid-cols-3 gap-4 p-8 bg-slate-900/60 backdrop-blur-xl rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.4)] border-2 border-white/10">
        {board.map((symbol, idx) => (
          <Cell 
            key={idx} 
            symbol={symbol} 
            onClick={() => handleCellClick(idx)}
          />
        ))}
      </div>

      {/* Bottom Status Panel */}
      <div className="mt-10 w-full bg-white/5 p-6 rounded-[2rem] border border-white/10">
        <div className="flex flex-wrap justify-center gap-4">
          {teams.map((team, idx) => {
            const isActive = idx === turnIndex % teams.length;
            const teamSymbol = idx % 2 === 0 ? 'X' : 'O';
            return (
              <div 
                key={team.id}
                className={`px-6 py-3 rounded-2xl text-sm font-bold border-2 transition-all duration-300 flex items-center gap-3 ${isActive ? 'bg-yellow-400 text-slate-900 border-white scale-110 shadow-xl ring-4 ring-yellow-400/20' : 'bg-slate-800 text-white/40 border-white/5 opacity-60'}`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-game ${teamSymbol === 'X' ? 'bg-blue-600' : 'bg-red-600'} text-white`}>
                  {teamSymbol}
                </div>
                <span>{team.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      {selectedCellIndex !== null && currentQuestion && (
        <QuizModal 
          question={currentQuestion} 
          onResult={handleQuizResult}
          isSteal={isStealAttempt}
        />
      )}
    </div>
  );
};

export default GameScreen;
