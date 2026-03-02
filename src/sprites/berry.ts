// Berry sprite frames — filled in by sprite-artist agent
export type AnimationState = 'idle' | 'thinking' | 'working' | 'celebrating' | 'confused' | 'talking';

export interface SpriteFrame {
  lines: string[];
  width: number;
  height: number;
}

export type SpriteSheet = Record<AnimationState, SpriteFrame[]>;

// Placeholder — sprite-artist will create the real sprites
export const berrySprites: SpriteSheet = {
  idle: [],
  thinking: [],
  working: [],
  celebrating: [],
  confused: [],
  talking: [],
};
