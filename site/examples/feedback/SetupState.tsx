import React from "react";
import { SetupState, Surface } from "../../../src";

export const meta = { name: "SetupState", file: "feedback/SetupState.tsx", about: "", wide: false, order: 2 };

const row = "flex flex-wrap items-center gap-3";

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
      <Pane height="h-32">
        <SetupState tool="the video editor" />
      </Pane>
      <SetupState tool="the terminal" size="row" error="The shell didn't start" onRetry={() => undefined} />
    </div>
  );
}
