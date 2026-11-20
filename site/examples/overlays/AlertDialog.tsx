import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
} from "../../../src";

export const meta = {
  name: "AlertDialog",
  file: "overlays/AlertDialog.tsx",
  about: "",
  wide: false,
  order: 10,
};

function AlertDialogDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <Button onClick={() => setOpen(true)}>Open alert</Button>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Leave this Space?</AlertDialogTitle>
          <AlertDialogDescription>You'll need a new invite to come back.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Leave</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default function Example() {
  return <AlertDialogDemo />;
}
