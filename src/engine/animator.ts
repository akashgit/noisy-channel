// Frame animator — cycles through sprite frame arrays

export type PlayMode = 'loop' | 'once' | 'pingpong';

export interface AnimatorConfig {
  frameCount: number;
  frameDuration: number; // ticks per frame (default ~6 for ~5fps animation at 30fps tick)
  playMode?: PlayMode;
}

export interface Animator {
  currentFrame: number;
  update: (tick: number) => void;
  reset: () => void;
  isFinished: boolean;
  setPlayMode: (mode: PlayMode) => void;
  setFrameCount: (count: number) => void;
}

export function createAnimator(config: AnimatorConfig): Animator {
  let frameCount = config.frameCount;
  let frameDuration = config.frameDuration;
  let playMode: PlayMode = config.playMode ?? 'loop';
  let currentFrame = 0;
  let direction = 1; // 1 = forward, -1 = reverse (for pingpong)
  let finished = false;
  let lastFrameTick = 0;
  let started = false;

  function advance() {
    if (finished) return;

    switch (playMode) {
      case 'loop':
        currentFrame = (currentFrame + 1) % frameCount;
        break;

      case 'once':
        if (currentFrame < frameCount - 1) {
          currentFrame++;
        } else {
          finished = true;
        }
        break;

      case 'pingpong':
        currentFrame += direction;
        if (currentFrame >= frameCount - 1) {
          currentFrame = frameCount - 1;
          direction = -1;
        } else if (currentFrame <= 0) {
          currentFrame = 0;
          direction = 1;
        }
        break;
    }
  }

  return {
    get currentFrame() {
      return currentFrame;
    },

    get isFinished() {
      return finished;
    },

    update(tick: number) {
      if (!started) {
        started = true;
        lastFrameTick = tick;
        return;
      }

      if (tick - lastFrameTick >= frameDuration) {
        advance();
        lastFrameTick = tick;
      }
    },

    reset() {
      currentFrame = 0;
      direction = 1;
      finished = false;
      started = false;
      lastFrameTick = 0;
    },

    setPlayMode(mode: PlayMode) {
      playMode = mode;
      finished = false;
    },

    setFrameCount(count: number) {
      frameCount = count;
      if (currentFrame >= count) {
        currentFrame = 0;
      }
    },
  };
}
