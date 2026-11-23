import { Disclosure, DisclosureList, Text } from "../../../src";

export const meta = { name: "Disclosure", file: "layout/Disclosure.tsx", about: "Sections on one group fill, and a row in a sidebar.", wide: false, order: 10 };

export default function Example() {
  return (
    <div className="grid w-96 gap-6">
      <DisclosureList>
        <Disclosure title="Can I host it myself?" defaultOpen>
          Yes, with every feature.
        </Disclosure>
        <Disclosure title="Where do agents run?">On your own computer.</Disclosure>
      </DisclosureList>
      <Disclosure kind="row" title="Getting started" defaultOpen>
        <Text size="control" tone="muted">
          Quickstart
        </Text>
      </Disclosure>
    </div>
  );
}
