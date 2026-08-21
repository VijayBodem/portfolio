import { cn } from '@/lib/utils'

type FlowDiagramProps = {
  nodes: readonly string[]
  caption: string
  className?: string
}

/**
 * Architecture diagram as flex boxes plus CSS connectors rather than inline SVG.
 * Deliberate: the node labels stay real selectable text (good for a11y and for
 * recruiters using Ctrl+F), and the whole thing reflows to a vertical stack on
 * mobile instead of overflowing a fixed viewBox.
 */
export function FlowDiagram({ nodes, caption, className }: FlowDiagramProps) {
  return (
    <figure className={cn('rounded-card border bg-surface p-6 md:p-8', className)}>
      <div
        className="flex flex-col items-stretch gap-0 sm:flex-row sm:items-center"
        role="img"
        aria-label={`Architecture: ${nodes.join(' to ')}. ${caption}`}
      >
        {nodes.map((node, i) => (
          <div
            key={node}
            className="flex flex-col items-center sm:flex-1 sm:flex-row"
          >
            <div
              className="w-full rounded-lg border border-border-strong bg-bg-elevated
                         px-4 py-3 text-center font-mono text-xs leading-5 text-text
                         sm:text-[11px]"
            >
              {node}
            </div>

            {i < nodes.length - 1 && <Connector />}
          </div>
        ))}
      </div>

      <figcaption className="mt-6 border-t pt-4 text-sm leading-relaxed text-muted">
        {caption}
      </figcaption>
    </figure>
  )
}

/** Vertical on mobile, horizontal from `sm` up. Decorative only. */
function Connector() {
  return (
    <span aria-hidden className="flex shrink-0 items-center justify-center">
      {/* mobile: downward */}
      <span className="flex h-8 w-px flex-col items-center bg-border-strong sm:hidden">
        <span className="mt-auto size-1.5 translate-y-px rotate-45 border-r border-b border-border-strong" />
      </span>
      {/* desktop: rightward */}
      <span className="hidden h-px w-6 items-center bg-border-strong sm:flex md:w-8">
        <span className="ml-auto size-1.5 -translate-x-px -rotate-45 border-t border-r border-border-strong" />
      </span>
    </span>
  )
}
