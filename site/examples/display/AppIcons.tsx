import React from "react";
import { Text, appIcons } from "../../../src";

export const meta = {
  name: "appIcons",
  file: "icons/app_icons.ts",
  about: "Each app's own icon, used everywhere the app shows.",
  wide: false,
  order: 28,
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
  return <IconSet icons={appIcons} />;
}
