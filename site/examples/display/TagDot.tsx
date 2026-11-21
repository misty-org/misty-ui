import { TagDot, TagDots, Text, tagToneName } from "../../../src";

export const meta = { name: "TagDot · TagDots", file: "display/TagDot.tsx", about: "", wide: false, order: 12 };

const row = "flex flex-wrap items-center gap-3";

export default function Example() {
  return (
    <div className="grid gap-3">
      <div className={row}>
        {[1, 2, 3, 4, 5, 6, 7, 0].map((color) => (
          <div key={color} className="flex items-center gap-1.5">
            <TagDot color={color} label={tagToneName(color)} />
            <Text size="meta" tone="muted">
              {tagToneName(color)}
            </Text>
          </div>
        ))}
      </div>
      <div className={row}>
        <TagDots tags={[{ name: "Work", color: 6 }]} />
        <TagDots
          tags={[
            { name: "Work", color: 6 },
            { name: "Home", color: 4 },
            { name: "Later", color: 5 },
            { name: "Taxes", color: 2 },
          ]}
        />
      </div>
    </div>
  );
}
