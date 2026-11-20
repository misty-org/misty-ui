import React from "react";
import { Bold, Italic, Underline } from "lucide-react";
import { Segment, SegmentTrack } from "../../../src";

export const meta = {
  name: "Segment · SegmentTrack",
  file: "controls/Segment.tsx",
  about: "",
  wide: false,
  order: 22,
};

function SegmentDemo() {
  const [mode, setMode] = React.useState("bold");
  return (
    <SegmentTrack role="radiogroup" aria-label="Style">
      {[
        { id: "bold", icon: Bold },
        { id: "italic", icon: Italic },
        { id: "underline", icon: Underline },
      ].map(({ id, icon: Icon }) => (
        <Segment
          key={id}
          role="radio"
          aria-label={id}
          aria-checked={mode === id}
          iconOnly
          onClick={() => setMode(id)}
        >
          <Icon />
        </Segment>
      ))}
    </SegmentTrack>
  );
}

export default function Example() {
  return <SegmentDemo />;
}
