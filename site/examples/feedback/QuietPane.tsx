import React from "react";
import { FlyingMisty, QuietPane, Surface } from "../../../src";

export const meta = {
  name: "QuietPane · FlyingMisty",
  file: "feedback/QuietPane.tsx · FlyingMisty.tsx",
  about: "",
  wide: false,
  order: 11,
};

const column = "grid gap-3";

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
    <div className={column}>
      <Pane height="h-40">
        <QuietPane />
      </Pane>
      <Pane height="h-24">
        <FlyingMisty />
      </Pane>
    </div>
  );
}
