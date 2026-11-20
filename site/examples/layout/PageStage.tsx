import React from "react";
import { PageStage, Text } from "../../../src";

export const meta = {
  name: "PageStage",
  file: "layout/PageStage.tsx",
  about: "Where a native page is placed; with no page it paints the page color over its skeleton.",
  wide: false,
  order: 19,
};

function PageStageDemo() {
  const host = React.useRef<HTMLDivElement>(null);
  return (
    <div className="h-32">
      <PageStage hostRef={host} placed={false} presented={false} framed>
        <Text size="meta" tone="muted" className="p-3">
          Waiting for the page
        </Text>
      </PageStage>
    </div>
  );
}

export default function Example() {
  return <PageStageDemo />;
}
