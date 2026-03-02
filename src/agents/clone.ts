// Clone lifecycle management
import { AnimationState } from '../sprites/berry.js';

export interface CloneAgent {
  id: string;
  task: string;
  state: 'spawning' | 'working' | 'done' | 'merging';
  color: string;
  position: { x: number; y: number };
  spawnedAt: number;
  workDuration: number; // ticks until done
  ticksInState: number;
}

const CLONE_COLORS = ['#818cf8', '#34d399', '#fb923c', '#f472b6'];

const CLONE_TASKS = [
  'Reading docs',
  'Writing code',
  'Running tests',
  'Fixing bugs',
  'Reviewing PR',
  'Refactoring',
  'Deploying',
  'Optimizing',
  'Debugging',
  'Searching codebase',
  'Updating deps',
  'Writing tests',
  'Code review',
  'Linting',
  'Building assets',
  'Parsing logs',
];

let cloneIdCounter = 0;

export function getRandomTask(): string {
  return CLONE_TASKS[Math.floor(Math.random() * CLONE_TASKS.length)];
}

export function spawnClone(task: string, colorIndex: number, tick: number, slotIndex: number): CloneAgent {
  cloneIdCounter++;
  return {
    id: `clone-${cloneIdCounter}`,
    task,
    state: 'spawning',
    color: CLONE_COLORS[colorIndex % CLONE_COLORS.length],
    position: { x: 20 + slotIndex * 12, y: 0 },
    spawnedAt: tick,
    workDuration: 60 + Math.floor(Math.random() * 60), // 60-120 ticks
    ticksInState: 0,
  };
}

export function updateClone(clone: CloneAgent): CloneAgent {
  const next = { ...clone, ticksInState: clone.ticksInState + 1 };

  switch (clone.state) {
    case 'spawning':
      if (clone.ticksInState >= 15) {
        return { ...next, state: 'working', ticksInState: 0 };
      }
      return next;

    case 'working':
      if (clone.ticksInState >= clone.workDuration) {
        return { ...next, state: 'done', ticksInState: 0 };
      }
      return next;

    case 'done':
      if (clone.ticksInState >= 30) {
        return { ...next, state: 'merging', ticksInState: 0 };
      }
      return next;

    case 'merging':
      // After 15 ticks of merging, clone should be removed by caller
      return next;

    default:
      return next;
  }
}

export function isCloneFinished(clone: CloneAgent): boolean {
  return clone.state === 'merging' && clone.ticksInState >= 15;
}

export function getCloneDisplayState(clone: CloneAgent): 'idle' | 'working' | 'done' {
  switch (clone.state) {
    case 'spawning':
      return 'idle';
    case 'working':
      return 'working';
    case 'done':
    case 'merging':
      return 'done';
  }
}
