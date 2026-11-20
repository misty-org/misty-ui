import { Image } from "lucide-react";
import { PlaceholderIcon } from "../../../src";

export const meta = {
  name: "PlaceholderIcon",
  file: "icons/PlaceholderIcon.tsx",
  about: "",
  wide: false,
  order: 27,
};

export default function Example() {
  return <PlaceholderIcon icon={Image} />;
}
