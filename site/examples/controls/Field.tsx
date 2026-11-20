import { Field, FieldError, Input } from "../../../src";

export const meta = {
  name: "Field · Label · FieldError",
  file: "controls/Field.tsx",
  about: "",
  wide: false,
  order: 15,
};

const column = "grid gap-3";

export default function Example() {
  return (
    <div className={column}>
      <Field label="Space name">
        <Input defaultValue="Research" />
      </Field>
      <Field label="Email" error="That doesn't look like an email address">
        <Input defaultValue="ada@" />
      </Field>
      <FieldError id="g-err" message="A failure shown beside a custom control" />
    </div>
  );
}
