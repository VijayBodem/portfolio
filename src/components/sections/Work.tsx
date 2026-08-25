import { Link } from 'react-router-dom'
import { ArrowRight, Building2, Lock, User } from 'lucide-react'
import { projects, type Project } from '@/data/content'
import { Section } from '@/components/ui/Section'
import { RevealGroup, RevealItem } from '@/components/ui/Reveal'
import { StackTags } from '@/components/ui/Tag'

export function Work() {
  const flagship = projects.filter((p) => p.tier === 'flagship')
  const secondary = projects.filter((p) => p.tier === 'secondary')

  return (
    <Section
      id="work"
      index="01"
      title="Selected work"
      lede="Six platforms — five built inside companies, including a national health service, a delivered architecture migration and an enterprise build started from nothing, plus one built entirely on my own. Each case study covers the hard part and the decisions behind it."
    >
      <RevealGroup className="grid gap-5" stagger={0.08}>
        {flagship.map((project) => (
          <RevealItem key={project.slug} as="article">
            <FlagshipCard project={project} />
          </RevealItem>
        ))}
      </RevealGroup>

      {secondary.length > 0 && (
        <RevealGroup className="mt-5 grid gap-5 sm:grid-cols-2" stagger={0.06}>
          {secondary.map((project) => (
            <RevealItem key={project.slug} as="article">
              <SecondaryCard project={project} />
            </RevealItem>
          ))}
        </RevealGroup>
      )}
    </Section>
  )
}

function KindBadge({ kind }: { kind: Project['kind'] }) {
  const Icon = kind === 'personal' ? User : Building2
  return (
    <span className="mono-label inline-flex items-center gap-1.5">
      <Icon size={12} aria-hidden />
      {kind === 'personal' ? 'Personal project' : 'Product work'}
    </span>
  )
}

/**
 * Ongoing work gets a live marker — "what are you doing right now" is one of the
 * first questions a recruiter has, so it should be answerable at a glance.
 */
function PeriodLabel({ period }: { period: string }) {
  if (!period.endsWith('Present')) return <span className="mono-label">{period}</span>

  return (
    <span className="mono-label inline-flex items-center gap-2 text-accent">
      <span className="relative flex size-1.5">
        <span className="absolute inline-flex size-full rounded-full bg-accent opacity-60 motion-safe:animate-ping" />
        <span className="relative inline-flex size-1.5 rounded-full bg-accent" />
      </span>
      {period}
    </span>
  )
}

/**
 * Says only what is true right now. `pending` renders nothing at all — a
 * portfolio should not draw attention to an absence, and "coming soon" on a
 * personal project reads worse than saying nothing and letting the case study
 * carry it.
 */
function AccessNote({ access }: { access: Project['access'] }) {
  if (access === 'proprietary') {
    return (
      <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-dim md:justify-end">
        <Lock size={11} aria-hidden />
        Proprietary — no public repo
      </p>
    )
  }

  if (access === 'public') {
    return <p className="mt-3 text-xs text-dim">Live demo and source available</p>
  }

  return null
}

function FlagshipCard({ project }: { project: Project }) {
  return (
    <Link
      to={`/work/${project.slug}`}
      className="group block rounded-card border bg-surface p-6 transition-all duration-200
                 hover:-translate-y-0.5 hover:border-border-strong hover:bg-surface-hover
                 md:p-8"
    >
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <KindBadge kind={project.kind} />
        <PeriodLabel period={project.period} />
      </div>

      <div className="mt-5 flex flex-col gap-6 md:flex-row md:items-start md:gap-10">
        <div className="md:flex-1">
          <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">
            {project.title}
            <span className="block text-base font-normal text-muted md:text-lg">
              {project.subtitle}
            </span>
          </h3>

          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted md:text-base">
            {project.hook}
          </p>

          <StackTags items={project.stack.slice(0, 7)} className="mt-6" />
        </div>

        <div className="shrink-0 md:w-44 md:text-right">
          <span
            className="inline-flex items-center gap-2 text-sm font-medium text-accent
                       transition-transform duration-200 group-hover:translate-x-0.5"
          >
            Read case study
            <ArrowRight size={15} aria-hidden />
          </span>

          <AccessNote access={project.access} />
        </div>
      </div>
    </Link>
  )
}

function SecondaryCard({ project }: { project: Project }) {
  return (
    <Link
      to={`/work/${project.slug}`}
      className="group flex h-full flex-col rounded-card border bg-surface p-6
                 transition-all duration-200 hover:-translate-y-0.5
                 hover:border-border-strong hover:bg-surface-hover"
    >
      <div className="flex items-center justify-between gap-4">
        <KindBadge kind={project.kind} />
        <PeriodLabel period={project.period} />
      </div>

      <h3 className="mt-4 text-lg font-semibold tracking-tight">
        {project.title}
        <span className="block text-sm font-normal text-muted">{project.subtitle}</span>
      </h3>

      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{project.hook}</p>

      <StackTags items={project.stack.slice(0, 5)} className="mt-5" />

      <span
        className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-accent
                   transition-transform duration-200 group-hover:translate-x-0.5"
      >
        Read more
        <ArrowRight size={14} aria-hidden />
      </span>
    </Link>
  )
}
