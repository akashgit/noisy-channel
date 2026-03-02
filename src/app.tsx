import React, { useReducer, useEffect, useRef, useCallback } from 'react';
import { Box, Text, useInput, useApp } from 'ink';
import { AnimationState } from './sprites/berry.js';
import { CloneAgent, spawnClone, updateClone, isCloneFinished, getRandomTask, getCloneDisplayState } from './agents/clone.js';
import { ActivePowerUp, PowerUpType, POWER_UP_TYPES, spawnPowerUp, updatePowerUp, isPowerUpAtGround, isPowerUpExpired, getRandomPowerUpType } from './components/PowerUp.js';
import { Particle, createParticleSystem } from './engine/particles.js';
import { createTickLoop } from './engine/tick.js';

// --- Theme inline (works even if theme provider isn't wired yet) ---
const BERRY_COLORS = {
  primary: '#c084fc',
  accent: '#f472b6',
  highlight: '#fbbf24',
  dimmed: '#6b5b7b',
  border: '#7c3aed',
};

const CYBER_COLORS = {
  primary: '#00ff41',
  accent: '#ff00ff',
  highlight: '#00ffff',
  dimmed: '#333333',
  border: '#00ffff',
};

type ThemeName = 'berry' | 'cyberpunk';

function getThemeColors(theme: ThemeName) {
  return theme === 'berry' ? BERRY_COLORS : CYBER_COLORS;
}

// --- Activity Log ---
export interface ActivityEntry {
  id: number;
  text: string;
  timestamp: number;
  color?: string;
}

// --- Game State ---
export interface GameState {
  berryState: AnimationState;
  clones: CloneAgent[];
  tools: string[];
  particles: Particle[];
  activityLog: ActivityEntry[];
  speechBubble: { visible: boolean; text: string } | null;
  demoRunning: boolean;
  uptimeSeconds: number;
  tick: number;
  theme: ThemeName;
  activePowerUps: ActivePowerUp[];
}

type GameAction =
  | { type: 'TICK' }
  | { type: 'SET_BERRY_STATE'; state: AnimationState }
  | { type: 'SPAWN_CLONE'; task?: string }
  | { type: 'REMOVE_CLONE'; id: string }
  | { type: 'SPAWN_POWERUP'; x?: number }
  | { type: 'COLLECT_POWERUP'; id: string }
  | { type: 'ADD_TOOL'; tool: string }
  | { type: 'SET_SPEECH'; text: string | null }
  | { type: 'TOGGLE_THEME' }
  | { type: 'LOG'; text: string; color?: string }
  | { type: 'START_DEMO' }
  | { type: 'STOP_DEMO' }
  | { type: 'INCREMENT_UPTIME' };

const MAX_CLONES = 4;
const MAX_LOG_ENTRIES = 12;

let activityIdCounter = 0;
let cloneCounter = 0;

const CLONE_COLORS = ['#818cf8', '#34d399', '#fb923c', '#f472b6'];

function addLog(state: GameState, text: string, color?: string): ActivityEntry[] {
  activityIdCounter++;
  const entry: ActivityEntry = { id: activityIdCounter, text, timestamp: state.tick, color };
  const log = [...state.activityLog, entry];
  if (log.length > MAX_LOG_ENTRIES) log.shift();
  return log;
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'TICK': {
      // Update clones
      const updatedClones: CloneAgent[] = [];
      let newLog = state.activityLog;
      const mergedClones: CloneAgent[] = [];

      for (const clone of state.clones) {
        const updated = updateClone(clone);
        if (isCloneFinished(updated)) {
          mergedClones.push(updated);
        } else {
          // Log state transitions
          if (clone.state !== updated.state) {
            if (updated.state === 'working') {
              newLog = addLog({ ...state, activityLog: newLog }, `Clone ${clone.id.split('-')[1]}: started ${clone.task}`, clone.color);
            } else if (updated.state === 'done') {
              newLog = addLog({ ...state, activityLog: newLog }, `Clone ${clone.id.split('-')[1]}: finished ${clone.task}`, '#34d399');
            } else if (updated.state === 'merging') {
              newLog = addLog({ ...state, activityLog: newLog }, `Clone ${clone.id.split('-')[1]}: merging back...`, '#fbbf24');
            }
          }
          updatedClones.push(updated);
        }
      }

      if (mergedClones.length > 0) {
        for (const c of mergedClones) {
          newLog = addLog({ ...state, activityLog: newLog }, `Clone ${c.id.split('-')[1]}: merged!`, '#c084fc');
        }
      }

      // Update power-ups
      const updatedPowerUps: ActivePowerUp[] = [];
      for (const pu of state.activePowerUps) {
        const updated = updatePowerUp(pu, state.tick);
        if (updated.collected || isPowerUpExpired(updated, state.tick)) {
          continue;
        }
        // Auto-collect when reaching ground
        if (isPowerUpAtGround(updated, state.tick) && !updated.collected) {
          newLog = addLog({ ...state, activityLog: newLog }, `Collected ${updated.type.icon} ${updated.type.label}!`, '#fbbf24');
          const newTools = state.tools.includes(updated.type.name) ? state.tools : [...state.tools, updated.type.name];
          return {
            ...state,
            tick: state.tick + 1,
            clones: updatedClones,
            activityLog: newLog,
            activePowerUps: updatedPowerUps,
            tools: newTools,
            berryState: 'celebrating',
          };
        }
        updatedPowerUps.push(updated);
      }

      return {
        ...state,
        tick: state.tick + 1,
        clones: updatedClones,
        activePowerUps: updatedPowerUps,
        activityLog: newLog,
      };
    }

    case 'SET_BERRY_STATE':
      return { ...state, berryState: action.state };

    case 'SPAWN_CLONE': {
      if (state.clones.length >= MAX_CLONES) return state;
      cloneCounter++;
      const task = action.task || getRandomTask();
      const clone = spawnClone(task, state.clones.length, state.tick, state.clones.length);
      const log = addLog(state, `Spawned clone: ${task}`, CLONE_COLORS[state.clones.length % CLONE_COLORS.length]);
      return {
        ...state,
        clones: [...state.clones, clone],
        activityLog: log,
        berryState: 'working',
      };
    }

    case 'REMOVE_CLONE': {
      return {
        ...state,
        clones: state.clones.filter(c => c.id !== action.id),
      };
    }

    case 'SPAWN_POWERUP': {
      const pu = spawnPowerUp(state.tick, action.x);
      const log = addLog(state, `Power-up appeared: ${pu.type.icon} ${pu.type.label}`, '#fbbf24');
      return {
        ...state,
        activePowerUps: [...state.activePowerUps, pu],
        activityLog: log,
      };
    }

    case 'COLLECT_POWERUP': {
      const pu = state.activePowerUps.find(p => p.id === action.id);
      if (!pu) return state;
      const newTools = state.tools.includes(pu.type.name) ? state.tools : [...state.tools, pu.type.name];
      const log = addLog(state, `Collected ${pu.type.icon} ${pu.type.label}!`, '#fbbf24');
      return {
        ...state,
        activePowerUps: state.activePowerUps.filter(p => p.id !== action.id),
        tools: newTools,
        activityLog: log,
        berryState: 'celebrating',
      };
    }

    case 'ADD_TOOL': {
      if (state.tools.includes(action.tool)) return state;
      return { ...state, tools: [...state.tools, action.tool] };
    }

    case 'SET_SPEECH': {
      if (action.text === null) {
        return { ...state, speechBubble: null };
      }
      return { ...state, speechBubble: { visible: true, text: action.text }, berryState: 'talking' };
    }

    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'berry' ? 'cyberpunk' : 'berry' };

    case 'LOG':
      return { ...state, activityLog: addLog(state, action.text, action.color) };

    case 'START_DEMO':
      return { ...state, demoRunning: true };

    case 'STOP_DEMO':
      return { ...state, demoRunning: false };

    case 'INCREMENT_UPTIME':
      return { ...state, uptimeSeconds: state.uptimeSeconds + 1 };

    default:
      return state;
  }
}

const initialState: GameState = {
  berryState: 'idle',
  clones: [],
  tools: [],
  particles: [],
  activityLog: [],
  speechBubble: null,
  demoRunning: false,
  uptimeSeconds: 0,
  tick: 0,
  theme: 'berry',
  activePowerUps: [],
};

// --- Fun speech bubble messages ---
const SPEECH_MESSAGES = [
  "Let's ship it!",
  "Time to refactor...",
  "Hmm, that's a tricky one.",
  "More clones, more power!",
  "Who needs sleep?",
  "The code is... alive.",
  "One more commit...",
  "Have you tried turning it off and on again?",
  "It works on my machine!",
  "Rubber duck says hi.",
  "rm -rf node_modules",
  "git push --force (just kidding)",
  "The tests are green!",
  "Berry reporting for duty!",
  "Compiling... please wait.",
  "Is it Friday yet?",
];

function getRandomSpeech(): string {
  return SPEECH_MESSAGES[Math.floor(Math.random() * SPEECH_MESSAGES.length)];
}

// --- Berry ASCII Art (inline fallback) ---
const BERRY_SPRITES: Record<AnimationState, string[][]> = {
  idle: [
    [
      '   .---.   ',
      '  ( o o )  ',
      '  |  >  |  ',
      '  \'-----\'  ',
      '   /| |\\   ',
      '  / | | \\  ',
    ],
    [
      '   .---.   ',
      '  ( o o )  ',
      '  |  <  |  ',
      '  \'-----\'  ',
      '   /| |\\   ',
      '  / | | \\  ',
    ],
  ],
  thinking: [
    [
      '   .---.   ',
      '  ( o o ) ?',
      '  |  ~  |  ',
      '  \'-----\'  ',
      '   /| |\\   ',
      '    | |    ',
    ],
  ],
  working: [
    [
      '   .---.   ',
      '  ( > < )  ',
      '  | === |  ',
      '  \'-----\'  ',
      '  \\| |/|   ',
      '   | |     ',
    ],
    [
      '   .---.   ',
      '  ( > < )  ',
      '  | === |  ',
      '  \'-----\'  ',
      '  |\\| |/   ',
      '   | |     ',
    ],
  ],
  celebrating: [
    [
      ' * .---. * ',
      '  \\( ^ ^ )/',
      '  |  D  |  ',
      '  \'-----\'  ',
      '   /| |\\   ',
      '  / | | \\  ',
    ],
    [
      '   .---.   ',
      '  \\( ^ ^ )/',
      '  |  D  | *',
      '  \'-----\'  ',
      '   /| |\\   ',
      '    | |    ',
    ],
  ],
  confused: [
    [
      '   .---. ? ',
      '  ( o O )  ',
      '  |  ?  |  ',
      '  \'-----\'  ',
      '   /| |\\   ',
      '    | |    ',
    ],
  ],
  talking: [
    [
      '   .---.   ',
      '  ( o o )  ',
      '  | ooo |  ',
      '  \'-----\'  ',
      '   /| |\\   ',
      '    | |    ',
    ],
    [
      '   .---.   ',
      '  ( o o )  ',
      '  | OOO |  ',
      '  \'-----\'  ',
      '   /| |\\   ',
      '    | |    ',
    ],
  ],
};

const MINI_CLONE_SPRITE = [
  ' .-. ',
  '(o.o)',
  ' |-| ',
  ' / \\ ',
];

// --- State name mapping ---
const STATE_NAMES: AnimationState[] = ['idle', 'thinking', 'working', 'celebrating', 'confused', 'talking'];

// --- Format uptime ---
function formatUptime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

// --- Demo sequence ---
interface DemoStep {
  action: (dispatch: React.Dispatch<GameAction>) => void;
  delayTicks: number; // wait this many ticks before next step
}

function createDemoSteps(): DemoStep[] {
  return [
    // Step 1: Berry idle (60 ticks / 2s)
    { action: (d) => d({ type: 'SET_BERRY_STATE', state: 'idle' }), delayTicks: 60 },
    // Step 2: Speech bubble
    { action: (d) => {
      d({ type: 'SET_SPEECH', text: "Time to get to work!" });
      d({ type: 'LOG', text: 'Berry: "Time to get to work!"', color: '#c084fc' });
    }, delayTicks: 45 },
    // Step 3: Thinking
    { action: (d) => {
      d({ type: 'SET_SPEECH', text: null });
      d({ type: 'SET_BERRY_STATE', state: 'thinking' });
      d({ type: 'LOG', text: 'Berry is thinking...', color: '#c084fc' });
    }, delayTicks: 45 },
    // Step 4: Spawn clone 1
    { action: (d) => {
      d({ type: 'SPAWN_CLONE', task: 'Reading docs' });
    }, delayTicks: 15 },
    // Step 5: Spawn clone 2
    { action: (d) => {
      d({ type: 'SPAWN_CLONE', task: 'Writing code' });
    }, delayTicks: 90 },
    // Step 6: Clones working (sparks)
    { action: (d) => {
      d({ type: 'LOG', text: 'Clones are hard at work...', color: '#34d399' });
    }, delayTicks: 60 },
    // Step 7: Power-up floats down
    { action: (d) => {
      d({ type: 'SPAWN_POWERUP', x: 30 });
    }, delayTicks: 60 },
    // Step 8: Berry collects power-up
    { action: (d) => {
      d({ type: 'SET_BERRY_STATE', state: 'celebrating' });
      d({ type: 'LOG', text: 'Berry collected a power-up!', color: '#fbbf24' });
    }, delayTicks: 30 },
    // Step 9: Clones finish
    { action: (d) => {
      d({ type: 'LOG', text: 'Clones finishing up...', color: '#34d399' });
    }, delayTicks: 45 },
    // Step 10: Berry celebrating
    { action: (d) => {
      d({ type: 'SET_BERRY_STATE', state: 'celebrating' });
      d({ type: 'LOG', text: 'Mission accomplished!', color: '#c084fc' });
    }, delayTicks: 60 },
    // Step 11: Speech bubble done
    { action: (d) => {
      d({ type: 'SET_SPEECH', text: 'All done! \u{1F389}' });
    }, delayTicks: 45 },
    // Step 12: Return to idle
    { action: (d) => {
      d({ type: 'SET_SPEECH', text: null });
      d({ type: 'SET_BERRY_STATE', state: 'idle' });
      d({ type: 'STOP_DEMO' });
      d({ type: 'LOG', text: 'Demo complete. Press d to replay!', color: '#6b5b7b' });
    }, delayTicks: 0 },
  ];
}

// --- App Component ---

export interface AppProps {
  demoAutoStart?: boolean;
}

export function App({ demoAutoStart = false }: AppProps) {
  const { exit } = useApp();
  const isTTY = Boolean(process.stdin.isTTY);
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const uptimeRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const demoRef = useRef<{ stepIndex: number; ticksWaited: number; steps: DemoStep[] } | null>(null);
  const frameRef = useRef(0);

  // Tick loop at 30fps
  useEffect(() => {
    tickRef.current = setInterval(() => {
      dispatch({ type: 'TICK' });
      frameRef.current++;

      // Run demo steps if demo is active
      if (demoRef.current) {
        const demo = demoRef.current;
        demo.ticksWaited++;
        if (demo.stepIndex < demo.steps.length) {
          const step = demo.steps[demo.stepIndex];
          if (demo.ticksWaited >= step.delayTicks) {
            step.action(dispatch);
            demo.stepIndex++;
            demo.ticksWaited = 0;
            if (demo.stepIndex >= demo.steps.length) {
              demoRef.current = null;
            }
          }
        }
      }
    }, 1000 / 30);

    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, []);

  // Uptime counter
  useEffect(() => {
    uptimeRef.current = setInterval(() => {
      dispatch({ type: 'INCREMENT_UPTIME' });
    }, 1000);
    return () => {
      if (uptimeRef.current) clearInterval(uptimeRef.current);
    };
  }, []);

  // Auto-start demo
  useEffect(() => {
    if (demoAutoStart) {
      startDemo();
    }
  }, []);

  const startDemo = useCallback(() => {
    dispatch({ type: 'START_DEMO' });
    dispatch({ type: 'LOG', text: 'Starting demo sequence...', color: '#c084fc' });
    demoRef.current = {
      stepIndex: 0,
      ticksWaited: 0,
      steps: createDemoSteps(),
    };
    // Fire the first step immediately
    const firstStep = demoRef.current.steps[0];
    firstStep.action(dispatch);
    demoRef.current.stepIndex = 1;
    demoRef.current.ticksWaited = 0;
  }, []);

  // Keyboard input (only when TTY supports raw mode)
  useInput((input, key) => {
    switch (input) {
      case 't':
        dispatch({ type: 'TOGGLE_THEME' });
        dispatch({ type: 'LOG', text: `Theme: ${state.theme === 'berry' ? 'cyberpunk' : 'berry'}` });
        break;
      case 'd':
        if (!state.demoRunning) startDemo();
        break;
      case 'c':
        if (state.clones.length < MAX_CLONES) {
          dispatch({ type: 'SPAWN_CLONE' });
        } else {
          dispatch({ type: 'LOG', text: 'Max clones reached! (4/4)', color: '#fb923c' });
        }
        break;
      case 'p':
        dispatch({ type: 'SPAWN_POWERUP' });
        break;
      case 's': {
        if (state.speechBubble) {
          dispatch({ type: 'SET_SPEECH', text: null });
          dispatch({ type: 'SET_BERRY_STATE', state: 'idle' });
        } else {
          dispatch({ type: 'SET_SPEECH', text: getRandomSpeech() });
        }
        break;
      }
      case 'q':
        exit();
        break;
      case '1':
        dispatch({ type: 'SET_BERRY_STATE', state: 'idle' });
        dispatch({ type: 'LOG', text: 'State: idle' });
        break;
      case '2':
        dispatch({ type: 'SET_BERRY_STATE', state: 'thinking' });
        dispatch({ type: 'LOG', text: 'State: thinking' });
        break;
      case '3':
        dispatch({ type: 'SET_BERRY_STATE', state: 'working' });
        dispatch({ type: 'LOG', text: 'State: working' });
        break;
      case '4':
        dispatch({ type: 'SET_BERRY_STATE', state: 'celebrating' });
        dispatch({ type: 'LOG', text: 'State: celebrating' });
        break;
      case '5':
        dispatch({ type: 'SET_BERRY_STATE', state: 'confused' });
        dispatch({ type: 'LOG', text: 'State: confused' });
        break;
      case '6':
        dispatch({ type: 'SET_BERRY_STATE', state: 'talking' });
        dispatch({ type: 'LOG', text: 'State: talking' });
        break;
    }
  }, { isActive: isTTY });

  const colors = getThemeColors(state.theme);
  const spriteFrames = BERRY_SPRITES[state.berryState] || BERRY_SPRITES.idle;
  const currentFrame = spriteFrames[Math.floor(frameRef.current / 8) % spriteFrames.length];

  return (
    <Box flexDirection="column" paddingX={1}>
      {/* Status Bar */}
      <Box borderStyle="single" borderColor={colors.border} paddingX={1} justifyContent="space-between">
        <Text color={colors.primary} bold>
          {'\u{1FAD0}'} Berry TUI v0.1
        </Text>
        <Text color={colors.dimmed}>
          {state.berryState.toUpperCase()} | Clones: {state.clones.length}/{MAX_CLONES} | Tools: {state.tools.length}/6 | Tick: {state.tick}
        </Text>
        <Text color={colors.accent}>
          {'\u{23F1}'} {formatUptime(state.uptimeSeconds)}
          {state.demoRunning ? ' [DEMO]' : ''}
        </Text>
      </Box>

      {/* Main Scene */}
      <Box borderStyle="single" borderColor={colors.border} height={16} flexDirection="row">
        {/* Left: Character + Clones + Power-ups area */}
        <Box flexDirection="column" width="60%">
          {/* Speech Bubble */}
          {state.speechBubble && state.speechBubble.visible && (
            <Box marginLeft={2} marginBottom={0}>
              <Text color={colors.primary}>
                {'\u250C'}{'\u2500'.repeat(state.speechBubble.text.length + 2)}{'\u2510'}
              </Text>
            </Box>
          )}
          {state.speechBubble && state.speechBubble.visible && (
            <Box marginLeft={2}>
              <Text color={colors.primary}>
                {'\u2502'} {state.speechBubble.text} {'\u2502'}
              </Text>
            </Box>
          )}
          {state.speechBubble && state.speechBubble.visible && (
            <Box marginLeft={2}>
              <Text color={colors.primary}>
                {'\u2514'}{'\u2500'}{'\u256E'}{' '.repeat(state.speechBubble.text.length)}{'\u2518'}
              </Text>
            </Box>
          )}

          {/* Berry + Clones row */}
          <Box flexDirection="row" marginTop={state.speechBubble ? 0 : 2}>
            {/* Berry */}
            <Box flexDirection="column" marginLeft={2}>
              {currentFrame.map((line, i) => (
                <Text key={i} color={colors.primary}>{line}</Text>
              ))}
              <Text color={colors.dimmed} dimColor> Berry</Text>
            </Box>

            {/* Clones */}
            {state.clones.map((clone, idx) => (
              <Box key={clone.id} flexDirection="column" marginLeft={3}>
                {MINI_CLONE_SPRITE.map((line, i) => (
                  <Text key={i} color={clone.color}>
                    {clone.state === 'spawning' ? (i < clone.ticksInState / 4 ? line : '') : line}
                  </Text>
                ))}
                <Text color={clone.color} dimColor>
                  {clone.state === 'merging' ? 'merge' : clone.state === 'done' ? 'done!' : clone.task.slice(0, 8)}
                </Text>
                <Text color={colors.dimmed} dimColor>
                  [{clone.state}]
                </Text>
              </Box>
            ))}

            {/* Floating power-ups */}
            {state.activePowerUps.map((pu) => (
              <Box key={pu.id} flexDirection="column" marginLeft={2}>
                <Box marginTop={Math.min(pu.position.y, 6)}>
                  <Text>{pu.type.icon}</Text>
                </Box>
                <Text dimColor color={colors.highlight}>
                  {pu.type.label}
                </Text>
              </Box>
            ))}
          </Box>

          {/* Ground */}
          <Box marginTop={0}>
            <Text color={colors.dimmed}>
              {'~'.repeat(50)}
            </Text>
          </Box>
        </Box>

        {/* Right: Activity Feed */}
        <Box flexDirection="column" width="40%" borderLeft borderStyle="single" borderColor={colors.border} paddingX={1}>
          <Text color={colors.accent} bold underline>Activity</Text>
          {state.activityLog.slice(-10).map((entry) => (
            <Text key={entry.id} color={entry.color || colors.dimmed} wrap="truncate">
              {entry.text}
            </Text>
          ))}
          {state.activityLog.length === 0 && (
            <Text color={colors.dimmed} dimColor>No activity yet...</Text>
          )}
        </Box>
      </Box>

      {/* Tool Inventory */}
      <Box paddingX={1} marginTop={0}>
        <Text color={colors.dimmed}>Tools: </Text>
        {state.tools.length === 0 && <Text color={colors.dimmed} dimColor>none yet</Text>}
        {state.tools.map((tool, i) => {
          const puType = POWER_UP_TYPES.find(p => p.name === tool);
          return (
            <Text key={tool} color={colors.highlight}>
              {puType ? puType.icon : '\u{2728}'} {puType ? puType.label : tool}
              {i < state.tools.length - 1 ? '  ' : ''}
            </Text>
          );
        })}
      </Box>

      {/* Controls Bar */}
      <Box borderStyle="single" borderColor={colors.border} paddingX={1} justifyContent="space-between">
        <Text color={colors.dimmed}>
          <Text color={colors.accent} bold>[t]</Text>heme{' '}
          <Text color={colors.accent} bold>[d]</Text>emo{' '}
          <Text color={colors.accent} bold>[c]</Text>lone{' '}
          <Text color={colors.accent} bold>[p]</Text>ower-up{' '}
          <Text color={colors.accent} bold>[s]</Text>peech{' '}
          <Text color={colors.accent} bold>[1-6]</Text> state{' '}
          <Text color={colors.accent} bold>[q]</Text>uit
        </Text>
        <Text color={colors.primary}>
          {state.theme === 'berry' ? '\u{1FAD0}' : '\u{1F916}'} {state.theme}
        </Text>
      </Box>
    </Box>
  );
}
