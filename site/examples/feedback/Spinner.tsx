import { Spinner } from "../../../src";

export const meta = { name: "Spinner", file: "feedback/Spinner.tsx", about: "", wide: false, order: 6 };

const row = "flex flex-wrap items-center gap-3";

export default function Example() {
  return (
    <div className={row}>
      <Spinner size="sm" />
      <Spinner />
      <Spinner size="lg" />
    </div>
  );
}
