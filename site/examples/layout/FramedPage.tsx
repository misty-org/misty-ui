import { Folder, House, Plus, Star, Users } from "lucide-react";
import {
  Button,
  FramedBar,
  FramedPage,
  IconButton,
  NavList,
  NavRow,
  OverflowFadeText,
  SearchField,
  Text,
} from "../../../src";

export const meta = {
  name: "FramedPage",
  file: "layout/FramedPage.tsx",
  about: "Drag a seam, or focus it and use the arrow keys; a double-click puts it back.",
  wide: true,
  order: 8,
};

export default function Example() {
  const toolbar = (
    <FramedBar
      aria-label="Page tools"
      start={<SearchField containerClassName="w-72" aria-label="Search" placeholder="Search" />}
    >
      <Button variant="primary" icon={Plus}>
        New
      </Button>
    </FramedBar>
  );
  const header = (
    <FramedBar
      start={
        <Text size="control" weight="medium" tone="bright">
          Documents
        </Text>
      }
    >
      <IconButton label="People">
        <Users />
      </IconButton>
    </FramedBar>
  );
  const sidebar = (
    <div className="p-3">
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
    </div>
  );
  return (
    <div className="h-96">
      <FramedPage
        toolbar={toolbar}
        header={header}
        autoSaveId="example"
        workMinWidth={240}
        start={{ id: "sidebar", label: "Resize the sidebar", width: 200, minWidth: 160, maxWidth: 320, content: sidebar }}
        end={{
          id: "preview",
          label: "Resize the preview",
          width: 240,
          header: (
            <FramedBar
              start={
                <Text size="control" weight="medium">
                  Preview
                </Text>
              }
            />
          ),
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
          <Text>Reports</Text>
        </div>
      </FramedPage>
    </div>
  );
}
