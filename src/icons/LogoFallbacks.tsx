import type { CSSProperties, ReactNode } from "react";

type LogoSize = number | string;

/**
 * What a logo slot shows when there is no artwork: the name's first letter, drawn bare in the text
 * colour. A logo is never left blank.
 */
export function LogoInitial({ name, size = 16 }: { name: string; size?: LogoSize }) {
  const letter = name.trim().charAt(0).toUpperCase() || "?";
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
      data-logo-initial={letter}
      style={{ flexShrink: 0 }}
    >
      <text
        x="12"
        y="12"
        dominantBaseline="central"
        textAnchor="middle"
        fontSize="17"
        fontWeight="700"
        fill="currentColor"
      >
        {letter}
      </text>
    </svg>
  );
}

/** The theme on which a logo all but disappears, and so sits on a plate there. */
export type LogoPlateTheme = "dark" | "light";

const plateStyle: Record<LogoPlateTheme, CSSProperties> = {
  dark: { backgroundColor: "light-dark(transparent, #f2f2f2)" },
  light: { backgroundColor: "light-dark(#1c1c1c, transparent)" },
};

/**
 * Puts a logo on a small plate on the theme where it would disappear, as a last resort after the
 * brand's own variants. A mark says when it needs one (`render` in `marks.json`, which `Mark` reads);
 * without `plate` the logo passes through bare.
 */
export function LogoPlate({ plate, children }: { plate?: LogoPlateTheme; children: ReactNode }) {
  if (!plate) return children;
  return (
    <span
      data-logo-plate={plate}
      style={{
        display: "inline-flex",
        flexShrink: 0,
        alignItems: "center",
        justifyContent: "center",
        padding: "calc(var(--spacing) * 0.5)",
        borderRadius: "var(--radius-sm)",
        ...plateStyle[plate],
      }}
    >
      {children}
    </span>
  );
}
