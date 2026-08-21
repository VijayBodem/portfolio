import { Mail } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from '@/components/ui/BrandIcons'
import { profile } from '@/data/content'

export function Footer() {
  return (
    <footer className="border-t py-10">
      <div className="container-page flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <p className="mono-label normal-case tracking-normal">
          {profile.name} — built with React, TypeScript and Tailwind CSS.
        </p>

        <ul className="flex items-center gap-1">
          {[
            { href: profile.links.github, label: 'GitHub', Icon: GithubIcon },
            { href: profile.links.linkedin, label: 'LinkedIn', Icon: LinkedinIcon },
            { href: `mailto:${profile.email}`, label: 'Email', Icon: Mail },
          ].map(({ href, label, Icon }) => (
            <li key={label}>
              <a
                href={href}
                target={href.startsWith('mailto:') ? undefined : '_blank'}
                rel="noreferrer noopener"
                aria-label={label}
                className="grid size-10 place-items-center rounded-lg text-dim sm:size-9
                           transition-colors duration-150 hover:text-accent"
              >
                <Icon size={16} aria-hidden />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
