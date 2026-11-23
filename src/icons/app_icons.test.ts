import { describe, expect, it } from "vitest";
import { appIcon, spaceIcons } from "./app_icons";

describe("a Space's tabs wear the Space's own icons", () => {
  it.each([
    ["home", spaceIcons.space],
    ["space", spaceIcons.space],
    ["social", spaceIcons.chat],
    ["lab", spaceIcons.lab],
    ["files", spaceIcons.files],
    ["media", spaceIcons.files],
    ["library", spaceIcons.files],
  ])("%s", (tool, icon) => {
    expect(appIcon(tool, "space")).toBe(icon);
  });
});
