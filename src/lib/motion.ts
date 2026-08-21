import type { Variants } from 'framer-motion'

/**
 * Every animation on the site comes from here, so the motion language stays
 * consistent and the reduced-motion path has exactly one place to short-circuit.
 *
 * Rules encoded below:
 *  - transform and opacity only (compositor-friendly, holds 60fps)
 *  - nothing longer than 600ms
 *  - reveals fire once, never on every scroll-past
 */

const EASE_OUT_SOFT = [0.16, 1, 0.3, 1] as const

/** Section and card entry: a short rise into place. */
export const riseIn: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE_OUT_SOFT },
  },
}

/** Parent wrapper that walks its children in. Keep stagger small. */
export const staggerChildren = (stagger = 0.06, delayChildren = 0): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren },
  },
})

/** Hero lines: slightly larger travel, since nothing competes with it. */
export const heroLine: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_OUT_SOFT },
  },
}

/** Shared viewport config — `once` is the important part. */
export const viewportOnce = { once: true, amount: 0.2 } as const
