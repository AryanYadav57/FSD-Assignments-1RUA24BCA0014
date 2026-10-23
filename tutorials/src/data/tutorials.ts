export type RoutePath =
  | '/'
  | '/pricing'
  | '/blog'
  | '/sign-up'
  | '/tutorials'
  | '/http-cycle'
  | '/layout-fixer'
  | '/validation-lab'
  | '/component-hierarchy';

export type Tutorial = {
  id: number;
  title: string;
  shortTitle: string;
  syllabusObjective: string;
  path: RoutePath;
  goal: string;
  deliverable: string;
  duration: string;
  accent: string;
  surface: string;
};

export const routePaths: readonly RoutePath[] = [
  '/',
  '/pricing',
  '/blog',
  '/sign-up',
  '/tutorials',
  '/http-cycle',
  '/layout-fixer',
  '/validation-lab',
  '/component-hierarchy',
] as const;

export const tutorials: readonly Tutorial[] = [
  {
    id: 1,
    title: 'HTTP Request–Response Cycle',
    shortTitle: 'Tutorial 1: HTTP Cycle',
    syllabusObjective:
      'Trace and explain the HTTP request–response cycle using browser developer tools (Network tab) for a sample website',
    path: '/http-cycle',
    goal: 'Trace a live GET request through Browser -> DNS -> Server -> Response -> DOM Parsing and inspect headers in Network tab.',
    deliverable: 'Inspect network timing, HTTP status codes (200 OK), content-type headers, and JSON response payload.',
    duration: '3 hrs',
    accent: '#38bdf8',
    surface: 'rgba(56, 189, 248, 0.08)',
  },
  {
    id: 2,
    title: 'Flexbox & Grid Layout Fixer',
    shortTitle: 'Tutorial 2: Layout Fixer',
    syllabusObjective:
      'Identify and fix layout issues in HTML/CSS code, including alignment, spacing, and responsiveness using Flexbox and Grid',
    path: '/layout-fixer',
    goal: 'Diagnose broken flex arrangements, overlapping cards, and overflow, then repair them into a responsive layout.',
    deliverable: 'Interactive Before/After comparison of alignment, gap spacing, flexWrap, and adaptive grid sizing.',
    duration: '4 hrs',
    accent: '#34d399',
    surface: 'rgba(52, 211, 153, 0.08)',
  },
  {
    id: 3,
    title: 'Event Handling & Form Validation',
    shortTitle: 'Tutorial 3: Validation Lab',
    syllabusObjective:
      'Solve JavaScript problems involving DOM manipulation, event handling, dynamic updates, and form validation',
    path: '/validation-lab',
    goal: 'Capture keystroke events, manage controlled input state, calculate validation rules, and render dynamic feedback.',
    deliverable: 'Interactive Sign-Up form with real-time error tracking, live character buffering, and event telemetry count.',
    duration: '4 hrs',
    accent: '#fbbf24',
    surface: 'rgba(251, 191, 36, 0.08)',
  },
  {
    id: 4,
    title: 'React Component Hierarchy',
    shortTitle: 'Tutorial 4: Hierarchy Map',
    syllabusObjective:
      'Analyze a UI and decompose it into reusable React components with proper hierarchy',
    path: '/component-hierarchy',
    goal: 'Analyze the Flim UI and decompose it into a clean, modular React component architecture with explicit data flow.',
    deliverable: 'Visual hierarchy breakdown illustrating component tree (Navbar, Hero, Canvas, Tile, Search, Labs).',
    duration: '4 hrs',
    accent: '#f472b6',
    surface: 'rgba(244, 114, 182, 0.08)',
  },
];
