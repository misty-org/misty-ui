import React from "react";
import { Plus } from "lucide-react";
import { SectionHeading, Text } from "../../../src";

export const meta = {
  name: "SectionHeading",
  file: "layout/SectionHeading.tsx",
  about: "",
  wide: false,
  order: 6,
};

function SectionHeadingDemo() {
  const [open, setOpen] = React.useState(true);
  return (
    <div className="grid">
      <SectionHeading
        title="Pinned"
        count={3}
        open={open}
        onOpenChange={setOpen}
        action={{ label: "Add", icon: Plus, onSelect: () => undefined }}
      />
      {open ? (
        <Text size="control" tone="muted" className="px-2">
          Rows go here
        </Text>
      ) : null}
    </div>
  );
}

export default function Example() {
  return <SectionHeadingDemo />;
}
