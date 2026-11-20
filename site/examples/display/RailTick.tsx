import { RailTick } from "../../../src";

export const meta = { name: "RailTick", file: "display/RailTick.tsx", about: "", wide: false, order: 20 };

export default function Example() {
  return (
    <div className="grid w-10 gap-1.5">
      <RailTick length={12} />
      <RailTick length={20} state="near" />
      <RailTick length={28} state="current" />
      <RailTick length={16} />
    </div>
  );
}
