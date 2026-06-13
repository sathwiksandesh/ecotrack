import { describe, expect, it } from 'vitest';
import { compareToTarget, compareToAverage } from './comparisons';

describe('compareToTarget', () => {
  it('treats a footprint at the target as "below"', () => {
    const c = compareToTarget(2.3);
    expect(c.status).toBe('below');
    expect(c.ratio).toBeCloseTo(1);
    expect(c.deltaTonnes).toBeCloseTo(0);
  });

  it('treats a small overshoot as "near"', () => {
    const c = compareToTarget(2.4);
    expect(c.status).toBe('near');
    expect(c.deltaTonnes).toBeCloseTo(0.1);
  });

  it('treats a large footprint as "above"', () => {
    const c = compareToTarget(5);
    expect(c.status).toBe('above');
    expect(c.deltaTonnes).toBeCloseTo(2.7);
  });
});

describe('compareToAverage', () => {
  it('reports being on the regional average as "near"', () => {
    const c = compareToAverage(4.7, 'GLOBAL');
    expect(c.average).toBe(4.7);
    expect(c.percentOfAverage).toBe(100);
    expect(c.status).toBe('near');
  });

  it('reports a low footprint as "below"', () => {
    const c = compareToAverage(2, 'GLOBAL');
    expect(c.status).toBe('below');
    expect(c.percentOfAverage).toBeLessThan(95);
  });

  it('reports a high footprint as "above" using the regional baseline', () => {
    const c = compareToAverage(20, 'US');
    expect(c.average).toBe(14);
    expect(c.status).toBe('above');
    expect(c.percentOfAverage).toBeGreaterThan(105);
  });
});
