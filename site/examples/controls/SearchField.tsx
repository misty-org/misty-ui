import React from "react";
import { SearchField } from "../../../src";

export const meta = {
  name: "SearchField",
  file: "controls/SearchField.tsx",
  about: "",
  wide: false,
  order: 12,
};

function SearchFieldDemo() {
  const [value, setValue] = React.useState("");
  return (
    <SearchField
      aria-label="Find a persona"
      placeholder="Find a persona"
      value={value}
      onChange={(event) => setValue(event.target.value)}
      onClear={() => setValue("")}
    />
  );
}

export default function Example() {
  return <SearchFieldDemo />;
}
