import { Hero, ProofStrip } from '@/components/sections/Hero'
import { Work } from '@/components/sections/Work'
import { Experience } from '@/components/sections/Experience'
import { Skills } from '@/components/sections/Skills'
import { About } from '@/components/sections/About'
import { Contact } from '@/components/sections/Contact'

export default function Home() {
  return (
    <>
      <Hero />
      <ProofStrip />
      {/* Work before skills, always: skills are claims, projects are evidence. */}
      <Work />
      <Experience />
      <Skills />
      <About />
      <Contact />
    </>
  )
}
