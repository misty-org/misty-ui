import type { CSSProperties, RefObject } from "react";
import AvatarEditor, { type AvatarEditorRef } from "react-avatar-editor";
import { cropFrame, cropSize } from "./picture_crop";
const ring = (cropSize * 4.5) / 81;
const radius = { circle: cropSize / 2, tile: cropSize * 0.28 };

export type PictureCropStageProps = {
  editorRef: RefObject<AvatarEditorRef | null>;
  image: string | File;
  shape: "circle" | "tile";
  outline: string | null;
  scale: number;
  rotate: number;
  position: { x: number; y: number };
  onPositionChange(position: { x: number; y: number }): void;
  onScaleChange(scale: number): void;
  onLoadFailure(): void;
};

export default function PictureCropStage(props: PictureCropStageProps) {
  const ringStyle: CSSProperties = {
    left: cropFrame,
    top: cropFrame,
    width: cropSize,
    height: cropSize,
    borderRadius: radius[props.shape],
    outline: props.outline ? `${ring}px solid ${props.outline}` : undefined,
    outlineOffset: -ring,
  };
  return (
    <>
      <AvatarEditor
        ref={props.editorRef}
        image={props.image}
        width={cropSize}
        height={cropSize}
        border={cropFrame}
        borderRadius={radius[props.shape]}
        color={[0, 0, 0, 0.6]}
        scale={props.scale}
        rotate={props.rotate}
        position={props.position}
        enableWheelZoom
        onPositionChange={props.onPositionChange}
        onRequestScaleChange={props.onScaleChange}
        onLoadFailure={props.onLoadFailure}
        style={{ display: "block" }}
      />
      <span aria-hidden="true" className="pointer-events-none absolute" style={ringStyle} />
    </>
  );
}
