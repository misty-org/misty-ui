import { StateMark, Text } from "../../../src";

export const meta = { name: "StateMark", file: "display/StateMark.tsx", about: "", wide: false, order: 7 };

const row = "flex flex-wrap items-center gap-3";

export default function Example() {
  return (
    <div className={row}>
      {(["working", "waiting", "unread", "done", "failed", "online"] as const).map((kind) => (
        <div key={kind} className="flex items-center gap-1.5">
          <StateMark kind={kind} />
          <Text size="meta" tone="muted">
            {kind}
          </Text>
        </div>
      ))}
    </div>
  );
}
