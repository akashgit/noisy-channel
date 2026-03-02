import React, { useMemo } from 'react';
import { Box, Text } from 'ink';
import { useTheme } from '../themes/ThemeContext.js';

export interface ActivityEntry {
  icon: string;
  label: string;
  status: 'active' | 'done';
  timestamp: number; // seconds since start
}

interface ActivityFeedProps {
  entries: ActivityEntry[];
  maxVisible?: number;
  title?: string;
}

function formatTimestamp(seconds: number): string {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export function ActivityFeed({
  entries,
  maxVisible = 15,
  title = 'Activity Feed',
}: ActivityFeedProps) {
  const { theme } = useTheme();
  const accentColor = theme.colors.accent;
  const dimColor = theme.colors.dimmed;
  const fgColor = theme.colors.fg;
  const feedBg = theme.colors.ui.activityFeed;

  // Auto-scroll: show the most recent entries
  const visibleEntries = useMemo(() => {
    if (entries.length <= maxVisible) return entries;
    return entries.slice(entries.length - maxVisible);
  }, [entries, maxVisible]);

  const treeChar = '\u251C\u2500';
  const treeEnd = '\u2514\u2500';

  return (
    <Box flexDirection="column" paddingX={1}>
      <Text color={accentColor} bold underline>
        {title}
      </Text>
      <Text> </Text>
      {visibleEntries.length === 0 && (
        <Text color={dimColor} italic>
          No activity yet...
        </Text>
      )}
      {visibleEntries.map((entry, i) => {
        const isLast = i === visibleEntries.length - 1;
        const connector = isLast ? treeEnd : treeChar;
        const isActive = entry.status === 'active';
        const labelColor = isActive ? accentColor : dimColor;
        const statusIndicator = isActive ? '\u25CF' : '\u2713';
        const timeStr = formatTimestamp(entry.timestamp);

        return (
          <Box key={i} flexDirection="row">
            <Text color={dimColor}>{connector} </Text>
            <Text color={labelColor}>
              {entry.icon} {entry.label}
            </Text>
            <Text color={dimColor}>
              {' '}
              {statusIndicator} {timeStr}
            </Text>
          </Box>
        );
      })}
    </Box>
  );
}
