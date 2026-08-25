/**
 * Single source of truth for every piece of copy on the site.
 *
 * Anything containing `TODO:` is a factual gap that needs Vijay's real number
 * or detail before launch. They are deliberately loud so none ship by accident.
 */

export const profile = {
  name: 'Vijay Bodem',
  role: 'Full-Stack Engineer',
  specialism: 'Real-Time Systems & Frontend Architecture',
  location: 'Hyderabad, India',
  yearsExperience: '2.6+',
  tagline:
    'I build production frontends and the real-time systems behind them — WebRTC video and live collaboration where reliability is the constraint, and Figma-to-production interfaces where the architecture has to be migrated or built from nothing.',
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
  { value: '2.7+', label: 'Years shipping production software' },
  { value: '6', label: 'Platforms built or contributed to' },
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
    subtitle: 'Video Consultation SDK for National Telemedicine',
    tier: 'flagship',
    kind: 'company',
    access: 'proprietary',
    org: 'InstaVC — SDK for a Government of India health programme',
    period: 'Apr 2024 – Dec 2025',
    hook:
      'A video consultation SDK embedded inside a Government of India telemedicine service — shipped as a component another team integrates, where the patient may be on a weak rural connection and the call simply cannot fail.',
    context:
      'E-Sanjeevani is India’s national telemedicine service, connecting patients at primary health centres with doctors remotely. We did not build their application — we built the SDK that carries the consultation inside it. The client integrates it into their own platform, which means the video session, its recording and its failure modes are ours, while the surrounding application is theirs.',
    problem:
      'A consumer video app can drop a call and apologise. A health consultation cannot. On top of that, shipping an SDK removes the usual escape routes: you cannot patch the host application, you cannot assume how it will be embedded, and every change has to stay backwards compatible for a team that integrates on their own schedule. The hard constraints were network variability across rural and urban India, browsers and devices we did not control, a doctor–patient pair who often did not share a common language, and a requirement to produce a complete audio record of a consultation that might run for an hour.',
    architecture:
      'The SDK establishes a peer-to-peer WebRTC session, so consultation media never transits our servers — lower latency and a smaller privacy surface for health data. A Socket.IO signalling channel handles offer/answer exchange, ICE candidate trickling and session lifecycle. Live translation runs alongside the media stream, so speech is captioned and translated without adding latency to the video path itself. Recording runs as a separate concern: audio is captured in five-minute segments and written to IndexedDB as the consultation proceeds, so nothing large is held in memory and nothing is lost if the tab dies. When the doctor ends the meeting, the SDK reads every stored segment back, merges them into a single consultation recording and uploads it to AWS S3.',
    contributions: [
      'Built secure peer-to-peer video consultation using WebRTC with Socket.IO signalling, keeping patient media off application servers entirely.',
      'Designed and built the consultation audio recording pipeline: five-minute segments captured during the call and persisted to IndexedDB, then merged into one complete recording and uploaded to AWS S3 when the meeting ends.',
      'Implemented live language translation during consultations, so doctor and patient could communicate across a language barrier in real time.',
      'Hardened session handling against real-world network conditions — reconnection, ICE renegotiation and graceful degradation on connection loss.',
      'Shipped the work as an SDK the client integrates into their own application, holding the integration surface stable across releases.',
      'Supported the client in production after delivery — diagnosing call issues they hit in the field and building features against their requirements as they came up.',
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
      {
        choice:
          'Record in five-minute segments to IndexedDB, instead of buffering the whole consultation in memory',
        rationale:
          'A consultation can run for an hour, and holding that much audio in one in-memory buffer is exactly the wrong thing to do on the low-end devices these calls run on. It also means a crash or a stray refresh loses the entire record — of a medical consultation. Writing bounded segments to IndexedDB as the call proceeds keeps memory flat regardless of how long the call runs, and caps the worst case at the segment in flight rather than the whole consultation.',
      },
      {
        choice: 'Merge and upload only after the call ends, never during it',
        rationale:
          'Uploading segments mid-consultation would put the recording in direct competition with the video for the patient’s bandwidth — and on a weak rural connection that is not a trade worth making. Deferring the merge and the S3 upload until the doctor ends the meeting keeps the entire recording feature off the call’s critical path: while the consultation is live, recording only ever writes locally.',
      },
    ],
    outcome:
      'Delivered as an SDK the client integrates into their own platform, and in active production use on a national public-health service. The relationship continued past delivery — when the client hit call issues in the field or needed new capability, that work came to me.',
    stack: [
      'JavaScript',
      'WebRTC',
      'Socket.IO',
      'Node.js',
      'IndexedDB',
      'AWS S3',
      'HTML',
      'CSS',
    ],
    diagram: {
      nodes: [
        'Live call audio',
        '5-min segments → IndexedDB',
        'Merge on meeting end',
        'Upload to AWS S3',
      ],
      caption:
        'While the call is live, recording only ever writes locally. The merge and upload happen after it ends, so recording never competes with the consultation for bandwidth.',
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
      'The platform runs in production with paying customers, and the meeting and webinar features built here continue to serve them.',
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
      'Shipped meeting, webinar and licensing features on a commercial product with a working revenue path. The platform is live with paying customers and those features remain in service — the meeting and webinar capability was later carried across into InLynk.',
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
    slug: 'rentokil-sparta',
    title: 'Rentokil Sparta',
    subtitle: 'Service Planning & Technician Route Allocation',
    tier: 'flagship',
    kind: 'company',
    access: 'proprietary',
    org: 'Kellton Tech — client engagement for Rentokil',
    period: 'Feb 2026 – Present',
    hook:
      'A multi-module field-service platform, built from the ground up out of business requirements and Figma designs — where the frontend architecture is a decision rather than an inheritance.',
    context:
      'Sparta — Service Planning Automation with Route Technician Allocation — is the platform Rentokil uses to plan service work and allocate technicians to routes. I am building its frontend on a client engagement at Kellton Tech. Unlike work on an existing codebase, this started from nothing: requirements arrive as business specifications and user stories, the interface arrives as Figma designs, and the frontend architecture underneath both is set as we go.',
    problem:
      'Greenfield work removes the safety net of precedent. There is no existing pattern to follow, so every structural choice — component boundaries, state ownership, how design tokens map to code, how a screen is composed — is made rather than inherited, and made early enough that changing it later is expensive. Alongside that, user stories are rarely complete on first reading, so part of the work is finding the gaps in a requirement before building the wrong thing.',
    architecture:
      'A React and TypeScript frontend organised around a shared foundation rather than a set of screens. Common components are built from the Figma system on top of MUI and reused across modules, with theming handled through tokens so light and dark are both first-class from the start rather than one being retrofitted onto the other. The folder structure mirrors the module boundaries, and each module keeps its API calls in its own dedicated file — so the data access for a feature sits next to that feature instead of accumulating in one shared client that every module has to reason about.',
    contributions: [
      'Building a multi-module enterprise web application from the ground up in React and TypeScript, establishing the component architecture rather than inheriting one.',
      'Building reusable, maintainable frontend components on MUI, keeping implementation faithful to the design system while staying composable across modules.',
      'Translating Figma designs into responsive, production-ready interfaces, holding visual consistency across every module.',
      'Collaborating with backend teams to integrate APIs and support end-to-end feature delivery as platform and services were designed in parallel.',
      'Built the shared component library and the common structural conventions the modules are assembled from, working from the Figma designs and user stories.',
      'Implemented full light and dark theme support across the component layer, designed in from the start rather than bolted on afterwards.',
      'Established the folder structure and the convention of a dedicated API file per module, so each feature owns its own data access instead of sharing one growing client.',
      'Participating in technical discussions and requirement clarification to identify implementation gaps early.',
      'Recognised by team members and solution architects for delivery quality.',
    ],
    decisions: [
      {
        choice: 'Build the shared component layer first, before building any module',
        rationale:
          'The faster-feeling start is to build screens as the stories arrive and extract shared pieces later. On a multi-module product that reliably produces four slightly different versions of the same table before anyone notices. Establishing the common components and structural conventions up front meant each new module was assembly rather than invention — and it is far cheaper to agree a pattern once than to reconcile four of them after they all have callers.',
      },
      {
        choice: 'Design light and dark as two first-class themes from the start',
        rationale:
          'Theming is one of those things that is nearly free at the beginning and expensive forever afterwards. Retrofitting a second theme onto components with colours hard-coded through them means touching every component again, and it is where contrast bugs get in. Driving both themes through tokens from the first component meant dark mode was never a migration.',
      },
      {
        choice: 'One API file per module, rather than a single shared API client',
        rationale:
          'A shared client starts tidy and becomes the file nobody wants to open — every module’s endpoints in one place, with no boundary explaining which feature owns what. Keeping each module’s calls beside that module means the data access is discoverable from the feature, changes stay contained, and two modules touching similar endpoints cannot silently couple through a shared helper.',
      },
    ],
    outcome:
      'In active development, with the shared component layer, theming and module conventions in place and the modules being built on top of them. Recognised by team members and solution architects for delivery quality.',
    stack: ['React.js', 'TypeScript', 'MUI', 'Figma', 'REST APIs'],
    diagram: {
      nodes: [
        'Figma designs + stories',
        'Themed component layer',
        'Feature modules',
        'Per-module API files',
      ],
      caption:
        'Designs resolve into shared, themed primitives first, so modules assemble rather than duplicate — and each module owns its own data access.',
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
      'A working platform with real-time collaboration and production-shaped authentication, designed and built end to end on my own. Currently running locally; a public deployment is in progress.',
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
    slug: 'abhibus-migration',
    title: 'AbhiBus',
    subtitle: 'Frontend Architecture Migration',
    tier: 'secondary',
    kind: 'company',
    access: 'proprietary',
    org: 'Kellton Tech — client engagement for ixigo / AbhiBus',
    period: 'Feb 2026 – May 2026',
    hook:
      'Sole frontend developer on a full frontend architecture migration for AbhiBus, one of India’s largest bus-booking platforms — delivered with no outage and no post-migration defects, while the data contracts underneath were still changing.',
    context:
      'AbhiBus, part of the ixigo group, needed its frontend architecture migrated, with specific performance improvements expected out of it. I was the only frontend developer on the workstream, owning it end to end from Feb 2026 through to completion on 5 May 2026, working directly with the client team and with the backend engineers whose contracts were changing at the same time.',
    problem:
      'Two things had to be true at once. The application was slow — screens waited on large, monolithic API responses before they could render — and the migration was expected to fix that. But the thing being replaced was already live and carrying real customers, and the data flow itself was changing, so the backend contracts were moving while the frontend was being migrated against them. As the only frontend developer on the workstream there was no second pair of eyes: a wrong assumption about a response shape would surface as a production incident rather than a review comment.',
    architecture:
      'The work ran as a sequence rather than a rewrite. First I mapped the live application’s response structures and data flow, so the existing contracts were documented before anything changed. The client walked me through the migration requirements directly — what was changing and which performance improvements were expected. I then went through the affected modules at code level, module by module, to find where the new data flow would actually break the old assumptions. Only after that did I take the required contract and data-flow changes back to the backend team, so their changes and my migration landed together instead of colliding. The largest of those changes was breaking the single slow API response into several focused endpoints; the frontend then composes those responses and maps them into per-screen view models, so a screen no longer blocks on one oversized request. The migrated frontend is React and TypeScript against the client’s internal design system (ABRS-UI) with Tailwind CSS.',
    contributions: [
      'Owned the frontend architecture migration end to end as the sole frontend developer on the engagement.',
      'Mapped the live application’s response structures and data flow before changing anything, so the existing contracts were understood rather than assumed.',
      'Took migration requirements directly from the client in working sessions — scope of the change and the expected performance improvements — and translated them into frontend work.',
      'Walked the affected modules at code level to locate exactly where the new data flow broke existing assumptions, rather than discovering it at runtime.',
      'Drove the required contract and data-flow changes with the backend team, so their API changes and the migration shipped in step instead of blocking each other.',
      'Rebuilt the data layer around the split endpoints: the single slow response was broken into several focused APIs, and I composed them on the client and mapped the results into the shape each screen needed — removing the long wait on one oversized request.',
      'Delivered the migration on 5 May 2026 with no production outage and no post-migration defects raised — recognised by the client team on completion.',
    ],
    decisions: [
      {
        choice: 'Map the live system’s data flow first, before writing any migration code',
        rationale:
          'The fastest-looking start would have been to begin converting screens immediately. On a live application that is how you find contract mismatches in production instead of in a document. Auditing the existing response structures and data flow up front cost time at the beginning and removed almost all of the risk from everything after it — which is the trade that made a no-outage delivery possible.',
      },
      {
        choice: 'Read the affected modules at code level rather than working from the requirements alone',
        rationale:
          'Requirements describe intent; they do not tell you which assumptions the existing code has baked in. Going through each migration module line by line was what surfaced the places the new data flow would silently break behaviour. Those are exactly the defects that reach production, because nothing in the spec predicts them.',
      },
      {
        choice: 'Change the backend contracts with the backend team, instead of adapting around them on the client',
        rationale:
          'I could have absorbed the shape differences in the frontend with mapping layers, which is faster in the moment and needs nobody else. It also makes the client permanently responsible for reconciling a contract nobody agreed to, and hides the drift from the team that owns the data. Taking the required data-flow changes back to the backend team kept one agreed contract and meant both sides shipped together.',
      },
      {
        choice: 'Compose the split endpoints deliberately, rather than fetching them one after another',
        rationale:
          'Splitting one slow response into several focused endpoints does not make an application faster by itself — it moves the composition problem to the frontend. Requested naively, each call waiting on the one before it, the screen ends up slower than the single request it replaced: more round trips, none of the waiting removed. Fetching them together and mapping the responses into per-screen view models is what converts the split into an actual improvement instead of a redistribution of the same latency. Note this is composition of contracts the backend team and I agreed on — not the client-side compensation for a wrong contract that the previous decision rejects.',
      },
    ],
    outcome:
      'Delivered on 5 May 2026 with no production outage and no post-migration defects raised, and recognised by the client team on completion. The data layer moved from screens blocking on one large, slow API response to composing several focused endpoints, which removed the load delay the client had asked us to fix.',
    stack: ['React.js', 'TypeScript', 'Tailwind CSS', 'REST APIs'],
    diagram: {
      nodes: [
        'Audit live data flow',
        'Client requirements session',
        'Module-level code walkthrough',
        'Align contracts with backend',
        'Migrate',
      ],
      caption:
        'Understanding came first and migration last. Front-loading the audit is what kept a live application from breaking while its data contracts changed underneath it.',
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
      'Carried InMeet’s meeting and webinar capability across into a different product — reshaping it for a new domain, and owning the backend APIs and data structures behind it as well as the frontend.',
    context:
      'InLynk is InstaVC’s collaborative networking platform. Having built the meeting and webinar features in InMeet, I brought that capability into InLynk and adapted it to this product’s domain — working across the stack, on the backend APIs and data structures as well as the interface.',
    problem:
      'A capability built for one product rarely fits cleanly into another. InMeet’s meetings and webinars were shaped around a conferencing product; InLynk is a networking platform, so the same features had to answer different questions about who a session belongs to and how it relates to the surrounding domain. Copying the implementation across would have carried InMeet’s assumptions with it; rebuilding from scratch would have thrown away working, proven real-time code.',
    architecture:
      'React with Redux and TypeScript on the frontend, Node.js and MongoDB services behind it, Firebase for auth, and Socket.IO carrying real-time session updates. The meeting and webinar capability was reworked against InLynk’s own domain model rather than transplanted, with the backend API surface and data structures reshaped to match how sessions relate to the networking platform.',
    contributions: [
      'Brought InMeet’s meeting and webinar capability into InLynk, adapting it to the platform’s own domain rather than porting the implementation as-is.',
      'Worked across the stack on this feature set — owning the backend APIs and data structures alongside the React and Redux frontend.',
      'Maintained the meeting and webinar features in production, resolving defects and improving reliability for users.',
      'Optimised application performance across the areas I owned.',
    ],
    decisions: [
      {
        choice: 'Rework the capability against InLynk’s domain, rather than copying the InMeet implementation across',
        rationale:
          'Copying working code is the cheap move, and it silently imports the assumptions of the product it was written for. InMeet models a session the way a conferencing tool needs to; InLynk needed sessions to relate to its own networking domain. Reshaping the data structures and API surface to match this product meant the feature belonged here — instead of becoming a foreign object that every later change has to work around.',
      },
      {
        choice: 'Own the backend data structures rather than adapting to them on the frontend',
        rationale:
          'Having built the original features, I understood what the real-time layer actually needed from the data. Taking the backend APIs and structures on directly meant the contract could be shaped correctly for the domain in one pass, instead of a frontend bending around a data model that was never designed for this product’s questions.',
      },
    ],
    outcome:
      'Meeting and webinar capability running inside InLynk, adapted to its domain and maintained in production — with the underlying APIs and data structures shaped for this product rather than inherited from the one it came from.',
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
      nodes: ['InMeet session capability', 'Reshaped for InLynk domain', 'Node APIs + MongoDB'],
      caption:
        'The capability was reworked against this product’s domain model, not transplanted — so the data structures answer InLynk’s questions rather than InMeet’s.',
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
      'Frontend engineering across two client engagements — the AbhiBus migration delivered, and Rentokil Sparta being built from the ground up — working directly with client teams and solution architects.',
    highlights: [
      'Currently building Rentokil Sparta (Service Planning Automation with Route Technician Allocation), a multi-module field-service platform, from the ground up in React, TypeScript and MUI — translating business requirements and Figma designs into responsive, production-ready interfaces. Recognised by team members and solution architects for delivery quality.',
      'Was the sole frontend developer on the AbhiBus (ixigo) frontend architecture migration, owning it end to end alongside evolving backend APIs. Completed on 5 May 2026 and recognised by the client team on delivery.',
      'Aligned API contracts directly with backend teams and surfaced implementation gaps before they reached delivery.',
      'Built reusable, maintainable UI components against client design systems, holding consistency across modules as each codebase grew.',
    ],
    relatedProjects: ['rentokil-sparta', 'abhibus-migration'],
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
        items: [
          'React.js',
          'TypeScript',
          'JavaScript (ES6+)',
          'React Hooks',
          'Tailwind CSS',
          'MUI',
        ],
      },
      {
        label: 'State',
        items: ['Redux', 'Redux Toolkit (RTK)', 'RTK Query', 'Context API'],
      },
      {
        label: 'Backend',
        items: ['Node.js', 'Express.js', 'REST API design', 'API integration', 'JWT auth'],
      },
      { label: 'Real-time', items: ['WebRTC', 'Socket.IO', 'Server-Sent Events'] },
      { label: 'Data', items: ['MongoDB', 'Mongoose'] },
      { label: 'Markup', items: ['HTML5', 'CSS3'] },
    ],
  },
  {
    tier: 'Working knowledge',
    note: 'Shipped with these; comfortable being asked about them.',
    groups: [
      { label: 'Frontend', items: ['Next.js', 'ShadCN', 'Bootstrap', 'Zustand', 'React Query'] },
      { label: 'Validation', items: ['Zod'] },
      {
        label: 'Platform',
        items: ['Firebase (Auth, Firestore, Hosting)', 'Docker', 'Git', 'GitHub', 'CI/CD'],
      },
      { label: 'Testing', items: ['Jest'] },
      { label: 'Data', items: ['SQL', 'Redis'] },
      {
        label: 'AI-assisted development',
        items: ['GitHub Copilot', 'Claude Code', 'Cursor', 'Windsurf'],
      },
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
