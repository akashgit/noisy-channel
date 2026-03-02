# Berry TUI — Terminal Adventure Agent

## Creative Vision

Berry is a **fun, animated terminal experience** where a pixel-art-style protagonist named **Berry** lives inside your terminal. Berry is an AI agent character who can **clone itself** into sub-agents, wield **power-up tools**, ask questions via **speech bubbles**, and react to the world around it with charming animations.

Think of it as a **tiny terminal RPG meets AI agent visualization** — not a startup, just a delightful thing to build and play with.

Inspired by [pixel-agents](https://github.com/pablodelucca/pixel-agents), but running purely in the terminal using ASCII/Unicode art and ANSI colors.

---

## Core Concepts

### 1. Berry — The Protagonist
A small ASCII art character (~5-7 lines tall) rendered with ANSI colors. Berry has multiple animation states:

- **Idle** — Gentle bobbing/breathing animation, blinking eyes
- **Thinking** — Thought bubble appears, eyes look up, `...` animation
- **Working** — Arms move, sparks fly, action lines appear
- **Celebrating** — Jump animation, confetti particles, `★` bursts
- **Confused** — `?!` above head, wobble animation
- **Talking** — Speech bubble appears with text, mouth moves

### 2. Cloning — Sub-Agents
Berry can split into **mini-clones** (smaller versions of itself, ~3 lines tall). Each clone:
- Has its own color tint (derived from parent's palette)
- Shows its assigned task above its head
- Has simplified animations (idle/working/done)
- Celebrates and merges back into Berry when done

### 3. Power-Ups — Tools
Tools are visualized as **collectible power-up items** that float down and Berry "equips":
- 📖 **Read** — Book icon, Berry opens it
- ✏️ **Edit** — Pencil icon, Berry writes
- 🔍 **Search** — Magnifying glass, Berry investigates
- 💻 **Bash** — Terminal icon, lightning effects
- 🌐 **Web** — Globe icon, connection lines appear
- ✍️ **Write** — Scroll icon, ink drops

### 4. Speech Bubbles — Interaction
When Berry asks a question or receives input:
- A classic comic-style speech bubble appears
- Text types out character by character
- Options appear as selectable items
- Berry's expression changes based on the conversation

### 5. The Scene
The terminal is divided into zones:
```
┌─── Berry TUI ──────────────────────────────────┐
│ 🫐 Berry  │ ⏱ 00:42  │ 🧬 3 clones │ ⚡ 5 tools │  ← Status Bar
├─────────────────────────┬───────────────────────┤
│                         │  Activity Feed        │
│    ╭───╮   ╭─╮  ╭─╮    │  ├─ 🔍 Searching...  │
│    │ ♥ │   │·│  │·│    │  ├─ ✏️ Editing foo.ts │
│    ╰─┬─╯   ╰┬╯  ╰┬╯    │  ├─ 📖 Reading cfg   │
│     ╱╲    ╱╲   ╱╲     │  └─ ✅ Done: setup   │
│    ╱  ╲  ╱ ╲  ╱ ╲    │                       │
│   Berry  c1   c2      │                       │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│                       │
│         ground         │                       │
├─────────────────────────┴───────────────────────┤
│ [↑↓] Navigate  [Enter] Select  [t] Theme  [q]  │  ← Controls
└─────────────────────────────────────────────────┘
```

### 6. Themes
Two themes for MVP:
- **Berry** (default) — Purple/pink/blue palette, warm and playful
- **Cyberpunk** — Neon green/cyan/magenta on black, glitchy effects

---

## Architecture

### Tech Stack
- **Language**: TypeScript
- **Runtime**: Node.js (>=18)
- **TUI Framework**: `ink` (React for CLIs) — handles layout, input, re-rendering
- **Animation**: Custom tick loop using `setInterval` (30fps) driving state updates
- **Character Rendering**: Multi-line Unicode/ASCII art strings with ANSI color codes
- **Package Manager**: npm
- **Build**: `tsup` (simple, fast TypeScript bundler)

### Project Structure
```
berry-tui/
├── package.json
├── tsconfig.json
├── tsup.config.ts
├── src/
│   ├── index.tsx                 # CLI entry point
│   ├── app.tsx                   # Root <App> component
│   │
│   ├── components/
│   │   ├── Scene.tsx             # Main scene layout (world + sidebar)
│   │   ├── Character.tsx         # Renders a character from sprite frames
│   │   ├── MiniClone.tsx         # Smaller clone character
│   │   ├── SpeechBubble.tsx      # Comic-style speech bubble
│   │   ├── PowerUp.tsx           # Floating power-up item
│   │   ├── StatusBar.tsx         # Top status bar
│   │   ├── ActivityFeed.tsx      # Right-side activity log
│   │   ├── ControlsBar.tsx       # Bottom keyboard shortcuts bar
│   │   ├── Ground.tsx            # Ground/floor rendering
│   │   └── ParticleEffect.tsx    # Confetti, sparks, etc.
│   │
│   ├── sprites/
│   │   ├── berry.ts              # Berry's sprite frames (all states)
│   │   ├── clone.ts              # Mini-clone sprite frames
│   │   ├── powerups.ts           # Power-up item sprites
│   │   └── effects.ts            # Particle/effect sprites
│   │
│   ├── engine/
│   │   ├── tick.ts               # Game tick loop (30fps setInterval)
│   │   ├── stateMachine.ts       # Character state machine
│   │   ├── animator.ts           # Frame sequencing and timing
│   │   └── particles.ts          # Particle system
│   │
│   ├── agents/
│   │   ├── berry.ts              # Berry protagonist logic
│   │   └── clone.ts              # Clone lifecycle management
│   │
│   ├── themes/
│   │   ├── types.ts              # Theme type definitions
│   │   ├── berry-theme.ts        # Default berry theme
│   │   └── cyberpunk-theme.ts    # Cyberpunk theme
│   │
│   └── utils/
│       ├── ansi.ts               # ANSI color helpers
│       └── terminal.ts           # Terminal dimensions, cursor control
│
├── demo.ts                       # Standalone demo script
└── README.md                     # (only if user asks)
```

### Key Design Decisions

1. **ink (React for CLIs)** — Gives us component-based architecture, hooks for state, and automatic re-rendering. Perfect for complex TUI layouts.

2. **setInterval tick loop** — Rather than RAF (not available in Node), we use a 30fps interval that updates animation state. ink's React reconciler handles the re-rendering.

3. **Sprite frames as string arrays** — Each animation state is an array of multi-line strings. The animator cycles through frames based on the tick.

4. **State machine per character** — Each character (Berry + clones) has its own state machine instance tracking current state, frame index, and transition timers.

5. **Particle system** — Lightweight array of `{x, y, char, color, life}` objects updated each tick for effects like confetti, sparks, etc.

---

## MVP Scope (v0.1)

### What's In
1. **Project scaffolding** — package.json, tsconfig, tsup, folder structure
2. **Berry character sprites** — All 6 states with 2-4 frames each
3. **Animation engine** — Tick loop, state machine, frame sequencer
4. **Scene layout** — World area + activity feed sidebar
5. **Clone system** — Berry splits into mini-clones, they work and merge back
6. **Power-up visuals** — Tool icons that Berry "collects"
7. **Speech bubbles** — Text display with typing animation
8. **Status bar + controls bar** — Info display
9. **2 themes** — Berry (default) + Cyberpunk
10. **Interactive demo** — Keyboard-driven demo that showcases all features
11. **Keyboard input** — Navigate, trigger actions, switch themes

### What's NOT in MVP
- Claude Code stream-json integration (post-MVP)
- Sound effects
- Plugin API
- Persistent state / save system
- Network features
- More than 2 themes

---

## GitHub Issues Breakdown

### Issue 1: Project Scaffolding
Set up package.json with dependencies (ink, react, tsup, typescript), tsconfig.json, tsup.config.ts, folder structure, and a minimal "hello world" ink app that compiles and runs.

### Issue 2: Sprite System — Berry Character
Create ASCII/Unicode art sprites for Berry in all 6 states (idle, thinking, working, celebrating, confused, talking). Each state has 2-4 animation frames. Store as typed string arrays with ANSI color support.

### Issue 3: Sprite System — Clones & Power-Ups
Create mini-clone sprites (3-line versions) and power-up item sprites (single-line icons with labels). Include color tinting logic for clone variants.

### Issue 4: Animation Engine
Build the core tick loop (30fps), character state machine (states + transitions + timers), and frame animator (cycles through sprite frames at configurable speeds).

### Issue 5: Theme System
Define theme type interface (colors for: bg, fg, accent, character tints, borders, etc.). Implement berry-theme and cyberpunk-theme. Add theme context provider and `t` key to cycle themes.

### Issue 6: Scene Layout & Ground
Build the main Scene component using ink's `<Box>` layout. Left side = world area with ground, right side = activity feed. Render ground using block characters. Handle terminal resize.

### Issue 7: Character Component
Build the `<Character>` component that takes sprite frames + state + position and renders the correct frame. Include the `<MiniClone>` variant. Wire up to the animation engine.

### Issue 8: Clone System
Implement Berry's clone mechanic: trigger clone spawn (Berry splits animation), assign task to clone, clone works (animated), clone completes and merges back. Track active clones in state.

### Issue 9: Power-Up System
Implement power-up collection: power-up appears (float-down animation), Berry moves to collect it, equip animation plays, power-up added to Berry's inventory shown in status bar.

### Issue 10: Speech Bubbles
Build `<SpeechBubble>` component with comic-style border, typing animation (char by char), and positioning relative to character. Support multi-line text and option selection.

### Issue 11: Status Bar & Controls Bar
Build `<StatusBar>` (top: Berry name, timer, clone count, tool count) and `<ControlsBar>` (bottom: keyboard shortcuts). Update reactively as state changes.

### Issue 12: Activity Feed
Build `<ActivityFeed>` sidebar showing a scrollable log of actions (tool uses, clone spawns, completions). Each entry has an icon, label, and status indicator.

### Issue 13: Particle Effects
Build lightweight particle system for celebrations (confetti), work (sparks), and power-up collection (sparkles). Particles are single characters with color, position, velocity, and lifetime.

### Issue 14: Interactive Demo
Build a demo mode that runs through a scripted sequence: Berry idles → thinks → spawns 2 clones → clones work → power-ups collected → clones merge → Berry celebrates. Keyboard input allows manual triggering too.

### Issue 15: Keyboard Input & App Shell
Wire up keyboard handlers in the root App: arrow keys (future movement), `t` (theme), `d` (demo sequence), `c` (spawn clone), `p` (spawn power-up), `s` (speech bubble), `q` (quit).

---

## Implementation Order & Dependencies

```
Issue 1 (Scaffolding)
  ↓
Issue 2 (Berry Sprites) ──────────┐
Issue 3 (Clone & PowerUp Sprites) │
Issue 4 (Animation Engine) ───────┤
Issue 5 (Theme System) ───────────┤
  ↓                                │
Issue 6 (Scene Layout) ◄──────────┘
Issue 7 (Character Component) ◄── Issues 2,4
  ↓
Issue 8 (Clone System) ◄── Issues 3,7
Issue 9 (Power-Up System) ◄── Issues 3,7
Issue 10 (Speech Bubbles) ◄── Issue 5
Issue 11 (Status Bar) ◄── Issue 5
Issue 12 (Activity Feed) ◄── Issue 6
Issue 13 (Particles) ◄── Issue 4
  ↓
Issue 14 (Demo) ◄── All above
Issue 15 (Keyboard + App Shell) ◄── All above
```

## Agent Team Plan

### Team Structure
- **Leader** (you) — Coordinates, creates issues, assigns work, reviews
- **Agent 1: "sprite-artist"** — Issues 2, 3 (sprites and art)
- **Agent 2: "engine-dev"** — Issues 4, 5, 13 (engine, themes, particles)
- **Agent 3: "ui-builder"** — Issues 6, 7, 10, 11, 12 (ink components)
- **Agent 4: "systems-dev"** — Issues 8, 9, 14, 15 (game systems, demo, app shell)

### Execution Phases
1. **Phase 1** (parallel): Scaffolding (leader), then Sprites (agent 1) + Engine (agent 2) in parallel
2. **Phase 2** (parallel): Scene/Components (agent 3) + Theme (agent 2)
3. **Phase 3** (parallel): Clone system (agent 4) + Power-ups (agent 4) + Speech/Status/Feed (agent 3) + Particles (agent 2)
4. **Phase 4**: Demo + App Shell integration (agent 4, with help from all)
