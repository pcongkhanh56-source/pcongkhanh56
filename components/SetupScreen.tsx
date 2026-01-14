
import React, { useState, useEffect } from 'react';
import { THEMES } from '../constants';
import { Team, Question } from '../types';
import { GoogleGenAI, Type } from "@google/genai";

interface SetupScreenProps {
  onStart: (teams: Team[], questions: Question[]) => void;
}

const SetupScreen: React.FC<SetupScreenProps> = ({ onStart }) => {
  const [teamCount, setTeamCount] = useState(2);
  const [teamNames, setTeamNames] = useState<string[]>(['Đội Kim Cương', 'Đội Vàng Anh', 'Đội Đại Bàng', 'Đội Cá Mập', 'Đội Sư Tử']);
  const [themeName, setThemeName] = useState('');
  const [questionCount, setQuestionCount] = useState(10);
  const [setupMode, setSetupMode] = useState<'ai' | 'manual'>('ai');
  const [isGenerating, setIsGenerating] = useState(false);
  const [regeneratingIndex, setRegeneratingIndex] = useState<number | null>(null);
  
  const [manualQuestions, setManualQuestions] = useState<Question[]>(
    Array(9).fill(null).map((_, i) => ({
      id: i,
      content: '',
      options: ['', '', '', ''],
      correctIndex: 0
    }))
  );

  // Trigger MathJax typeset when questions change in setup screen
  useEffect(() => {
    if ((window as any).MathJax && setupMode === 'manual') {
      (window as any).MathJax.typesetPromise().catch((err: any) => console.log('MathJax error:', err));
    }
  }, [manualQuestions, setupMode]);

  const generateWithAI = async () => {
    if (!themeName) {
      alert("Vui lòng nhập tên chủ đề để AI bắt đầu!");
      return;
    }
    
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Tạo danh sách ${questionCount} câu hỏi trắc nghiệm cho chủ đề: "${themeName}". 
        Yêu cầu:
        1. Nội dung đa dạng, phù hợp giáo dục học sinh.
        2. Nếu là chủ đề toán học hoặc khoa học, hãy sử dụng ký hiệu Latex như $ \\frac{a}{b} $, $ x^2 $, $ \\sqrt{x} $.
        3. Mỗi câu hỏi có đúng 4 lựa chọn (A, B, C, D).
        4. Trả về định dạng JSON là một mảng các đối tượng.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                content: { type: Type.STRING, description: "Nội dung câu hỏi" },
                options: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING },
                  description: "Mảng 4 đáp án trắc nghiệm"
                },
                correctIndex: { type: Type.INTEGER, description: "Vị trí đáp án đúng (0-3)" }
              },
              required: ["content", "options", "correctIndex"]
            }
          }
        }
      });

      const generated = JSON.parse(response.text || "[]");
      if (generated && Array.isArray(generated)) {
        const formatted = generated.map((q, i) => ({ ...q, id: i }));
        setManualQuestions(formatted);
        setSetupMode('manual');
      }
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra khi gọi AI.");
    } finally {
      setIsGenerating(false);
    }
  };

  const regenerateSingleQuestion = async (index: number) => {
    if (!themeName) {
      alert("Cần có tên chủ đề để đổi câu hỏi!");
      return;
    }
    setRegeneratingIndex(index);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Tạo 01 câu hỏi trắc nghiệm MỚI cho chủ đề: "${themeName}". 
        Câu hỏi này phải khác với câu hỏi hiện tại: "${manualQuestions[index].content}".
        Yêu cầu:
        1. Sử dụng Latex $ $ cho công thức.
        2. Có 4 đáp án.
        3. Trả về JSON duy nhất 1 đối tượng.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              content: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctIndex: { type: Type.INTEGER }
            },
            required: ["content", "options", "correctIndex"]
          }
        }
      });

      const q = JSON.parse(response.text || "{}");
      if (q && q.content) {
        const next = [...manualQuestions];
        next[index] = { ...q, id: Date.now() + index };
        setManualQuestions(next);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setRegeneratingIndex(null);
    }
  };

  const loadSample = (index: number) => {
    const sample = THEMES[index];
    setThemeName(sample.name);
    setManualQuestions(sample.questions.map((q, i) => ({ ...q, id: i })));
    setSetupMode('manual');
  };

  const addManualQuestion = () => {
    setManualQuestions([...manualQuestions, {
      id: Date.now(),
      content: '',
      options: ['', '', '', ''],
      correctIndex: 0
    }]);
  };

  const removeManualQuestion = (index: number) => {
    if (manualQuestions.length <= 9) {
      alert("Cần tối thiểu 9 câu hỏi!");
      return;
    }
    setManualQuestions(manualQuestions.filter((_, i) => i !== index));
  };

  const handleStart = () => {
    const finalTeams: Team[] = teamNames.slice(0, teamCount).map((name, i) => ({ id: i, name }));
    const validQuestions = manualQuestions.filter(q => q.content.trim() !== '');
    if (validQuestions.length < 9) {
      alert("Vui lòng nhập ít nhất 9 câu hỏi!");
      return;
    }
    onStart(finalTeams, validQuestions);
  };

  return (
    <div className="bg-slate-900/95 backdrop-blur-2xl p-6 md:p-8 rounded-[2.5rem] border-4 border-yellow-400/30 w-full max-w-6xl shadow-2xl my-4">
      <header className="text-center mb-6">
        <h1 className="text-4xl md:text-6xl font-game text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 to-yellow-500 drop-shadow-lg uppercase tracking-tight">
          CỜ CARO TRÍ TUỆ
        </h1>
        <p className="text-yellow-200/50 font-bold italic text-sm mt-1">Nền tảng học tập tương tác cho lớp học</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-4 space-y-4">
          <section className="bg-white/5 p-5 rounded-3xl border border-white/10 shadow-inner">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2 text-yellow-400">
              <span className="w-6 h-6 rounded-full bg-yellow-400 text-slate-900 flex items-center justify-center text-[10px] font-black">1</span>
              Cài đặt Chung
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-white/40 uppercase font-black block mb-1 ml-1">Tên chủ đề thi đấu</label>
                <input 
                  type="text"
                  value={themeName}
                  onChange={(e) => setThemeName(e.target.value)}
                  placeholder="Nhập tên chủ đề..."
                  className="w-full bg-slate-800 border-2 border-white/5 rounded-xl p-3 text-white font-bold focus:border-yellow-400 outline-none transition-all"
                />
              </div>
              
              <div>
                <label className="text-[10px] text-white/40 uppercase font-black block mb-1 ml-1">Số lượng đội chơi</label>
                <div className="flex gap-1 bg-slate-800 p-1 rounded-xl">
                  {[2, 3, 4, 5].map(num => (
                    <button 
                      key={num}
                      onClick={() => setTeamCount(num)}
                      className={`flex-1 py-2 rounded-lg font-black text-xs transition-all ${teamCount === num ? 'bg-yellow-400 text-slate-900 shadow-md' : 'text-white/40 hover:bg-white/5'}`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <div className="max-h-32 overflow-y-auto pr-1 custom-scrollbar space-y-2">
                {Array(teamCount).fill(0).map((_, i) => (
                  <input 
                    key={i}
                    value={teamNames[i]}
                    onChange={(e) => {
                      const next = [...teamNames];
                      next[i] = e.target.value;
                      setTeamNames(next);
                    }}
                    className="w-full bg-slate-800/50 border border-white/5 rounded-lg p-2 text-xs text-white font-medium focus:border-yellow-400/50 outline-none"
                  />
                ))}
              </div>
            </div>
          </section>

          <button 
            onClick={handleStart}
            className="w-full py-5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl font-game text-2xl text-slate-900 shadow-lg hover:scale-[1.02] active:scale-95 transition-all border-b-4 border-orange-700 uppercase"
          >
            VÀO TRÒ CHƠI
          </button>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-8 space-y-4">
          <section className="bg-white/5 p-5 rounded-3xl border border-white/10 h-full flex flex-col min-h-[450px]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2 text-yellow-400">
                <span className="w-6 h-6 rounded-full bg-yellow-400 text-slate-900 flex items-center justify-center text-[10px] font-black">2</span>
                Ngân hàng Câu hỏi
              </h2>
              <div className="flex bg-slate-800 p-1 rounded-xl">
                <button 
                  onClick={() => setSetupMode('ai')}
                  className={`px-3 py-1.5 rounded-lg font-bold text-[10px] transition-all ${setupMode === 'ai' ? 'bg-blue-600 text-white' : 'text-white/40'}`}
                >
                  DÙNG AI ✨
                </button>
                <button 
                  onClick={() => setSetupMode('manual')}
                  className={`px-3 py-1.5 rounded-lg font-bold text-[10px] transition-all ${setupMode === 'manual' ? 'bg-slate-700 text-white' : 'text-white/40'}`}
                >
                  XEM & SỬA ✍️
                </button>
              </div>
            </div>

            {setupMode === 'ai' ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-white/10 rounded-2xl">
                <div className="text-4xl mb-4">🤖</div>
                <h3 className="text-xl font-black text-white mb-2">Tạo tự động bằng AI</h3>
                <p className="text-white/50 text-xs mb-6 max-w-xs">AI sẽ soạn thảo bộ câu hỏi theo chủ đề bạn mong muốn.</p>
                
                <div className="flex items-center gap-4 mb-6 w-full max-w-xs">
                  <span className="text-[10px] font-bold text-white/40 uppercase">Số câu:</span>
                  <input 
                    type="range" min="9" max="30" 
                    value={questionCount} 
                    onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                    className="flex-1 accent-yellow-400"
                  />
                  <span className="text-yellow-400 font-black">{questionCount}</span>
                </div>

                <button 
                  onClick={generateWithAI}
                  disabled={isGenerating}
                  className={`px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white font-game rounded-xl transition-all shadow-xl flex items-center gap-3 ${isGenerating ? 'opacity-50' : ''}`}
                >
                  {isGenerating ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : null}
                  {isGenerating ? 'ĐANG SOẠN THẢO...' : 'BẮT ĐẦU TẠO CÂU HỎI'}
                </button>
              </div>
            ) : (
              <div className="flex-1 flex flex-col h-full overflow-hidden">
                <div className="flex gap-2 mb-3 shrink-0">
                  <button onClick={() => loadSample(0)} className="text-[9px] px-2 py-1 bg-slate-700 rounded-md font-bold text-white/70 hover:bg-slate-600 uppercase">Mẫu Toán</button>
                  <button onClick={() => loadSample(1)} className="text-[9px] px-2 py-1 bg-slate-700 rounded-md font-bold text-white/70 hover:bg-slate-600 uppercase">Mẫu K.Học</button>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
                  {manualQuestions.map((q, idx) => (
                    <div key={q.id || idx} className="bg-slate-800/60 p-5 rounded-2xl border border-white/5 group relative transition-all hover:bg-slate-800">
                      <div className="absolute top-3 right-3 flex gap-2">
                         <button 
                          onClick={() => regenerateSingleQuestion(idx)}
                          disabled={regeneratingIndex === idx}
                          title="AI đổi câu hỏi này"
                          className={`w-7 h-7 flex items-center justify-center bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white transition-all text-[10px] ${regeneratingIndex === idx ? 'animate-spin' : ''}`}
                        >
                          {regeneratingIndex === idx ? '◌' : '✨'}
                        </button>
                        <button 
                          onClick={() => removeManualQuestion(idx)}
                          className="w-7 h-7 flex items-center justify-center bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all text-[10px]"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="mb-4">
                        <label className="text-[9px] font-black text-yellow-400/40 uppercase mb-2 block tracking-[0.2em]">Câu hỏi {idx+1}</label>
                        <textarea 
                          placeholder="Nội dung câu hỏi (Latex)..."
                          value={q.content}
                          rows={2}
                          onChange={(e) => {
                            const next = [...manualQuestions];
                            next[idx].content = e.target.value;
                            setManualQuestions(next);
                          }}
                          className="w-full bg-slate-900/50 rounded-xl p-3 text-white font-bold text-sm outline-none border border-white/5 focus:border-yellow-400/50 resize-none mb-2"
                        />
                        {/* Preview LaTeX for Teacher */}
                        {q.content && (
                          <div className="text-xs text-blue-200/60 italic p-2 bg-blue-400/5 rounded-lg border border-blue-400/10">
                            <span className="opacity-50 text-[8px] uppercase block mb-1">Xem trước Latex:</span>
                            <div className="mathjax-preview">{q.content}</div>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {q.options.map((opt, optIdx) => (
                          <div key={optIdx} className="flex items-center gap-2">
                            <input 
                              type="radio"
                              name={`correct-setup-${idx}`}
                              checked={q.correctIndex === optIdx}
                              onChange={() => {
                                const next = [...manualQuestions];
                                next[idx].correctIndex = optIdx;
                                setManualQuestions(next);
                              }}
                              className="accent-yellow-400 w-3 h-3 cursor-pointer"
                            />
                            <input 
                              placeholder={`Đáp án ${String.fromCharCode(65+optIdx)}`}
                              value={opt}
                              onChange={(e) => {
                                const next = [...manualQuestions];
                                next[idx].options[optIdx] = e.target.value;
                                setManualQuestions(next);
                              }}
                              className={`flex-1 bg-slate-900/80 p-2.5 rounded-xl text-[11px] border transition-all ${q.correctIndex === optIdx ? 'border-yellow-400/50 text-yellow-100 shadow-sm' : 'border-white/5 text-white/50'}`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  <button 
                    onClick={addManualQuestion}
                    className="w-full py-4 border-2 border-dashed border-white/10 rounded-2xl text-white/20 hover:text-yellow-400 hover:border-yellow-400/40 transition-all font-bold text-xs uppercase tracking-widest"
                  >
                    + Thêm câu hỏi thủ công
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default SetupScreen;
