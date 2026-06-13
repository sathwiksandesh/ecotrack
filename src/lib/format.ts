/**
 * Display formatting helpers. Pure and locale-stable (fixed 'en-US' locale so the
 * UI and tests are deterministic).
 */

export function formatNumber(value: number, decimals = 0): string {
  if (!Number.isFinite(value)) return '—';
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/** Format kg CO₂e: shown in kg below 1 tonne, otherwise in tonnes. */
export function formatCo2(kg: number): string {
  if (!Number.isFinite(kg)) return '—';
  if (Math.abs(kg) >= 1000) {
    return `${formatNumber(kg / 1000, 2)} t CO₂e`;
  }
  return `${formatNumber(kg, 0)} kg CO₂e`;
}

export function formatTonnes(tonnes: number): string {
  if (!Number.isFinite(tonnes)) return '—';
  return `${formatNumber(tonnes, 2)} t CO₂e`;
}

export function formatPercent(value: number, decimals = 0): string {
  if (!Number.isFinite(value)) return '—';
  return `${formatNumber(value, decimals)}%`;
}
