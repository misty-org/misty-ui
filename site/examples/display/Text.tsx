import { Text } from "../../../src";

export const meta = {
  name: "Text",
  file: "display/Text.tsx",
  about: "Every size role, then every tone.",
  wide: true,
  order: 0,
};

const column = "grid gap-2";

const textSizes = ["caption", "meta", "control", "body", "page", "title", "display"] as const;

const textTones = [
  "default",
  "muted",
  "bright",
  "danger",
  "added",
  "removed",
  "changed",
  "working",
  "waiting",
  "failed",
  "done",
] as const;

export default function Example() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className={column}>
        {textSizes.map((size) => (
          <Text key={size} size={size}>
            {size}: The quick brown fox
          </Text>
        ))}
      </div>
      <div className={column}>
        {textTones.map((tone) => (
          <Text key={tone} size="control" tone={tone}>
            tone="{tone}"
          </Text>
        ))}
        <Text size="control" weight="medium">
          weight="medium"
        </Text>
        <Text size="control" weight="semibold">
          weight="semibold"
        </Text>
      </div>
    </div>
  );
}
