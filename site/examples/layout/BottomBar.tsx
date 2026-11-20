import { Bell } from "lucide-react";
import { BottomBar, IconButton, Text } from "../../../src";

export const meta = { name: "BottomBar", file: "layout/BottomBar.tsx", about: "", wide: true, order: 4 };

export default function Example() {
  return (
    <div className="grid gap-3">
      <BottomBar
        start={
          <Text size="meta" tone="muted">
            Misty Cloud
          </Text>
        }
      >
        <IconButton label="Notifications" size="sm">
          <Bell />
        </IconButton>
      </BottomBar>
      <BottomBar
        size="standard"
        start={
          <Text size="meta" tone="muted">
            Standard height
          </Text>
        }
      >
        <IconButton label="Notifications">
          <Bell />
        </IconButton>
      </BottomBar>
    </div>
  );
}
