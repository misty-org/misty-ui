import React from "react";
import { Plus } from "lucide-react";
import { EmptyState, Surface } from "../../../src";

export const meta = { name: "EmptyState", file: "feedback/StateView.tsx", about: "", wide: false, order: 0 };

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
      <EmptyState
        title="No notes yet"
        line="Notes you write here are shared with the Space."
        action={{ label: "New note", icon: Plus, onClick: () => undefined, variant: "primary" }}
      />
    </Pane>
  );
}
