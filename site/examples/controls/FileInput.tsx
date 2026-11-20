import React from "react";
import { Download } from "lucide-react";
import { Button, FileInput, Text } from "../../../src";

export const meta = { name: "FileInput", file: "controls/FileInput.tsx", about: "", wide: false, order: 16 };

const row = "flex flex-wrap items-center gap-3";

function FileInputDemo() {
  const input = React.useRef<HTMLInputElement>(null);
  const [name, setName] = React.useState("");
  return (
    <div className={row}>
      <Button icon={Download} onClick={() => input.current?.click()}>
        Choose a file
      </Button>
      <FileInput ref={input} onChange={(event) => setName(event.target.files?.[0]?.name ?? "")} />
      <Text size="meta" tone="muted">
        {name}
      </Text>
    </div>
  );
}

export default function Example() {
  return <FileInputDemo />;
}
