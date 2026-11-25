import * as React from "react";
import { cn } from "../class_names";

export type AnnotationTool = "pen" | "line" | "rectangle" | "ellipse";

export type AnnotationColor = "red" | "amber" | "blue" | "green" | "ink" | "white";

/** The pens' colors, the full-color art tokens, so a mark reads on any page under it. */
export const annotationColors: { id: AnnotationColor; label: string; token: string }[] = [
  { id: "red", label: "Red", token: "--color-art-red" },
  { id: "amber", label: "Amber", token: "--color-art-amber" },
  { id: "blue", label: "Blue", token: "--color-art-blue" },
  { id: "green", label: "Green", token: "--color-art-green" },
  { id: "ink", label: "Black", token: "--color-art-ink" },
  { id: "white", label: "White", token: "--color-art-white" },
];

export type AnnotationMark = {
  tool: AnnotationTool;
  color: AnnotationColor;
  /** In the picture's own pixels. */
  points: { x: number; y: number }[];
};

const tokenOf = (color: AnnotationColor) =>
  annotationColors.find((item) => item.id === color)?.token ?? "--color-art-red";

const strokeOf = (width: number) => Math.max(3, Math.round(width / 280));

function pathOf(mark: AnnotationMark) {
  const [first, ...rest] = mark.points;
  if (!first) return "";
  const last = rest.at(-1) ?? first;
  switch (mark.tool) {
    case "pen":
      return `M${first.x} ${first.y}${rest.map((point) => `L${point.x} ${point.y}`).join("")}`;
    case "line":
      return `M${first.x} ${first.y}L${last.x} ${last.y}`;
    case "rectangle":
      return `M${first.x} ${first.y}H${last.x}V${last.y}H${first.x}Z`;
    case "ellipse": {
      const rx = Math.abs(last.x - first.x) / 2;
      const ry = Math.abs(last.y - first.y) / 2;
      const cx = (first.x + last.x) / 2;
      const cy = (first.y + last.y) / 2;
      return `M${cx - rx} ${cy}A${rx} ${ry} 0 1 0 ${cx + rx} ${cy}A${rx} ${ry} 0 1 0 ${cx - rx} ${cy}Z`;
    }
  }
}

function useFit(box: React.RefObject<HTMLDivElement | null>, width: number, height: number) {
  const [size, setSize] = React.useState({ width: 0, height: 0 });
  React.useLayoutEffect(() => {
    const element = box.current;
    if (!element || !width || !height) return;
    const measure = () => {
      const scale = Math.min(element.clientWidth / width, element.clientHeight / height, 1);
      setSize({ width: Math.floor(width * scale), height: Math.floor(height * scale) });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    measure();
    return () => observer.disconnect();
  }, [box, width, height]);
  return size;
}

/**
 * A picture to draw on, such as a page's picture marked up before it goes to a chat: it fits the
 * picture inside its box and draws the marks over it, a pen's free line or a line, rectangle or
 * ellipse dragged out, each in one of `annotationColors`. The caller keeps `marks` (and so its own
 * undo and redo) and the chosen `tool` and `color`; the pens and actions are the caller's bar.
 * `renderAnnotatedPicture` flattens the picture and its marks into one PNG.
 */
export function AnnotationCanvas(props: {
  picture: string;
  width: number;
  height: number;
  tool: AnnotationTool;
  color: AnnotationColor;
  marks: AnnotationMark[];
  onMarksChange(marks: AnnotationMark[]): void;
  label: string;
  className?: string;
}) {
  const box = React.useRef<HTMLDivElement>(null);
  const svg = React.useRef<SVGSVGElement>(null);
  const [draft, setDraft] = React.useState<AnnotationMark | null>(null);
  const fit = useFit(box, props.width, props.height);
  const pointOf = (event: React.PointerEvent) => {
    const rect = svg.current?.getBoundingClientRect();
    if (!rect?.width || !rect.height) return { x: 0, y: 0 };
    return {
      x: Math.round(((event.clientX - rect.left) / rect.width) * props.width),
      y: Math.round(((event.clientY - rect.top) / rect.height) * props.height),
    };
  };
  const stroke = strokeOf(props.width);
  const draw = (mark: AnnotationMark, key: React.Key) => (
    <path
      key={key}
      d={pathOf(mark)}
      fill="none"
      stroke={`var(${tokenOf(mark.color)})`}
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
  return (
    <div
      ref={box}
      data-slot="annotation-canvas"
      className={cn("flex min-h-0 min-w-0 items-center justify-center", props.className)}
    >
      <div className="relative" style={{ width: fit.width, height: fit.height }}>
        <img src={props.picture} alt="" draggable={false} className="absolute inset-0 size-full select-none" />
        <svg
          ref={svg}
          role="img"
          aria-label={props.label}
          viewBox={`0 0 ${props.width} ${props.height}`}
          preserveAspectRatio="none"
          className="absolute inset-0 size-full cursor-crosshair touch-none"
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId);
            const point = pointOf(event);
            setDraft({ tool: props.tool, color: props.color, points: [point, point] });
          }}
          onPointerMove={(event) => {
            if (!draft) return;
            const point = pointOf(event);
            setDraft({
              ...draft,
              points: draft.tool === "pen" ? [...draft.points, point] : [draft.points[0], point],
            });
          }}
          onPointerUp={() => {
            if (!draft) return;
            const [first, last] = [draft.points[0], draft.points.at(-1) ?? draft.points[0]];
            const moved = Math.hypot(last.x - first.x, last.y - first.y) > stroke || draft.points.length > 3;
            if (moved) props.onMarksChange([...props.marks, draft]);
            setDraft(null);
          }}
          onPointerCancel={() => setDraft(null)}
        >
          {props.marks.map(draw)}
          {draft ? draw(draft, "draft") : null}
        </svg>
      </div>
    </div>
  );
}

/** The picture with its marks drawn into it, as a PNG the size of the picture. */
export async function renderAnnotatedPicture(
  picture: string,
  width: number,
  height: number,
  marks: AnnotationMark[],
): Promise<Blob> {
  const image = new Image();
  image.src = picture;
  await image.decode();
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("The picture couldn't be drawn.");
  context.drawImage(image, 0, 0, width, height);
  const styles = getComputedStyle(document.documentElement);
  context.lineWidth = strokeOf(width);
  context.lineCap = "round";
  context.lineJoin = "round";
  for (const mark of marks) {
    context.strokeStyle = styles.getPropertyValue(tokenOf(mark.color)).trim();
    context.stroke(new Path2D(pathOf(mark)));
  }
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("The picture couldn't be drawn."))),
      "image/png",
    ),
  );
}
