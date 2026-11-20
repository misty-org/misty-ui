import React from "react";
import { AppLogoImage, Button, StoreDetail, StoreDetailSection, Text } from "../../../src";

export const meta = {
  name: "StoreDetail · StoreDetailSection",
  file: "patterns/StoreDetail.tsx",
  about: "What opens on Get: the banner, the app, its facts and previews.",
  wide: false,
  order: 0,
};

export default function Example() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open details</Button>
      <StoreDetail
        open={open}
        onOpenChange={setOpen}
        banner="https://picsum.photos/seed/misty-sketch/1200/400"
        logo={<AppLogoImage name="Sketch" size="tile" />}
        title="Sketch"
        line="Draw together"
        action={<Button variant="get-filled" size="lg">Get</Button>}
        facts={[
          { label: "Maker", value: "Sketch's maker" },
          { label: "Version", value: "1.4" },
          { label: "License", value: "Open source", detail: "MIT" },
        ]}
      >
        <StoreDetailSection title="About">
          <Text as="p" size="body" wrap className="m-0">
            A whiteboard to draw on together. It opens and saves files in the Space's Files.
          </Text>
        </StoreDetailSection>
      </StoreDetail>
    </>
  );
}
