import { Surface, Text } from "../../../src";

export const meta = {
  name: "Surface",
  file: "display/Surface.tsx",
  about: "Every tone, every edge, every tint.",
  wide: true,
  order: 1,
};

const surfaceTones = [
  "card",
  "page",
  "well",
  "faint",
  "added",
  "removed",
  "active",
  "workspace",
  "sidebar",
  "inverse",
  "drop",
  "chrome",
  "tab-well",
  "media",
  "board",
  "glass",
  "smoke",
  "scene-panel",
  "stage",
  "track",
] as const;

const surfaceEdges = ["hairline", "strong", "bright", "dashed", "field", "right", "wrong"] as const;

const tints = [
  "audio",
  "video",
  "infographic",
  "map",
  "report",
  "cards",
  "quiz",
  "slides",
  "table",
  "lesson",
] as const;

export default function Example() {
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(7rem,1fr))] gap-2">
        {surfaceTones.map((tone) => (
          <Surface
            key={tone}
            tone={tone}
            edge="hairline"
            radius="lg"
            className="grid h-14 place-items-center"
          >
            <Text size="caption">{tone}</Text>
          </Surface>
        ))}
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(7rem,1fr))] gap-2">
        {surfaceEdges.map((edge) => (
          <Surface key={edge} tone="card" edge={edge} radius="lg" className="grid h-14 place-items-center">
            <Text size="caption">edge {edge}</Text>
          </Surface>
        ))}
        <Surface tone="card" edge="hairline" radius="lg" raised className="grid h-14 place-items-center">
          <Text size="caption">raised</Text>
        </Surface>
        <Surface tone="card" edge="hairline" radius="lg" floating className="grid h-14 place-items-center">
          <Text size="caption">floating</Text>
        </Surface>
        <Surface
          tone="card"
          edge="hairline"
          radius="lg"
          state="working"
          className="grid h-14 place-items-center"
        >
          <Text size="caption">state working</Text>
        </Surface>
        <Surface
          tone="card"
          edge="hairline"
          radius="lg"
          state="waiting"
          className="grid h-14 place-items-center"
        >
          <Text size="caption">state waiting</Text>
        </Surface>
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(7rem,1fr))] gap-2">
        {tints.map((tint) => (
          <Surface key={tint} tint={tint} radius="lg" className="grid h-14 place-items-center">
            <Text size="caption" tint={tint}>
              {tint}
            </Text>
          </Surface>
        ))}
      </div>
    </div>
  );
}
