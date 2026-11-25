import { PenTool } from "lucide-react";
import { AgentFace, personaTone } from "../../../src";

export const meta = {
  name: "AgentFace",
  file: "display/AgentFace.tsx",
  about: "An agent's face, round at an Avatar's size: its engine's mark, a persona's glyph or an emoji.",
  wide: false,
  order: 11,
};

const row = "flex flex-wrap items-center gap-3";

export default function Example() {
  return (
    <div className="grid gap-4">
      <div className={row}>
        {(["xs", "sm", "default", "lg", "xl"] as const).map((size) => (
          <AgentFace key={size} size={size} mark="engine:claude" />
        ))}
      </div>
      <div className={row}>
        {(["xs", "sm", "default", "lg", "xl"] as const).map((size) => (
          <AgentFace key={size} size={size} icon={PenTool} color={personaTone("designer")} />
        ))}
      </div>
    </div>
  );
}
