import React, { useState, useEffect, useRef } from 'react';
import { Box, Text } from 'ink';
import { useTheme } from '../themes/ThemeContext.js';

interface SpeechBubbleProps {
  message: string;
  visible: boolean;
  typingSpeed?: number; // ticks per character (lower = faster)
  onComplete?: () => void;
  maxWidth?: number;
}

function wrapText(text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    if (currentLine.length + word.length + 1 > maxWidth) {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = currentLine ? `${currentLine} ${word}` : word;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines.length > 0 ? lines : [''];
}

export function SpeechBubble({
  message,
  visible,
  typingSpeed = 2,
  onComplete,
  maxWidth = 40,
}: SpeechBubbleProps) {
  const { theme } = useTheme();
  const [revealedChars, setRevealedChars] = useState(0);
  const tickRef = useRef(0);
  const completedRef = useRef(false);

  useEffect(() => {
    if (!visible) {
      setRevealedChars(0);
      tickRef.current = 0;
      completedRef.current = false;
      return;
    }

    const interval = setInterval(() => {
      tickRef.current += 1;
      if (tickRef.current % typingSpeed === 0) {
        setRevealedChars((prev) => {
          const next = prev + 1;
          if (next >= message.length && !completedRef.current) {
            completedRef.current = true;
            onComplete?.();
          }
          return Math.min(next, message.length);
        });
      }
    }, 33); // ~30fps

    return () => clearInterval(interval);
  }, [visible, message, typingSpeed, onComplete]);

  if (!visible || !message) return null;

  const visibleText = message.slice(0, revealedChars);
  const cursor = revealedChars < message.length ? '\u2588' : '';
  const displayText = visibleText + cursor;

  const contentWidth = Math.min(maxWidth, Math.max(message.length, 10));
  const lines = wrapText(displayText, contentWidth);
  const bubbleWidth = Math.max(...lines.map((l) => l.length), 4);

  const topBorder = '\u256D' + '\u2500'.repeat(bubbleWidth + 2) + '\u256E';
  const bottomBorder = '\u2570' + '\u2500'.repeat(bubbleWidth + 2) + '\u256F';
  const tail = ' \u2570\u25B6';

  const bubbleColor = theme.colors.ui.speechBubble;
  const borderColor = theme.colors.border;

  return (
    <Box flexDirection="column">
      <Text color={borderColor}>{topBorder}</Text>
      {lines.map((line, i) => {
        const padded = line + ' '.repeat(Math.max(0, bubbleWidth - line.length));
        return (
          <Text key={i} color={bubbleColor}>
            <Text color={borderColor}>{'\u2502'}</Text>
            {' '}{padded}{' '}
            <Text color={borderColor}>{'\u2502'}</Text>
          </Text>
        );
      })}
      <Text color={borderColor}>{bottomBorder}</Text>
      <Text color={borderColor}>{tail}</Text>
    </Box>
  );
}
