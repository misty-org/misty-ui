import React from "react";
import { DisclosureButton, Text } from "../../../src";

export const meta = {
  name: "DisclosureButton",
  file: "controls/DisclosureButton.tsx",
  about: "",
  wide: false,
  order: 5,
};

const column = "grid gap-3";

function DisclosureDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <div className={column}>
      <DisclosureButton open={open} onClick={() => setOpen(!open)}>
        More engines
      </DisclosureButton>
      {open ? (
        <Text size="meta" tone="muted">
          Gemini CLI, Grok, Hermes
        </Text>
      ) : null}
    </div>
  );
}

export default function Example() {
  return <DisclosureDemo />;
}
