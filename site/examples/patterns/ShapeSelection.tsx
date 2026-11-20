import { ShapeSelection } from "../../../src";

export const meta = {
  name: "ShapeSelection",
  file: "patterns/ShapeSelection.tsx",
  about: "",
  wide: false,
  order: 20,
};

export default function Example() {
  return (
    <div className="relative h-40">
      <ShapeSelection
        outline={[
          { x: 40, y: 30 },
          { x: 200, y: 30 },
          { x: 200, y: 120 },
          { x: 40, y: 120 },
        ]}
        handles={[
          { id: "nw", x: 40, y: 30, cursor: "nwse-resize" },
          { id: "se", x: 200, y: 120, cursor: "nwse-resize" },
        ]}
      />
    </div>
  );
}
