/** Minimal class joiner — keeps a clsx dependency off the bundle. */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}

/** Copy marked TODO in content.ts should never render as if it were final. */
export function isTodo(value: string): boolean {
  return value.includes('TODO')
}
