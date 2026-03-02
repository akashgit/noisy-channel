// PowerUp component and manager
import React from 'react';
import { Box, Text } from 'ink';

export interface PowerUpType {
  name: string;
  icon: string;
  label: string;
}

export const POWER_UP_TYPES: PowerUpType[] = [
  { name: 'read', icon: '\u{1F4D6}', label: 'Read' },
  { name: 'edit', icon: '\u{270F}\u{FE0F}', label: 'Edit' },
  { name: 'search', icon: '\u{1F50D}', label: 'Search' },
  { name: 'bash', icon: '\u{1F4BB}', label: 'Bash' },
  { name: 'web', icon: '\u{1F310}', label: 'Web' },
  { name: 'write', icon: '\u{270D}\u{FE0F}', label: 'Write' },
];

export interface ActivePowerUp {
  id: string;
  type: PowerUpType;
  position: { x: number; y: number };
  spawnTick: number;
  floatDuration: number; // ticks to float down
  collected: boolean;
}

let powerUpIdCounter = 0;

export function getRandomPowerUpType(): PowerUpType {
  return POWER_UP_TYPES[Math.floor(Math.random() * POWER_UP_TYPES.length)];
}

export function spawnPowerUp(tick: number, xPosition?: number): ActivePowerUp {
  powerUpIdCounter++;
  return {
    id: `pu-${powerUpIdCounter}`,
    type: getRandomPowerUpType(),
    position: {
      x: xPosition ?? (10 + Math.floor(Math.random() * 40)),
      y: 0,
    },
    spawnTick: tick,
    floatDuration: 60,
    collected: false,
  };
}

export function updatePowerUp(powerUp: ActivePowerUp, currentTick: number): ActivePowerUp {
  const elapsed = currentTick - powerUp.spawnTick;
  const maxY = 8; // ground level
  const progress = Math.min(elapsed / powerUp.floatDuration, 1);
  const y = Math.round(progress * maxY);

  return {
    ...powerUp,
    position: { ...powerUp.position, y },
  };
}

export function isPowerUpAtGround(powerUp: ActivePowerUp, currentTick: number): boolean {
  const elapsed = currentTick - powerUp.spawnTick;
  return elapsed >= powerUp.floatDuration;
}

export function isPowerUpExpired(powerUp: ActivePowerUp, currentTick: number): boolean {
  const elapsed = currentTick - powerUp.spawnTick;
  // Power-up disappears 30 ticks after reaching ground if not collected
  return elapsed >= powerUp.floatDuration + 30;
}

export interface PowerUpManagerState {
  activePowerUps: ActivePowerUp[];
}

export function createPowerUpManager(): {
  state: PowerUpManagerState;
  spawn: (tick: number, xPosition?: number) => ActivePowerUp;
  update: (tick: number) => { collected: ActivePowerUp[]; expired: ActivePowerUp[] };
  collectAt: (powerUpId: string) => ActivePowerUp | null;
  getActive: () => ActivePowerUp[];
} {
  const state: PowerUpManagerState = {
    activePowerUps: [],
  };

  function spawn(tick: number, xPosition?: number): ActivePowerUp {
    const pu = spawnPowerUp(tick, xPosition);
    state.activePowerUps.push(pu);
    return pu;
  }

  function update(tick: number): { collected: ActivePowerUp[]; expired: ActivePowerUp[] } {
    const collected: ActivePowerUp[] = [];
    const expired: ActivePowerUp[] = [];

    state.activePowerUps = state.activePowerUps
      .map(pu => updatePowerUp(pu, tick))
      .filter(pu => {
        if (pu.collected) {
          collected.push(pu);
          return false;
        }
        if (isPowerUpExpired(pu, tick)) {
          expired.push(pu);
          return false;
        }
        return true;
      });

    return { collected, expired };
  }

  function collectAt(powerUpId: string): ActivePowerUp | null {
    const idx = state.activePowerUps.findIndex(pu => pu.id === powerUpId);
    if (idx === -1) return null;
    const pu = state.activePowerUps[idx];
    state.activePowerUps[idx] = { ...pu, collected: true };
    return pu;
  }

  function getActive(): ActivePowerUp[] {
    return [...state.activePowerUps];
  }

  return { state, spawn, update, collectAt, getActive };
}

// React component for rendering a power-up
export interface PowerUpProps {
  powerUp: ActivePowerUp;
}

export function PowerUp({ powerUp }: PowerUpProps) {
  const bobOffset = Math.sin(Date.now() / 200) > 0 ? 0 : 1;

  return (
    <Box flexDirection="column">
      <Box marginTop={powerUp.position.y + bobOffset}>
        <Text>
          {powerUp.type.icon} {powerUp.type.label}
        </Text>
      </Box>
    </Box>
  );
}
