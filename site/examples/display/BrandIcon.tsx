import { BrandIcon } from "../../../src";

export const meta = { name: "BrandIcon", file: "icons/BrandIcon.tsx", about: "", wide: false, order: 25 };

const row = "flex flex-wrap items-center gap-3";

const brands = ["anthropic", "openai", "github", "google", "slack", "notion", "linear", "figma"];

export default function Example() {
  return (
    <div className={row}>
      {brands.map((brand) => (
        <BrandIcon key={brand} brand={brand} label={brand} />
      ))}
      <BrandIcon brand="no-such-brand" label="Unknown brand" />
    </div>
  );
}
