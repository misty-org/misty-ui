import { Button, ProgressPill } from "../../../src";

export const meta = {
  name: "ProgressPill",
  file: "controls/ProgressPill.tsx",
  about: "",
  wide: false,
  order: 3,
};

const labels = ["Get", "Manage", "Update", "Open"];

export default function Example() {
  return (
    <div className="flex items-center gap-2">
      <Button variant="get" widthOf={labels}>
        Get
      </Button>
      <ProgressPill value={0.42} label="Downloading Voicebox" widthOf={labels} />
      <ProgressPill label="Starting the download" widthOf={labels} />
      <Button variant="secondary" widthOf={labels}>
        Open
      </Button>
    </div>
  );
}
