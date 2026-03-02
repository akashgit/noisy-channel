// Power-up sprites — collectible tool items that float down
import { SpriteFrame } from './berry.js';

export interface PowerUpDef {
  name: string;
  icon: string;
  label: string;
  frames: SpriteFrame[];
}

// ============================================================
// Power-up items — each has 3 frames showing float-down animation
// (high position -> mid position -> low/landed position)
// Width: 9, Height: 5
// ============================================================

const PU_W = 9;
const PU_H = 5;

function pad(line: string, width: number): string {
  const visible = line.replace(/\x1b\[[0-9;]*m/g, '');
  if (visible.length >= width) return line;
  return line + ' '.repeat(width - visible.length);
}

function puFrame(lines: string[]): SpriteFrame {
  const padded = lines.map(l => pad(l, PU_W));
  while (padded.length < PU_H) padded.push(' '.repeat(PU_W));
  return { lines: padded, width: PU_W, height: PU_H };
}

// ============================================================
// READ — Book power-up
// ============================================================
const readFrames: SpriteFrame[] = [
  // High position
  puFrame([
    '  ╭───╮  ',
    '  │╶─╴│  ',
    '  │╶─╴│  ',
    '  ╰───╯  ',
    '         ',
  ]),
  // Mid position
  puFrame([
    '         ',
    '  ╭───╮  ',
    '  │╶─╴│  ',
    '  │╶─╴│  ',
    '  ╰───╯  ',
  ]),
  // Landed with sparkle
  puFrame([
    '         ',
    '  ╭───╮✦ ',
    '  │╶─╴│  ',
    '  │╶─╴│  ',
    '  ╰───╯  ',
  ]),
];

// ============================================================
// EDIT — Pencil power-up
// ============================================================
const editFrames: SpriteFrame[] = [
  puFrame([
    '     ╱   ',
    '    ╱    ',
    '   ╱     ',
    '  ╱▪     ',
    '         ',
  ]),
  puFrame([
    '         ',
    '     ╱   ',
    '    ╱    ',
    '   ╱     ',
    '  ╱▪     ',
  ]),
  puFrame([
    '         ',
    '     ╱ ✦ ',
    '    ╱    ',
    '   ╱     ',
    '  ╱▪     ',
  ]),
];

// ============================================================
// SEARCH — Magnifying glass power-up
// ============================================================
const searchFrames: SpriteFrame[] = [
  puFrame([
    '  ╭──╮   ',
    '  │  │   ',
    '  ╰──╯╲  ',
    '       ╲ ',
    '         ',
  ]),
  puFrame([
    '         ',
    '  ╭──╮   ',
    '  │  │   ',
    '  ╰──╯╲  ',
    '       ╲ ',
  ]),
  puFrame([
    '         ',
    '  ╭──╮ ✦ ',
    '  │◉ │   ',
    '  ╰──╯╲  ',
    '       ╲ ',
  ]),
];

// ============================================================
// BASH — Terminal power-up
// ============================================================
const bashFrames: SpriteFrame[] = [
  puFrame([
    '  ┌───┐  ',
    '  │>_ │  ',
    '  │   │  ',
    '  └───┘  ',
    '         ',
  ]),
  puFrame([
    '         ',
    '  ┌───┐  ',
    '  │>_ │  ',
    '  │   │  ',
    '  └───┘  ',
  ]),
  puFrame([
    '      ⚡ ',
    '  ┌───┐  ',
    '  │>_ │  ',
    '  │   │  ',
    '  └───┘  ',
  ]),
];

// ============================================================
// WEB — Globe power-up
// ============================================================
const webFrames: SpriteFrame[] = [
  puFrame([
    '  ╭─◯─╮  ',
    '  ├───┤  ',
    '  ╰─◯─╯  ',
    '         ',
    '         ',
  ]),
  puFrame([
    '         ',
    '  ╭─◯─╮  ',
    '  ├───┤  ',
    '  ╰─◯─╯  ',
    '         ',
  ]),
  puFrame([
    '         ',
    '  ╭─◯─╮✦ ',
    '  ├───┤  ',
    '  ╰─◯─╯  ',
    '  ～～～  ',
  ]),
];

// ============================================================
// WRITE — Scroll power-up
// ============================================================
const writeFrames: SpriteFrame[] = [
  puFrame([
    '  ╔═══╗  ',
    '  ║~~~║  ',
    '  ║~~~║  ',
    '  ╚═══╝  ',
    '         ',
  ]),
  puFrame([
    '         ',
    '  ╔═══╗  ',
    '  ║~~~║  ',
    '  ║~~~║  ',
    '  ╚═══╝  ',
  ]),
  puFrame([
    '       ✦ ',
    '  ╔═══╗  ',
    '  ║~~~║  ',
    '  ║~~~║  ',
    '  ╚═══╝  ',
  ]),
];

// ============================================================
// Export all power-up definitions
// ============================================================
export const powerUpDefs: PowerUpDef[] = [
  { name: 'read',   icon: '\u{1F4D6}', label: 'Read',   frames: readFrames   },
  { name: 'edit',   icon: '\u{270F}\u{FE0F}',  label: 'Edit',   frames: editFrames   },
  { name: 'search', icon: '\u{1F50D}', label: 'Search', frames: searchFrames },
  { name: 'bash',   icon: '\u{1F4BB}', label: 'Bash',   frames: bashFrames   },
  { name: 'web',    icon: '\u{1F310}', label: 'Web',    frames: webFrames    },
  { name: 'write',  icon: '\u{270D}\u{FE0F}',  label: 'Write',  frames: writeFrames  },
];
