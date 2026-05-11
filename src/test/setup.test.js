import { describe, it, expect } from 'vitest';

describe('Vitest setup', () => {
  it('should run a trivial test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should have jsdom environment available', () => {
    expect(document).toBeDefined();
    expect(document.createElement('div')).toBeDefined();
  });
});
