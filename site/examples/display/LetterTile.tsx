import { LetterTile, Surface } from "../../../src";

export const meta = {
  name: "LetterTile",
  file: "icons/LetterTile.tsx",
  about: "",
  wide: false,
  order: 40,
};

export default function LetterTileExample() {
  return (
    <Surface tone="page" className="flex w-fit gap-3 p-4">
      <LetterTile name="A/B test statistics" />
      <LetterTile name="Code review" />
      <LetterTile name="Security audit" />
      <LetterTile name="Agent memory" />
      <LetterTile name="Brand guardian" size="hero" />
    </Surface>
  );
}
