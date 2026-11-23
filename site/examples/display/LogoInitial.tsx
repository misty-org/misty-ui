import { LogoInitial, LogoPlate, Mark } from "../../../src";

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
      <LogoPlate plate="dark">
        <Mark of="github" label="github" />
      </LogoPlate>
    </div>
  );
}
