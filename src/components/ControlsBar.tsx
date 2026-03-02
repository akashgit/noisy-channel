import React from 'react';
import { Box, Text } from 'ink';
import { useTheme } from '../themes/ThemeContext.js';

interface ControlItem {
  key: string;
  label: string;
}

const defaultControls: ControlItem[] = [
  { key: 't', label: 'Theme' },
  { key: 'd', label: 'Demo' },
  { key: 'c', label: 'Clone' },
  { key: 'p', label: 'Power-up' },
  { key: 's', label: 'Speech' },
  { key: 'q', label: 'Quit' },
];

interface ControlsBarProps {
  controls?: ControlItem[];
}

export function ControlsBar({ controls = defaultControls }: ControlsBarProps) {
  const { theme } = useTheme();
  const dimColor = theme.colors.dimmed;
  const accentColor = theme.colors.accent;

  return (
    <Box flexDirection="row" justifyContent="center" gap={1} width="100%">
      {controls.map((ctrl, i) => (
        <Box key={i}>
          <Text color={accentColor}>[</Text>
          <Text color={accentColor} bold>
            {ctrl.key}
          </Text>
          <Text color={accentColor}>]</Text>
          <Text color={dimColor}> {ctrl.label}</Text>
          {i < controls.length - 1 && <Text color={dimColor}>  </Text>}
        </Box>
      ))}
    </Box>
  );
}
