import { describe, expect, it } from 'vitest';
import { round } from './math';

describe('round', () => {
  it('rounds to 2 decimal places by default', () => {
    expect(round(1.234)).toBe(1.23);
    expect(round(1.235)).toBe(1.24); // standard "round half up"
    expect(round(123.456789)).toBe(123.46);
    expect(round(0.001)).toBe(0);
  });

  it('rounds to a specified number of decimal places', () => {
    expect(round(1.5, 0)).toBe(2);
    expect(round(1.234, 1)).toBe(1.2);
    expect(round(1.2349, 3)).toBe(1.235);
  });

  it('handles zero', () => {
    expect(round(0)).toBe(0);
    expect(round(0, 0)).toBe(0);
  });

  it('handles negative numbers', () => {
    expect(round(-1.234)).toBe(-1.23);
    expect(round(-1.236)).toBe(-1.24);
  });

  it('is stable for already-rounded values', () => {
    expect(round(1.23)).toBe(1.23);
    expect(round(100)).toBe(100);
  });

  it('handles large numbers', () => {
    expect(round(9999.999)).toBe(10000);
    expect(round(1_000_000.001)).toBe(1_000_000);
  });
});
