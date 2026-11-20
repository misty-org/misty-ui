import React from "react";
import { ChevronRight } from "lucide-react";
import { Button, Collapsible, CollapsibleContent, CollapsibleTrigger, Text } from "../../../src";

export const meta = { name: "Collapsible", file: "layout/Collapsible.tsx", about: "", wide: false, order: 9 };

function CollapsibleDemo() {
  const [open, setOpen] = React.useState(true);
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="quiet" iconEnd={ChevronRight}>
          {open ? "Hide details" : "Show details"}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <Text size="meta" tone="muted" wrap>
          The content folds away under its trigger.
        </Text>
      </CollapsibleContent>
    </Collapsible>
  );
}

export default function Example() {
  return <CollapsibleDemo />;
}
