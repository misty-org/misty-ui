import { ChevronLeft, Plus, Settings2 } from "lucide-react";
import { Button, FramedBar, IconButton, SearchField, Surface, Text } from "../../../src";

export const meta = {
  name: "FramedBar",
  file: "layout/FramedBar.tsx",
  about: "A FramedPage's 54px toolbar row and its 45px tools row.",
  wide: true,
  order: 7,
};

export default function Example() {
  return (
    <Surface tone="sidebar" radius="lg" className="overflow-hidden">
      <FramedBar
        aria-label="Friends"
        start={<SearchField containerClassName="w-72" aria-label="Search friends" placeholder="Search" />}
      >
        <Button variant="primary" icon={Plus}>
          Add friend
        </Button>
      </FramedBar>
      <FramedBar
        size="tools"
        start={
          <>
            <IconButton label="Back">
              <ChevronLeft />
            </IconButton>
            <Text size="control" tone="muted">
              Documents
            </Text>
          </>
        }
      >
        <IconButton label="View options">
          <Settings2 />
        </IconButton>
      </FramedBar>
    </Surface>
  );
}
