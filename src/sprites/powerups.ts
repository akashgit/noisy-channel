// Power-up sprites — filled in by sprite-artist agent
import { SpriteFrame } from './berry.js';

export interface PowerUpDef {
  name: string;
  icon: string;
  label: string;
  frames: SpriteFrame[];
}

export const powerUpDefs: PowerUpDef[] = [];
