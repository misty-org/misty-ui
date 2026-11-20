import { useState } from "react";
import { AddAppTile, AppLauncher, AppLogoImage, AppTile, Button } from "../../../src";

const apps = ["Sketch", "Decks", "Sound", "Photo", "Film", "Words"];

export const meta = {
  name: "AppLauncher",
  file: "patterns/home/AppLauncher.tsx",
  about: "",
  wide: false,
  order: 8,
};

export default function Example() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const shown = apps.filter((name) => name.toLowerCase().includes(query.toLowerCase()));
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open apps</Button>
      <AppLauncher
        open={open}
        onOpenChange={setOpen}
        query={query}
        onQueryChange={setQuery}
        empty={!shown.length}
      >
        {shown.map((name) => (
          <AppTile key={name} mark={<AppLogoImage name={name} size="launcher" />} label={name} />
        ))}
        <AddAppTile />
      </AppLauncher>
    </>
  );
}
