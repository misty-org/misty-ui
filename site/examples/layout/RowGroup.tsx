import { MessageCircle, Phone } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  Button,
  IconButton,
  PersonRow,
  PresenceFace,
  RowGroupSection,
  RowGroupStack,
} from "../../../src";

export const meta = {
  name: "RowGroup",
  file: "layout/RowGroup.tsx",
  about: "Related rows on one faint fill under a label, groups a step apart, no lines.",
  wide: false,
  order: 20,
};

const face = (initial: string, presence: "online" | "idle" | "offline", tone: "blue" | "green" | "pink") => (
  <PresenceFace presence={presence}>
    <Avatar tone={tone}>
      <AvatarFallback>{initial}</AvatarFallback>
    </Avatar>
  </PresenceFace>
);

const tools = (
  <>
    <IconButton label="Message">
      <MessageCircle />
    </IconButton>
    <IconButton label="Call">
      <Phone />
    </IconButton>
  </>
);

export default function Example() {
  return (
    <RowGroupStack className="max-w-xl">
      <RowGroupSection
        title="Requests"
        count={1}
        action={{ label: "Clear all", onSelect: () => undefined }}
      >
        <PersonRow
          face={face("R", "offline", "pink")}
          name="rowan"
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
      </RowGroupSection>
      <RowGroupSection title="Online" count={2}>
        <PersonRow face={face("A", "online", "blue")} name="ana" line="In General in Harbor" tools={tools} />
        <PersonRow face={face("M", "idle", "green")} name="mira" line="Idle" tools={tools} />
      </RowGroupSection>
    </RowGroupStack>
  );
}
