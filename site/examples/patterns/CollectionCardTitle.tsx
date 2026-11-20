import { CollectionCardMetadata, CollectionCardTitle } from "../../../src";

export const meta = {
  name: "CollectionCardTitle · CollectionCardMetadata",
  file: "patterns/collection/CollectionCards.tsx",
  about: "",
  wide: false,
  order: 3,
};

export default function Example() {
  return (
    <div className="grid w-64 gap-1">
      <CollectionCardTitle title="Q4 roadmap with a very long title that has to fade" />
      <CollectionCardMetadata category="Notes" updated="2h ago" creator="Ada" />
    </div>
  );
}
