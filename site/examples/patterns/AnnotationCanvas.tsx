import { useState } from "react";
import { AnnotationCanvas, type AnnotationMark } from "../../../src";

export const meta = {
  name: "AnnotationCanvas",
  file: "patterns/AnnotationCanvas.tsx",
  about: "",
  wide: false,
  order: 21,
};

const picture =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360"><rect width="640" height="360" fill="#f2f2f2"/><rect x="40" y="40" width="260" height="24" rx="4" fill="#d6d6d6"/><rect x="40" y="90" width="560" height="200" rx="8" fill="#ffffff"/></svg>',
  );

export default function Example() {
  const [marks, setMarks] = useState<AnnotationMark[]>([
    { tool: "ellipse", color: "red", points: [{ x: 30, y: 30 }, { x: 320, y: 76 }] },
  ]);
  return (
    <AnnotationCanvas
      className="h-64"
      label="Marked-up page"
      picture={picture}
      width={640}
      height={360}
      tool="pen"
      color="red"
      marks={marks}
      onMarksChange={setMarks}
    />
  );
}
