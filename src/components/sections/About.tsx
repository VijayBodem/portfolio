import { useState } from 'react'
import { about, education, profile } from '@/data/content'
import { Section } from '@/components/ui/Section'
import { Reveal } from '@/components/ui/Reveal'

/**
 * Uses public/vijay.jpg when it is there and falls back to a monogram when it is
 * not — so the section looks deliberate either way, rather than showing a hole
 * where a photo should be. Drop the file in and it appears; no code change.
 */
function Portrait() {
  const [hasPhoto, setHasPhoto] = useState(true)
  const initials = profile.name
    .split(' ')
    .map((part) => part[0])
    .join('')

  return (
    <div
      className="mb-8 aspect-[4/5] w-full max-w-[15rem] overflow-hidden rounded-card
                 border bg-surface"
    >
      {hasPhoto ? (
        <img
          src="/vijay.jpg"
          alt={`${profile.name}, ${profile.role}`}
          onError={() => setHasPhoto(false)}
          className="size-full object-cover"
        />
      ) : (
        <div className="grid h-full place-items-center" aria-hidden>
          <span className="font-mono text-5xl font-semibold tracking-tight text-dim">
            {initials}
          </span>
        </div>
      )}
    </div>
  )
}

export function About() {
  return (
    <Section id="about" index="04" title="About" tone="elevated">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-16">
        <Reveal>
          <h3 className="text-xl font-semibold leading-snug tracking-tight md:text-2xl">
            {about.heading}
          </h3>

          <div className="mt-6 space-y-5">
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-[15px] leading-relaxed text-muted md:text-base">
                {paragraph}
              </p>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <Portrait />

          <dl className="space-y-4">
            {about.facts.map((fact) => (
              <div key={fact.label} className="border-b pb-4">
                <dt className="mono-label">{fact.label}</dt>
                <dd className="mt-1.5 text-[15px] text-text">{fact.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8">
            <h4 className="mono-label mb-3">Education</h4>
            <ul className="space-y-3">
              {education.map((entry) => (
                <li key={entry.qualification}>
                  <p className="text-sm font-medium text-text">{entry.qualification}</p>
                  <p className="mt-0.5 text-sm text-dim">{entry.institution}</p>
                  <p className="mt-0.5 font-mono text-[11px] text-dim">{entry.period}</p>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
