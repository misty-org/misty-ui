import { Clock, Globe, Pencil, Search } from "lucide-react";
import { StarterPrompts } from "../../../src";

export const meta = {
  name: "StarterPrompts",
  file: "patterns/StarterPrompts.tsx",
  about: "",
  wide: true,
  order: 11,
};

export default function Example() {
  return (
    <StarterPrompts
      label="Ideas"
      onPick={() => undefined}
      prompts={[
        { label: "Plan my week", icon: Clock, prompt: "Help me plan my week" },
        { label: "Research a topic", icon: Search, prompt: "Research " },
        { label: "Summarize a page", icon: Globe, prompt: "Summarize " },
        { label: "Write a draft", icon: Pencil, prompt: "Write a draft of " },
      ]}
    />
  );
}
