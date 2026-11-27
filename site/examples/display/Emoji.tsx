import { Emoji, EmojiText, Text } from "../../../src";

export const meta = {
  name: "Emoji",
  file: "display/Emoji.tsx",
  about: "Emoji drawn from the bundled Twemoji set, the same on every system, sized to the text around them.",
  wide: false,
  order: 12,
};

export default function Example() {
  return (
    <div className="grid gap-3">
      <Text size="display">
        <Emoji emoji="🎉" /> <Emoji emoji="👍🏽" /> <Emoji emoji="🇯🇵" />
      </Text>
      <Text as="p" wrap size="body">
        <EmojiText>Shipped it 🚀 thanks everyone ❤️ see you Monday 👋</EmojiText>
      </Text>
    </div>
  );
}
