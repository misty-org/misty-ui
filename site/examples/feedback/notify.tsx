import { Button, notify } from "../../../src";

export const meta = {
  name: "notify (NoticeViewport)",
  file: "feedback/notices.tsx",
  about: "Notices stack at the bottom right and leave on their own.",
  wide: false,
  order: 10,
};

const row = "flex flex-wrap items-center gap-3";

export default function Example() {
  return (
    <div className={row}>
      <Button onClick={() => notify({ message: "Link copied" })}>Plain notice</Button>
      <Button
        onClick={() =>
          notify({ message: "Note deleted", action: { label: "Undo", onSelect: () => undefined } })
        }
      >
        With action
      </Button>
      <Button
        onClick={() =>
          notify({
            message: "You've been signed out. Sign in to get your Spaces and sync back.",
            action: { label: "Sign in", onSelect: () => undefined },
          })
        }
      >
        Long with action
      </Button>
      <Button onClick={() => notify({ message: "Couldn't save the note", tone: "error" })}>Error</Button>
    </div>
  );
}
