
import React, { useState, useCallback, useEffect } from 'react';
import SetupScreen from './components/SetupScreen';
import GameScreen from './components/GameScreen';
import ResultModal from './components/ResultModal';
import { Team, Question, GameState, Symbol } from './types';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('setup');
  const [teams, setTeams] = useState<Team[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [board, setBoard] = useState<(Symbol | null)[]>(Array(9).fill(null));
  const [turnIndex, setTurnIndex] = useState(0);
  const [winnerTeam, setWinnerTeam] = useState<Team | null>(null);

  const startGame = (selectedTeams: Team[], selectedQuestions: Question[]) => {
    setTeams(selectedTeams);
    setQuestions(selectedQuestions);
    setBoard(Array(9).fill(null));
    setTurnIndex(0);
    setGameState('playing');
    setWinnerTeam(null);
  };

  const checkWinner = useCallback((currentBoard: (Symbol | null)[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
      [0, 4, 8], [2, 4, 6]             // diags
    ];

    for (const [a, b, c] of lines) {
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
        return currentBoard[a];
      }
    }
    return null;
  }, []);

  const handleCellClaim = (index: number) => {
    const currentSymbol: Symbol = turnIndex % 2 === 0 ? 'X' : 'O';
    const newBoard = [...board];
    newBoard[index] = currentSymbol;
    setBoard(newBoard);

    const winningSymbol = checkWinner(newBoard);
    if (winningSymbol) {
      // Tìm đội vừa thực hiện nước đi tạo ra chuỗi 3 ô thẳng hàng
      setWinnerTeam(teams[turnIndex % teams.length]);
      setGameState('winner');
    } else {
      // Theo yêu cầu mới: Không kết thúc khi đầy 9 ô (hòa).
      // Trò chơi tiếp tục để các đội có thể "cướp" ô của nhau cho đến khi có người thắng.
      setTurnIndex(prev => prev + 1);
    }
  };

  const handleTurnMiss = () => {
    setTurnIndex(prev => prev + 1);
  };

  const resetGame = () => {
    setGameState('setup');
    setBoard(Array(9).fill(null));
    setTurnIndex(0);
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col items-center justify-center text-white">
      {gameState === 'setup' && (
        <SetupScreen onStart={startGame} />
      )}

      {(gameState === 'playing' || gameState === 'winner' || gameState === 'draw') && (
        <GameScreen 
          board={board}
          teams={teams}
          turnIndex={turnIndex}
          questions={questions}
          onCellClaim={handleCellClaim}
          onTurnMiss={handleTurnMiss}
          isGameOver={gameState !== 'playing'}
        />
      )}

      {(gameState === 'winner' || gameState === 'draw') && (
        <ResultModal 
          gameState={gameState}
          winner={winnerTeam}
          onReset={resetGame}
        />
      )}
    </div>
  );
};

export default App;
