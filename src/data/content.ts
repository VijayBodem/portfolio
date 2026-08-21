/**
 * Single source of truth for every piece of copy on the site.
 *
 * Anything containing `TODO:` is a factual gap that needs Vijay's real number
 * or detail before launch. They are deliberately loud so none ship by accident.
 */

export const profile = {
  name: 'Vijay Bodem',
  role: 'Full-Stack Engineer',
  specialism: 'Real-Time & Video Infrastructure',
  location: 'Hyderabad, India',
  yearsExperience: '2.6+',
  tagline:
    'I build systems where latency, state synchronisation and connection reliability actually matter — real-time video, live collaboration, and the APIs underneath them.',
  availability: 'Open to full-stack and frontend roles — remote or Hyderabad.',
  email: 'vijaybodem17@gmail.com',
  links: {
    github: 'https://github.com/VijayBodem',
    linkedin: 'https://linkedin.com/in/vijay-bodem-040935248',
    resume: '/Vijay-Bodem-Resume.pdf',
  },
} as const

/** Scannable credibility, directly under the hero. Keep to four. */
export const proofPoints = [
  { value: '2.6+', label: 'Years shipping production software' },
  { value: '5', label: 'Production platforms contributed to' },
  { value: 'WebRTC', label: 'Peer-to-peer video, in production' },
  { value: 'National', label: 'Government healthcare deployment' },
] as const

export type ProjectTier = 'flagship' | 'secondary'

export type Project = {
  slug: string
  title: string
  subtitle: string
  tier: ProjectTier
  /** 'company' work is proprietary — it never gets a repo or live link. */
  kind: 'company' | 'personal'
  /**
   * What a visitor can actually reach right now. Drives the card label and the
   * case-study link row, so the site can never advertise access that
   * does not exist:
   *   proprietary — client/employer product; no repo or demo, ever
   *   public      — live demo and/or source anyone can open
   *   pending     — mine, but not yet deployed or made public
   */
  access: 'proprietary' | 'public' | 'pending'
  org: string
  period: string
  /** The hook. One sentence, framed as a constraint or a hard problem. */
  hook: string
  /** Who used it and why it existed. */
  context: string
  /** The genuinely difficult part. */
  problem: string
  /** Architecture walkthrough — paired with the diagram. */
  architecture: string
  /** Outcome-shaped bullets. Never "worked on" / "was involved in". */
  contributions: string[]
  /** The section engineers actually read: chose X over Y because Z. */
  decisions: { choice: string; rationale: string }[]
  outcome: string
  stack: string[]
  links?: { label: string; href: string }[]
  demoCredentials?: { email: string; password: string }
  /** Nodes rendered into the inline-SVG architecture diagram. */
  diagram: { nodes: string[]; caption: string }
}

export const projects: Project[] = [
  {
    slug: 'e-sanjeevani',
    title: 'E-Sanjeevani',
    subtitle: 'National Telemedicine Platform',
    tier: 'flagship',
    kind: 'company',
    access: 'proprietary',
    org: 'InstaVC — Government of India health programme',
    period: 'Apr 2024 – Dec 2025',
    hook:
      'Video consultations for a Government of India health platform, where the patient may be on a weak rural mobile connection and the call simply cannot fail.',
    context:
      'E-Sanjeevani is India’s national telemedicine service, connecting patients at primary health centres with doctors remotely. I worked on the client application that carries the consultation itself — the live video session between doctor and patient.',
    problem:
      'A consumer video app can drop a call and apologise. A health consultation cannot. The hard constraints were network variability across rural and urban India, browsers and devices we did not control, and a doctor–patient pair who often did not share a common language.',
    architecture:
      'The client establishes a peer-to-peer WebRTC session, so consultation media never transits our servers — lower latency and a smaller privacy surface for health data. A Socket.IO signalling channel handles offer/answer exchange, ICE candidate trickling and session lifecycle. Live translation runs alongside the media stream, so speech is captioned and translated without adding latency to the video path itself.',
    contributions: [
      'Built secure peer-to-peer video consultation using WebRTC with Socket.IO signalling, keeping patient media off application servers entirely.',
      'Implemented live language translation during consultations, so doctor and patient could communicate across a language barrier in real time.',
      'Hardened session handling against real-world network conditions — reconnection, ICE renegotiation and graceful degradation on connection loss.',
      'Used IndexedDB for client-side session state, so a browser refresh or transient drop did not lose consultation context.',
      'TODO: add the scale figure you know — consultations supported, concurrent sessions, or number of health centres live.',
    ],
    decisions: [
      {
        choice: 'Peer-to-peer WebRTC rather than routing media through an SFU',
        rationale:
          'Consultations are one-to-one, so P2P was the correct topology: lowest possible latency, no per-call server media cost, and patient health data never touching our infrastructure. An SFU would have added expense and a compliance surface for no benefit at two participants.',
      },
      {
        choice: 'Socket.IO for signalling instead of raw WebSockets',
        rationale:
          'Signalling reliability is what determines whether a call connects at all. Socket.IO’s automatic reconnection and transport fallback meant a patient on an unstable connection could still complete the handshake, where raw WebSockets would have failed outright.',
      },
      {
        choice: 'Translation as a parallel channel, not inline in the media pipeline',
        rationale:
          'Keeping translation off the critical media path meant a slow or failed translation degraded a feature rather than dropping the consultation. The video call remains the thing that must never break.',
      },
    ],
    outcome:
      'Secure peer-to-peer consultations with live translation, running as part of a national public-health service. TODO: add scale or reliability figure.',
    stack: ['JavaScript', 'WebRTC', 'Socket.IO', 'Node.js', 'IndexedDB', 'HTML', 'CSS'],
    diagram: {
      nodes: ['Doctor client', 'Signalling server', 'Patient client'],
      caption:
        'Signalling brokers the handshake; media flows peer-to-peer and never touches the server.',
    },
  },
  {
    slug: 'inmeet',
    title: 'InMeet',
    subtitle: 'Video Conferencing & Webinar Platform',
    tier: 'flagship',
    kind: 'company',
    access: 'proprietary',
    org: 'InstaVC',
    period: 'Nov 2023 – Dec 2024',
    hook:
      'A commercial video conferencing and webinar product — the full path from a browser joining a call to a paid licence gating who is allowed to host one.',
    context:
      'InMeet is InstaVC’s video conferencing platform, covering both interactive meetings and one-to-many webinars. I worked across the frontend and the Node.js services behind it, on user-facing meeting features and on the licensing and payment path.',
    problem:
      'Two different problems in one product. Real-time media has to work across browsers, devices and networks. Meanwhile the commercial layer — who may host, how many participants their licence allows, what happens when it lapses — has to be enforced correctly, because it is the revenue path.',
    architecture:
      'A React and Redux frontend manages meeting state and media negotiation over WebRTC, with Socket.IO carrying signalling, participant presence and in-call events. Node.js services handle rooms, authentication and licence validation, backed by MongoDB, with Firebase for auth and IndexedDB for client-side persistence. Razorpay sits on the licensing flow, and a successful payment is what unlocks meeting and webinar creation.',
    contributions: [
      'Built and extended real-time meeting and webinar features on a production video conferencing product used by paying customers.',
      'Integrated Razorpay to gate meeting and webinar creation behind licence purchase, connecting the payment result to entitlement checks in the product.',
      'Developed user-facing meeting modules in React and Redux, managing complex media and participant state.',
      'Improved application stability and performance across the meeting experience.',
      'TODO: add concrete numbers — max participants per session, active users, or a specific stability or performance improvement you measured.',
    ],
    decisions: [
      {
        choice: 'Redux for meeting state rather than component-local state',
        rationale:
          'In-call state is read by many unrelated parts of the UI at once — participant tiles, controls, presence, permissions — and mutated by socket events arriving asynchronously. A single predictable store made that traceable; scattered local state would have made race conditions very hard to find.',
      },
      {
        choice: 'Entitlement enforced server-side, not in the client',
        rationale:
          'Licence checks are a revenue boundary. Validating them in Node.js rather than the React app means the paid tier cannot be unlocked by editing client state, and the payment result remains the single source of truth for what a customer is allowed to do.',
      },
      {
        choice: 'IndexedDB for client persistence over localStorage',
        rationale:
          'Meeting state is structured and larger than key-value strings comfortably hold, and IndexedDB’s asynchronous API avoids blocking the main thread during a live call — which localStorage’s synchronous access would have risked.',
      },
    ],
    outcome:
      'Shipped meeting, webinar and licensing features on a commercial product with a working revenue path. TODO: add usage or scale figure.',
    stack: [
      'React.js',
      'Redux',
      'WebRTC',
      'Socket.IO',
      'Node.js',
      'MongoDB',
      'Firebase',
      'IndexedDB',
      'Razorpay',
    ],
    diagram: {
      nodes: ['React client', 'Node services', 'MongoDB', 'Razorpay'],
      caption:
        'Media negotiates peer-to-peer; licensing and entitlement are enforced server-side.',
    },
  },
  {
    slug: 'sparta',
    title: 'Sparta',
    subtitle: 'Enterprise Field-Operations Platform',
    tier: 'flagship',
    kind: 'company',
    access: 'proprietary',
    org: 'Kellton Tech — enterprise client engagement',
    period: 'Feb 2026 – Present',
    hook:
      'A greenfield enterprise platform, built from scratch out of user stories and Figma screens — where the frontend architecture is a decision rather than an inheritance.',
    context:
      'Sparta is an enterprise field-operations platform I am currently building for a client engagement at Kellton Tech. Unlike work on an existing codebase, this started from nothing: requirements arrive as user stories, the interface arrives as Figma screens, and the frontend architecture underneath both is set as we go.',
    problem:
      'Greenfield work removes the safety net of precedent. There is no existing pattern to follow, so every structural choice — component boundaries, state ownership, how design tokens map to code, how a screen is composed — is made rather than inherited, and made early enough that changing it later is expensive. Alongside that, user stories are rarely complete on first reading, so part of the work is finding the gaps in a requirement before building the wrong thing.',
    architecture:
      'A React and TypeScript frontend built as a composable component layer beneath the Figma design system, so screens are assembled from shared primitives rather than rebuilt each time. TODO: describe the real state-management approach, routing structure, and how you consume the backend APIs — this section is the one engineers read most closely.',
    contributions: [
      'Building the frontend of an enterprise field-operations platform from scratch in React and TypeScript, establishing the component architecture rather than inheriting one.',
      'Translating Figma designs into a reusable component layer, keeping implementation faithful to the design system while staying composable across screens.',
      'Working from user stories to implementation — clarifying requirements with stakeholders and surfacing implementation gaps before they reached delivery.',
      'Collaborating with backend teams to align API contracts as the platform and its services were designed in parallel.',
      'Recognised by team members and solution architects for delivery quality.',
      'TODO: name one specific thing you built here — a component system, a complex screen, a tricky interaction, a performance problem you solved.',
    ],
    decisions: [
      {
        choice: 'TODO: the structural call you made early — how you organised components and state',
        rationale:
          'TODO: what the alternative was and why you rejected it. On a greenfield build this is your strongest available signal, because the decisions were genuinely yours to make. Even "co-located state per feature rather than one global store, because X" is worth stating.',
      },
      {
        choice: 'TODO: how you mapped the Figma design system into code',
        rationale:
          'TODO: did you build primitives first, or extract them as patterns repeated? How do design tokens reach the components? Interviewers ask this constantly and most candidates have no answer.',
      },
    ],
    outcome:
      'In active development. TODO: add what has shipped so far — modules live, screens delivered, or the size of the surface you own.',
    stack: ['React.js', 'TypeScript', 'Tailwind CSS', 'Figma'],
    diagram: {
      nodes: ['Figma design system', 'React component layer', 'Feature screens', 'Client APIs'],
      caption:
        'Designs resolve into shared primitives first, so screens compose rather than duplicate. TODO: confirm this matches how the project is actually structured.',
    },
  },
  {
    slug: 'collabflow',
    title: 'CollabFlow',
    subtitle: 'Real-Time Project Management Platform',
    tier: 'flagship',
    kind: 'personal',
    access: 'pending',
    org: 'Personal project — designed, built and deployed solo',
    period: '2025',
    hook:
      'Built end to end on my own: a collaborative project management platform with multi-device session security and live multi-user editing.',
    context:
      'CollabFlow is where I own every decision — schema, API surface, auth model, real-time layer and UI. I built it to work through the problems a production collaborative tool actually has, rather than the ones a tutorial project has.',
    problem:
      'Two hard problems I wanted to solve properly. First, authentication that behaves like a real product: a user logged in on several devices, sessions that can be individually revoked, and a login from somewhere unexpected challenged rather than trusted. Second, concurrent editing, where several people move cards on the same board simultaneously without the UI fighting itself.',
    architecture:
      'A React 19 and TypeScript frontend on Vite talks to an Express API, with Zod validating every request boundary so malformed input never reaches domain logic. MongoDB with Mongoose holds projects, tasks and sessions. Access tokens are short-lived and paired with refresh tokens tracked per device, so each session is independently revocable. Socket.IO rooms are scoped per project, and task mutations broadcast to everyone in the room so boards converge without a page refresh.',
    contributions: [
      'Designed a multi-device authentication system: JWT access and refresh tokens with per-device session records, so a user can see active sessions and revoke one device without signing out everywhere.',
      'Added OTP verification triggered on suspicious logins, challenging unrecognised sessions instead of trusting them.',
      'Built the real-time collaboration layer with Socket.IO — live task synchronisation, presence indicators, collaborative cursors and instant notifications, scoped to per-project rooms.',
      'Implemented role-based access control across four roles (Owner, Admin, Member, Viewer), enforced server-side on every mutation rather than hidden in the UI.',
      'Built a drag-and-drop Kanban board with optimistic updates and server reconciliation, plus a project analytics view.',
      'Validated every API boundary with Zod schemas shared between client and server, giving each contract a single definition.',
    ],
    decisions: [
      {
        choice: 'Per-device refresh token records instead of one stateless token',
        rationale:
          'Fully stateless JWTs cannot be revoked before expiry — a leaked token stays valid. Storing a session record per device costs one database lookup on refresh and buys real revocation, visible active sessions, and the ability to challenge a login that does not match any known device.',
      },
      {
        choice: 'RBAC enforced on the server, with the UI only reflecting it',
        rationale:
          'Hiding a button is not a permission. Every mutation authorises against the actor’s project role server-side, so the client can be wrong or tampered with and the data stays correct. The UI reads the same role to avoid offering actions that would fail.',
      },
      {
        choice: 'Socket.IO rooms per project rather than one global channel',
        rationale:
          'Room scoping means a task update is delivered only to people on that project — less bandwidth, and no chance of leaking activity from a project a user cannot access. It also keeps filtering logic out of the client hot path.',
      },
      {
        choice: 'Optimistic UI on drag-and-drop, reconciled against the server',
        rationale:
          'A Kanban card must move the instant it is dropped or the interaction feels broken. Applying the move locally and reconciling on the server response gives immediate feedback while the server stays authoritative, with a rollback if the write fails.',
      },
      {
        choice: 'Zod schemas shared across the client/server boundary',
        rationale:
          'One schema produces both the runtime validator and the TypeScript type, so client and server cannot drift apart. Hand-written types sitting beside separate validators is exactly where contract bugs come from.',
      },
    ],
    outcome:
      'A working platform with real-time collaboration and production-shaped authentication, built solo. Not yet deployed publicly — TODO: once it is live, add the demo and repo links and rewrite this line around what a visitor can go and try.',
    stack: [
      'React 19',
      'TypeScript',
      'Vite',
      'Node.js',
      'Express.js',
      'MongoDB',
      'Mongoose',
      'Socket.IO',
      'JWT',
      'Zod',
      'Tailwind CSS',
    ],
    // Not deployed yet, so there is deliberately nothing here. When it goes live,
    // set `access: 'public'` above and fill these in — the card label and the
    // case-study link row switch over on their own:
    //   links: [
    //     { label: 'Live demo', href: 'https://…' },
    //     { label: 'Source', href: 'https://github.com/VijayBodem/…' },
    //   ],
    //   demoCredentials: { email: 'demo@…', password: '…' },
    diagram: {
      nodes: ['React 19 client', 'Express API', 'Socket.IO', 'MongoDB'],
      caption:
        'Per-project socket rooms broadcast mutations; every write is authorised and validated server-side.',
    },
  },
  {
    slug: 'inlynk',
    title: 'InLynk',
    subtitle: 'Collaborative Networking Platform',
    tier: 'secondary',
    kind: 'company',
    access: 'proprietary',
    org: 'InstaVC',
    period: 'Dec 2024 – Oct 2025',
    hook:
      'A collaborative networking product where I worked across feature development, performance and reliability.',
    context:
      'InLynk is InstaVC’s collaborative networking platform. I contributed to feature development alongside performance optimisation and defect resolution.',
    problem:
      'TODO: what was actually hard here? A slow screen you profiled and fixed, a recurring bug class you eliminated, a feature with awkward real-time requirements. One concrete story turns this from a filler card into a real one.',
    architecture:
      'React with Redux on the frontend, TypeScript throughout, Node.js and MongoDB services, Firebase for auth, and Socket.IO for real-time updates.',
    contributions: [
      'Delivered features on a production collaborative platform in React, Redux and TypeScript.',
      'Optimised application performance and resolved defects to improve reliability for users.',
      'TODO: replace both lines above with one specific thing you built or fixed, and the effect it had.',
    ],
    decisions: [
      {
        choice: 'TODO: one technical decision you made or argued for here',
        rationale:
          'TODO: what the alternative was, and why you rejected it. Even a small call is worth stating — it is the difference between "contributed" and "engineered".',
      },
    ],
    outcome: 'TODO: what improved as a result of your work.',
    stack: [
      'React.js',
      'Redux',
      'TypeScript',
      'Node.js',
      'MongoDB',
      'Firebase',
      'Socket.IO',
    ],
    diagram: {
      nodes: ['React client', 'Node API', 'MongoDB'],
      caption: 'TODO: confirm the real shape of this system before publishing.',
    },
  },
]

export type Role = {
  company: string
  title: string
  period: string
  location: string
  summary: string
  highlights: string[]
  relatedProjects: string[]
}

export const experience: Role[] = [
  {
    company: 'Kellton Tech Solutions',
    title: 'Software Engineer',
    period: 'Feb 2026 – Present',
    location: 'Hyderabad, India',
    summary:
      'Frontend engineering on enterprise client platforms, working directly with client teams and solution architects.',
    highlights: [
      'Currently building Sparta, an enterprise field-operations platform, from scratch in React and TypeScript — working from user stories and Figma designs, and establishing the frontend component architecture rather than inheriting one. Recognised by team members and solution architects for delivery quality.',
      'Was the sole frontend developer on a full frontend architecture migration for a leading travel-tech platform, owning the workstream end to end alongside evolving backend APIs. Delivered and recognised by the client team on completion.',
      'Aligned API contracts directly with backend teams and surfaced implementation gaps before they reached delivery.',
      'Built and maintained reusable UI components against a design system, keeping the interface responsive and consistent as the codebase grew.',
    ],
    relatedProjects: ['sparta'],
  },
  {
    company: 'InstaVC',
    title: 'Full-Stack Developer — Frontend Focus',
    period: 'Nov 2023 – Dec 2025',
    location: 'Hyderabad, India',
    summary:
      'Two years building real-time video products: a commercial conferencing platform, a national telemedicine service, and a collaborative networking tool.',
    highlights: [
      'Built and maintained InMeet, a production video conferencing and webinar platform, across React, Node.js, WebRTC, Socket.IO, MongoDB and Firebase.',
      'Delivered peer-to-peer video consultations and live language translation for E-Sanjeevani, a Government of India telemedicine platform.',
      'Integrated Razorpay licensing so meeting and webinar creation was gated behind payment.',
      'Contributed features, performance work and defect resolution on InLynk.',
    ],
    relatedProjects: ['e-sanjeevani', 'inmeet', 'inlynk'],
  },
  {
    company: 'NxtWave (CCBP)',
    title: 'Teaching Assistant — MERN Stack, Internship',
    period: 'Jan 2023 – Aug 2023',
    location: 'Remote',
    summary:
      'Mentored learners through JavaScript, React, Node.js and MongoDB — where I learned to explain hard things simply.',
    highlights: [
      'Resolved 518+ technical queries and mentored 421+ learners across JavaScript, React, Node.js and MongoDB.',
      'Recognised as “TA of the Week” six times, and “TA of the Month” for consistent performance.',
      'Broke real-world coding problems down into explanations learners could act on.',
    ],
    relatedProjects: [],
  },
]

export type SkillTier = {
  tier: string
  note: string
  groups: { label: string; items: string[] }[]
}

/**
 * Deliberately tiered, and deliberately shorter than the résumé list.
 * Honesty about depth reads as more senior than an undifferentiated tag cloud,
 * and it keeps interviews on ground Vijay is strong on.
 */
export const skills: SkillTier[] = [
  {
    tier: 'Core',
    note: 'Daily, in production, and I can defend every decision in these.',
    groups: [
      {
        label: 'Frontend',
        items: ['React.js', 'TypeScript', 'JavaScript (ES6+)', 'React Hooks', 'Tailwind CSS'],
      },
      { label: 'State', items: ['Redux', 'RTK Query', 'Context API'] },
      { label: 'Backend', items: ['Node.js', 'Express.js', 'REST API design', 'JWT auth'] },
      { label: 'Real-time', items: ['WebRTC', 'Socket.IO', 'Server-Sent Events'] },
      { label: 'Data', items: ['MongoDB', 'Mongoose'] },
    ],
  },
  {
    tier: 'Working knowledge',
    note: 'Shipped with these; comfortable being asked about them.',
    groups: [
      { label: 'Frontend', items: ['Next.js', 'ShadCN', 'MUI', 'Zustand', 'React Query'] },
      { label: 'Validation', items: ['Zod'] },
      {
        label: 'Platform',
        items: ['Firebase (Auth, Firestore, Hosting)', 'Docker', 'Git', 'CI/CD'],
      },
      { label: 'Testing', items: ['Jest'] },
      { label: 'Data', items: ['SQL', 'Redis'] },
    ],
  },
  {
    tier: 'Familiar',
    note: 'Used or studied, not yet at depth — and I would rather say so.',
    groups: [
      { label: 'Infrastructure', items: ['AWS (EC2, S3, IAM)'] },
      { label: 'Data & APIs', items: ['Kafka', 'GraphQL'] },
    ],
  },
]

export const about = {
  heading: 'I came to software from mechanical engineering.',
  paragraphs: [
    'I studied mechanical engineering, taught myself to write code, and within a couple of years was building WebRTC video infrastructure that carries doctor–patient consultations on a national health platform. Nobody handed me that path — I learned what I needed as each problem arrived.',
    'That is still how I work. I like problems where the constraint is real: a call that cannot drop, state that has to stay consistent across several people at once, a migration that has to land without breaking what is already live. Real-time systems appeal to me because they are unforgiving — either the thing connects or it does not, and you cannot argue with it.',
    'Right now I am doing enterprise frontend work at Kellton Tech, and building CollabFlow on my own time to keep going deeper on the full stack. I am looking for work where I own something meaningful end to end, and where the engineering is genuinely hard.',
  ],
  facts: [
    { label: 'Based in', value: 'Hyderabad, India' },
    { label: 'Education', value: 'B.Tech, Mechanical Engineering' },
    { label: 'Certification', value: 'Industry Ready Certificate — NxtWave' },
    { label: 'Currently', value: 'Enterprise frontend at Kellton Tech' },
  ],
} as const

export const education = [
  {
    qualification: 'B.Tech, Mechanical Engineering',
    institution: 'Kakinada Institute of Technology and Science',
    period: 'Jun 2019 – Apr 2022',
  },
  {
    qualification: 'Diploma, Mechanical Engineering',
    institution: 'Kakinada Institute of Technology and Science',
    period: 'Jun 2016 – Apr 2019',
  },
] as const

export const navItems = [
  { label: 'Work', href: '#work' },
  { label: 'Experience', href: '#experience' },
  { label: 'Skills', href: '#skills' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
] as const
