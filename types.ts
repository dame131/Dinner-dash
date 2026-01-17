
export const GameState = {
  HOME: 'HOME',
  LEVEL_SELECT: 'LEVEL_SELECT',
  PLAYING: 'PLAYING',
  CUSTOMIZE: 'CUSTOMIZE',
};

export type GameState = keyof typeof GameState;

export const StationType = {
  PREP: 'PREP',
  STOVE: 'STOVE',
  PLATING: 'PLATING',
};

export type StationType = keyof typeof StationType;

export const ItemState = {
  RAW: 'RAW',
  PREPPED: 'PREPPED',
  COOKED: 'COOKED',
  BURNT: 'BURNT',
};

export type ItemState = keyof typeof ItemState;

export type Ingredient = {
  id: string;
  name: string;
  state: string;
  icon: string;
};

export type Order = {
  id: string;
  dishName: string;
  ingredients: string[];
  timeLeft: number;
  maxTime: number;
  reward: number;
};

export type Customer = {
  id: string;
  order: Order;
  positionX: number;
  appearance: string;
};

export type Level = {
  id: number;
  title: string;
  difficulty: string;
  targetScore: number;
  duration: number;
};

export type HomeProps = {
  onStart: () => void;
};

export type LevelSelectProps = {
  onBack: () => void;
  onLevelSelect: (level: Level) => void;
  onCustomize: () => void;
  currency: number;
};

export type KitchenProps = {
  level: Level;
  onQuit: () => void;
  onWin: (reward: number) => void;
  theme: string | null;
};

export type CustomizeProps = {
  onBack: () => void;
  onSaveTheme: (url: string) => void;
};
