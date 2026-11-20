import React from "react";
import { Field, Switch } from "../../../src";

export const meta = { name: "Switch", file: "controls/Switch.tsx", about: "", wide: false, order: 23 };

const column = "grid gap-3";

function SwitchDemo() {
  const [on, setOn] = React.useState(true);
  return (
    <div className={column}>
      <Field label="Show shortcut hints" layout="inline">
        <Switch checked={on} onCheckedChange={setOn} />
      </Field>
      <Field label="Disabled" layout="inline">
        <Switch disabled />
      </Field>
    </div>
  );
}

export default function Example() {
  return <SwitchDemo />;
}
