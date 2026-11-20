import React from "react";
import { ShortcutField } from "../../../src";

export const meta = {
  name: "ShortcutField",
  file: "controls/ShortcutField.tsx",
  about: "Click it and press keys.",
  wide: false,
  order: 14,
};

function ShortcutDemo() {
  const [value, setValue] = React.useState("Mod+K");
  return <ShortcutField label="Open command palette" value={value} onChange={setValue} />;
}

export default function Example() {
  return <ShortcutDemo />;
}
