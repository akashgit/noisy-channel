// Berry sprite frames — lovable blueberry character ASCII art
export type AnimationState = 'idle' | 'thinking' | 'working' | 'celebrating' | 'confused' | 'talking';

export interface SpriteFrame {
  lines: string[];
  width: number;
  height: number;
}

export type SpriteSheet = Record<AnimationState, SpriteFrame[]>;

// ============================================================
// Berry — A lovable blueberry protagonist
// ~7 lines tall, round body, tiny legs, simple arms
// Uses: ╭╮╰╯│ for rounded edges, ◕●○ for eyes,
//       ▓▒░ for body fill, ★✦♥ for flair
// ============================================================

const W = 18; // consistent frame width
const H = 7;  // consistent frame height

function pad(line: string, width: number): string {
  // Compute visible length (strip ANSI codes if any)
  const visible = line.replace(/\x1b\[[0-9;]*m/g, '');
  if (visible.length >= width) return line;
  return line + ' '.repeat(width - visible.length);
}

function frame(lines: string[]): SpriteFrame {
  const padded = lines.map(l => pad(l, W));
  // Ensure exactly H lines
  while (padded.length < H) padded.push(' '.repeat(W));
  return { lines: padded, width: W, height: H };
}

// ============================================================
// IDLE — gentle breathing, occasional blink
// ============================================================
const idle: SpriteFrame[] = [
  // Frame 0: eyes open, neutral
  frame([
    '      ╭───╮     ',
    '    ╭─┤ ♠ ├─╮   ',
    '    │ ◕   ◕ │   ',
    '    │   ‿   │   ',
    '    ╰──┬─┬──╯   ',
    '       │ │      ',
    '      ╶┘ └╴     ',
  ]),
  // Frame 1: eyes open, slight bob down
  frame([
    '                 ',
    '      ╭───╮     ',
    '    ╭─┤ ♠ ├─╮   ',
    '    │ ◕   ◕ │   ',
    '    │   ‿   │   ',
    '    ╰──┬─┬──╯   ',
    '      ╶┘ └╴     ',
  ]),
  // Frame 2: blink! eyes closed
  frame([
    '      ╭───╮     ',
    '    ╭─┤ ♠ ├─╮   ',
    '    │ ─   ─ │   ',
    '    │   ‿   │   ',
    '    ╰──┬─┬──╯   ',
    '       │ │      ',
    '      ╶┘ └╴     ',
  ]),
  // Frame 3: eyes open again, bob up
  frame([
    '      ╭───╮     ',
    '    ╭─┤ ♠ ├─╮   ',
    '    │ ◕   ◕ │   ',
    '    │   ‿   │   ',
    '    ╰──┬─┬──╯   ',
    '       │ │      ',
    '      ╶┘ └╴     ',
  ]),
];

// ============================================================
// THINKING — eyes look up, thought dots, hand on chin
// ============================================================
const thinking: SpriteFrame[] = [
  // Frame 0: looking up, one dot
  frame([
    '             ·   ',
    '      ╭───╮     ',
    '    ╭─┤ ♠ ├─╮   ',
    '    │ ◔   ◔ │   ',
    '   ╭│   ─   │   ',
    '   ╰╰──┬─┬──╯   ',
    '      ╶┘ └╴     ',
  ]),
  // Frame 1: looking up, two dots
  frame([
    '           · ·   ',
    '      ╭───╮     ',
    '    ╭─┤ ♠ ├─╮   ',
    '    │ ◔   ◔ │   ',
    '   ╭│   ─   │   ',
    '   ╰╰──┬─┬──╯   ',
    '      ╶┘ └╴     ',
  ]),
  // Frame 2: looking up, three dots
  frame([
    '         · · ·   ',
    '      ╭───╮     ',
    '    ╭─┤ ♠ ├─╮   ',
    '    │ ◔   ◔ │   ',
    '   ╭│   ─   │   ',
    '   ╰╰──┬─┬──╯   ',
    '      ╶┘ └╴     ',
  ]),
  // Frame 3: eyes shift, dots fade
  frame([
    '           ·     ',
    '      ╭───╮     ',
    '    ╭─┤ ♠ ├─╮   ',
    '    │ ◑   ◑ │   ',
    '   ╭│   ─   │   ',
    '   ╰╰──┬─┬──╯   ',
    '      ╶┘ └╴     ',
  ]),
];

// ============================================================
// WORKING — arms pumping, action lines, energetic
// ============================================================
const working: SpriteFrame[] = [
  // Frame 0: right arm up with tool
  frame([
    '      ╭───╮  ⚡  ',
    '    ╭─┤ ♠ ├─╮╱  ',
    '    │ ●   ● │   ',
    '    │   ▽   │   ',
    '    ╰──┬─┬──╯   ',
    '       │ │      ',
    '      ╶┘ └╴     ',
  ]),
  // Frame 1: both arms active, sparks
  frame([
    '    ∗ ╭───╮ ∗   ',
    '   ╲╭─┤ ♠ ├─╮╱  ',
    '    │ ◉   ◉ │   ',
    '    │   ▽   │   ',
    '    ╰──┬─┬──╯   ',
    '       │ │      ',
    '      ╶┘ └╴     ',
  ]),
  // Frame 2: left arm up, action lines
  frame([
    '  ⚡  ╭───╮     ',
    '   ╲╭─┤ ♠ ├─╮   ',
    '    │ ●   ● │   ',
    '    │   ▽   │   ',
    '    ╰──┬─┬──╯   ',
    '       │ │      ',
    '      ╶┘ └╴     ',
  ]),
  // Frame 3: crouched pose, effort
  frame([
    '    ∗ ╭───╮  ∗  ',
    '   ╲╭─┤ ♠ ├─╮╱  ',
    '    │ ◉   ◉ │   ',
    '    │   △   │   ',
    '    ╰──┬─┬──╯   ',
    '      ╶┘ └╴     ',
    '                 ',
  ]),
];

// ============================================================
// CELEBRATING — jumping, arms up, stars!
// ============================================================
const celebrating: SpriteFrame[] = [
  // Frame 0: jump up, arms raised, stars
  frame([
    '   \\★╭───╮★/   ',
    '    ╭┤ ♠ ├╮    ',
    '    │ ◕ ◕ │    ',
    '    │  ▽  │    ',
    '    ╰─────╯    ',
    '     ╱   ╲     ',
    '                ',
  ]),
  // Frame 1: peak of jump, big stars
  frame([
    '  ✦\\★╭───╮★/✦  ',
    '    ╭┤ ♠ ├╮    ',
    '    │ ◕ ◕ │    ',
    '    │  ▽  │    ',
    '    ╰─────╯    ',
    '                ',
    '                ',
  ]),
  // Frame 2: coming down, stars scatter
  frame([
    ' ✦  \\╭───╮/  ✦ ',
    '    ╭┤ ♠ ├╮    ',
    '    │ ◕ ◕ │    ',
    '    │  ‿  │    ',
    '    ╰──┬┬─╯    ',
    '       ││      ',
    '      ╶┘└╴     ',
  ]),
  // Frame 3: landing, happy bounce
  frame([
    '    ★       ★   ',
    '      ╭───╮     ',
    '    ╭─┤ ♠ ├─╮   ',
    '    │ ◕   ◕ │   ',
    '    │   ▽   │   ',
    '    ╰──┬─┬──╯   ',
    '      ╶┘ └╴     ',
  ]),
];

// ============================================================
// CONFUSED — question marks, wobble, tilted
// ============================================================
const confused: SpriteFrame[] = [
  // Frame 0: question mark above, leaning right
  frame([
    '        ？       ',
    '      ╭───╮     ',
    '    ╭─┤ ♠ ├─╮   ',
    '    │ ◑   ◐ │   ',
    '    │   ∿   │   ',
    '    ╰──┬─┬──╯   ',
    '      ╶┘ └╴     ',
  ]),
  // Frame 1: ?! above, leaning left
  frame([
    '       ？！      ',
    '      ╭───╮     ',
    '     ╭┤ ♠ ├╮    ',
    '     │◑   ◐│    ',
    '     │  ∿  │    ',
    '     ╰─┬─┬─╯    ',
    '      ╶┘ └╴     ',
  ]),
  // Frame 2: wobble right, swirl above
  frame([
    '         ～      ',
    '      ╭───╮     ',
    '    ╭─┤ ♠ ├─╮   ',
    '    │ ◐   ◑ │   ',
    '    │   ∿   │   ',
    '    ╰──┬─┬──╯   ',
    '      ╶┘ └╴     ',
  ]),
  // Frame 3: back to center, big question
  frame([
    '       ❓       ',
    '      ╭───╮     ',
    '    ╭─┤ ♠ ├─╮   ',
    '    │ ◑   ◐ │   ',
    '    │   ○   │   ',
    '    ╰──┬─┬──╯   ',
    '      ╶┘ └╴     ',
  ]),
];

// ============================================================
// TALKING — mouth opens/closes, speech indicator
// ============================================================
const talking: SpriteFrame[] = [
  // Frame 0: mouth open, speech line
  frame([
    '      ╭───╮     ',
    '    ╭─┤ ♠ ├─╮◁  ',
    '    │ ◕   ◕ │   ',
    '    │   ○   │   ',
    '    ╰──┬─┬──╯   ',
    '       │ │      ',
    '      ╶┘ └╴     ',
  ]),
  // Frame 1: mouth closed
  frame([
    '      ╭───╮     ',
    '    ╭─┤ ♠ ├─╮ ◁ ',
    '    │ ◕   ◕ │   ',
    '    │   ‿   │   ',
    '    ╰──┬─┬──╯   ',
    '       │ │      ',
    '      ╶┘ └╴     ',
  ]),
  // Frame 2: mouth wide, emphasis
  frame([
    '      ╭───╮     ',
    '    ╭─┤ ♠ ├─╮◁  ',
    '    │ ◕   ◕ │   ',
    '    │   ◯   │   ',
    '    ╰──┬─┬──╯   ',
    '       │ │      ',
    '      ╶┘ └╴     ',
  ]),
  // Frame 3: smile, pause
  frame([
    '      ╭───╮     ',
    '    ╭─┤ ♠ ├─╮   ',
    '    │ ◕   ◕ │   ',
    '    │   ‿   │   ',
    '    ╰──┬─┬──╯   ',
    '       │ │      ',
    '      ╶┘ └╴     ',
  ]),
];

// ============================================================
// Export the complete sprite sheet
// ============================================================
export const berrySprites: SpriteSheet = {
  idle,
  thinking,
  working,
  celebrating,
  confused,
  talking,
};
