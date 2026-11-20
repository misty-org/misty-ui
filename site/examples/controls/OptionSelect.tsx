import React from "react";
import { OptionSelect, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../src";

export const meta = {
  name: "OptionSelect · Select",
  file: "controls/OptionSelect.tsx · Select.tsx",
  about: "",
  wide: false,
  order: 17,
};

const column = "grid gap-3";

function SelectDemo() {
  const [value, setValue] = React.useState("week");
  return (
    <div className={column}>
      <OptionSelect
        aria-label="Start of week"
        value={value}
        onValueChange={setValue}
        options={[
          { value: "week", label: "Monday" },
          { value: "sunday", label: "Sunday" },
          { value: "saturday", label: "Saturday" },
        ]}
      />
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger aria-label="Start of week (parts)">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="week">Monday</SelectItem>
          <SelectItem value="sunday">Sunday</SelectItem>
          <SelectItem value="saturday">Saturday</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export default function Example() {
  return <SelectDemo />;
}
