/**
 * Minimal className combiner.
 *
 * Joins truthy string class fragments with a single space. Intentionally tiny —
 * we avoid pulling in `clsx`/`classnames` to keep the bundle and dependency
 * surface small. Later fragments win at the source level; we do not attempt
 * Tailwind conflict resolution, so order class names so the intended utility
 * comes last.
 *
 * Only `string` values are accepted: numeric class names are not valid in
 * Tailwind or standard HTML, so the type narrows accordingly.
 */
export type ClassValue = string | false | null | undefined;

export function cn(...values: ClassValue[]): string {
  return values.filter((v): v is string => typeof v === 'string' && v.length > 0).join(' ');
}
