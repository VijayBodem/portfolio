import { ArrowUpRight, FileText, Mail } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from '@/components/ui/BrandIcons'
import { profile } from '@/data/content'
import { Reveal } from '@/components/ui/Reveal'

/**
 * Deliberately no phone number: this page is public and a phone number here
 * gets scraped. Email, LinkedIn and GitHub are enough for anyone serious.
 */
export function Contact() {
  const channels = [
    {
      label: 'Email',
      value: profile.email,
      href: `mailto:${profile.email}`,
      Icon: Mail,
      primary: true,
    },
    {
      label: 'LinkedIn',
      value: 'Connect and message',
      href: profile.links.linkedin,
      Icon: LinkedinIcon,
      primary: false,
    },
    {
      label: 'GitHub',
      value: 'VijayBodem',
      href: profile.links.github,
      Icon: GithubIcon,
      primary: false,
    },
    {
      label: 'Résumé',
      value: 'Download PDF',
      href: profile.links.resume,
      Icon: FileText,
      primary: false,
    },
  ]

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative overflow-hidden py-section-sm md:py-section"
    >
      <div
        aria-hidden
        className="grid-texture pointer-events-none absolute inset-0
                   [mask-image:radial-gradient(ellipse_55%_60%_at_50%_100%,black,transparent)]"
      />

      <div className="container-page relative">
        <Reveal className="max-w-2xl">
          <div className="mono-label mb-4 flex items-center gap-3">
            <span>05</span>
            <span aria-hidden className="h-px w-8 bg-border-strong" />
          </div>

          <h2
            id="contact-heading"
            className="text-3xl font-semibold tracking-tight md:text-4xl"
          >
            Let’s talk.
          </h2>

          <p className="mt-4 text-base leading-relaxed text-muted md:text-lg">
            {profile.availability} If you are building something where real-time
            behaviour, reliability or state consistency is the hard part, that is the
            work I want.
          </p>
        </Reveal>

        <Reveal delay={0.08} className="mt-10">
          <ul className="grid gap-3 sm:grid-cols-2">
            {channels.map(({ label, value, href, Icon, primary }) => (
              <li key={label}>
                <a
                  href={href}
                  target={href.startsWith('mailto:') || href.startsWith('/') ? undefined : '_blank'}
                  rel="noreferrer noopener"
                  className={`group flex items-center gap-4 rounded-card border p-5
                              transition-all duration-200 hover:-translate-y-0.5
                              ${
                                primary
                                  ? 'border-accent/35 bg-accent-soft hover:border-accent/60'
                                  : 'bg-surface hover:border-border-strong hover:bg-surface-hover'
                              }`}
                >
                  <Icon
                    size={18}
                    aria-hidden
                    className={primary ? 'text-accent' : 'text-dim'}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="mono-label block">{label}</span>
                    <span className="mt-1 block truncate text-[15px] font-medium text-text">
                      {value}
                    </span>
                  </span>
                  <ArrowUpRight
                    size={16}
                    aria-hidden
                    className="shrink-0 text-dim transition-transform duration-200
                               group-hover:-translate-y-0.5 group-hover:translate-x-0.5
                               group-hover:text-accent"
                  />
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
