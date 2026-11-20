import React from "react";
import { ImageCropFrame, Surface } from "../../../src";

export const meta = {
  name: "ImageCropFrame",
  file: "patterns/ImageCropFrame.tsx",
  about: "",
  wide: false,
  order: 19,
};

function CropDemo() {
  const [rect, setRect] = React.useState({ x: 0.15, y: 0.15, width: 0.6, height: 0.6 });
  return (
    <Surface tone="media" radius="lg" className="relative h-48 overflow-hidden">
      <ImageCropFrame rect={rect} onChange={setRect} />
    </Surface>
  );
}

export default function Example() {
  return <CropDemo />;
}
