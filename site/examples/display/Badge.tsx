import { Badge } from "../../../src";

export const meta = { name: "Badge", file: "display/Badge.tsx", about: "", wide: false, order: 6 };

const row = "flex flex-wrap items-center gap-3";

export default function Example() {
  return (
    <div className={row}>
      <Badge>default</Badge>
      <Badge variant="secondary">secondary</Badge>
      <Badge variant="outline">outline</Badge>
      <Badge variant="count">3</Badge>
      <Badge tone="violet">violet tone</Badge>
      <Badge tone="green">green tone</Badge>
    </div>
  );
}
