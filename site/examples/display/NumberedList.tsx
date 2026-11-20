import { NumberedList } from "../../../src";

export const meta = {
  name: "NumberedList",
  file: "display/NumberedList.tsx",
  about: "",
  wide: false,
  order: 15,
};

export default function Example() {
  return (
    <NumberedList
      items={["Misty keeps your agents together.", "An agent does the work.", "A Space is where it lands."]}
    />
  );
}
