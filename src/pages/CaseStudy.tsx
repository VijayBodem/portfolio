import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, Hammer, KeyRound, Lock } from 'lucide-react'
import { projects } from '@/data/content'
import { Reveal } from '@/components/ui/Reveal'
import { StackTags } from '@/components/ui/Tag'
import { FlowDiagram } from '@/components/ui/FlowDiagram'
import { isTodo } from '@/lib/utils'

export default function CaseStudy() {
  const { slug } = useParams()
  const project = projects.find((p) => p.slug === slug)

  useEffect(() => {
    window.scrollTo(0, 0)
    if (project) document.title = `${project.title} — Vijay Bodem`
    return () => {
      document.title = 'Vijay Bodem — Full-Stack Engineer'
    }
  }, [project])

  if (!project) {
    return (
      <div className="container-page py-40 text-center">
        <h1 className="text-2xl font-semibold">Case study not found</h1>
        <Link to="/" className="mt-4 inline-block text-accent hover:underline">
          Back to home
        </Link>
      </div>
    )
  }

  // Only ever render a link that actually goes somewhere.
  const publicLinks = project.links?.filter((l) => !isTodo(l.href)) ?? []

  return (
    <article className="pt-28 pb-section-sm md:pt-36 md:pb-section">
      <div className="container-page">
        <Reveal>
          <Link
            to="/#work"
            className="mono-label inline-flex items-center gap-2 transition-colors
                       duration-150 hover:text-accent"
          >
            <ArrowLeft size={13} aria-hidden />
            All work
          </Link>

          <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="mono-label">{project.period}</span>
            <span aria-hidden className="h-px w-6 bg-border-strong" />
            <span className="mono-label">{project.org}</span>
          </div>

          <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
            {project.title}
          </h1>
          <p className="mt-2 text-xl text-muted md:text-2xl">{project.subtitle}</p>

          <p className="mt-7 max-w-3xl border-l-2 border-accent pl-5 text-lg leading-relaxed text-text md:text-xl">
            {project.hook}
          </p>

          <StackTags items={project.stack} className="mt-8" />

          {(publicLinks.length > 0 || project.access !== 'public') && (
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {publicLinks.map((link, i) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={`inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm
                              font-semibold transition-colors duration-150 ${
                                i === 0
                                  ? 'bg-accent text-accent-contrast hover:bg-accent-hover'
                                  : 'border border-border text-text hover:border-border-strong hover:bg-surface-hover'
                              }`}
                >
                  {link.label}
                  <ArrowUpRight size={14} aria-hidden />
                </a>
              ))}

              {project.access === 'proprietary' && (
                <p className="inline-flex items-center gap-2 rounded-lg border border-border
                              bg-surface px-4 py-2.5 text-sm text-muted">
                  <Lock size={14} aria-hidden className="text-dim" />
                  Proprietary product — source and live access are not public
                </p>
              )}

              {project.access === 'pending' && (
                <p className="inline-flex items-center gap-2 rounded-lg border border-border
                              bg-surface px-4 py-2.5 text-sm text-muted">
                  <Hammer size={14} aria-hidden className="text-dim" />
                  Built and running locally — public deployment in progress
                </p>
              )}
            </div>
          )}

          {project.demoCredentials && (
            <div className="mt-4 inline-flex flex-wrap items-center gap-x-6 gap-y-2 rounded-lg
                            border border-accent/30 bg-accent-soft px-5 py-3.5">
              <span className="mono-label inline-flex items-center gap-2 text-accent">
                <KeyRound size={13} aria-hidden />
                Demo login
              </span>
              <span className="font-mono text-sm text-text">
                {project.demoCredentials.email}
              </span>
              <span className="font-mono text-sm text-text">
                {project.demoCredentials.password}
              </span>
            </div>
          )}
        </Reveal>

        <div className="mt-16 grid gap-14 md:mt-20 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-16">
          <div className="min-w-0 space-y-14">
            <Block heading="Context">
              <Prose>{project.context}</Prose>
            </Block>

            <Block heading="The hard part">
              <Prose>{project.problem}</Prose>
            </Block>

            <Block heading="Architecture">
              <FlowDiagram
                nodes={project.diagram.nodes}
                caption={project.diagram.caption}
                className="mb-6"
              />
              <Prose>{project.architecture}</Prose>
            </Block>

            <Block heading="What I built">
              <ul className="space-y-3.5">
                {project.contributions.map((item) => (
                  <li
                    key={item}
                    className={`relative pl-6 text-[15px] leading-relaxed md:text-base ${
                      isTodo(item) ? 'text-dim italic' : 'text-muted'
                    }`}
                  >
                    <span
                      aria-hidden
                      className={`absolute left-0 top-[10px] size-1.5 rounded-full ${
                        isTodo(item) ? 'bg-border-strong' : 'bg-accent'
                      }`}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </Block>

            {/* The section engineers and technical leads actually read. */}
            <Block
              heading="Decisions"
              note="Chose X over Y, and why — the reasoning, not just the outcome."
            >
              <ul className="space-y-4">
                {project.decisions.map((decision) => (
                  <li
                    key={decision.choice}
                    className="rounded-card border bg-surface p-5 md:p-6"
                  >
                    <h4
                      className={`text-[15px] font-semibold leading-snug md:text-base ${
                        isTodo(decision.choice) ? 'text-dim italic' : 'text-text'
                      }`}
                    >
                      {decision.choice}
                    </h4>
                    <p
                      className={`mt-2.5 text-[15px] leading-relaxed ${
                        isTodo(decision.rationale) ? 'text-dim italic' : 'text-muted'
                      }`}
                    >
                      {decision.rationale}
                    </p>
                  </li>
                ))}
              </ul>
            </Block>

            <Block heading="Outcome">
              <Prose>{project.outcome}</Prose>
            </Block>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-card border bg-surface p-6">
              <h3 className="mono-label mb-4">At a glance</h3>
              <dl className="space-y-4 text-sm">
                <div>
                  <dt className="text-dim">Type</dt>
                  <dd className="mt-0.5 text-text">
                    {project.kind === 'personal' ? 'Personal project' : 'Product work'}
                  </dd>
                </div>
                <div>
                  <dt className="text-dim">Organisation</dt>
                  <dd className="mt-0.5 text-text">{project.org}</dd>
                </div>
                <div>
                  <dt className="text-dim">Period</dt>
                  <dd className="mt-0.5 font-mono text-[13px] text-text">{project.period}</dd>
                </div>
                <div>
                  <dt className="text-dim">Stack</dt>
                  <dd className="mt-2">
                    <StackTags items={project.stack} />
                  </dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>

        <NextProject slug={project.slug} />
      </div>
    </article>
  )
}

function Block({
  heading,
  note,
  children,
}: {
  heading: string
  note?: string
  children: React.ReactNode
}) {
  return (
    <Reveal as="section">
      <h2 className="text-xl font-semibold tracking-tight md:text-2xl">{heading}</h2>
      {note && <p className="mt-1.5 text-sm text-dim">{note}</p>}
      <div className="mt-5">{children}</div>
    </Reveal>
  )
}

function Prose({ children }: { children: string }) {
  return (
    <p
      className={`max-w-3xl text-[15px] leading-relaxed md:text-base ${
        isTodo(children) ? 'text-dim italic' : 'text-muted'
      }`}
    >
      {children}
    </p>
  )
}

function NextProject({ slug }: { slug: string }) {
  const index = projects.findIndex((p) => p.slug === slug)
  const next = projects[(index + 1) % projects.length]
  if (next.slug === slug) return null

  return (
    <Reveal className="mt-20 border-t pt-10 md:mt-24">
      <Link to={`/work/${next.slug}`} className="group block">
        <span className="mono-label">Next case study</span>
        <p className="mt-2 flex items-center gap-3 text-2xl font-semibold tracking-tight
                      transition-colors duration-150 group-hover:text-accent md:text-3xl">
          {next.title}
          <ArrowUpRight
            size={22}
            aria-hidden
            className="transition-transform duration-200 group-hover:-translate-y-0.5
                       group-hover:translate-x-0.5"
          />
        </p>
        <p className="mt-1 text-muted">{next.subtitle}</p>
      </Link>
    </Reveal>
  )
}
