import { RingMeter } from "../../../src";

export const meta = { name: "RingMeter", file: "feedback/RingMeter.tsx", about: "", wide: false, order: 8 };

const row = "flex flex-wrap items-center gap-3";

export default function Example() {
  return (
    <div className={row}>
      <RingMeter value={0.3} />
      <RingMeter value={0.9} />
      <RingMeter />
    </div>
  );
}
