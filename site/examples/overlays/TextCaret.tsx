import { Input } from "../../../src";

export const meta = {
  name: "TextCaret",
  file: "overlays/TextCaret.tsx",
  about: "Type in the field: the caret is the thin line the site's root draws.",
  wide: false,
  order: 18,
};

export default function Example() {
  return <Input placeholder="Type here" />;
}
