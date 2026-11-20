import React from "react";
import { MenuItem, ZoomControl } from "../../../src";

export const meta = {
  name: "ZoomControl",
  file: "patterns/ZoomControl.tsx",
  about: "",
  wide: false,
  order: 17,
};

function ZoomDemo() {
  const [zoom, setZoom] = React.useState(100);
  return (
    <ZoomControl
      value={`${zoom}%`}
      onZoomIn={() => setZoom(zoom + 25)}
      onZoomOut={() => setZoom(Math.max(25, zoom - 25))}
    >
      <MenuItem label="Fit" onSelect={() => setZoom(100)} />
      <MenuItem label="200%" onSelect={() => setZoom(200)} />
    </ZoomControl>
  );
}

export default function Example() {
  return <ZoomDemo />;
}
