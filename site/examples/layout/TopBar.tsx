import { Trash2 } from "lucide-react";
import { IconButton, Text, TopBar } from "../../../src";

export const meta = { name: "TopBar", file: "layout/TopBar.tsx", about: "", wide: true, order: 3 };

export default function Example() {
  return (
    <TopBar
      start={
        <Text size="control" weight="semibold">
          Settings
        </Text>
      }
      divider
    >
      <IconButton label="Close">
        <Trash2 />
      </IconButton>
    </TopBar>
  );
}
