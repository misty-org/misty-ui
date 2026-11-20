import { StepDot, Text } from "../../../src";

export const meta = { name: "StepDot", file: "display/StepDot.tsx", about: "", wide: false, order: 8 };

const row = "flex flex-wrap items-center gap-3";

export default function Example() {
  return (
    <div className={row}>
      {(["pending", "working", "done", "failed"] as const).map((state) => (
        <div key={state} className="flex items-center gap-1.5">
          <StepDot state={state} />
          <Text size="meta" tone="muted">
            {state}
          </Text>
        </div>
      ))}
    </div>
  );
}
