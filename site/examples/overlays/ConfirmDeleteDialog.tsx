import React from "react";
import { Button, ConfirmDeleteDialog, useConfirmDelete } from "../../../src";

export const meta = {
  name: "ConfirmDeleteDialog · useConfirmDelete",
  file: "overlays/ConfirmDeleteDialog.tsx",
  about: "",
  wide: false,
  order: 11,
};

const row = "flex flex-wrap items-center gap-3";

function ConfirmDeleteDemo() {
  const [open, setOpen] = React.useState(false);
  const { confirm, dialog } = useConfirmDelete();
  return (
    <div className={row}>
      <Button variant="danger" onClick={() => setOpen(true)}>
        Delete note
      </Button>
      <ConfirmDeleteDialog
        open={open}
        onOpenChange={setOpen}
        title="Delete note?"
        what="“Weekly plan” and its comments will be deleted."
      />
      <Button
        variant="quiet"
        onClick={() => void confirm({ title: "Delete chat?", what: "This chat goes for good." })}
      >
        Through useConfirmDelete
      </Button>
      {dialog}
    </div>
  );
}

export default function Example() {
  return <ConfirmDeleteDemo />;
}
