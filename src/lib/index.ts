/**
 * Public API for the EcoTrack AI logic core ("backend").
 *
 * The frontend should import everything it needs from `@/lib`. Keeping a single
 * barrel here means the UI never reaches into individual modules, so the internal
 * file layout can change without touching component code.
 */
export * from './emission-factors';
export * from './schemas';
export * from './calculator';
export * from './comparisons';
export * from './breakdown';
export * from './goal';
export * from './tips-engine';
export * from './storage';
export * from './format';
export * from './math';
