import { ChevronLeft, ChevronRight, Folder, House, Star } from "lucide-react";
import { FramedPage, IconButton, NavList, NavRow, OverflowFadeText, PathField, Text } from "../../../src";

export const meta = { name: "FramedPage", file: "layout/FramedPage.tsx", about: "", wide: true, order: 7 };

export default function Example() {
  const toolbar = (
    <div className="flex h-12 items-center gap-2 px-3">
      <IconButton label="Back">
        <ChevronLeft />
      </IconButton>
      <IconButton label="Forward">
        <ChevronRight />
      </IconButton>
      <PathField
        label="Path"
        framed
        className="flex-1"
        segments={[{ label: "/" }, { label: "Users" }, { label: "ana" }]}
      />
    </div>
  );
  const sidebar = (
    <NavList>
      <NavRow current>
        <House />
        <OverflowFadeText>Home</OverflowFadeText>
      </NavRow>
      <NavRow>
        <Star />
        <OverflowFadeText>Starred</OverflowFadeText>
      </NavRow>
    </NavList>
  );
  return (
    <div className="h-96">
      <FramedPage
        toolbar={toolbar}
        start={{ id: "sidebar", label: "Resize the sidebar", defaultSize: 24, content: <div className="p-3">{sidebar}</div> }}
        end={{
          id: "preview",
          label: "Resize the preview",
          defaultSize: 28,
          content: (
            <div className="p-3">
              <Text size="meta" tone="muted">
                Nothing picked
              </Text>
            </div>
          ),
        }}
      >
        <div className="flex items-center gap-2 p-4">
          <Folder />
          <Text>Documents</Text>
        </div>
      </FramedPage>
    </div>
  );
}
