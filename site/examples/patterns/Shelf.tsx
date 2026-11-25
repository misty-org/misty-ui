import { Eye } from "lucide-react";
import { AppLogoImage, Button, MenuItem, Shelf, ShelfItem } from "../../../src";

export const meta = {
  name: "Shelf · ShelfItem",
  file: "patterns/Shelf.tsx",
  about: "Explore's rows, as the App Store's: a heading with See all, then items in up to three columns, each ending in its one action.",
  wide: true,
  order: 0,
};

export default function Example() {
  return (
    <Shelf title="Open-source apps" action={<Button variant="quiet" size="sm">See all</Button>}>
      <ShelfItem logo={<AppLogoImage name="Sketch" size="tile" />} title="Sketch" line="Draw together"
        action={<Button size="sm">Manage</Button>} onOpen={() => undefined} />
      <ShelfItem logo={<AppLogoImage name="Decks" size="tile" />} title="Decks" line="Slides from layouts"
        action={<Button variant="get" size="sm">Get</Button>} menu={<MenuItem icon={Eye} label="Details" />}
        onOpen={() => undefined} />
      <ShelfItem logo={<AppLogoImage name="Sound" size="tile" />} title="Sound" line="Beats and mixes, with a sequencer, a sampler and a mixer"
        action={<Button variant="get" size="sm">Update</Button>} onOpen={() => undefined} />
      <ShelfItem logo={<AppLogoImage name="Photo" size="tile" />} title="Photo" line="Edit pictures"
        action={<Button variant="get" size="sm">Get</Button>} onOpen={() => undefined} />
      <ShelfItem logo={<AppLogoImage name="Notes" size="tile" />} title="Notes" line="Write things down"
        action={<Button size="sm">Open</Button>} onOpen={() => undefined} />
      <ShelfItem logo={<AppLogoImage name="Maps" size="tile" />} title="Maps" line="Draw on maps"
        action={<Button variant="get" size="sm">Get</Button>} onOpen={() => undefined} />
    </Shelf>
  );
}
