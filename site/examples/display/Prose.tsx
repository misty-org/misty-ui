import { Info, Lightbulb } from "lucide-react";
import { Prose, ProseCallout, ProseCode, ProseTable } from "../../../src";

export const meta = {
  name: "Prose · ProseTable · ProseCallout · ProseCode",
  file: "display/Prose.tsx",
  about: "",
  wide: true,
  order: 18,
};

export default function Example() {
  return (
    <Prose size="body">
      <h2>A heading</h2>
      <p>
        A paragraph with <strong>bold</strong>, <em>italic</em>, <a href="#prose">a link</a> and{" "}
        <code>inline code</code>.
      </p>
      <ul>
        <li>A list item</li>
        <li>Another one</li>
      </ul>
      <blockquote>A quote.</blockquote>
      <ProseCallout kind="note" label="Note" icon={Info}>
        <p>A callout.</p>
      </ProseCallout>
      <ProseCallout kind="tip" label="Tip" icon={Lightbulb}>
        <p>A tip.</p>
      </ProseCallout>
      <ProseCode language="ts">
        <code>{"const answer = 42;"}</code>
      </ProseCode>
      <ProseTable>
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Ada</td>
            <td>Owner</td>
          </tr>
        </tbody>
      </ProseTable>
    </Prose>
  );
}
