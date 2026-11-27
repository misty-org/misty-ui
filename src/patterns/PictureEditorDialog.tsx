import { ImagePlus, RotateCcw, RotateCw } from "lucide-react";
import { useRef, useState } from "react";
import type { AvatarEditorRef } from "react-avatar-editor";
import { Button } from "../controls/Button";
import { ColorSwatch, CustomColorSwatch } from "../controls/ColorSwatch";
import { FieldError } from "../controls/Field";
import { FileInput } from "../controls/FileInput";
import { IconButton } from "../controls/IconButton";
import { Pressable } from "../controls/Pressable";
import { Slider } from "../controls/Slider";
import { roleColorPresets } from "../display/RoleName";
import { Text } from "../display/Text";
import { lazyTool, ToolSuspense } from "../feedback/ToolSuspense";
import { cropFrame, cropSize } from "./picture_crop";
import { PlaceholderIcon } from "../icons/PlaceholderIcon";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../overlays/Dialog";

/** The outline colors offered first: the app's pastels, as a role's are. Any other may be picked. */
export const pictureOutlinePresets = roleColorPresets;

/** What the editor hands back: the new picture (a square PNG), or null when it wasn't changed. */
export type PictureEditorResult = {
  picture: Blob | null;
  outline: string | null;
};

export type PictureEditorDialogProps = {
  /** "Edit picture" by default; a Space's says "Edit Space picture". */
  title?: string;
  /** The face's shape, so the crop and the outline are drawn as it will show. */
  shape?: "circle" | "tile";
  /** The current picture's address, or null when there is none yet. */
  src: string | null;
  /** The current outline, `#rrggbb`, or null for none. */
  outline: string | null;
  /** Which files may be picked. */
  accept?: string;
  /**
   * Picks the picture with the host's own file picker (Misty's), resolving to the chosen file or
   * nothing when the person cancels. Without it, the system's file dialog opens.
   */
  onChoose?: () => Promise<File | null | undefined>;
  /** Saves the result. If it throws, its message shows above the buttons and the dialog stays. */
  onSave: (result: PictureEditorResult) => Promise<unknown>;
  onClose: () => void;
};

const crop = cropSize;
const frame = cropFrame;
const output = 512;
const PictureCropStage = lazyTool(() => import("./PictureCropStage"));

function failureText(
  cause: unknown,
  otherwise = "The picture wasn't saved. Try again.",
) {
  const message =
    cause instanceof Error
      ? cause.message
      : typeof cause === "string"
        ? cause
        : "";
  return message.trim() || otherwise;
}

function squarePng(source: HTMLCanvasElement): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = output;
  canvas.height = output;
  const context = canvas.getContext("2d");
  if (!context)
    return Promise.reject(new Error("The picture couldn't be drawn."));
  context.imageSmoothingQuality = "high";
  context.drawImage(source, 0, 0, output, output);
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) =>
        blob
          ? resolve(blob)
          : reject(new Error("The picture couldn't be drawn.")),
      "image/png",
    ),
  );
}

/**
 * Changing a face's picture and its outline, as Discord's avatar editor does: the picture in a crop
 * of the face's own shape (`circle` or `tile`), dragged to place it, zoomed with the slider or the
 * wheel and turned a quarter at a time; the outline (the face's avatar decoration) picked from the
 * app's pastels, any other color, or none, and drawn over the crop at the size it will show.
 * Choose picture swaps in another file, through the host's own picker when it passes `onChoose`
 * (Misty's always does) and the system's file dialog otherwise. Save hands back a 512px square PNG, or null for the
 * picture when only the outline changed, and the outline. Mount it while open, keyed by what it
 * edits, so nothing carries over.
 *
 * ```tsx
 * {editing ? (
 *   <PictureEditorDialog src={pictureUrl} outline={decoration.outline ?? null}
 *     onSave={save} onClose={() => setEditing(false)} />
 * ) : null}
 * ```
 */
export function PictureEditorDialog({
  title = "Edit picture",
  shape = "circle",
  src,
  outline: initialOutline,
  accept = "image/png,image/jpeg,image/webp,image/gif",
  onChoose,
  onSave,
  onClose,
}: PictureEditorDialogProps) {
  const editor = useRef<AvatarEditorRef>(null);
  const input = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<string | File | null>(src);
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [position, setPosition] = useState({ x: 0.5, y: 0.5 });
  const [touched, setTouched] = useState(false);
  const [outline, setOutline] = useState<string | null>(initialOutline);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const take = (file: File) => {
    setImage(file);
    setScale(1);
    setRotate(0);
    setPosition({ x: 0.5, y: 0.5 });
    setTouched(true);
    setError("");
  };
  const pick = () => {
    if (!onChoose) return input.current?.click();
    void onChoose().then(
      (file) => {
        if (file) take(file);
      },
      (cause) =>
        setError(failureText(cause, "That picture couldn't be opened.")),
    );
  };
  const save = async () => {
    if (busy) return;
    const canvas = touched && image ? editor.current?.getImage() : null;
    if (!canvas && outline === initialOutline) {
      onClose();
      return;
    }
    setBusy(true);
    setError("");
    try {
      await onSave({
        picture: canvas ? await squarePng(canvas) : null,
        outline,
      });
      onClose();
    } catch (cause) {
      setError(failureText(cause));
      setBusy(false);
    }
  };
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !busy) onClose();
      }}
    >
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogBody className="flex flex-col items-center gap-4">
          <div className="relative overflow-hidden rounded-xl bg-charcoal-bg">
            {image ? (
              <ToolSuspense
                tool="picture editor"
                size="inline"
                frame={(state) => (
                  <div
                    className="grid place-items-center"
                    style={{
                      width: crop + frame * 2,
                      height: crop + frame * 2,
                    }}
                  >
                    {state}
                  </div>
                )}
              >
                <PictureCropStage
                  editorRef={editor}
                  image={image}
                  shape={shape}
                  outline={outline}
                  scale={scale}
                  rotate={rotate}
                  position={position}
                  onPositionChange={(next) => {
                    setPosition(next);
                    setTouched(true);
                  }}
                  onScaleChange={(next) => {
                    setScale(Math.min(3, Math.max(1, next)));
                    setTouched(true);
                  }}
                  onLoadFailure={() =>
                    setError("That picture couldn't be opened.")
                  }
                />
              </ToolSuspense>
            ) : (
              <Pressable
                aria-label="Choose a picture"
                onClick={pick}
                wash="control"
                className="grid place-items-center"
                style={{ width: crop + frame * 2, height: crop + frame * 2 }}
              >
                <span className="flex flex-col items-center gap-2">
                  <PlaceholderIcon icon={ImagePlus} />
                  <Text tone="muted" size="meta">
                    Choose a picture
                  </Text>
                </span>
              </Pressable>
            )}
          </div>
          {image ? (
            <div className="flex w-full max-w-80 items-center gap-2">
              <IconButton
                label="Rotate left"
                onClick={() => {
                  setRotate((turn) => (turn + 270) % 360);
                  setTouched(true);
                }}
              >
                <RotateCcw />
              </IconButton>
              <Slider
                aria-label="Zoom"
                min={1}
                max={3}
                step={0.01}
                value={[scale]}
                onValueChange={([next]) => {
                  setScale(next ?? 1);
                  setTouched(true);
                }}
              />
              <IconButton
                label="Rotate right"
                onClick={() => {
                  setRotate((turn) => (turn + 90) % 360);
                  setTouched(true);
                }}
              >
                <RotateCw />
              </IconButton>
            </div>
          ) : null}
          <div className="flex w-full flex-col gap-2">
            <Text size="meta" tone="muted" weight="medium">
              Outline
            </Text>
            <div
              role="radiogroup"
              aria-label="Outline"
              className="flex flex-wrap items-center gap-2"
            >
              <ColorSwatch
                radio
                color="transparent"
                label="No outline"
                selected={!outline}
                onClick={() => setOutline(null)}
              />
              {pictureOutlinePresets.map((color) => (
                <ColorSwatch
                  key={color}
                  radio
                  color={color}
                  label={color}
                  selected={outline?.toLowerCase() === color}
                  onClick={() => setOutline(color)}
                />
              ))}
              <CustomColorSwatch
                label="Any color"
                value={outline ?? pictureOutlinePresets[0]}
                onChange={(color) => setOutline(color.toLowerCase())}
              />
            </div>
          </div>
          <FieldError className="w-full" message={error} />
        </DialogBody>
        <DialogFooter>
          <Button
            variant="secondary"
            size="lg"
            className="mr-auto"
            disabled={busy}
            onClick={pick}
          >
            {image ? "Choose another" : "Choose picture"}
          </Button>
          <Button variant="quiet" size="lg" disabled={busy} onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="lg"
            disabled={busy}
            onClick={() => void save()}
          >
            Save
          </Button>
        </DialogFooter>
        {onChoose ? null : (
          <FileInput
            ref={input}
            accept={accept}
            aria-label="Picture"
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (file) take(file);
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
