import { Textarea } from "../../../src";

export const meta = { name: "Textarea", file: "controls/Textarea.tsx", about: "", wide: false, order: 11 };

export default function Example() {
  return <Textarea aria-label="Notes" placeholder="Write something" />;
}
