import { BrandIcon, LogoInitial, LogoPlate } from "../../../src";

export const meta = {
  name: "LogoInitial · LogoPlate",
  file: "icons/LogoFallbacks.tsx",
  about: "",
  wide: false,
  order: 26,
};

const row = "flex flex-wrap items-center gap-3";

export default function Example() {
  return (
    <div className={row}>
      <LogoInitial name="Hermes" />
      <LogoInitial name="Grok" size={24} />
      <LogoPlate logo="brand:github">
        <BrandIcon brand="github" label="github" />
      </LogoPlate>
    </div>
  );
}
