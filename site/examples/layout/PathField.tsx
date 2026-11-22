import React from "react";
import { PathField } from "../../../src";

export const meta = { name: "PathField", file: "layout/PathField.tsx", about: "", wide: false, order: 6 };

export default function Example() {
  const [path, setPath] = React.useState("/Users/ana/Documents/Plans");
  const parts = path.split("/").filter(Boolean);
  const segments = [
    { id: "/", label: "/", onSelect: () => setPath("/") },
    ...parts.map((part, index) => {
      const at = `/${parts.slice(0, index + 1).join("/")}`;
      return { id: at, label: part, onSelect: () => setPath(at) };
    }),
  ];
  return <PathField label="Path" segments={segments} value={path} onSubmit={setPath} />;
}
