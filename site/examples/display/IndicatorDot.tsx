import { Folder, User } from "lucide-react";
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
    <div className="flex items-center gap-4">
      <span className="relative inline-flex">
        <Folder />
        <IndicatorDot />
      </span>
      <span className="relative inline-flex">
        <User />
        <IndicatorDot count={4} />
      </span>
    </div>
  );
}
