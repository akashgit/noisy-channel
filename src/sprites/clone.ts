// Clone sprite frames — mini Berry, ~3 lines tall
import { SpriteFrame } from './berry.js';

export type CloneState = 'idle' | 'working' | 'done';

export type CloneSpriteSheet = Record<CloneState, SpriteFrame[]>;

// ============================================================
// Mini Berry clones — smaller, rounder, simpler
// Only 3 lines tall, minimal detail
// ============================================================

const CLONE_W = 7;
const CLONE_H = 3;

function pad(line: string, width: number): string {
  const visible = line.replace(/\x1b\[[0-9;]*m/g, '');
  if (visible.length >= width) return line;
  return line + ' '.repeat(width - visible.length);
}

function cloneFrame(lines: string[]): SpriteFrame {
  const padded = lines.map(l => pad(l, CLONE_W));
  while (padded.length < CLONE_H) padded.push(' '.repeat(CLONE_W));
  return { lines: padded, width: CLONE_W, height: CLONE_H };
}

// ============================================================
// IDLE — tiny bob, eyes blink
// ============================================================
const idle: SpriteFrame[] = [
  cloneFrame([
    ' ╭─╮  ',
    ' │·│  ',
    ' ╰┬╯  ',
  ]),
  cloneFrame([
    ' ╭─╮  ',
    ' │-│  ',
    ' ╰┬╯  ',
  ]),
];

// ============================================================
// WORKING — action indicators
// ============================================================
const working: SpriteFrame[] = [
  cloneFrame([
    ' ╭─╮∗ ',
    ' │●│╱ ',
    ' ╰┬╯  ',
  ]),
  cloneFrame([
    '∗╭─╮  ',
    ' ╲│●│ ',
    '  ╰┬╯ ',
  ]),
];

// ============================================================
// DONE — checkmark, happy face
// ============================================================
const done: SpriteFrame[] = [
  cloneFrame([
    ' ╭─╮✓ ',
    ' │◕│  ',
    ' ╰┬╯  ',
  ]),
  cloneFrame([
    ' ╭─╮★ ',
    ' │◕│  ',
    ' ╰┬╯  ',
  ]),
];

export const cloneSprites: CloneSpriteSheet = {
  idle,
  working,
  done,
};

/**
 * Returns a label indicating the clone variant index.
 * Useful for assigning color tints from the theme's clone.tints array.
 */
export function tintClone(frames: SpriteFrame[], colorIndex: number): { frames: SpriteFrame[]; colorIndex: number } {
  return { frames, colorIndex };
}
