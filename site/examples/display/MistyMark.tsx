import { MistyMark } from "../../../src";

export const meta = { name: "MistyMark", file: "icons/MistyMark.tsx", about: "", wide: false, order: 22 };

const row = "flex flex-wrap items-center gap-3";

export default function Example() {
  return (
    <div className={row}>
      <MistyMark />
      <MistyMark size={32} />
    </div>
  );
}
