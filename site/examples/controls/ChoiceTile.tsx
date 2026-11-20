import React from "react";
import { ChoiceTile } from "../../../src";

export const meta = {
  name: "ChoiceTile",
  file: "controls/ChoiceTile.tsx",
  about: "",
  wide: false,
  order: 20,
};

function ChoiceTileDemo() {
  const [pick, setPick] = React.useState("a");
  return (
    <div role="radiogroup" aria-label="Emoji" className="grid grid-cols-4 gap-2">
      {["🌲", "🌊", "🔥", "⭐"].map((emoji, index) => (
        <ChoiceTile
          key={emoji}
          radio
          label={`Option ${index + 1}`}
          selected={pick === String(index)}
          onSelect={() => setPick(String(index))}
        >
          <span>{emoji}</span>
        </ChoiceTile>
      ))}
    </div>
  );
}

export default function Example() {
  return <ChoiceTileDemo />;
}
