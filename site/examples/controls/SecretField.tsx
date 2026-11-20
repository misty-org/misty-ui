import React from "react";
import { SecretField } from "../../../src";

export const meta = {
  name: "SecretField",
  file: "controls/SecretField.tsx",
  about: "Empty, then saved (its ⋯ has Replace and Remove).",
  wide: false,
  order: 13,
};

const column = "grid gap-3";

function SecretFieldDemo() {
  const [saved, setSaved] = React.useState(false);
  return (
    <div className={column}>
      <SecretField
        label="API key"
        saved={false}
        placeholder="Paste a key"
        onSave={async () => setSaved(true)}
        onRemove={async () => setSaved(false)}
      />
      <SecretField
        label="Saved API key"
        saved
        onSave={async () => setSaved(!saved)}
        onRemove={async () => setSaved(false)}
      />
    </div>
  );
}

export default function Example() {
  return <SecretFieldDemo />;
}
