import { ArrowDownAZ } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, MenuItem, MenuTrigger } from "../../../src";

export const meta = {
  name: "MenuTrigger variants",
  file: "overlays/MenuTrigger.tsx",
  about: "",
  wide: false,
  order: 1,
};

const row = "flex flex-wrap items-center gap-3";

export default function Example() {
  return (
    <div className={row}>
      <DropdownMenu>
        <MenuTrigger label="Model" value="Sonnet 5.5" />
        <DropdownMenuContent>
          <MenuItem label="Sonnet 5.5" />
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <MenuTrigger label="Sort" icon={ArrowDownAZ} iconOnly />
        <DropdownMenuContent>
          <MenuItem label="Name" />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
