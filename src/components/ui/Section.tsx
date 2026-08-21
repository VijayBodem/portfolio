import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Reveal } from './Reveal'

type SectionProps = {
  id: string
  /** Mono index, e.g. "01" — gives the page a documented, engineered feel. */
  index?: string
  title: string
  /** One line under the title, setting up what follows. */
  lede?: string
  children: ReactNode
  className?: string
  /** Alternate surface tone, to separate adjacent sections without a border. */
  tone?: 'base' | 'elevated'
}

export function Section({
  id,
  index,
  title,
  lede,
  children,
  className,
  tone = 'base',
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={cn(
        'py-section-sm md:py-section',
        tone === 'elevated' && 'bg-bg-elevated border-y',
        className,
      )}
    >
      <div className="container-page">
        <Reveal className="mb-12 md:mb-16 max-w-2xl">
          {index && (
            <div className="mono-label mb-4 flex items-center gap-3">
              <span>{index}</span>
              <span aria-hidden className="h-px w-8 bg-border-strong" />
            </div>
          )}
          <h2
            id={`${id}-heading`}
            className="text-3xl md:text-4xl font-semibold tracking-tight"
          >
            {title}
          </h2>
          {lede && (
            <p className="mt-4 text-base md:text-lg text-muted leading-relaxed">{lede}</p>
          )}
        </Reveal>

        {children}
      </div>
    </section>
  )
}
