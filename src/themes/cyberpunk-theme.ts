// Cyberpunk theme — filled in by engine-dev agent
import { Theme } from './types.js';

export const cyberpunkTheme: Theme = {
  name: 'cyberpunk',
  colors: {
    bg: '#0a0a0a',
    fg: '#00ff41',
    accent: '#00ff41',
    accent2: '#ff00ff',
    border: '#00ffff',
    dimmed: '#333333',
    character: {
      primary: '#00ff41',
      secondary: '#00ffff',
      highlight: '#ff00ff',
    },
    clone: {
      tints: ['#ff6600', '#ff00ff', '#00ffff', '#ffff00'],
    },
    particles: {
      confetti: ['#00ff41', '#ff00ff', '#00ffff', '#ffff00', '#ff6600'],
      sparks: ['#ffff00', '#ff6600', '#ff0000'],
      sparkles: ['#00ff41', '#00ffff', '#ffffff'],
    },
    ui: {
      statusBar: '#1a1a2e',
      activityFeed: '#0d0d1a',
      speechBubble: '#00ff41',
      controlsBar: '#1a1a2e',
    },
  },
};
