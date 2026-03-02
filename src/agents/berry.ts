// Berry protagonist logic — filled in by systems-dev agent
export interface BerryAgent {
  state: string;
  clones: string[];
  tools: string[];
}

export function createBerryAgent(): BerryAgent {
  return { state: 'idle', clones: [], tools: [] };
}
