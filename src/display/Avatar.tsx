import * as AvatarPrimitive from "@radix-ui/react-avatar";
import * as React from "react";

import { cn } from "../class_names";
import type { ItemTone } from "../icons/item_tones";

/**
 * glyph 18 (a face standing where an icon goes, such as a tab's, with no presence dot), xs 22.5
 * (inline beside text), sm 31.5, default 40.5, lg 45 (a message), xl 81 (a profile or a Space's page).
 */
export type AvatarSize = "glyph" | "xs" | "sm" | "default" | "lg" | "xl";

/**
 * A fill for initials with no picture, such as a Space's own color: one of the item tones, with
 * the dark ink that reads on every one of them.
 */
export type AvatarTone = ItemTone;

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> & {
    size?: AvatarSize;
    /**
     * `tile` sits in an icon slot like a glyph: a square with soft corners and no ring,
     * so any uploaded picture crops to the same footprint as the icons around it.
     */
    shape?: "circle" | "tile";
    /** Paints the fallback (the initials) in this tone. A picture, once loaded, covers it. */
    tone?: AvatarTone;
    /**
     * A subtle hairline just inside the face's edge, following its shape, so a picture as dark
     * as the sidebar still reads as its own tile. A Space's picture wears it.
     */
    edge?: boolean;
    /**
     * The ring the person chose for their face or their Space's (their avatar decoration's
     * outline): any `#rrggbb`, drawn just inside the face's edge, following its shape, 2.25px
     * wide (4.5px at `xl`). It takes the place of `edge`.
     */
    outline?: string | null;
  }
>(({ className, size = "default", shape = "circle", tone, edge, outline, style, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    data-slot="avatar"
    data-size={size}
    data-shape={shape}
    data-tone={tone}
    data-edge={(edge && !outline) || undefined}
    data-outline={outline ? "" : undefined}
    className={cn(
      "group/avatar relative flex size-9 shrink-0 overflow-hidden rounded-full border border-charcoal-border bg-charcoal-card text-cream-bright select-none",
      "data-[size=glyph]:size-4 data-[size=xs]:size-5 data-[size=sm]:size-7 data-[size=lg]:size-10 data-[size=xl]:size-18",
      "data-[tone]:border-0",
      "data-[tone=blue]:bg-tone-blue data-[tone=red]:bg-tone-red data-[tone=green]:bg-tone-green",
      "data-[tone=orange]:bg-tone-orange data-[tone=violet]:bg-tone-violet data-[tone=pink]:bg-tone-pink",
      "data-[tone=amber]:bg-tone-amber data-[tone=teal]:bg-tone-teal data-[tone=sand]:bg-tone-sand",
      "data-[shape=tile]:rounded-[28%] data-[shape=tile]:border-0 data-[shape=tile]:bg-transparent",
      "data-[shape=tile]:[container-type:size]",
      "data-[edge]:hairline-outline data-[edge]:outline-charcoal-border-strong",
      "data-[outline]:outline-solid data-[outline]:outline-(--avatar-outline)",
      "data-[outline]:outline-(length:--avatar-ring) data-[outline]:-outline-offset-(--avatar-ring)",
      "[--avatar-ring:calc(var(--spacing)*0.5)] data-[size=xl]:[--avatar-ring:var(--spacing)]",
      className,
    )}
    style={outline ? ({ ...style, "--avatar-outline": outline } as React.CSSProperties) : style}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

function useSettledSrc(src: string | undefined) {
  const [shown, setShown] = React.useState(src);
  React.useEffect(() => {
    if (src === shown) return;
    if (!src) {
      setShown(src);
      return;
    }
    let live = true;
    const next = new window.Image();
    next.src = src;
    const settle = () => {
      if (live) setShown(src);
    };
    if (typeof next.decode === "function") next.decode().then(settle, settle);
    else settle();
    return () => {
      live = false;
    };
  }, [src, shown]);
  return shown;
}

/**
 * The face's picture. When its address changes (a new picture, a new version), the one on screen
 * stays until the new one has loaded and decoded, then they swap in one frame, so a face never
 * flashes back to its initials or draws half a picture.
 */
const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, src, ...props }, ref) => {
  const shown = useSettledSrc(src);
  return (
    <AvatarPrimitive.Image
      ref={ref}
      data-slot="avatar-image"
      className={cn(
        "aspect-square size-full rounded-full object-cover group-data-[shape=tile]/avatar:rounded-[inherit]",
        className,
      )}
      src={shown}
      {...props}
    />
  );
});
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    data-slot="avatar-fallback"
    className={cn(
      "flex size-full items-center justify-center rounded-full bg-charcoal-card",
      "text-control font-medium text-cream-bright group-data-[size=sm]/avatar:text-caption",
      "group-data-[size=xs]/avatar:text-micro group-data-[size=glyph]/avatar:text-micro",
      "group-data-[size=xl]/avatar:text-title",
      "group-data-[tone]/avatar:bg-transparent group-data-[tone]/avatar:text-ink-on-color",
      "group-data-[shape=tile]/avatar:rounded-[inherit] group-data-[shape=tile]/avatar:text-[length:42cqi] group-data-[shape=tile]/avatar:font-semibold",
      className,
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarFallback, AvatarImage };
