import { Hash, MessagesSquare, Pin, Users } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  ChannelDivider,
  ChannelHeader,
  ChannelMain,
  ChannelPage,
  ChannelSidebar,
  ChannelSidebarHeader,
  ChannelWelcome,
  MemberGroupHeading,
  MemberList,
  MemberRow,
  MentionMark,
  NavRow,
  NavRowLabel,
  SearchField,
  Text,
  TypingLine,
} from "../../../src";

export const meta = {
  name: "ChannelPage · ChannelSidebar · ChannelSidebarHeader · ChannelMain · ChannelHeader · ChannelWelcome · ChannelDivider · TypingLine · MentionMark · MemberList · MemberGroupHeading · MemberRow",
  file: "patterns/channel/*",
  about: "",
  wide: true,
  order: 14,
};

function ChannelDemo() {
  return (
    <div className="h-96 overflow-hidden rounded-lg border border-charcoal-border">
      <ChannelPage>
        <ChannelSidebar aria-label="Channels" header={<ChannelSidebarHeader name="Research" />}>
          <div className="grid gap-px p-2">
            {["general", "design", "launch"].map((name, index) => (
              <NavRow key={name} current={index === 0}>
                <Hash />
                <NavRowLabel>{name}</NavRowLabel>
              </NavRow>
            ))}
          </div>
        </ChannelSidebar>
        <ChannelMain
          header={
            <ChannelHeader
              icon={Hash}
              name="general"
              topic="Anything about the project"
              actions={[
                { id: "threads", icon: MessagesSquare, label: "Threads", priority: 2 },
                { id: "pinned", icon: Pin, label: "Pinned", priority: 1 },
                { id: "members", icon: Users, label: "Members", priority: 3, pressed: true },
              ]}
              end={<SearchField containerClassName="w-56" aria-label="Search" placeholder="Search" />}
            />
          }
          side={
            <MemberList label="Members">
              <MemberGroupHeading title="Online" count={2} />
              <MemberRow
                avatar={
                  <Avatar size="sm">
                    <AvatarFallback>AL</AvatarFallback>
                  </Avatar>
                }
                name="Ada"
                color="#e5533d"
                owner
                presence="online"
                line="Reviewing the gallery"
              />
              <MemberRow
                avatar={
                  <Avatar size="sm">
                    <AvatarFallback>GH</AvatarFallback>
                  </Avatar>
                }
                name="Grace"
                presence="waiting"
              />
            </MemberList>
          }
        >
          <div className="grid gap-3 p-4">
            <ChannelWelcome
              icon={Hash}
              title="Welcome to #general"
              line="This is the start of the channel."
            />
            <ChannelDivider label="Today" kind="date" />
            <div className="relative px-2">
              <MentionMark />
              <Text size="body">@you can you look at the gallery?</Text>
            </div>
            <ChannelDivider kind="new" />
            <TypingLine label="Ada is typing…" />
          </div>
        </ChannelMain>
      </ChannelPage>
    </div>
  );
}

export default function Example() {
  return <ChannelDemo />;
}
