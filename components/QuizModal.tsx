
import React, { useState, useEffect } from 'react';
import { Question } from '../types';

interface QuizModalProps {
  question: Question;
  onResult: (correct: boolean) => void;
  isSteal?: boolean;
}

const QuizModal: React.FC<QuizModalProps> = ({ question, onResult, isSteal }) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45);

  useEffect(() => {
    if ((window as any).MathJax) {
      (window as any).MathJax.typesetPromise().catch((err: any) => console.log('MathJax error:', err));
    }
  }, [question]);

  // Bộ đếm thời gian
  useEffect(() => {
    if (isAnswered) return;

    if (timeLeft <= 0) {
      setIsAnswered(true);
      // Khi hết giờ, tính là sai
      const timer = setTimeout(() => {
        onResult(false);
      }, 1500);
      return () => clearTimeout(timer);
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, isAnswered, onResult]);

  const handleOptionClick = (idx: number) => {
    if (isAnswered) return;
    setSelectedIdx(idx);
    setIsAnswered(true);
    
    setTimeout(() => {
      onResult(idx === question.correctIndex);
    }, 1800);
  };

  const progressWidth = (timeLeft / 45) * 100;
  const isTimeCritical = timeLeft <= 10;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className={`relative bg-slate-900 text-white rounded-[3rem] p-6 md:p-10 max-w-4xl w-full max-h-[95vh] overflow-y-auto custom-scrollbar shadow-2xl border-[10px] flex flex-col items-center transform transition-all animate-in zoom-in slide-in-from-bottom-10 duration-500 ${isSteal ? 'border-red-600' : 'border-yellow-400'}`}>
        
        {/* Timer Bar */}
        <div className="absolute top-0 left-0 w-full h-3 bg-white/5 overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ease-linear ${isTimeCritical ? 'bg-red-500 animate-pulse' : 'bg-blue-500'}`}
            style={{ width: `${progressWidth}%` }}
          ></div>
        </div>

        {/* Banner for Stealing */}
        {isSteal && (
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-red-600 text-white px-8 py-3 rounded-full font-game text-xl shadow-lg animate-bounce border-2 border-white uppercase tracking-tighter z-20">
            🔥 Đang cướp ô!
          </div>
        )}

        {/* Timer Display */}
        <div className={`absolute top-6 right-10 flex flex-col items-center transition-transform ${isTimeCritical ? 'scale-125' : 'scale-100'}`}>
          <span className={`text-4xl font-game leading-none ${isTimeCritical ? 'text-red-500' : 'text-blue-400'}`}>
            {timeLeft}
          </span>
          <span className="text-[10px] uppercase font-black opacity-40">Giây</span>
        </div>

        <div className="w-full text-center flex flex-col items-center gap-6 mt-4">
          {/* Header */}
          <div className="inline-block px-8 py-2 rounded-full bg-white/5 text-yellow-400 font-black text-sm uppercase tracking-[0.2em] border border-white/10">
            Câu hỏi thử thách
          </div>

          {/* Question Text */}
          <div className="min-h-[100px] flex items-center justify-center w-full px-2">
            <h3 className="text-2xl md:text-3xl font-quiz font-bold leading-tight text-white drop-shadow-md">
              {question.content}
            </h3>
          </div>

          {/* Answers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl mt-2">
            {question.options.map((option, idx) => {
              let bgColor = 'bg-slate-800 hover:bg-slate-700 border-slate-700';
              let labelColor = 'bg-slate-700 text-slate-400';
              let textColor = 'text-white';
              
              if (isAnswered) {
                if (idx === question.correctIndex) {
                  bgColor = 'bg-green-600 border-green-400 shadow-[0_0_20px_rgba(34,197,94,0.4)] scale-[1.02] z-10';
                  labelColor = 'bg-green-200 text-green-900';
                } else if (idx === selectedIdx) {
                  bgColor = 'bg-red-600 border-red-400 shadow-[0_0_20px_rgba(239,68,68,0.4)]';
                  labelColor = 'bg-red-200 text-red-900';
                } else {
                  bgColor = 'bg-slate-900 opacity-20 border-slate-900';
                  labelColor = 'bg-slate-950 text-slate-800';
                  textColor = 'text-white/20';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionClick(idx)}
                  disabled={isAnswered}
                  className={`group p-4 rounded-2xl text-left font-quiz font-bold transition-all border-b-8 flex items-center gap-4 ${bgColor} ${!isAnswered ? 'active:translate-y-1 active:border-b-0 hover:-translate-y-1' : ''}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-game text-xl transition-colors shadow-inner ${labelColor}`}>
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span className={`text-xl md:text-2xl leading-snug ${textColor}`}>{option}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback Message */}
        {isAnswered && (
          <div className="mt-8 text-center">
            <div className={`text-3xl md:text-4xl font-game animate-bounce drop-shadow-md ${selectedIdx === question.correctIndex && timeLeft > 0 ? 'text-green-400' : 'text-red-500'}`}>
              {timeLeft <= 0 
                ? 'HẾT GIỜ RỒI! ⏰' 
                : selectedIdx === question.correctIndex 
                  ? 'CHÍNH XÁC! 🎊' 
                  : 'CHƯA ĐÚNG! 🧊'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizModal;
