import React from "react";
import { FilterChip } from "../../../src";

export const meta = {
  name: "FilterChip",
  file: "controls/FilterChip.tsx",
  about: "",
  wide: false,
  order: 21,
};

const row = "flex flex-wrap items-center gap-3";

function FilterChipDemo() {
  const [on, setOn] = React.useState<Record<string, boolean>>({ All: true });
  return (
    <div className={row}>
      {["All", "Academic", "Design", "Engineering"].map((label) => (
        <FilterChip
          key={label}
          label={label}
          pressed={Boolean(on[label])}
          onPressedChange={(pressed) => setOn({ [label]: pressed })}
        />
      ))}
    </div>
  );
}

export default function Example() {
  return <FilterChipDemo />;
}
