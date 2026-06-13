import { describe, expect, it } from 'vitest';
import { formatCo2, formatNumber, formatPercent, formatTonnes } from './format';

describe('formatNumber', () => {
  it('formats integers with thousands separators', () => {
    expect(formatNumber(1234, 0)).toBe('1,234');
  });

  it('formats with a fixed number of decimals', () => {
    expect(formatNumber(1.5, 2)).toBe('1.50');
  });

  it('returns an em dash for non-finite values', () => {
    expect(formatNumber(Number.NaN)).toBe('—');
  });
});

describe('formatCo2', () => {
  it('shows kilograms below one tonne', () => {
    expect(formatCo2(950)).toBe('950 kg CO₂e');
    expect(formatCo2(999)).toBe('999 kg CO₂e');
  });

  it('shows tonnes at or above one tonne', () => {
    expect(formatCo2(1500)).toBe('1.50 t CO₂e');
    expect(formatCo2(2000)).toBe('2.00 t CO₂e');
  });

  it('returns an em dash for non-finite values', () => {
    expect(formatCo2(Number.NaN)).toBe('—');
  });
});

describe('formatTonnes', () => {
  it('formats tonnes with two decimals', () => {
    expect(formatTonnes(2.3)).toBe('2.30 t CO₂e');
  });
});

describe('formatPercent', () => {
  it('appends a percent sign', () => {
    expect(formatPercent(42)).toBe('42%');
  });

  it('returns an em dash for non-finite values', () => {
    expect(formatPercent(Number.POSITIVE_INFINITY)).toBe('—');
  });
});
