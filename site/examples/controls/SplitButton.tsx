import { Download } from "lucide-react";
import { Button, DropdownMenu, DropdownMenuContent, MenuItem, MenuTrigger, SplitButton } from "../../../src";

export const meta = {
  name: "SplitButton",
  file: "controls/SplitButton.tsx",
  about: "The chevron opens the other choices.",
  wide: false,
  order: 4,
};

export default function Example() {
  return (
    <SplitButton label="Export">
      <Button variant="secondary" icon={Download}>
        Export
      </Button>
      <DropdownMenu>
        <MenuTrigger label="More export options" iconOnly />
        <DropdownMenuContent>
          <MenuItem label="Export as PDF" />
          <MenuItem label="Export as Markdown" />
        </DropdownMenuContent>
      </DropdownMenu>
    </SplitButton>
  );
}
