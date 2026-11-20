import { Input } from "../../../src";

export const meta = { name: "Input", file: "controls/Input.tsx", about: "", wide: false, order: 10 };

const column = "grid gap-3";

export default function Example() {
  return (
    <div className={column}>
      {(["default", "address", "toolbar", "title", "smoke", "compact", "bare"] as const).map((variant) => (
        <Input key={variant} aria-label={variant} placeholder={`variant="${variant}"`} variant={variant} />
      ))}
      <Input aria-label="Disabled" placeholder="Disabled" disabled />
    </div>
  );
}
