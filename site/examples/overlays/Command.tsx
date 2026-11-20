import { Clock, FileText, Plus } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Surface,
} from "../../../src";

export const meta = { name: "Command", file: "overlays/Command.tsx", about: "", wide: false, order: 14 };

function CommandDemo() {
  return (
    <Surface tone="card" edge="hairline" radius="xl" className="overflow-hidden">
      <Command>
        <CommandInput placeholder="Type a command" />
        <CommandList>
          <CommandEmpty>Nothing matches</CommandEmpty>
          <CommandGroup heading="Actions">
            <CommandItem icon={Plus} label="New chat" shortcut="⌘N" />
            <CommandItem icon={FileText} label="New note" />
            <CommandItem icon={Clock} label="Recent chats" description="The last ten you opened" />
          </CommandGroup>
        </CommandList>
      </Command>
    </Surface>
  );
}

export default function Example() {
  return <CommandDemo />;
}
