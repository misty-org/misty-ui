import { InlineLink, Text } from "../../../src";

export const meta = { name: "InlineLink", file: "controls/InlineLink.tsx", about: "A button in a line of text, and with asChild a real link.", wide: false, order: 7 };

export default function Example() {
  return (
    <Text size="meta" tone="muted" wrap>
      By continuing you agree to the <InlineLink>terms of service</InlineLink>. Have an account?{" "}
      <InlineLink asChild>
        <a href="#sign-in">Sign in</a>
      </InlineLink>
    </Text>
  );
}
