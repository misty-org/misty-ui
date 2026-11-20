import { LivePointer } from "../../../src";

export const meta = {
  name: "LivePointer",
  file: "display/LivePointer.tsx",
  about: "",
  wide: false,
  order: 12,
};

export default function Example() {
  return (
    <div className="relative h-20">
      <LivePointer name="Grace" tone="pink" left={40} top={20} />
    </div>
  );
}
