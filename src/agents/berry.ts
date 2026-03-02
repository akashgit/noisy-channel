// Berry protagonist state management
import { AnimationState } from '../sprites/berry.js';
import { CloneAgent, spawnClone, updateClone, isCloneFinished, getRandomTask } from './clone.js';

export const MAX_CLONES = 4;

export interface BerryState {
  animationState: AnimationState;
  position: { x: number; y: number };
  clones: CloneAgent[];
  tools: string[];
  tick: number;
}

export interface BerryAgent {
  state: BerryState;
  spawnClone: (task?: string) => CloneAgent | null;
  collectTool: (tool: string) => void;
  setState: (state: AnimationState) => void;
  update: () => void;
  getState: () => BerryState;
}

export function createBerryAgent(): BerryAgent {
  const state: BerryState = {
    animationState: 'idle',
    position: { x: 2, y: 0 },
    clones: [],
    tools: [],
    tick: 0,
  };

  function doSpawnClone(task?: string): CloneAgent | null {
    if (state.clones.length >= MAX_CLONES) return null;

    const cloneTask = task || getRandomTask();
    const colorIndex = state.clones.length;
    const slotIndex = state.clones.length;
    const clone = spawnClone(cloneTask, colorIndex, state.tick, slotIndex);
    state.clones.push(clone);

    // Berry goes into working state briefly when spawning a clone
    state.animationState = 'working';

    return clone;
  }

  function collectTool(tool: string): void {
    if (!state.tools.includes(tool)) {
      state.tools.push(tool);
      // Brief celebration when collecting
      state.animationState = 'celebrating';
    }
  }

  function setState(animState: AnimationState): void {
    state.animationState = animState;
  }

  function update(): void {
    state.tick++;
    // Update all clones
    state.clones = state.clones
      .map(clone => updateClone(clone))
      .filter(clone => !isCloneFinished(clone));
  }

  function getState(): BerryState {
    return { ...state, clones: [...state.clones] };
  }

  return {
    state,
    spawnClone: doSpawnClone,
    collectTool,
    setState,
    update,
    getState,
  };
}
