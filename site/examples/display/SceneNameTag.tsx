import { FileCode, Folder, Image, Pencil } from "lucide-react";
import {
  SceneBadge,
  SceneBubble,
  SceneCrosshair,
  SceneGlyph,
  SceneMeter,
  SceneNameTag,
  ScenePlate,
  ScenePrompt,
  SceneReward,
  SceneSign,
  SceneSlot,
  Surface,
} from "../../../src";

export const meta = {
  name: "SceneNameTag · SceneBubble · ScenePlate · SceneSign · SceneGlyph · SceneBadge · SceneMeter · SceneSlot · ScenePrompt · SceneReward · SceneCrosshair",
  file: "display/SceneLabel.tsx",
  about: "Game scene labels (the Studio, now parked in misty-3d).",
  wide: true,
  order: 21,
};

export default function Example() {
  return (
    <Surface tone="stage" radius="lg" className="relative grid h-72 place-items-center gap-3 p-4">
      <div className="flex flex-wrap items-end justify-center gap-6">
        <div className="grid justify-items-center gap-2">
          <SceneBubble>Looking into the flaky test.</SceneBubble>
          <SceneNameTag name="Ada" line="Fixing tests" state="working" />
        </div>
        <SceneNameTag name="Grace" line="Needs an answer" state="waiting" />
        <SceneNameTag name="Linus" line="Done" state="resting" outcome="done" />
        <ScenePlate>Ada's desk</ScenePlate>
        <ScenePlate empty>Free desk</ScenePlate>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <SceneSign icon={<Pencil />}>Claim</SceneSign>
        <SceneGlyph tint="blue">
          <FileCode />
        </SceneGlyph>
        <SceneBadge tint="yellow">Lv 5</SceneBadge>
        <SceneMeter tint="green" value={60} label="Experience" className="w-32" />
        <SceneSlot icon={<Folder />} keyName="1" tint="orange">
          Files
        </SceneSlot>
        <SceneSlot icon={<Image />} keyName="2" selected>
          Images
        </SceneSlot>
        <ScenePrompt keyName="E">Talk to Ada</ScenePrompt>
        <SceneReward>+1</SceneReward>
      </div>
      <SceneCrosshair />
    </Surface>
  );
}
