import { CodeBlock, CodeText } from "../../../src";

export const meta = {
  name: "CodeBlock · CodeText",
  file: "display/CodeBlock.tsx",
  about: "",
  wide: false,
  order: 16,
};

const column = "grid gap-2";

export default function Example() {
  return (
    <div className={column}>
      <CodeBlock language="bash" code={"npm run design:catalog\nnpm run design:gallery"} />
      <CodeText>$ git status{"\n"}On branch main</CodeText>
    </div>
  );
}
