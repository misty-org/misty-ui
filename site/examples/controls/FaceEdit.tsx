import { Avatar, AvatarFallback, FaceEdit, notify } from "../../../src";

export const meta = { name: "FaceEdit", file: "controls/FaceEdit.tsx", about: "", wide: false, order: 11 };

export default function Example() {
  return (
    <span className="relative inline-flex">
      <Avatar size="xl">
        <AvatarFallback>A</AvatarFallback>
      </Avatar>
      <FaceEdit onEdit={() => notify({ message: "Pick a new picture" })} />
    </span>
  );
}
