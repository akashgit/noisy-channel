// Character state machine with auto-transitions and callbacks

export type CharacterState = 'idle' | 'thinking' | 'working' | 'celebrating' | 'confused' | 'talking';

export interface StateCallbacks {
  onEnter?: () => void;
  onExit?: () => void;
}

export interface StateMachineConfig<S extends string> {
  initial: S;
  transitions: Record<S, S[]>;
  autoTransitions?: Partial<Record<S, { to: S; afterTicks: number }>>;
  callbacks?: Partial<Record<S, StateCallbacks>>;
}

export interface StateMachine<S extends string> {
  current: S;
  transition: (to: S) => boolean;
  update: (tick: number) => void;
  onStateChange: (cb: (from: S, to: S) => void) => () => void;
}

export function createStateMachine<S extends string>(config: StateMachineConfig<S>): StateMachine<S> {
  let current = config.initial;
  let stateEnteredAtTick = 0;
  const changeListeners = new Set<(from: S, to: S) => void>();

  // Fire onEnter for initial state
  config.callbacks?.[current]?.onEnter?.();

  function transition(to: S, tick?: number): boolean {
    if (to === current) return false;

    const allowed = config.transitions[current];
    if (!allowed || !allowed.includes(to)) return false;

    const from = current;
    config.callbacks?.[from]?.onExit?.();

    current = to;
    stateEnteredAtTick = tick ?? 0;

    config.callbacks?.[to]?.onEnter?.();

    for (const cb of changeListeners) {
      cb(from, to);
    }

    return true;
  }

  return {
    get current() {
      return current;
    },

    transition(to: S) {
      return transition(to);
    },

    update(tick: number) {
      const auto = config.autoTransitions?.[current];
      if (auto && tick - stateEnteredAtTick >= auto.afterTicks) {
        transition(auto.to, tick);
      }
    },

    onStateChange(cb: (from: S, to: S) => void) {
      changeListeners.add(cb);
      return () => {
        changeListeners.delete(cb);
      };
    },
  };
}

// Convenience: default Berry state machine config
export function createBerryStateMachine(callbacks?: Partial<Record<CharacterState, StateCallbacks>>): StateMachine<CharacterState> {
  return createStateMachine<CharacterState>({
    initial: 'idle',
    transitions: {
      idle: ['thinking', 'working', 'celebrating', 'confused', 'talking'],
      thinking: ['idle', 'working', 'confused'],
      working: ['idle', 'celebrating', 'confused', 'thinking'],
      celebrating: ['idle'],
      confused: ['idle', 'thinking'],
      talking: ['idle', 'thinking', 'working'],
    },
    autoTransitions: {
      celebrating: { to: 'idle', afterTicks: 90 },   // ~3s at 30fps
      thinking: { to: 'idle', afterTicks: 60 },       // ~2s at 30fps
      confused: { to: 'idle', afterTicks: 75 },        // ~2.5s at 30fps
      talking: { to: 'idle', afterTicks: 120 },        // ~4s at 30fps
    },
    callbacks,
  });
}
