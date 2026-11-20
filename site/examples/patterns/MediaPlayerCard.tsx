import React from "react";
import { MediaPlayerCard } from "../../../src";

export const meta = {
  name: "MediaPlayerCard",
  file: "patterns/MediaPlayerCard.tsx",
  about: "",
  wide: false,
  order: 18,
};

function MediaDemo() {
  const [playing, setPlaying] = React.useState(false);
  return (
    <MediaPlayerCard
      title="Weekly standup recording"
      detail="Research"
      playing={playing}
      position={42}
      length={300}
      onPlay={() => setPlaying(true)}
      onPause={() => setPlaying(false)}
      onSeek={() => undefined}
      onToggleMute={() => undefined}
    />
  );
}

export default function Example() {
  return <MediaDemo />;
}
