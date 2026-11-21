import { Mic, MonitorUp, PhoneOff, Video } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  CallBar,
  CallStage,
  CallTile,
  IconButton,
  ToolbarDivider,
} from "../../../src";

export const meta = {
  name: "CallStage",
  file: "patterns/call/CallStage.tsx",
  about: "",
  wide: true,
  order: 40,
};

const face = (initial: string) => (
  <Avatar size="lg">
    <AvatarFallback>{initial}</AvatarFallback>
  </Avatar>
);

export default function Example() {
  return (
    <div className="flex h-96 flex-col">
      <CallStage>
        <CallTile name="Ana" speaking face={face("A")} />
        <CallTile name="Sam" muted face={face("S")} />
        <CallTile name="Lee" face={face("L")} />
      </CallStage>
      <CallBar>
        <IconButton label="Mute">
          <Mic />
        </IconButton>
        <IconButton label="Turn camera on">
          <Video />
        </IconButton>
        <IconButton label="Share screen">
          <MonitorUp />
        </IconButton>
        <ToolbarDivider />
        <IconButton label="Leave" variant="danger">
          <PhoneOff />
        </IconButton>
      </CallBar>
    </div>
  );
}
