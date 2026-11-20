import { InUseMark, ListRow } from "../../../src";

export const meta = {
  name: "InUseMark",
  file: "display/InUseMark.tsx",
  about: "Who has a file open, at the row's end where its state goes.",
  wide: false,
  order: 8,
};

export default function Example() {
  return (
    <ul className="grid w-80 gap-1">
      <li>
        <ListRow
          label="Launch plan.md"
          trailing={<InUseMark people={[{ name: "Ana", tone: "blue", editing: true }]} />}
        />
      </li>
      <li>
        <ListRow
          label="Budget.xlsx"
          trailing={
            <InUseMark
              people={[
                { name: "Mia", you: true, editing: true, device: "MacBook", tone: "green" },
                { name: "Grace", tone: "violet" },
              ]}
            />
          }
        />
      </li>
      <li>
        <ListRow
          label="Pitch deck.key"
          trailing={
            <InUseMark
              people={[
                { name: "Ana", tone: "blue" },
                { name: "Grace", tone: "violet", editing: true },
                { name: "Linus", tone: "amber" },
                { name: "Ada", tone: "pink" },
                { name: "Alan", tone: "teal" },
              ]}
            />
          }
        />
      </li>
    </ul>
  );
}
