import { cn } from '@/lib/utils'

type TagProps = {
  children: string
  /** `accent` marks the technologies that define Vijay's specialism. */
  variant?: 'default' | 'accent'
  className?: string
}

/** Stack chip. Mono, because it is metadata rather than prose. */
export function Tag({ children, variant = 'default', className }: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-2 py-0.5',
        'font-mono text-[11px] leading-5 tracking-tight whitespace-nowrap',
        variant === 'accent'
          ? 'border-accent/35 bg-accent-soft text-accent'
          : 'border-border bg-surface text-muted',
        className,
      )}
    >
      {children}
    </span>
  )
}

/** The stack items worth pulling the eye toward. */
const SIGNATURE = new Set(['WebRTC', 'Socket.IO', 'React 19', 'TypeScript', 'Node.js'])

export function StackTags({ items, className }: { items: readonly string[]; className?: string }) {
  return (
    <ul className={cn('flex flex-wrap gap-1.5', className)}>
      {items.map((item) => (
        <li key={item}>
          <Tag variant={SIGNATURE.has(item) ? 'accent' : 'default'}>{item}</Tag>
        </li>
      ))}
    </ul>
  )
}
