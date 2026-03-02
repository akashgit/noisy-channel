import React, { useMemo } from 'react';
import { Box, Text } from 'ink';
import { useTheme } from '../themes/ThemeContext.js';
import { SpriteFrame } from '../sprites/berry.js';
import { CloneSpriteSheet, CloneState } from '../sprites/clone.js';

interface MiniCloneProps {
  cloneSpriteSheet: CloneSpriteSheet;
  state: CloneState;
  position?: { x: number; y: number };
  colorTint?: string;
  taskLabel?: string;
  animationTick?: number;
  frameDuration?: number;
}

export function MiniClone({
  cloneSpriteSheet,
  state,
  position = { x: 0, y: 0 },
  colorTint,
  taskLabel,
  animationTick = 0,
  frameDuration = 10,
}: MiniCloneProps) {
  const { theme } = useTheme();
  const defaultTint = theme.colors.clone.tints[0] || theme.colors.accent;
  const tint = colorTint || defaultTint;

  const frames = cloneSpriteSheet[state];

  const currentFrame: SpriteFrame | null = useMemo(() => {
    if (!frames || frames.length === 0) {
      return null;
    }
    const frameIndex = Math.floor(animationTick / frameDuration) % frames.length;
    return frames[frameIndex]!;
  }, [frames, animationTick, frameDuration]);

  const fallbackLines = state === 'working'
    ? [' o ', '/|\\', '/ \\']
    : state === 'done'
      ? [' o ', '\\|/', ' | ']
      : [' o ', ' | ', '/ \\'];

  const lines = currentFrame ? currentFrame.lines : fallbackLines;

  return (
    <Box flexDirection="column" marginLeft={position.x} alignItems="center">
      {/* Task label above the clone */}
      {taskLabel && (
        <Text color={tint} dimColor italic>
          {taskLabel}
        </Text>
      )}
      {/* Clone sprite (3 lines) */}
      {lines.slice(0, 3).map((line, i) => (
        <Text key={i} color={tint}>
          {line}
        </Text>
      ))}
    </Box>
  );
}
