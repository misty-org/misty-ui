import React from "react";
import { Checkbox, Label } from "../../../src";

export const meta = { name: "Checkbox", file: "controls/Checkbox.tsx", about: "", wide: false, order: 24 };

const row = "flex flex-wrap items-center gap-3";

function CheckboxDemo() {
  const [on, setOn] = React.useState(true);
  return (
    <div className={row}>
      <Checkbox id="g-check" checked={on} onCheckedChange={(value) => setOn(value === true)} />
      <Label htmlFor="g-check">Remember this device</Label>
      <Checkbox disabled aria-label="Disabled" />
    </div>
  );
}

export default function Example() {
  return <CheckboxDemo />;
}
