export type AcademyTab = 'explorer' | 'stories' | 'guides' | 'games' | 'mission-control';

export interface WalkthroughStep {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  targetTab?: AcademyTab;
  tip: string;
  icon: string;
}

export interface QuizQuestionItem {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  xpReward?: number;
}

export interface PlanetData {
  id: string;
  name: string;
  subtitle: string;
  category: 'Star' | 'Terrestrial Planet' | 'Gas Giant' | 'Ice Giant' | 'Dwarf Planet / Moon';
  color: string;
  accentColor: string;
  radiusScale: number;
  orbitRadius: number;
  orbitSpeed: number;
  hasRings?: boolean;
  gravityRatio: number; // Relative to Earth = 1.0
  distanceFromSun: string;
  dayLength: string;
  yearLength: string;
  avgTemp: string;
  moonsCount: number;
  escapeVelocity: string;
  orbitalSpeed: string;
  axialTilt: string;
  lightTimeFromSun: string;
  atmosphereComposition: { gas: string; percent: number; color: string }[];
  internalLayers: { layer: string; detail: string }[];
  deepDiveHistory: string;
  kidFriendlyAnalogy: string;
  beginnerSummary: string;
  funFacts: string[];
  activeMissions: string[];
  quizQuestions: QuizQuestionItem[];
}

export interface SpacecraftHotspot {
  id: string;
  name: string;
  role: string;
  plainEnglish: string;
  technicalFact: string;
  position: [number, number, number];
}

export interface SpacecraftData {
  id: 'apollo' | 'rover' | 'voyager' | 'jwst' | 'iss' | 'hubble';
  name: string;
  year: string;
  destination: string;
  status: string;
  badgeEmoji: string;
  launchVehicle: string;
  mass: string;
  powerSystem: string;
  maxSpeed: string;
  summary: string;
  whyItMatters: string;
  funFacts: string[];
  hotspots: SpacecraftHotspot[];
}

export interface StoryChoice {
  label: string;
  outcomeText: string;
  isOptimal: boolean;
  xpBonus: number;
}

export interface StoryChapter {
  id: string;
  title: string;
  timestamp: string;
  tensionLevel: 'NOMINAL' | 'ELEVATED' | 'CRITICAL' | 'EXTREME';
  telemetryMetrics: { label: string; value: string; status: 'ok' | 'warn' | 'crit' }[];
  narrative: string;
  quote?: string;
  quoteAuthor?: string;
  scienceTakeaway: string;
  didYouKnowFact: string;
  visualType:
    | 'lunar-descent'
    | 'apollo-13'
    | 'mars-skycrane'
    | 'voyager-record'
    | 'mars-storm'
    | 'webb-mirror';
  choicePrompt: string;
  choices: StoryChoice[];
}

export interface SpaceStory {
  id: string;
  title: string;
  subtitle: string;
  era: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Thrilling' | 'All Ages';
  readTime: string;
  heroEmoji: string;
  themeColor: string;
  badgeId: string;
  badgeTitle: string;
  chapters: StoryChapter[];
}

export interface InteractiveGuide {
  id: 'rocket-staging' | 'newtons-cannon' | 'exoplanet-transit' | 'spacesuit-anatomy';
  title: string;
  subtitle: string;
  category: string;
  difficulty: string;
  emoji: string;
  bigIdea: string;
  realWorldExample: string;
  keyEquationsOrFacts: string[];
  steps: {
    stepNumber: number;
    title: string;
    explanation: string;
    tryItPrompt: string;
  }[];
  badgeId: string;
  badgeTitle: string;
}

export interface GlossaryTerm {
  term: string;
  pronunciation: string;
  category: 'Orbits & Physics' | 'Rockets & Tech' | 'Stars & Galaxies' | 'Planets & Moons';
  simpleDefinition: string;
  everydayAnalogy: string;
  funFact?: string;
  emoji: string;
}

export interface BadgeAward {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'Explorer' | 'Storyteller' | 'Scientist' | 'Ace Pilot';
  xpValue: number;
}
