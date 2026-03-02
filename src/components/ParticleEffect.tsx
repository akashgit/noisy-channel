// ParticleEffect component — renders particle system state in terminal
import React from 'react';
import { Box, Text } from 'ink';
import { type Particle } from '../engine/particles.js';

interface ParticleEffectProps {
  particles: Particle[];
  width?: number;
  height?: number;
}

export function ParticleEffect({ particles, width = 60, height = 20 }: ParticleEffectProps) {
  if (particles.length === 0) return null;

  // Build a grid of characters to render
  const grid: Map<string, { char: string; color: string; opacity: number }> = new Map();

  for (const p of particles) {
    const px = Math.round(p.x);
    const py = Math.round(p.y);

    // Skip out-of-bounds particles
    if (px < 0 || px >= width || py < 0 || py >= height) continue;

    const key = `${px},${py}`;
    const opacity = p.life / p.maxLife;

    // Only render if nothing already occupies this cell (or this has higher opacity)
    const existing = grid.get(key);
    if (!existing || opacity > existing.opacity) {
      grid.set(key, { char: p.char, color: p.color, opacity });
    }
  }

  // Render rows
  const rows: React.ReactNode[] = [];
  for (let y = 0; y < height; y++) {
    const segments: React.ReactNode[] = [];
    let x = 0;

    while (x < width) {
      const key = `${x},${y}`;
      const cell = grid.get(key);

      if (cell) {
        // Dim particles that are fading out
        const dimColor = cell.opacity < 0.3;
        segments.push(
          <Text key={`${key}`} color={cell.color} dimColor={dimColor}>
            {cell.char}
          </Text>
        );
        x++;
      } else {
        // Collect consecutive empty spaces
        let spaces = 0;
        while (x + spaces < width && !grid.has(`${x + spaces},${y}`)) {
          spaces++;
        }
        if (spaces > 0) {
          segments.push(
            <Text key={`space-${y}-${x}`}>{' '.repeat(spaces)}</Text>
          );
          x += spaces;
        }
      }
    }

    rows.push(
      <Box key={`row-${y}`}>
        {segments}
      </Box>
    );
  }

  return (
    <Box flexDirection="column" position="absolute" marginLeft={0} marginTop={0}>
      {rows}
    </Box>
  );
}
