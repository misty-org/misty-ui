import { Folder } from "lucide-react";
import { IndicatorDot } from "../../../src";

export const meta = {
  name: "IndicatorDot",
  file: "display/IndicatorDot.tsx",
  about: "",
  wide: false,
  order: 9,
};

export default function Example() {
  return (
    <span className="relative inline-flex">
      <Folder />
      <IndicatorDot />
    </span>
  );
}
