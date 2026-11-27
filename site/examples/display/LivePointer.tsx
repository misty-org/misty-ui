import { AgentFace, LivePointer } from "../../../src";

export const meta = {
  name: "LivePointer",
  file: "display/LivePointer.tsx",
  about: "",
  wide: false,
  order: 12,
};

export default function Example() {
  return (
    <div className="relative h-24">
      <LivePointer name="Grace" tone="pink" left={40} top={20} />
      <LivePointer
        name="Writer"
        tone="blue"
        left={200}
        top={20}
        doing="Insert › Picture from File"
        face={
          <AgentFace size="glyph" tone="blue">
            W
          </AgentFace>
        }
      />
    </div>
  );
}
