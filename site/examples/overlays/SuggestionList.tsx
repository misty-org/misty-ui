import React from "react";
import { FileText } from "lucide-react";
import { SuggestionItem, SuggestionList } from "../../../src";

export const meta = {
  name: "SuggestionList · SuggestionItem",
  file: "overlays/SuggestionList.tsx",
  about: "",
  wide: false,
  order: 7,
};

function SuggestionDemo() {
  const [selected, setSelected] = React.useState(0);
  const items = [
    { label: "Ada Lovelace", detail: "Member" },
    { label: "Research partner", detail: "Agent" },
    { label: "Weekly plan", detail: "Note" },
  ];
  return (
    <SuggestionList role="listbox" aria-label="Mentions">
      {items.map((item, index) => (
        <SuggestionItem
          key={item.label}
          icon={FileText}
          label={item.label}
          detail={item.detail}
          selected={selected === index}
          onMouseEnter={() => setSelected(index)}
        />
      ))}
    </SuggestionList>
  );
}

export default function Example() {
  return <SuggestionDemo />;
}
