import { Button, SidewaysScroll } from "../../../src";

export const meta = {
  name: "SidewaysScroll",
  file: "layout/SidewaysScroll.tsx",
  about: "Scroll it sideways with the wheel.",
  wide: false,
  order: 12,
};

export default function Example() {
  return (
    <SidewaysScroll className="flex gap-2">
      {Array.from({ length: 14 }, (_, index) => (
        <Button key={index} variant="quiet">
          Item {index + 1}
        </Button>
      ))}
    </SidewaysScroll>
  );
}
