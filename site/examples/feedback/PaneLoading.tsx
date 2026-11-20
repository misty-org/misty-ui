import { PaneLoading } from "../../../src";

export const meta = { name: "PaneLoading", file: "feedback/PaneLoading.tsx", about: "", wide: false, order: 4 };

export default function Example() {
  return (
    <div className="grid gap-3">
      <div className="h-40">
        <PaneLoading label="Loading messages" />
      </div>
      <PaneLoading label="Loading the list" inline />
    </div>
  );
}
