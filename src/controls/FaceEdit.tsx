import { Pencil } from "lucide-react";
import { cn } from "../class_names";
import { Tooltip } from "../overlays/Tooltip";
import { Pressable } from "./Pressable";

/**
 * Changing a picture right on its face: the person's own face, or a Space's they may change. Laid
 * over the face, it shows nothing at rest; while the face itself is hovered or holds focus, the
 * overlay wash darkens it and a pencil sits in its middle, named in Misty's tooltip ("Change
 * picture"). Pressing it calls `onEdit`, which picks the new picture. It fills its positioned
 * parent (a `relative` box the face's size) and takes the face's `shape`. It is a button of its
 * own, never inside another: where the face sits in a button (a menu trigger, a nav row), lay it
 * over that face as the button's sibling, as `MenuTrigger`'s `markEdit` does. Only on a face the
 * person may change; anyone else's face stays plain.
 *
 * ```tsx
 * <span className="relative inline-flex">
 *   <Avatar size="xl">…</Avatar>
 *   <FaceEdit onEdit={pickPicture} />
 * </span>
 * ```
 */
export function FaceEdit({
  onEdit,
  label = "Change picture",
  shape = "circle",
}: {
  onEdit: () => void;
  /** Its tooltip and accessible name. */
  label?: string;
  /** The face's own shape: an Avatar's `circle`, or `tile` for a Space's picture. */
  shape?: "circle" | "tile";
}) {
  return (
    <Tooltip content={label}>
      <Pressable
        data-slot="face-edit"
        aria-label={label}
        onClick={(event) => {
          event.stopPropagation();
          onEdit();
        }}
        className={cn(
          "absolute inset-0 grid place-items-center overflow-hidden",
          shape === "tile" ? "rounded-[28%]" : "rounded-full",
          "bg-charcoal-bg/75 text-cream-bright opacity-0 transition-opacity",
          "hover:opacity-100 focus-visible:opacity-100",
        )}
      >
        <Pencil aria-hidden="true" />
      </Pressable>
    </Tooltip>
  );
}
