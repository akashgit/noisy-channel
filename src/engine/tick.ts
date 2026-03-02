// Game tick loop — filled in by engine-dev agent
export interface TickState {
  tick: number;
  deltaMs: number;
  fps: number;
}

export type TickCallback = (state: TickState) => void;

// Placeholder
export function createTickLoop(_fps: number, _callback: TickCallback): { start: () => void; stop: () => void } {
  return { start: () => {}, stop: () => {} };
}
