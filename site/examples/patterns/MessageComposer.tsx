import React from "react";
import { AtSign, BookOpen, FileText, Mic, Paperclip, RefreshCw, Trash2 } from "lucide-react";
import {
  Button,
  ComposerStatusRow,
  IconButton,
  MessageComposer,
  MessageComposerAction,
  MessageComposerSend,
  type CollectionItem,
} from "../../../src";

export const meta = {
  name: "MessageComposer · MessageComposerSend · MessageComposerAction · ComposerStatusRow",
  file: "patterns/MessageComposer.tsx",
  about: "",
  wide: true,
  order: 8,
};

const items: CollectionItem[] = [
  {
    id: "1",
    title: "Weekly plan",
    icon: <FileText />,
    category: "Notes",
    updated: "2h ago",
    creator: "Ada",
    onOpen: () => undefined,
  },
  {
    id: "2",
    title: "Launch research",
    icon: <BookOpen />,
    category: "Lab",
    updated: "Yesterday",
    creator: "Grace",
    onOpen: () => undefined,
  },
  {
    id: "3",
    title: "Q4 roadmap with a very long title that has to fade",
    icon: <FileText />,
    category: "Notes",
    updated: "3d ago",
    creator: "Linus",
    onOpen: () => undefined,
  },
];

function ComposerDemo() {
  const [text, setText] = React.useState("");
  return (
    <div className="grid gap-4">
      <MessageComposer
        inputProps={{
          value: text,
          onChange: (event) => setText(event.target.value),
          placeholder: "Ask anything",
          "aria-label": "Message",
        }}
        items={[
          { id: "attach", icon: Paperclip, label: "Attach", priority: 2 },
          { id: "mention", icon: AtSign, label: "Mention", priority: 1 },
        ]}
        end={
          <>
            <IconButton label="Voice input">
              <Mic />
            </IconButton>
            <MessageComposerSend label="Send" disabled={!text} />
          </>
        }
      />
      <MessageComposer
        variant="card"
        inputProps={{ placeholder: "While a reply runs", "aria-label": "Message (card)" }}
        status={
          <ComposerStatusRow
            icon={RefreshCw}
            label="Agent status"
            actions={<Button size="sm">Answer</Button>}
          >
            Waiting for your answer
          </ComposerStatusRow>
        }
        end={
          <MessageComposerAction label="Stop">
            <Trash2 />
          </MessageComposerAction>
        }
      />
    </div>
  );
}

export default function Example() {
  return <ComposerDemo />;
}
