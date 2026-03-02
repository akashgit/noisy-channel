// Game tick loop — 30fps setInterval-based engine

export interface TickState {
  tick: number;
  deltaMs: number;
  fps: number;
}

export type TickCallback = (state: TickState) => void;

export interface TickLoop {
  start: () => void;
  stop: () => void;
  subscribe: (cb: TickCallback) => () => void;
  isRunning: () => boolean;
}

export function createTickLoop(targetFps: number = 30): TickLoop {
  const intervalMs = Math.floor(1000 / targetFps);
  let timer: ReturnType<typeof setInterval> | null = null;
  let tick = 0;
  let lastTime = 0;
  const subscribers = new Set<TickCallback>();

  function onTick() {
    const now = Date.now();
    const deltaMs = lastTime === 0 ? intervalMs : now - lastTime;
    const fps = deltaMs > 0 ? Math.round(1000 / deltaMs) : targetFps;
    lastTime = now;

    const state: TickState = { tick, deltaMs, fps };

    for (const cb of subscribers) {
      cb(state);
    }

    tick++;
  }

  return {
    start() {
      if (timer !== null) return;
      lastTime = 0;
      tick = 0;
      timer = setInterval(onTick, intervalMs);
    },

    stop() {
      if (timer !== null) {
        clearInterval(timer);
        timer = null;
      }
    },

    subscribe(cb: TickCallback) {
      subscribers.add(cb);
      return () => {
        subscribers.delete(cb);
      };
    },

    isRunning() {
      return timer !== null;
    },
  };
}
