import React from 'react';
import { Box, Text, useStdout } from 'ink';
import { useTheme } from '../themes/ThemeContext.js';
import { Ground } from './Ground.js';

interface SceneProps {
  children?: React.ReactNode;
  sidebar?: React.ReactNode;
  statusBar?: React.ReactNode;
  controlsBar?: React.ReactNode;
}

export function Scene({ children, sidebar, statusBar, controlsBar }: SceneProps) {
  const { theme } = useTheme();
  const { stdout } = useStdout();
  const columns = stdout?.columns || 80;
  const rows = stdout?.rows || 24;

  const borderColor = theme.colors.border;
  const bgColor = theme.colors.bg;
  const accentColor = theme.colors.accent;

  // Layout widths
  const innerWidth = columns - 2; // minus left+right border
  const worldWidth = Math.floor(innerWidth * 0.7);
  const sidebarWidth = innerWidth - worldWidth - 1; // -1 for divider

  // Content area height (minus top/bottom borders, status/controls bars)
  const contentHeight = rows - 6; // status + top border + bottom border + controls + 2 padding

  // Box-drawing characters
  const TL = '\u250C';
  const TR = '\u2510';
  const BL = '\u2514';
  const BR = '\u2518';
  const H = '\u2500';
  const V = '\u2502';
  const TJ = '\u252C'; // T-junction top
  const BJ = '\u2534'; // T-junction bottom
  const LJ = '\u251C'; // left junction
  const RJ = '\u2524'; // right junction

  const titleText = ' Berry TUI ';
  const titlePadLeft = Math.floor((innerWidth - titleText.length) / 2);
  const titlePadRight = innerWidth - titleText.length - titlePadLeft;

  const topBorder =
    TL +
    H.repeat(titlePadLeft) +
    titleText +
    H.repeat(titlePadRight) +
    TR;

  const dividerTop = LJ + H.repeat(worldWidth) + TJ + H.repeat(sidebarWidth) + RJ;
  const dividerBottom = LJ + H.repeat(worldWidth) + BJ + H.repeat(sidebarWidth) + RJ;
  const bottomBorder = BL + H.repeat(innerWidth) + BR;

  return (
    <Box flexDirection="column" width={columns}>
      {/* Top border with title */}
      <Text color={borderColor}>{topBorder}</Text>

      {/* Status bar row */}
      <Box>
        <Text color={borderColor}>{V}</Text>
        <Box width={innerWidth}>{statusBar}</Box>
        <Text color={borderColor}>{V}</Text>
      </Box>

      {/* Divider between status and content */}
      <Text color={borderColor}>{dividerTop}</Text>

      {/* Main content: world + sidebar */}
      <Box height={Math.max(contentHeight, 8)}>
        {/* Left border */}
        <Box flexDirection="column">
          {Array.from({ length: Math.max(contentHeight, 8) }).map((_, i) => (
            <Text key={`lb-${i}`} color={borderColor}>
              {V}
            </Text>
          ))}
        </Box>

        {/* World area */}
        <Box
          flexDirection="column"
          width={worldWidth}
          justifyContent="flex-end"
        >
          {/* Characters, speech bubbles, etc. */}
          <Box flexDirection="column" flexGrow={1} justifyContent="flex-end">
            {children}
          </Box>
          {/* Ground at the bottom of world */}
          <Ground width={worldWidth} />
        </Box>

        {/* Vertical divider */}
        <Box flexDirection="column">
          {Array.from({ length: Math.max(contentHeight, 8) }).map((_, i) => (
            <Text key={`div-${i}`} color={borderColor}>
              {V}
            </Text>
          ))}
        </Box>

        {/* Sidebar */}
        <Box
          flexDirection="column"
          width={sidebarWidth}
        >
          {sidebar}
        </Box>

        {/* Right border */}
        <Box flexDirection="column">
          {Array.from({ length: Math.max(contentHeight, 8) }).map((_, i) => (
            <Text key={`rb-${i}`} color={borderColor}>
              {V}
            </Text>
          ))}
        </Box>
      </Box>

      {/* Divider between content and controls */}
      <Text color={borderColor}>{dividerBottom}</Text>

      {/* Controls bar row */}
      <Box>
        <Text color={borderColor}>{V}</Text>
        <Box width={innerWidth}>{controlsBar}</Box>
        <Text color={borderColor}>{V}</Text>
      </Box>

      {/* Bottom border */}
      <Text color={borderColor}>{bottomBorder}</Text>
    </Box>
  );
}
