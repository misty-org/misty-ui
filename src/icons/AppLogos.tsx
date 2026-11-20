import { useState, type CSSProperties, type ReactNode } from "react";
import { LogoInitial } from "./LogoFallbacks";

/**
 * The logos of the apps Misty ships, style A of `mockups/space-app-logos.html`: a colored tile with white
 * artwork, drawn once on a 64 grid. This is the one place a logo sits on a tile; icons, other logos and
 * engine marks stay bare. A third-party app brings its own logo (its manifest's `logo`).
 */
export type OfficialAppId =
  "docs" | "whiteboards" | "lab" | "planner" | "calendar" | "media" | "code" | "slides" | "data";

export interface OfficialApp {
  id: OfficialAppId;
  name: string;
  /** The tile's color; the artwork's tones are made from it. */
  color: string;
  /** One line for the directory. */
  by: string;
  /** Slides and Data: mods can install them, and they say so. */
  workInProgress?: boolean;
}

/** In the order the directory lists them. */
export const officialApps: readonly OfficialApp[] = [
  { id: "docs", name: "Docs", color: "#3b6fe0", by: "Rich text, written together" },
  { id: "whiteboards", name: "Whiteboards", color: "#e39a2d", by: "Draw and sketch together" },
  { id: "lab", name: "Lab", color: "#7c5ce0", by: "Notebooks from your sources" },
  { id: "planner", name: "Planner", color: "#1f9e84", by: "Tasks on boards" },
  { id: "calendar", name: "Calendar", color: "#e0533f", by: "The Space's schedule" },
  { id: "media", name: "Media", color: "#d6427c", by: "Photos, videos and app files" },
  { id: "code", name: "Code", color: "#3f9aa3", by: "Projects and agent sessions" },
  {
    id: "slides",
    name: "Slides",
    color: "#e8743b",
    by: "Decks from layouts",
    workInProgress: true,
  },
  {
    id: "data",
    name: "Data",
    color: "#2f9a52",
    by: "Sheets, charts, dashboards",
    workInProgress: true,
  },
];

export const officialAppById = (id: string): OfficialApp | undefined =>
  officialApps.find((app) => app.id === id);

/** Tones: `--p` paper, `--s` soft, `--i` ink, `--a` accent. */
const artwork: Record<OfficialAppId, ReactNode> = {
  docs: (
    <>
      <path
        d="M20 11h17l11 11v29a3 3 0 0 1-3 3H20a3 3 0 0 1-3-3V14a3 3 0 0 1 3-3z"
        fill="var(--p)"
      />
      <path d="M37 11v8a3 3 0 0 0 3 3h8z" fill="var(--s)" />
      <rect x="22" y="27" width="15" height="4" rx="2" fill="var(--a)" />
      <rect x="22" y="35" width="21" height="2.5" rx="1.25" fill="var(--i)" />
      <rect x="22" y="40.5" width="21" height="2.5" rx="1.25" fill="var(--i)" />
      <rect x="22" y="46" width="13" height="2.5" rx="1.25" fill="var(--i)" />
    </>
  ),
  whiteboards: (
    <>
      <path d="M25 43l-5 11M39 43l5 11" stroke="var(--s)" strokeWidth="3.5" strokeLinecap="round" />
      <rect x="9" y="12" width="46" height="32" rx="3.5" fill="var(--p)" />
      <circle cx="21" cy="25" r="5" fill="none" stroke="var(--a)" strokeWidth="2.6" />
      <rect x="31" y="19" width="11" height="11" rx="2" fill="var(--i)" />
      <path
        d="M15 37c4-4 7 2 11-1s6-4 9-1 7 2 14-3"
        fill="none"
        stroke="var(--a)"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <rect x="22" y="44" width="20" height="3" rx="1.5" fill="var(--s)" />
    </>
  ),
  lab: (
    <>
      <path
        d="M25 9h14a1.5 1.5 0 0 1 0 3h-1.5v11.5l12.2 21.8A4.5 4.5 0 0 1 45.8 52H18.2a4.5 4.5 0 0 1-3.9-6.7l12.2-21.8V12H25a1.5 1.5 0 0 1 0-3z"
        fill="var(--p)"
      />
      <path d="M21.3 37h21.4l5 9.1A2 2 0 0 1 46 49H18a2 2 0 0 1-1.7-2.9z" fill="var(--a)" />
      <circle cx="27" cy="43" r="2.2" fill="var(--p)" opacity=".85" />
      <circle cx="35" cy="41" r="1.5" fill="var(--p)" opacity=".85" />
      <circle cx="31" cy="31" r="1.8" fill="var(--i)" />
      <circle cx="34" cy="26" r="1.2" fill="var(--i)" />
      <rect x="30.5" y="14" width="7" height="2" rx="1" fill="var(--i)" />
      <rect x="30.5" y="18" width="5" height="2" rx="1" fill="var(--i)" />
    </>
  ),
  planner: (
    <>
      <rect x="9" y="11" width="14" height="42" rx="3.5" fill="var(--s)" />
      <rect x="25" y="11" width="14" height="42" rx="3.5" fill="var(--s)" />
      <rect x="41" y="11" width="14" height="42" rx="3.5" fill="var(--s)" />
      <rect x="11" y="14" width="10" height="9" rx="2" fill="var(--p)" />
      <rect x="11" y="25" width="10" height="12" rx="2" fill="var(--p)" />
      <rect x="27" y="14" width="10" height="12" rx="2" fill="var(--a)" />
      <rect x="27" y="28" width="10" height="8" rx="2" fill="var(--p)" />
      <rect x="27" y="38" width="10" height="10" rx="2" fill="var(--p)" />
      <rect x="43" y="14" width="10" height="10" rx="2" fill="var(--p)" />
      <path
        d="M45.5 19l2 2 3.5-4"
        fill="none"
        stroke="var(--a)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
  calendar: (
    <>
      <rect x="10" y="14" width="44" height="40" rx="5" fill="var(--p)" />
      <path d="M15 14h34a5 5 0 0 1 5 5v6H10v-6a5 5 0 0 1 5-5z" fill="var(--a)" />
      <rect x="20" y="9" width="4" height="10" rx="2" fill="var(--s)" />
      <rect x="40" y="9" width="4" height="10" rx="2" fill="var(--s)" />
      <g fill="var(--i)">
        <rect x="16" y="30" width="5" height="4" rx="1" />
        <rect x="24" y="30" width="5" height="4" rx="1" />
        <rect x="32" y="30" width="5" height="4" rx="1" />
        <rect x="40" y="30" width="5" height="4" rx="1" />
        <rect x="16" y="37" width="5" height="4" rx="1" />
        <rect x="32" y="37" width="5" height="4" rx="1" />
        <rect x="40" y="37" width="5" height="4" rx="1" />
        <rect x="16" y="44" width="5" height="4" rx="1" />
        <rect x="24" y="44" width="5" height="4" rx="1" />
        <rect x="32" y="44" width="5" height="4" rx="1" />
      </g>
      <rect x="22.5" y="35.5" width="8" height="7" rx="2" fill="var(--a)" />
    </>
  ),
  media: (
    <>
      <rect
        x="13"
        y="12"
        width="34"
        height="27"
        rx="3.5"
        fill="var(--s)"
        transform="rotate(-8 30 25)"
      />
      <rect x="15" y="20" width="36" height="29" rx="3.5" fill="var(--p)" />
      <path d="M19 45l9-11 6 7 4-4 9 8z" fill="var(--i)" />
      <circle cx="42" cy="28" r="3.5" fill="var(--a)" />
      <rect x="38" y="40" width="17" height="15" rx="4" fill="var(--a)" />
      <path d="M44.5 44.2v6.6l5.5-3.3z" fill="var(--p)" />
    </>
  ),
  // A paper window with three title dots and an accent </> inside: the mark the person picked for Code.
  code: (
    <>
      <rect x="9" y="12" width="46" height="40" rx="5" fill="var(--p)" />
      <circle cx="16" cy="18" r="1.8" fill="var(--a)" />
      <circle cx="22" cy="18" r="1.8" fill="var(--i)" />
      <circle cx="28" cy="18" r="1.8" fill="var(--i)" />
      <g fill="none" stroke="var(--a)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M24 31l-6 7 6 7" />
        <path d="M40 31l6 7-6 7" />
        <path d="M35 29l-6 18" />
      </g>
    </>
  ),
  slides: (
    <>
      <rect x="30.5" y="40" width="3" height="11" fill="var(--s)" />
      <rect x="22" y="50" width="20" height="3.5" rx="1.75" fill="var(--s)" />
      <rect x="8" y="12" width="48" height="30" rx="3.5" fill="var(--p)" />
      <rect x="13" y="17" width="16" height="4" rx="2" fill="var(--a)" />
      <rect x="13" y="25" width="13" height="2.5" rx="1.25" fill="var(--i)" />
      <rect x="13" y="30" width="10" height="2.5" rx="1.25" fill="var(--i)" />
      <rect x="35" y="28" width="4.5" height="9" rx="1" fill="var(--i)" />
      <rect x="42" y="22" width="4.5" height="15" rx="1" fill="var(--a)" />
      <rect x="49" y="31" width="2.5" height="6" rx="1" fill="var(--i)" />
    </>
  ),
  data: (
    <>
      <rect x="10" y="10" width="44" height="44" rx="5" fill="var(--p)" />
      <g fill="var(--i)" opacity=".55">
        <rect x="15" y="17" width="34" height="1.5" />
        <rect x="15" y="26" width="34" height="1.5" />
        <rect x="15" y="35" width="34" height="1.5" />
      </g>
      <rect x="17" y="33" width="6" height="14" rx="1.5" fill="var(--i)" />
      <rect x="26" y="24" width="6" height="23" rx="1.5" fill="var(--a)" />
      <rect x="35" y="29" width="6" height="18" rx="1.5" fill="var(--i)" />
      <rect x="44" y="20" width="4" height="27" rx="1.5" fill="var(--a)" />
      <rect x="15" y="47" width="34" height="2" rx="1" fill="var(--a)" />
    </>
  ),
};

/** Where an app's logo shows: a sidebar row, a Space home's app grid, a directory card, a big tile. */
export type AppLogoSize = "row" | "launcher" | "card" | "tile";
const sizePx: Record<AppLogoSize, number> = { row: 20, launcher: 56, card: 48, tile: 64 };

/**
 * An official app's logo on its color tile (style A). The artwork's tones are made from the tile's color,
 * exactly as the mockup does, so every app reads as one family.
 */
export function AppLogo({ app, size = "row" }: { app: OfficialAppId; size?: AppLogoSize }) {
  const meta = officialAppById(app);
  if (!meta) return null;
  const px = sizePx[size];
  const tones = {
    "--c": meta.color,
    "--p": "#fff",
    "--s": "rgba(255,255,255,.5)",
    "--i": "color-mix(in srgb, var(--c) 55%, #fff)",
    "--a": "color-mix(in srgb, var(--c) 82%, #000)",
  } as CSSProperties;
  return (
    <svg
      viewBox="0 0 64 64"
      width={px}
      height={px}
      aria-hidden="true"
      data-app-logo={app}
      style={{ ...tones, display: "block", flexShrink: 0 }}
    >
      <rect x="0.5" y="0.5" width="63" height="63" rx="15" fill={meta.color} />
      {artwork[app]}
    </svg>
  );
}

/**
 * A third-party app's own icon, as its maker drew it (already on its own tile), at the size an app's logo has in
 * `AppLogoSize`. Until the icon is there, or if it can't load, the app's initial shows instead.
 */
export function AppLogoImage({
  src,
  name,
  size = "row",
}: {
  src?: string;
  name: string;
  size?: AppLogoSize;
}) {
  const [failed, setFailed] = useState(false);
  const px = sizePx[size];
  if (!src || failed) return <LogoInitial name={name} size={px} />;
  return (
    <img
      src={src}
      alt=""
      width={px}
      height={px}
      data-app-logo-image={name}
      onError={() => setFailed(true)}
      style={{ display: "block", flexShrink: 0 }}
    />
  );
}
