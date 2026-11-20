import React from "react";
import { LoadingScreen, Surface } from "../../../src";

export const meta = {
  name: "LoadingScreen",
  file: "feedback/LoadingScreen.tsx",
  about: "Inline it is a skeleton; full screen it is the startup splash.",
  wide: false,
  order: 12,
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
    <Pane height="h-40">
      <LoadingScreen />
    </Pane>
  );
}
