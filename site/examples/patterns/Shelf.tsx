import { Eye } from "lucide-react";
import { AppLogoImage, Button, CatalogDone, MenuItem, Shelf, ShelfItem } from "../../../src";

export const meta = {
  name: "Shelf · ShelfItem",
  file: "patterns/Shelf.tsx",
  about: "Explore's rows: a heading with See all, then items in two columns.",
  wide: true,
  order: 0,
};

export default function Example() {
  return (
    <Shelf title="Open-source apps" action={<Button variant="quiet" size="sm">See all</Button>}>
      <ShelfItem logo={<AppLogoImage name="Sketch" size="tile" />} title="Sketch" line="Draw together"
        action={<CatalogDone label="In your Space" />} onOpen={() => undefined} />
      <ShelfItem logo={<AppLogoImage name="Decks" size="tile" />} title="Decks" line="Slides from layouts"
        action={<Button variant="get" size="sm">Get</Button>} menu={<MenuItem icon={Eye} label="Details" />}
        onOpen={() => undefined} />
      <ShelfItem logo={<AppLogoImage name="Sound" size="tile" />} title="Sound" line="Beats and mixes"
        action={<Button variant="get" size="sm">Get</Button>} onOpen={() => undefined} />
      <ShelfItem logo={<AppLogoImage name="Photo" size="tile" />} title="Photo" line="Edit pictures"
        action={<Button variant="get" size="sm">Get</Button>} onOpen={() => undefined} />
    </Shelf>
  );
}
