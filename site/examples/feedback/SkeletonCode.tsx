import React from "react";
import { SkeletonCode, Surface } from "../../../src";

export const meta = { name: "SkeletonCode", file: "feedback/Skeleton.tsx", about: "", wide: false, order: 5 };

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
      <SkeletonCode label="Loading the file" lines={8} />
    </Pane>
  );
}
