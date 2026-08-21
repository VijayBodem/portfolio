import { skills } from '@/data/content'
import { Section } from '@/components/ui/Section'
import { RevealGroup, RevealItem } from '@/components/ui/Reveal'
import { Tag } from '@/components/ui/Tag'

/**
 * Tiered rather than a flat tag cloud. The point of the tiers is honesty:
 * naming what is only "familiar" removes interview risk and reads as more
 * senior than claiming forty technologies at equal depth.
 */
export function Skills() {
  return (
    <Section
      id="skills"
      index="03"
      title="Technical skills"
      lede="Grouped by how deep I actually am, not by how long the list can be made."
    >
      <RevealGroup className="grid gap-4" stagger={0.07}>
        {skills.map((tier, i) => (
          <RevealItem key={tier.tier}>
            <div className="rounded-card border bg-surface p-6 md:p-8">
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <h3 className="text-lg font-semibold tracking-tight">
                  {i === 0 && <span className="mr-2 text-accent">◆</span>}
                  {tier.tier}
                </h3>
                <p className="text-sm text-dim">{tier.note}</p>
              </div>

              <div className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
                {tier.groups.map((group) => (
                  <div key={group.label}>
                    <h4 className="mono-label mb-2.5">{group.label}</h4>
                    <ul className="flex flex-wrap gap-1.5">
                      {group.items.map((item) => (
                        <li key={item}>
                          <Tag variant={i === 0 ? 'accent' : 'default'}>{item}</Tag>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  )
}
