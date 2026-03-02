// Particle system — confetti, sparks, and sparkles

export interface Particle {
  x: number;
  y: number;
  char: string;
  color: string;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

export type EmitterType = 'confetti' | 'sparks' | 'sparkles';

export interface ParticleSystem {
  particles: Particle[];
  emit: (x: number, y: number, count: number, type: EmitterType) => void;
  update: () => void;
  clear: () => void;
}

const CONFETTI_CHARS = ['*', '+', '.', 'o', '~', '^'];
const SPARK_CHARS = ['*', '.', "'", '`', ','];
const SPARKLE_CHARS = ['+', '*', '.', '`'];

const DEFAULT_COLORS: Record<EmitterType, string[]> = {
  confetti: ['#c084fc', '#f472b6', '#fbbf24', '#34d399', '#818cf8'],
  sparks: ['#fbbf24', '#fb923c', '#f59e0b'],
  sparkles: ['#e8d5f5', '#c084fc', '#fbbf24'],
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function rand(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function createConfettiParticle(x: number, y: number, colors: string[]): Particle {
  return {
    x,
    y,
    char: pick(CONFETTI_CHARS),
    color: pick(colors),
    vx: rand(-0.5, 0.5),
    vy: rand(0.1, 0.4),   // fall downward
    life: Math.floor(rand(20, 50)),
    maxLife: 50,
  };
}

function createSparkParticle(x: number, y: number, colors: string[]): Particle {
  const angle = Math.random() * Math.PI * 2;
  const speed = rand(0.3, 1.0);
  return {
    x,
    y,
    char: pick(SPARK_CHARS),
    color: pick(colors),
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed * 0.5, // flatten vertically since terminal chars are taller
    life: Math.floor(rand(8, 20)),
    maxLife: 20,
  };
}

function createSparkleParticle(x: number, y: number, colors: string[]): Particle {
  return {
    x: x + rand(-2, 2),
    y: y + rand(-1, 1),
    char: pick(SPARKLE_CHARS),
    color: pick(colors),
    vx: 0,
    vy: 0,
    life: Math.floor(rand(10, 30)),
    maxLife: 30,
  };
}

export function createParticleSystem(colors?: Partial<Record<EmitterType, string[]>>): ParticleSystem {
  const particles: Particle[] = [];

  const resolvedColors: Record<EmitterType, string[]> = {
    confetti: colors?.confetti ?? DEFAULT_COLORS.confetti,
    sparks: colors?.sparks ?? DEFAULT_COLORS.sparks,
    sparkles: colors?.sparkles ?? DEFAULT_COLORS.sparkles,
  };

  return {
    get particles() {
      return particles;
    },

    emit(x: number, y: number, count: number, type: EmitterType) {
      const colorSet = resolvedColors[type];
      for (let i = 0; i < count; i++) {
        switch (type) {
          case 'confetti':
            particles.push(createConfettiParticle(x, y, colorSet));
            break;
          case 'sparks':
            particles.push(createSparkParticle(x, y, colorSet));
            break;
          case 'sparkles':
            particles.push(createSparkleParticle(x, y, colorSet));
            break;
        }
      }
    },

    update() {
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]!;
        p.x += p.vx;
        p.y += p.vy;
        p.life--;

        if (p.life <= 0) {
          particles.splice(i, 1);
        }
      }
    },

    clear() {
      particles.length = 0;
    },
  };
}
