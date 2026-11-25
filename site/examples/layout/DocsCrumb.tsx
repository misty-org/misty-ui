import { useState } from "react";
import { DocsCrumb, DocsSwitcher, MistyMark, Text } from "../../../src";

export const meta = {
  name: "DocsCrumb",
  file: "layout/DocsLayout.tsx",
  about: "A name in a docs trail that leads somewhere, washing under the pointer as the docs' menu does.",
  order: 22,
};

const sections = [
  { id: "app", label: "App" },
  { id: "sdk", label: "SDK" },
  { id: "design", label: "Design system" },
];

export default function Example() {
  const [section, setSection] = useState("app");
  return (
    <div className="flex items-center gap-0.5">
      <DocsCrumb href="#" flush aria-label="Misty home">
        <MistyMark className="size-5" />
        <span>Misty</span>
      </DocsCrumb>
      <Text size="page" tone="muted" aria-hidden="true">
        /
      </Text>
      <DocsCrumb href="#">Docs</DocsCrumb>
      <DocsSwitcher sections={sections} current={section} onSelect={setSection} />
    </div>
  );
}
