import React from 'react';
import { Box, Text } from 'ink';
import { useTheme } from '../themes/ThemeContext.js';

interface GroundProps {
  width: number;
}

export function Ground({ width }: GroundProps) {
  const { theme } = useTheme();

  const isCyberpunk = theme.name === 'cyberpunk';

  const grassColor = isCyberpunk ? theme.colors.accent : '#6b8e23';
  const groundColor = isCyberpunk ? theme.colors.border : '#8b4513';
  const deepColor = isCyberpunk ? theme.colors.dimmed : '#654321';

  // Top edge: grass/detail strip
  const grassLine = '\u2591\u2592\u2593'
    .repeat(Math.ceil(width / 3))
    .slice(0, width);

  // Main ground: solid block fill
  const groundLine = '\u2593'.repeat(width);

  // Bottom edge: deeper shade
  const deepLine = '\u2592'.repeat(width);

  return (
    <Box flexDirection="column">
      <Text color={grassColor}>{grassLine}</Text>
      <Text color={groundColor}>{groundLine}</Text>
      <Text color={deepColor}>{deepLine}</Text>
    </Box>
  );
}
