import React from "react";
import { ChoiceList } from "../../../src";

export const meta = {
  name: "ChoiceList",
  file: "controls/ChoiceList.tsx",
  about: "",
  wide: false,
  order: 19,
};

function ChoiceListDemo() {
  const [one, setOne] = React.useState(["fast"]);
  return (
    <ChoiceList
      label="How should it answer?"
      selected={one}
      onSelect={(value) => setOne([value])}
      options={[
        { value: "fast", label: "Quickly", description: "A short answer now." },
        { value: "deep", label: "Thoroughly", description: "Reads more sources first." },
        { value: "ask", label: "Ask me first", description: "Checks the plan with you." },
      ]}
    />
  );
}

export default function Example() {
  return <ChoiceListDemo />;
}
