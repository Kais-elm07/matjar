/**
 * Type guards for data read at runtime (JSON files and browser storage).
 * The data is checked with these instead of being trusted with a type assertion.
 */

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

export function isString(value: unknown): value is string {
  return typeof value === "string"
}

/** A real number: rejects NaN and Infinity. */
export function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value)
}

export function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean"
}

/** An array whose items all pass `isItem`. */
export function isArrayOf<T>(
  value: unknown,
  isItem: (item: unknown) => item is T
): value is T[] {
  return Array.isArray(value) && value.every(isItem)
}

/** null, or a value that passes `isValue`. */
export function isNullOr<T>(
  value: unknown,
  isValue: (item: unknown) => item is T
): value is T | null {
  return value === null || isValue(value)
}
