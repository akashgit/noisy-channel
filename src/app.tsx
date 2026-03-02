import React, { useState } from 'react';
import { Box, Text } from 'ink';

export function App() {
  return (
    <Box flexDirection="column" padding={1}>
      <Text color="magenta" bold>
        🫐 noisy-channel — Berry TUI v0.1
      </Text>
      <Text dimColor>Loading Berry...</Text>
    </Box>
  );
}
