
export interface GameState {
  story: string;
  image: string;
  choices: string[];
  inventory: string[];
  quest: string;
}

export interface StoryTurn {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export interface GeminiResponse {
  story: string;
  choices: string[];
  inventory: string[];
  quest: string;
  imagePrompt: string;
}
