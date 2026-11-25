import { useState } from "react";
import {
  DocsHeader,
  DocsHeading,
  DocsLayout,
  DocsNavGroup,
  DocsPager,
  DocsTitle,
  DocsToc,
  NavRow,
  NavRowLabel,
} from "../../../src";

export const meta = {
  name: "DocsLayout · DocsHeader · DocsNavGroup · DocsHeading · DocsToc · DocsPager",
  file: "layout/DocsLayout.tsx",
  about: "A docs site's page in three panels, as Vercel's: the section's pages, the article, and its contents.",
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
            home={{ href: "#", label: "Misty" }}
            name="Docs"
            onName={() => {}}
            sections={sections}
            current={section}
            onSelect={setSection}
          />
        }
        nav={
          <DocsNavGroup title="Getting started">
            <NavRow tone="page" current>
              <NavRowLabel bright>Quickstart</NavRowLabel>
            </NavRow>
            <NavRow tone="page">
              <NavRowLabel>Live rooms</NavRowLabel>
            </NavRow>
          </DocsNavGroup>
        }
        page="quickstart"
        navLabel="Quickstart"
        toc={<DocsToc items={headings} active={active} onSelect={setActive} />}
      >
        <DocsTitle eyebrow="Getting started" title="Quickstart" lead="Install the SDK and open your app in a Space." />
        <DocsHeading id="install">Install</DocsHeading>
        <DocsPager next={{ label: "Live rooms", onSelect: () => {} }} />
      </DocsLayout>
    </div>
  );
}
