import { MicOff, MonitorUp, PhoneOff, Video } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  CallBar,
  CallCaptions,
  Button,
  CallControl,
  CallLobby,
  CallReactions,
  CallStage,
  CallTile,
  IconButton,
  MenuLabel,
  MenuRadioGroup,
  MenuRadioItem,
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
        <CallTile
          name="Sam"
          muted
          hand
          handPlace={1}
          reaction={{ key: 1, emoji: "🎉" }}
          face={face("S")}
        />
        <CallTile name="Ada, Sam’s agent" muted deafened face={face("A")} />
        <CallTile name="Lee" weak hand handPlace={2} face={face("L")} />
      </CallStage>
      <CallCaptions
        lines={[
          { key: 1, name: "Ana", text: "Let’s look at the launch plan first." },
          { key: 2, name: "Lee", text: "Sure, I have the draft open." },
        ]}
      />
      <CallBar>
        <CallControl
          label="Unmute"
          off
          menuLabel="Audio devices"
          menu={
            <>
              <MenuLabel>Microphone</MenuLabel>
              <MenuRadioGroup value="built-in" onValueChange={() => {}}>
                <MenuRadioItem value="built-in" label="MacBook Pro Microphone" />
                <MenuRadioItem value="usb" label="Shure MV7" />
              </MenuRadioGroup>
            </>
          }
        >
          <MicOff />
        </CallControl>
        <CallControl label="Turn camera off">
          <Video />
        </CallControl>
        <CallReactions
          reactions={[
            { emoji: "👍", label: "Thumbs up" },
            { emoji: "🎉", label: "Party" },
          ]}
          onPick={() => {}}
        />
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

export function Lobby() {
  return (
    <div className="flex h-96 flex-col">
      <CallLobby
        preview={<CallTile name="You" face={face("Y")} />}
        controls={
          <>
            <CallControl label="Mute">
              <MicOff />
            </CallControl>
            <CallControl label="Turn camera on" off>
              <Video />
            </CallControl>
          </>
        }
        title="Lounge"
        line="Ana and Sam are here."
        action={
          <Button variant="primary" size="lg">
            Join
          </Button>
        }
      />
    </div>
  );
}
