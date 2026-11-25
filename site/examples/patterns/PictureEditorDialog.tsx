import React from "react";
import { Avatar, AvatarFallback, AvatarImage, FaceEdit, PictureEditorDialog } from "../../../src";

export const meta = {
  name: "PictureEditorDialog",
  file: "patterns/PictureEditorDialog.tsx",
  about: "",
  wide: false,
  order: 22,
};

function PictureEditorDemo() {
  const [open, setOpen] = React.useState(false);
  const [picture, setPicture] = React.useState<string | null>(null);
  const [outline, setOutline] = React.useState<string | null>("#a0c4d4");
  return (
    <>
      <span className="relative inline-flex">
        <Avatar size="xl" outline={outline}>
          {picture ? <AvatarImage src={picture} alt="" /> : null}
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
        <FaceEdit onEdit={() => setOpen(true)} />
      </span>
      {open ? (
        <PictureEditorDialog
          src={picture}
          outline={outline}
          onSave={async (result) => {
            if (result.picture) setPicture(URL.createObjectURL(result.picture));
            setOutline(result.outline);
          }}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </>
  );
}

export default function Example() {
  return <PictureEditorDemo />;
}
