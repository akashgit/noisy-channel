// Berry theme — filled in by engine-dev agent
import { Theme } from './types.js';

export const berryTheme: Theme = {
  name: 'berry',
  colors: {
    bg: '#1a0a2e',
    fg: '#e8d5f5',
    accent: '#c084fc',
    accent2: '#f472b6',
    border: '#7c3aed',
    dimmed: '#6b5b7b',
    character: {
      primary: '#c084fc',
      secondary: '#f472b6',
      highlight: '#fbbf24',
    },
    clone: {
      tints: ['#818cf8', '#34d399', '#fb923c', '#f472b6'],
    },
    particles: {
      confetti: ['#c084fc', '#f472b6', '#fbbf24', '#34d399', '#818cf8'],
      sparks: ['#fbbf24', '#fb923c', '#f59e0b'],
      sparkles: ['#e8d5f5', '#c084fc', '#fbbf24'],
    },
    ui: {
      statusBar: '#7c3aed',
      activityFeed: '#2d1b4e',
      speechBubble: '#e8d5f5',
      controlsBar: '#4c1d95',
    },
  },
};
