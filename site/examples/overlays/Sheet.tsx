import React from "react";
import { Button, Sheet, SheetContent, SheetDescription, SheetTitle } from "../../../src";

export const meta = { name: "Sheet", file: "overlays/Sheet.tsx", about: "", wide: false, order: 12 };

function SheetDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Button onClick={() => setOpen(true)}>Open sheet</Button>
      <SheetContent className="w-105">
        <div className="grid gap-2 p-4">
          <SheetTitle>Details</SheetTitle>
          <SheetDescription>A sheet slides in from the side.</SheetDescription>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default function Example() {
  return <SheetDemo />;
}
