import React, { useMemo } from 'react';
import { Box, Text } from 'ink';
import { useTheme } from '../themes/ThemeContext.js';
import { SpriteFrame, SpriteSheet, AnimationState } from '../sprites/berry.js';

interface CharacterProps {
  spriteSheet: SpriteSheet;
  currentState: AnimationState;
  animationTick: number;
  position?: { x: number; y: number };
  frameDuration?: number; // ticks per frame
}

export function Character({
  spriteSheet,
  currentState,
  animationTick,
  position = { x: 0, y: 0 },
  frameDuration = 8,
}: CharacterProps) {
  const { theme } = useTheme();
  const primaryColor = theme.colors.character.primary;
  const secondaryColor = theme.colors.character.secondary;

  const frames = spriteSheet[currentState];

  const currentFrame: SpriteFrame | null = useMemo(() => {
    if (!frames || frames.length === 0) {
      return null;
    }
    const frameIndex = Math.floor(animationTick / frameDuration) % frames.length;
    return frames[frameIndex]!;
  }, [frames, animationTick, frameDuration]);

  if (!currentFrame) {
    // Fallback: render a simple placeholder character
    return (
      <Box flexDirection="column" marginLeft={position.x}>
        <Text color={primaryColor}>  {'\\o/'}  </Text>
        <Text color={primaryColor}>   |   </Text>
        <Text color={primaryColor}>  / \  </Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" marginLeft={position.x}>
      {currentFrame.lines.map((line, i) => (
        <Text key={i} color={i === 0 ? secondaryColor : primaryColor}>
          {line}
        </Text>
      ))}
    </Box>
  );
}
