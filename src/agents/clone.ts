// Clone lifecycle management — filled in by systems-dev agent
export interface CloneAgent {
  id: string;
  task: string;
  state: 'spawning' | 'working' | 'done' | 'merging';
  color: string;
}

export function spawnClone(_task: string): CloneAgent {
  return { id: '', task: '', state: 'spawning', color: '' };
}
