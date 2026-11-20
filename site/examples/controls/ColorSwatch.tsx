import React from "react";
import { ColorChip, ColorSwatch, CustomColorSwatch, Text } from "../../../src";

export const meta = {
  name: "ColorSwatch · CustomColorSwatch · ColorChip",
  file: "controls/ColorSwatch.tsx",
  about: "",
  wide: false,
  order: 26,
};

const row = "flex flex-wrap items-center gap-3";

const column = "grid gap-3";

function SwatchDemo() {
  const [color, setColor] = React.useState("#4f86e8");
  return (
    <div className={column}>
      <div className={row}>
        {["#4f86e8", "#e5533d", "#3fa463", "#d9a21b", "#8b5cf6"].map((value) => (
          <ColorSwatch
            key={value}
            color={value}
            label={value}
            selected={color === value}
            onClick={() => setColor(value)}
          />
        ))}
        <CustomColorSwatch value={color} onChange={setColor} label="Custom color" />
      </div>
      <div className={row}>
        <ColorChip color={color} />
        <Text size="meta" tone="muted">
          {color}
        </Text>
      </div>
    </div>
  );
}

export default function Example() {
  return <SwatchDemo />;
}
