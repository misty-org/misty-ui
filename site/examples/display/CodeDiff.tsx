import { CodeDiff } from "../../../src";

export const meta = { name: "CodeDiff", file: "display/CodeDiff.tsx", about: "", wide: false, order: 17 };

export default function Example() {
  return (
    <CodeDiff
      label="Changes to Button.tsx"
      lines={[
        { kind: "header", text: "@@ -12,4 +12,4 @@" },
        { kind: "context", text: "const size = props.size;", oldNumber: 12, newNumber: 12 },
        { kind: "del", text: "  shadow: true,", oldNumber: 13 },
        { kind: "add", text: "  shadow: false,", newNumber: 13 },
        { kind: "context", text: "}", oldNumber: 14, newNumber: 14 },
      ]}
    />
  );
}
