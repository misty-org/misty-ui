import { PropertyList } from "../../../src";

export const meta = {
  name: "PropertyList",
  file: "display/PropertyList.tsx",
  about: "",
  wide: false,
  order: 14,
};

export default function Example() {
  return (
    <PropertyList
      items={[
        { label: "Model", value: "Sonnet 5.5" },
        { label: "Folder", value: "~/misty-org/misty" },
        { label: "Started", value: "12 minutes ago" },
      ]}
    />
  );
}
