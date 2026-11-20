import { Meter, Progress } from "../../../src";

export const meta = {
  name: "Progress · Meter",
  file: "feedback/Progress.tsx",
  about: "",
  wide: false,
  order: 7,
};

const column = "grid gap-3";

export default function Example() {
  return (
    <div className={column}>
      <Progress value={40} aria-label="Upload" />
      <Progress value={70} variant="media" aria-label="Playback" />
      <Meter label="Context window" share={0.3} />
      <Meter label="Context window (high)" share={0.75} />
      <Meter label="Context window (full)" share={0.95} />
    </div>
  );
}
