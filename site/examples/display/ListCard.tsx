import { ListCard, Text } from "../../../src";

export const meta = { name: "ListCard", file: "display/ListCard.tsx", about: "", wide: false, order: 4 };

export default function Example() {
  return (
    <ListCard>
      {["Claude Code", "Codex", "Antigravity"].map((name) => (
        <li key={name} className="flex h-10 items-center px-3">
          <Text size="control">{name}</Text>
        </li>
      ))}
    </ListCard>
  );
}
