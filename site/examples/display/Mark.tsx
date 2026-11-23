import { Mark } from "../../../src";

export const meta = { name: "Mark", file: "icons/Mark.tsx", about: "", wide: false, order: 25 };

const row = "flex flex-wrap items-center gap-3";

const shown = ["anthropic", "engine:claude", "engine:codex", "github", "aws", "openrouter-color", "slack", "misty"];

export default function Example() {
  return (
    <div className={row}>
      {shown.map((id) => (
        <Mark key={id} of={id} label={id} />
      ))}
      <Mark of="no-such-mark" label="Unknown" />
    </div>
  );
}
