import React from "react";
import { LayoutGrid, List } from "lucide-react";
import { ChoiceGroup } from "../../../src";

export const meta = {
  name: "ChoiceGroup",
  file: "controls/ChoiceGroup.tsx",
  about: "",
  wide: false,
  order: 18,
};

const column = "grid gap-3";

function ChoiceGroupDemo() {
  const [view, setView] = React.useState<"month" | "week" | "agenda">("month");
  const [layout, setLayout] = React.useState<"grid" | "list">("grid");
  return (
    <div className={column}>
      <ChoiceGroup
        label="Calendar view"
        value={view}
        onChange={setView}
        options={[
          { value: "month", label: "Month" },
          { value: "week", label: "Week" },
          { value: "agenda", label: "Agenda" },
        ]}
      />
      <ChoiceGroup
        label="Layout"
        size="sm"
        value={layout}
        onChange={setLayout}
        options={[
          { value: "grid", label: "Grid", icon: LayoutGrid, iconOnly: true },
          { value: "list", label: "List", icon: List, iconOnly: true },
        ]}
      />
    </div>
  );
}

export default function Example() {
  return <ChoiceGroupDemo />;
}
