# Vijay Bodem — Portfolio

Personal portfolio. React 19 + TypeScript + Vite + Tailwind CSS v4 + Framer Motion.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck + production build to dist/
npm run preview  # serve the built output
```

## How this is organised

**All copy lives in one file: [`src/data/content.ts`](src/data/content.ts).** Nothing
user-facing is hardcoded in a component. To change what the site says, edit that file
and nothing else.

```
src/
  data/content.ts          all copy, projects, experience, skills — single source of truth
  lib/
    motion.ts              every animation variant on the site (see Motion below)
    useTheme.ts            dark/light, persisted, defaults to OS preference
    utils.ts               cn() + isTodo()
  components/
    layout/                Nav (condenses on scroll), Footer
    ui/                    Section, Reveal, Tag, FlowDiagram, ThemeToggle, BrandIcons
    sections/              Hero + ProofStrip, Work, Experience, Skills, About, Contact
  pages/
    Home.tsx               the single-page scroll
    CaseStudy.tsx          /work/:slug — the per-project deep dive
```

## Design decisions worth knowing

**Positioning.** The site leads with *real-time and video infrastructure*, not
"MERN developer". That specialism (WebRTC in production, a national telemedicine
deployment) is the differentiator, so every layout decision points at it.

**Work before skills.** Skills sections are claims; projects are evidence. Work is
section 01 and sits directly under the hero.

**Skills are tiered** (Core / Working knowledge / Familiar) rather than a flat tag
cloud. Naming what is only "familiar" reduces interview risk and reads as more senior
than claiming forty technologies at equal depth.

**Company work carries no repo or live link.** InMeet, E-Sanjeevani and InLynk are
InstaVC products, so their case studies show architecture and reasoning and say
plainly that the source is proprietary. An explicit `access` field (`proprietary` |
`public` | `pending`) drives every card label and link row, so the site can never
advertise access that does not exist.

**Every case study has a `Decisions` section** — chose X over Y because Z. That is
the part technical leads and senior engineers actually read, and almost no portfolio
includes it.

**No phone number anywhere.** The page is public and it would be scraped.

## Motion

Every animation routes through `src/lib/motion.ts`, and `Reveal` /
`RevealGroup` / `RevealItem` are the only reveal primitives. Rules held throughout:

- transform and opacity only — never `width`, `height`, `top`, or `box-shadow`
- nothing longer than 600ms
- reveals fire **once**, never on every scroll-past
- `prefers-reduced-motion` renders content with no transform at all — not a faster
  animation, no animation. Handled both in CSS (`src/index.css`) and per-component
  via Framer's `useReducedMotion`.

## Theming

Dark by default; light is a fully specified counterpart, not an inversion. Tokens are
CSS custom properties on `:root` / `:root[data-theme="light"]` in `src/index.css`,
exposed to Tailwind through `@theme inline`.

The inline script in `index.html` applies the stored theme before first paint so a
light-mode visitor never sees a dark flash. **Its storage key must stay in sync with
`src/lib/useTheme.ts` (`vb-theme`).**

## Accessibility

Not aspirational — checked. All 14 text/background token pairs were computed against
WCAG 2.1 relative luminance and pass AA in **both** themes (body copy sits at 7:1+,
the smallest metadata labels at 4.8:1+). Plus: skip-to-content link, visible focus
rings throughout, Escape closes the mobile menu, 40px minimum tap targets, semantic
landmarks with a single `h1` per page, and architecture diagrams that expose their
node labels as real text rather than baking them into an image.

## Deployment

`vercel.json` rewrites all paths to `index.html`, which `/work/:slug` needs under
`BrowserRouter`. On Netlify use an equivalent `_redirects` rule.
