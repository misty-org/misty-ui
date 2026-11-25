import { useState } from "react";
import { LogoInitial, LogoPlate } from "./LogoFallbacks";
import type { MarkRender } from "./Mark";

/** Where an app's logo shows: a tab (the glyph's size), a sidebar row, the apps launcher, a directory card, a big tile, a product page's hero. */
export type AppLogoSize = "glyph" | "row" | "launcher" | "card" | "tile" | "hero";
const sizePx: Record<AppLogoSize, number> = {
  glyph: 18,
  row: 20,
  launcher: 56,
  card: 48,
  tile: 64,
  hero: 126,
};

/**
 * A third-party app's own icon, as its maker drew it (already on its own tile), at the size an app's logo has in
 * `AppLogoSize`. `render` is the registry entry's `icon_render`, by the marks registry's rules: `color` (the
 * default) as drawn, `theme` for a one-color icon that follows the theme, `plate-dark` or `plate-light` on a
 * small plate where it would disappear. Until the icon is there, or if it can't load, the app's initial shows.
 */
export function AppLogoImage({
  src,
  name,
  size = "row",
  render = "color",
}: {
  src?: string;
  name: string;
  size?: AppLogoSize;
  render?: MarkRender;
}) {
  const [failed, setFailed] = useState(false);
  const px = sizePx[size];
  if (!src || failed) return <LogoInitial name={name} size={px} />;
  const image = (
    <img
      src={src}
      alt=""
      width={px}
      height={px}
      data-app-logo-image={name}
      onError={() => setFailed(true)}
      style={render === "theme" ? { display: "none" } : { display: "block", flexShrink: 0 }}
    />
  );
  if (render === "theme") {
    const mask = `url("${src}") center / contain no-repeat`;
    return (
      <span
        data-app-logo-image={name}
        style={{
          display: "block",
          flexShrink: 0,
          width: px,
          height: px,
          WebkitMask: mask,
          mask,
          backgroundColor: "light-dark(#000, #fff)",
        }}
      >
        {image}
      </span>
    );
  }
  if (render === "color") return image;
  return <LogoPlate plate={render === "plate-dark" ? "dark" : "light"}>{image}</LogoPlate>;
}
