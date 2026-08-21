import { Link } from 'react-router-dom'
import { experience, projects } from '@/data/content'
import { Section } from '@/components/ui/Section'
import { RevealGroup, RevealItem } from '@/components/ui/Reveal'

const projectTitle = (slug: string) =>
  projects.find((p) => p.slug === slug)?.title ?? slug

export function Experience() {
  return (
    <Section
      id="experience"
      index="02"
      title="Experience"
      lede="Compact by design — the work above is the evidence. This is the context around it."
      tone="elevated"
    >
      <RevealGroup as="ol" className="relative" stagger={0.08}>
        {experience.map((role, i) => (
          <RevealItem
            as="li"
            key={role.company}
            className={`relative pl-8 sm:pl-10 ${i < experience.length - 1 ? 'pb-10' : ''}`}
          >
            {/* Timeline rail. Decorative — the ordered list carries the meaning. */}
            {i < experience.length - 1 && (
              <span
                aria-hidden
                className="absolute left-[5px] top-4 h-full w-px bg-border"
              />
            )}
            <span
              aria-hidden
              className={`absolute left-0 top-[7px] size-[11px] rounded-full border-2 ${
                i === 0
                  ? 'border-accent bg-accent'
                  : 'border-border-strong bg-bg-elevated'
              }`}
            />

            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="text-lg font-semibold tracking-tight">
                {role.title}
                <span className="text-muted"> · {role.company}</span>
              </h3>
              <span className="mono-label">{role.period}</span>
            </div>

            <p className="mt-1 text-sm text-dim">{role.location}</p>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">
              {role.summary}
            </p>

            <ul className="mt-4 space-y-2.5">
              {role.highlights.map((highlight) => (
                <li
                  key={highlight}
                  className="relative max-w-2xl pl-5 text-[15px] leading-relaxed text-muted"
                >
                  <span
                    aria-hidden
                    className="absolute left-0 top-[9px] size-1.5 rounded-full bg-border-strong"
                  />
                  {highlight}
                </li>
              ))}
            </ul>

            {role.relatedProjects.length > 0 && (
              <p className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                <span className="mono-label">Built here</span>
                {role.relatedProjects.map((slug) => (
                  <Link
                    key={slug}
                    to={`/work/${slug}`}
                    className="rounded-md border border-border px-2 py-0.5 font-mono text-[11px]
                               text-muted transition-colors duration-150
                               hover:border-accent/40 hover:text-accent"
                  >
                    {projectTitle(slug)}
                  </Link>
                ))}
              </p>
            )}
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  )
}
