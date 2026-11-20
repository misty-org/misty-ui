import React from "react";
import { Pencil } from "lucide-react";
import { Button, RenameItemDialog } from "../../../src";

export const meta = {
  name: "RenameItemDialog",
  file: "patterns/RenameItemDialog.tsx",
  about: "",
  wide: false,
  order: 21,
};

function RenameDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button icon={Pencil} onClick={() => setOpen(true)}>
        Rename
      </Button>
      {open ? (
        <RenameItemDialog
          title="Rename note"
          initialName="Weekly plan"
          onConfirm={async () => setOpen(false)}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </>
  );
}

export default function Example() {
  return <RenameDemo />;
}
