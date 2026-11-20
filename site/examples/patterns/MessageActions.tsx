import { Copy, RefreshCw, ThumbsUp, Trash2 } from "lucide-react";
import { MessageActions, Text } from "../../../src";

export const meta = {
  name: "MessageActions",
  file: "patterns/MessageActions.tsx",
  about: "",
  wide: false,
  order: 9,
};

export default function Example() {
  return (
    <div data-message className="grid gap-1">
      <Text size="body">A reply from the agent.</Text>
      <MessageActions
        align="start"
        alwaysVisible
        actions={[
          { id: "copy", icon: Copy, label: "Copy", onSelect: () => undefined },
          { id: "good", icon: ThumbsUp, label: "Good reply", onSelect: () => undefined, pressed: true },
          { id: "retry", icon: RefreshCw, label: "Try again", onSelect: () => undefined },
          { id: "delete", icon: Trash2, label: "Delete", onSelect: () => undefined, danger: true },
        ]}
      />
    </div>
  );
}
