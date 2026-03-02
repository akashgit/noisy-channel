import React from 'react';
import { Box, Text } from 'ink';
import { useTheme } from '../themes/ThemeContext.js';

interface StatusBarProps {
  uptimeSeconds: number;
  cloneCount: number;
  toolCount: number;
  themeName?: string;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export function StatusBar({
  uptimeSeconds,
  cloneCount,
  toolCount,
  themeName,
}: StatusBarProps) {
  const { theme } = useTheme();
  const displayTheme = themeName || theme.name;

  const statusColor = theme.colors.ui.statusBar;
  const accentColor = theme.colors.accent;
  const accent2Color = theme.colors.accent2;
  const fgColor = theme.colors.fg;
  const borderColor = theme.colors.border;

  return (
    <Box
      flexDirection="row"
      justifyContent="space-between"
      width="100%"
      paddingX={1}
    >
      <Box>
        <Text color={accentColor} bold>
          {'\uD83E\uDED0'} Berry
        </Text>
      </Box>

      <Text color={borderColor}>{'\u2502'}</Text>

      <Box>
        <Text color={fgColor}>
          {'\u23F1'} {formatTime(uptimeSeconds)}
        </Text>
      </Box>

      <Text color={borderColor}>{'\u2502'}</Text>

      <Box>
        <Text color={accent2Color}>
          {'\uD83E\uDDEC'} {cloneCount} clone{cloneCount !== 1 ? 's' : ''}
        </Text>
      </Box>

      <Text color={borderColor}>{'\u2502'}</Text>

      <Box>
        <Text color={accentColor}>
          {'\u26A1'} {toolCount} tool{toolCount !== 1 ? 's' : ''}
        </Text>
      </Box>

      <Text color={borderColor}>{'\u2502'}</Text>

      <Box>
        <Text color={statusColor} dimColor>
          {displayTheme}
        </Text>
      </Box>
    </Box>
  );
}
