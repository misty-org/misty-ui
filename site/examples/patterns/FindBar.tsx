import React from "react";
import { FindBar } from "../../../src";

export const meta = { name: "FindBar", file: "patterns/FindBar.tsx", about: "", wide: true, order: 16 };

/** A box to narrow by its corner, for pieces that give way as they shrink. */
function ResizableBox(props: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`min-w-48 resize-x overflow-hidden rounded-lg border border-dashed border-charcoal-border ${props.className ?? ""}`}
    >
      {props.children}
    </div>
  );
}

function FindBarDemo() {
  const [value, setValue] = React.useState("token");
  const [caseSensitive, setCase] = React.useState(false);
  return (
    <ResizableBox>
      <FindBar
        label="Find in document"
        find={{ value, onChange: setValue }}
        caseSensitive={caseSensitive}
        onCaseSensitive={() => setCase(!caseSensitive)}
        wholeWord={false}
        onWholeWord={() => undefined}
        regex={false}
        onRegex={() => undefined}
        count="2/7"
        empty={false}
        canStep
        onPrevious={() => undefined}
        onNext={() => undefined}
        onClose={() => undefined}
      />
    </ResizableBox>
  );
}

export default function Example() {
  return <FindBarDemo />;
}
