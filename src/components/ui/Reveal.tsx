import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { riseIn, staggerChildren, viewportOnce } from '@/lib/motion'
import { cn } from '@/lib/utils'

type RevealProps = {
  children: ReactNode
  className?: string
  /** Seconds. Use sparingly — long delays feel like lag, not polish. */
  delay?: number
  as?: 'div' | 'li' | 'section' | 'article'
}

/**
 * Single reveal primitive: a 16px rise, once, on scroll into view.
 * When the user prefers reduced motion the content renders immediately with no
 * transform at all — not a faster animation, no animation.
 */
export function Reveal({ children, className, delay = 0, as = 'div' }: RevealProps) {
  const reduced = useReducedMotion()
  const Component = motion[as]

  if (reduced) {
    const Static = as
    return <Static className={className}>{children}</Static>
  }

  return (
    <Component
      className={className}
      variants={riseIn}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      transition={delay ? { delay } : undefined}
    >
      {children}
    </Component>
  )
}

type RevealGroupProps = {
  children: ReactNode
  className?: string
  stagger?: number
  as?: 'div' | 'ul' | 'ol'
}

/** Parent for lists whose items should walk in. Pair with `RevealItem`. */
export function RevealGroup({
  children,
  className,
  stagger = 0.06,
  as = 'div',
}: RevealGroupProps) {
  const reduced = useReducedMotion()
  const Component = motion[as]

  if (reduced) {
    const Static = as
    return <Static className={className}>{children}</Static>
  }

  return (
    <Component
      className={className}
      variants={staggerChildren(stagger)}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
    >
      {children}
    </Component>
  )
}

type RevealItemProps = {
  children: ReactNode
  className?: string
  as?: 'div' | 'li' | 'article'
}

export function RevealItem({ children, className, as = 'div' }: RevealItemProps) {
  const reduced = useReducedMotion()
  const Component = motion[as]

  if (reduced) {
    const Static = as
    return <Static className={className}>{children}</Static>
  }

  return (
    <Component className={cn(className)} variants={riseIn}>
      {children}
    </Component>
  )
}
