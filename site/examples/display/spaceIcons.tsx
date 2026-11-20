import React from "react";
import { Text, spaceIcons } from "../../../src";

export const meta = {
  name: "spaceIcons",
  file: "icons/appIcons.ts",
  about: "A Space's places and pages.",
  wide: false,
  order: 29,
};

function IconSet(props: { icons: Record<string, React.ComponentType<{ className?: string }>> }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
      {Object.entries(props.icons).map(([name, Icon]) => (
        <div key={name} className="flex min-w-0 items-center gap-2">
          <Icon />
          <Text size="meta" tone="muted">
            {name}
          </Text>
        </div>
      ))}
    </div>
  );
}

export default function Example() {
  return <IconSet icons={spaceIcons} />;
}
