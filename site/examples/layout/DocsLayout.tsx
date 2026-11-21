import { useState } from "react";
import {
  DocsHeader,
  DocsLayout,
  DocsPager,
  DocsToc,
  NavList,
  NavRow,
  NavRowLabel,
  Text,
} from "../../../src";

export const meta = {
  name: "DocsLayout · DocsHeader · DocsToc · DocsPager",
  file: "layout/DocsLayout.tsx",
  about: "A docs site's page in three panels: the section's pages, the article, and its contents.",
  wide: true,
  order: 21,
};

const sections = [
  { id: "guides", label: "Guides" },
  { id: "sdk", label: "SDK" },
  { id: "design", label: "Design system" },
];
const headings = [
  { id: "install", text: "Install" },
  { id: "connect", text: "Connect" },
  { id: "next", text: "Next steps" },
];

export default function Example() {
  const [section, setSection] = useState("sdk");
  const [active, setActive] = useState("install");
  return (
    <div className="h-96 overflow-hidden rounded-xl hairline-outline">
      <DocsLayout
        header={
          <DocsHeader
            brand={<Text weight="semibold" tone="bright">Misty docs</Text>}
            sections={sections}
            current={section}
            onSelect={setSection}
          />
        }
        nav={
          <NavList>
            <NavRow current>
              <NavRowLabel bright>Getting started</NavRowLabel>
            </NavRow>
            <NavRow>
              <NavRowLabel>Live rooms</NavRowLabel>
            </NavRow>
          </NavList>
        }
        toc={<DocsToc items={headings} active={active} onSelect={setActive} />}
      >
        <Text as="h1" size="display" weight="semibold" tone="bright">
          Getting started
        </Text>
        <DocsPager next={{ label: "Live rooms", onSelect: () => {} }} />
      </DocsLayout>
    </div>
  );
}
