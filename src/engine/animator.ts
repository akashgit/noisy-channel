// Frame animator — filled in by engine-dev agent
export interface AnimatorConfig {
  frameCount: number;
  frameDuration: number; // ticks per frame
}

export interface Animator {
  currentFrame: number;
  update: (tick: number) => void;
}

export function createAnimator(_config: AnimatorConfig): Animator {
  return { currentFrame: 0, update: () => {} };
}
