import React from "react";
import { ErrorState, Surface } from "../../../src";

export const meta = { name: "ErrorState", file: "feedback/StateView.tsx", about: "", wide: false, order: 1 };

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
      <ErrorState
        title="Couldn't load the notes"
        line="The server didn't answer."
        action={{ label: "Try again", onClick: () => undefined }}
      />
    </Pane>
  );
}
