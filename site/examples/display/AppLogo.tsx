import { AppLogo } from "../../../src";

export const meta = { name: "AppLogo", file: "icons/AppLogos.tsx", about: "", wide: false, order: 23 };

const row = "flex flex-wrap items-center gap-3";

const officialApps = [
  "docs",
  "whiteboards",
  "lab",
  "planner",
  "calendar",
  "media",
  "code",
  "slides",
  "data",
] as const;

export default function Example() {
  return (
    <div className={row}>
      {officialApps.map((app) => (
        <AppLogo key={app} app={app} size="card" />
      ))}
    </div>
  );
}
