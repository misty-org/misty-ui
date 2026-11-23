import { MessageCircle, Phone, Trash2 } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  Button,
  IconButton,
  MenuItem,
  PersonRow,
  PresenceFace,
} from "../../../src";

export const meta = {
  name: "PersonRow",
  file: "patterns/people/PersonRow.tsx",
  about: "",
  order: 16,
};

const face = (initial: string, presence: "online" | "idle" | "offline") => (
  <PresenceFace presence={presence}>
    <Avatar tone="blue">
      <AvatarFallback>{initial}</AvatarFallback>
    </Avatar>
  </PresenceFace>
);

export default function Example() {
  return (
    <div className="grid max-w-xl gap-0.5">
      <PersonRow
        face={face("P", "offline")}
        name="prime"
        line="Wants to be your friend"
        actions={
          <>
            <Button size="sm">Accept</Button>
            <Button size="sm" variant="quiet">
              Ignore
            </Button>
          </>
        }
      />
      <PersonRow
        face={face("J", "online")}
        name="justnatureusa"
        line="In Lounge in Weekend build"
        onOpen={() => {}}
        tools={
          <>
            <IconButton label="Message">
              <MessageCircle />
            </IconButton>
            <IconButton label="Call">
              <Phone />
            </IconButton>
          </>
        }
        menu={<MenuItem icon={Trash2} label="Remove friend" danger />}
      />
      <PersonRow face={face("A", "offline")} name="ana.r" line="Offline" away onOpen={() => {}} />
    </div>
  );
}
