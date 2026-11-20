import { FeatureCard, FeatureRow } from "../../../src";

export const meta = {
  name: "FeatureCard · FeatureRow",
  file: "patterns/FeatureCard.tsx",
  about: "Featured picks at the top of Explore, each filled by its banner.",
  wide: true,
  order: 0,
};

export default function Example() {
  return (
    <FeatureRow>
      <FeatureCard banner="https://picsum.photos/seed/misty-film/1200/640" eyebrow="App of the week"
        title="Cut a film with your agents" line="FilmCraft edits right in your Space."
        onOpen={() => undefined} />
      <FeatureCard banner="https://picsum.photos/seed/misty-design/1200/640" eyebrow="Agent of the week"
        title="Ship UI that looks finished" line="A designer who holds every screen to your library."
        onOpen={() => undefined} />
    </FeatureRow>
  );
}
