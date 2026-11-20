import React from "react";
import {
  Button,
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
} from "../../../src";

export const meta = {
  name: "Dialog · DialogHeader · DialogTitle · DialogBody · DialogFooter",
  file: "overlays/Dialog.tsx",
  about: "",
  wide: false,
  order: 9,
};

function DialogDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button onClick={() => setOpen(true)}>Open dialog</Button>
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle>New Space</DialogTitle>
          <DialogDescription>A place for a project and the people working on it.</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <Input aria-label="Space name" placeholder="Space name" />
        </DialogBody>
        <DialogFooter>
          <Button variant="quiet" size="lg" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" size="lg" onClick={() => setOpen(false)}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function Example() {
  return <DialogDemo />;
}
