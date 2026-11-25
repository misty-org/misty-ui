import { CountMark } from "../../../src";

export const meta = { name: "CountMark", file: "display/CountMark.tsx", about: "", wide: false, order: 8 };

export default function Example() {
  return (
    <div className="flex items-center gap-3">
      <CountMark count={3} label="3 unread" />
      <CountMark count={2} waiting label="2 need you or are new" />
      <CountMark count={128} label="128 unread" />
    </div>
  );
}
