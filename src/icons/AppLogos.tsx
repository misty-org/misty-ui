import { useState } from "react";
import { LogoInitial } from "./LogoFallbacks";

/** Where an app's logo shows: a sidebar row, the apps launcher, a directory card, a big tile. */
export type AppLogoSize = "row" | "launcher" | "card" | "tile";
const sizePx: Record<AppLogoSize, number> = { row: 20, launcher: 56, card: 48, tile: 64 };

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
