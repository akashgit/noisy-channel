// Particle system — filled in by engine-dev agent
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

export interface ParticleSystem {
  particles: Particle[];
  emit: (x: number, y: number, count: number, type: 'confetti' | 'sparks' | 'sparkles') => void;
  update: () => void;
}

export function createParticleSystem(): ParticleSystem {
  return { particles: [], emit: () => {}, update: () => {} };
}
