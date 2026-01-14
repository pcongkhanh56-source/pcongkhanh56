
export type Symbol = 'X' | 'O';

export interface Question {
  id: number;
  content: string;
  options: string[];
  correctIndex: number;
}

export interface Team {
  id: number;
  name: string;
}

export type GameState = 'setup' | 'playing' | 'winner' | 'draw';

export interface Theme {
  name: string;
  questions: Question[];
}
