import { motion, useReducedMotion } from 'framer-motion'
import { ArrowDown, ArrowUpRight, FileText, MapPin } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from '@/components/ui/BrandIcons'
import { profile, proofPoints } from '@/data/content'
import { heroLine, staggerChildren } from '@/lib/motion'

export function Hero() {
  const reduced = useReducedMotion()

  // One-time entrance only. Nothing here gates first paint of the text itself —
  // a recruiter with 60 seconds should never be waiting on an animation.
  const container = reduced ? undefined : staggerChildren(0.09, 0.05)
  const line = reduced ? undefined : heroLine

  return (
    <section className="relative overflow-hidden pt-32 pb-16 md:pt-44 md:pb-24">
      {/* The one background texture the design allows itself. */}
      <div
        aria-hidden
        className="grid-texture pointer-events-none absolute inset-0
                   [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]"
      />

      <div className="container-page relative">
        <motion.div
          variants={container}
          initial={reduced ? undefined : 'hidden'}
          animate={reduced ? undefined : 'visible'}
          className="max-w-3xl"
        >
          <motion.p
            variants={line}
            className="mono-label flex items-center gap-2 text-accent"
          >
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full rounded-full bg-accent opacity-60 motion-safe:animate-ping" />
              <span className="relative inline-flex size-1.5 rounded-full bg-accent" />
            </span>
            Available for new roles
          </motion.p>

          <motion.h1
            variants={line}
            className="mt-6 text-4xl font-semibold leading-[1.08] tracking-tight
                       sm:text-5xl md:text-6xl"
          >
            {profile.name}
          </motion.h1>

          <motion.p
            variants={line}
            className="mt-4 text-xl font-medium text-muted sm:text-2xl md:text-3xl"
          >
            {profile.role}
            <span className="mx-2 text-dim" aria-hidden>
              /
            </span>
            <span className="text-accent">{profile.specialism}</span>
          </motion.p>

          <motion.p
            variants={line}
            className="mt-7 max-w-2xl text-base leading-relaxed text-muted md:text-lg"
          >
            {profile.tagline}
          </motion.p>

          <motion.div variants={line} className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#work"
              className="group inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3
                         text-sm font-semibold text-accent-contrast
                         transition-colors duration-150 hover:bg-accent-hover"
            >
              View selected work
              <ArrowDown
                size={15}
                aria-hidden
                className="transition-transform duration-200 group-hover:translate-y-0.5"
              />
            </a>
            <a
              href={profile.links.resume}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-3
                         text-sm font-semibold text-text transition-colors duration-150
                         hover:border-border-strong hover:bg-surface-hover"
            >
              <FileText size={15} aria-hidden />
              Résumé
            </a>
          </motion.div>

          <motion.div
            variants={line}
            className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-dim"
          >
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={14} aria-hidden />
              {profile.location}
            </span>
            <a
              href={profile.links.github}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 transition-colors duration-150 hover:text-accent"
            >
              <GithubIcon size={14} />
              GitHub
              <ArrowUpRight size={12} aria-hidden />
            </a>
            <a
              href={profile.links.linkedin}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 transition-colors duration-150 hover:text-accent"
            >
              <LinkedinIcon size={14} />
              LinkedIn
              <ArrowUpRight size={12} aria-hidden />
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

/** Scannable credibility, immediately below the hero. */
export function ProofStrip() {
  return (
    <div className="border-y bg-bg-elevated">
      <div className="container-page">
        <dl className="grid grid-cols-2 divide-border md:grid-cols-4 md:divide-x">
          {proofPoints.map((point, i) => (
            <div
              key={point.label}
              className={`px-0 py-6 md:px-6 md:py-8 ${i === 0 ? 'md:pl-0' : ''}`}
            >
              <dt className="font-mono text-xl font-semibold tracking-tight text-accent md:text-2xl">
                {point.value}
              </dt>
              <dd className="mt-1.5 max-w-[16rem] text-xs leading-relaxed text-muted md:text-sm">
                {point.label}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}
