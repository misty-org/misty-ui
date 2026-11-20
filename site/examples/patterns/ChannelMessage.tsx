import { MessagesSquare, Pencil, SmilePlus } from "lucide-react";
import {
  AddReactionButton,
  Avatar,
  AvatarFallback,
  ChannelMessage,
  ChannelMessageText,
  ChannelReactions,
  ChannelReply,
  IconButton,
  ReactionChip,
  ThreadRepliesButton,
} from "../../../src";

export const meta = {
  name: "ChannelMessage · ChannelMessageText · ChannelReply · ChannelReactions · ReactionChip · AddReactionButton · ThreadRepliesButton",
  file: "patterns/channel/ChannelMessage.tsx",
  about: "",
  wide: true,
  order: 15,
};

const face = (initials: string) => (
  <Avatar size="lg" tone="blue">
    <AvatarFallback>{initials}</AvatarFallback>
  </Avatar>
);

export default function Example() {
  return (
    <div className="grid rounded-lg border border-charcoal-border bg-charcoal-card py-6">
      <ChannelMessage
        name="Ada"
        color="#eab7ab"
        avatar={face("AL")}
        time="Today at 3:45 PM"
        dateTime="2026-11-20T15:45:00Z"
        tools={
          <>
            <IconButton label="Add reaction" size="sm">
              <SmilePlus />
            </IconButton>
            <IconButton label="Edit" size="sm">
              <Pencil />
            </IconButton>
            <IconButton label="Create thread" size="sm">
              <MessagesSquare />
            </IconButton>
          </>
        }
        after={
          <>
            <ChannelReactions add={<AddReactionButton />}>
              <ReactionChip
                emoji="👍"
                count={3}
                mine
                onToggle={() => undefined}
              />
              <ReactionChip emoji="🎉" count={1} onToggle={() => undefined} />
            </ChannelReactions>
            <ThreadRepliesButton count={2} onOpen={() => undefined} />
          </>
        }
      >
        <ChannelMessageText>
          The gallery is ready for a look.
        </ChannelMessageText>
      </ChannelMessage>
      <ChannelMessage
        grouped
        name="Ada"
        time="3:46 PM"
        dateTime="2026-11-20T15:46:00Z"
      >
        <ChannelMessageText edited="Edited today at 3:47 PM">
          Hover me for my time.
        </ChannelMessageText>
      </ChannelMessage>
      <ChannelMessage
        name="Grace"
        avatar={face("GH")}
        time="Today at 3:50 PM"
        dateTime="2026-11-20T15:50:00Z"
        mentioned
        reply={
          <ChannelReply
            avatar={
              <Avatar size="xs" tone="blue">
                <AvatarFallback>A</AvatarFallback>
              </Avatar>
            }
            name="Ada"
            color="#eab7ab"
            text="The gallery is ready for a look."
            onOpen={() => undefined}
          />
        }
      >
        <ChannelMessageText jumbo>🎉🎉</ChannelMessageText>
      </ChannelMessage>
    </div>
  );
}
