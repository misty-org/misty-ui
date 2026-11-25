import {
  AudioLines,
  Bot,
  Brain,
  CircleUserRound,
  FlaskConical,
  Galaxy,
  Hash,
  Package,
  Users,
  Volume2,
  CalendarClock,
  ListTodo,
  Code2,
  FolderOpen,
  Globe2,
  House,
  MessagesSquare,
  Notebook,
  SquareTerminal,
  Compass,
  Music,
  Film,
  LayoutGrid,
  type LucideIcon,
} from "lucide-react";

/** App identity shared by navigation, tabs, launchers, and Discover. */
export const appIcons = {
  home: House,
  social: MessagesSquare,
  journal: Notebook,
  memory: Brain,
  files: FolderOpen,
  agents: MessagesSquare,
  scheduled: CalendarClock,
  planner: ListTodo,
  library: Package,
  browser: Globe2,
  code: Code2,
  terminal: SquareTerminal,
  marketplace: Compass,
  music: Music,
  media: Film,
  /** The engines agents run on (Claude Code, Codex and the rest), as Explore lists them. */
  engines: SquareTerminal,
  /** Speech models and voices: what Misty hears and speaks with. */
  speech: AudioLines,
} satisfies Record<string, LucideIcon>;

export const appIconStrokeWidth = 2;

/**
 * A Space and its places, one icon each wherever they show: the sidebar's rows, the window's tabs
 * and the shortcuts for them. A tab never wears a stand-in such as a
 * house for the Space itself.
 */
export const spaceIcons = {
  /** The person's own side of the sidebar (Personal), opposite the Spaces. */
  personal: CircleUserRound,
  space: Galaxy,
  explore: Compass,
  chat: MessagesSquare,
  files: FolderOpen,
  /** The apps installed on this computer, opened from the Space rail's launcher. */
  apps: LayoutGrid,
  /** Misty's browser: its sidebar row, a web tab with no site icon yet and its shortcut. */
  browser: Globe2,
  lab: FlaskConical,
  code: Code2,
  /** The agents people make in a Space, as a group: Settings' Agents page, never one agent's face. */
  agents: Bot,
  /** A text channel, and everyone's channel. */
  channel: Hash,
  /** A voice channel. */
  voice: Volume2,
  /** Personal's Friends page. */
  friends: Users,
} satisfies Record<string, LucideIcon>;

/**
 * Whose profile a chat's Profile button and its panel open: a person's (a direct message) or an
 * agent's (an agent chat). An agent never wears the person's icon.
 */
export const profileIcons = {
  person: CircleUserRound,
  agent: Bot,
} satisfies Record<string, LucideIcon>;

/** A Space tab's tool (`spaceWorkspaceToolFromRoute`) as `spaceIcons` names it. */
const spaceTools: Record<string, keyof typeof spaceIcons> = {
  home: "space",
  space: "space",
  explore: "explore",
  social: "chat",
  chat: "chat",
  lab: "lab",
  files: "files",
  library: "files",
  media: "files",
};

/** Catalog IDs retain `chat`; workspace routes and navigation use `social`. */
export function appIcon(appId: string, context: "app" | "space" = "app"): LucideIcon | undefined {
  if (context === "space" && spaceTools[appId]) return spaceIcons[spaceTools[appId]];
  const id = appId === "chat" ? "social" : appId;
  return Object.prototype.hasOwnProperty.call(appIcons, id)
    ? appIcons[id as keyof typeof appIcons]
    : undefined;
}
