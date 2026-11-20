import { PageEnter, Text } from "../../../src";

export const meta = { name: "PageEnter", file: "layout/PageEnter.tsx", about: "", wide: false, order: 17 };

export default function Example() {
  return (
    <PageEnter>
      <Text size="title" weight="semibold">
        Welcome back
      </Text>
    </PageEnter>
  );
}
