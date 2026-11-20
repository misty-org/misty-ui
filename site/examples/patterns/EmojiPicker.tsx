import { Heart, Smile } from "lucide-react";
import { EmojiPicker, IconButton, type EmojiChoice } from "../../../src";

export const meta = {
  name: "EmojiPicker",
  file: "patterns/EmojiPicker.tsx",
  about: "",
  wide: false,
  order: 16,
};

const people: EmojiChoice[] = [
  { emoji: "😀", name: "grinning" },
  { emoji: "😂", name: "joy" },
  { emoji: "😍", name: "heart eyes" },
  { emoji: "👍", name: "thumbsup" },
  { emoji: "👋", name: "wave" },
];
const symbols: EmojiChoice[] = [
  { emoji: "❤️", name: "heart" },
  { emoji: "✨", name: "sparkles" },
  { emoji: "✅", name: "white check mark" },
];
const all = [...people, ...symbols];

export default function Example() {
  return (
    <EmojiPicker
      sections={[
        { id: "people", title: "People", icon: Smile, emojis: people },
        { id: "symbols", title: "Symbols", icon: Heart, emojis: symbols },
      ]}
      search={(query) =>
        all.filter((choice) => choice.name.includes(query.toLowerCase()))
      }
      onPick={() => undefined}
    >
      <IconButton label="Emoji">
        <Smile />
      </IconButton>
    </EmojiPicker>
  );
}
