import { CollectionSkeleton } from "../../../src";

export const meta = {
  name: "CollectionSkeleton",
  file: "patterns/collection/CollectionSkeleton.tsx",
  about: "",
  wide: false,
  order: 2,
};

export default function Example() {
  return (
    <div className="h-48 overflow-hidden">
      <CollectionSkeleton view="list" icons />
    </div>
  );
}
