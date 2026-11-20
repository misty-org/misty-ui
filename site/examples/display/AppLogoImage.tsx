import { AppLogoImage } from "../../../src";

export const meta = {
  name: "AppLogoImage",
  file: "icons/AppLogos.tsx",
  about: "No image given: the app's initial.",
  wide: false,
  order: 24,
};

const row = "flex flex-wrap items-center gap-3";

export default function Example() {
  return (
    <div className={row}>
      <AppLogoImage name="ArtCraft" size="card" />
      <AppLogoImage name="Zed" size="card" />
    </div>
  );
}
