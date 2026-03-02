// Clone sprite frames — filled in by sprite-artist agent
import { SpriteFrame } from './berry.js';

export type CloneState = 'idle' | 'working' | 'done';

export type CloneSpriteSheet = Record<CloneState, SpriteFrame[]>;

export const cloneSprites: CloneSpriteSheet = {
  idle: [],
  working: [],
  done: [],
};
