import React from "react";
import { SkeletonDocument, Surface } from "../../../src";

export const meta = {
  name: "SkeletonDocument",
  file: "feedback/Skeleton.tsx",
  about: "",
  wide: false,
  order: 4,
};

function Pane(props: { children: React.ReactNode; height?: string }) {
  return (
    <Surface
      tone="page"
      edge="hairline"
      radius="lg"
      className={`relative overflow-hidden ${props.height ?? "h-56"}`}
    >
      {props.children}
    </Surface>
  );
}

export default function Example() {
  return (
    <Pane>
      <SkeletonDocument label="Loading the document" />
    </Pane>
  );
}
