import React from "react";
import { Button, Text, Tour } from "../../../src";

export const meta = { name: "Tour", file: "overlays/Tour.tsx", about: "", wide: false, order: 17 };

const row = "flex flex-wrap items-center gap-3";

function TourDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <div className={row}>
      <Button data-tour="gallery-tour-start" onClick={() => setOpen(true)}>
        Start tour
      </Button>
      <Text size="meta" tone="muted" data-tour="gallery-tour-second">
        The second stop
      </Text>
      <Tour
        open={open}
        label="Gallery tour"
        onClose={() => setOpen(false)}
        steps={[
          { target: "gallery-tour-start", title: "Start here", body: "This button starts the tour." },
          { target: "gallery-tour-second", title: "Then here", body: "Each step lights one thing." },
        ]}
      />
    </div>
  );
}

export default function Example() {
  return <TourDemo />;
}
