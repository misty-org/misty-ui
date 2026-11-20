import React from "react";
import { GitBranch, Plus } from "lucide-react";
import { SearchablePicker } from "../../../src";

export const meta = {
  name: "SearchablePicker",
  file: "overlays/SearchablePicker.tsx",
  about: "",
  wide: false,
  order: 6,
};

function SearchablePickerDemo() {
  const [value, setValue] = React.useState("main");
  return (
    <SearchablePicker
      label="Branch"
      icon={GitBranch}
      value={value}
      searchLabel="Find a branch"
      emptyLabel="No branches match"
      onPick={setValue}
      options={["main", "design-system", "explore-refactor", "release/0.9"].map((branch) => ({
        value: branch,
        label: branch,
      }))}
      actions={[{ icon: Plus, label: "New branch", onSelect: () => undefined }]}
    />
  );
}

export default function Example() {
  return <SearchablePickerDemo />;
}
