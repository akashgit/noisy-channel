// Character state machine — filled in by engine-dev agent
export interface StateMachineConfig<S extends string> {
  initial: S;
  transitions: Record<S, S[]>;
}

export interface StateMachine<S extends string> {
  current: S;
  transition: (to: S) => boolean;
}

export function createStateMachine<S extends string>(_config: StateMachineConfig<S>): StateMachine<S> {
  return { current: '' as S, transition: () => false };
}
