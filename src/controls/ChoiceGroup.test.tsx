import { fireEvent, render, screen } from "@testing-library/react";
import { LayoutGrid, List } from "lucide-react";
import { describe, expect, it, vi } from "vitest";
import { ChoiceGroup } from "./ChoiceGroup";

describe("ChoiceGroup", () => {
  it("is a radio group whose track is one control height", () => {
    const onChange = vi.fn();
    render(
      <ChoiceGroup
        label="Calendar view"
        value="month"
        onChange={onChange}
        options={[
          { value: "month", label: "Month" },
          { value: "agenda", label: "Agenda" },
        ]}
      />,
    );
    const group = screen.getByRole("radiogroup", { name: "Calendar view" });
    expect(group.className).toContain("h-8");
    expect(screen.getByRole("radio", { name: "Month" }).getAttribute("aria-checked")).toBe("true");
    expect(screen.getByRole("radio", { name: "Month" }).className).toContain("text-control");

    fireEvent.keyDown(group, { key: "End" });
    expect(onChange).toHaveBeenCalledWith("agenda");
  });

  it("names icon-only options by their label", () => {
    render(
      <ChoiceGroup
        label="View layout"
        size="sm"
        value="grid"
        onChange={() => {}}
        options={[
          { value: "grid", label: "Grid view", icon: LayoutGrid, iconOnly: true },
          { value: "list", label: "List view", icon: List, iconOnly: true },
        ]}
      />,
    );
    expect(screen.getByRole("radiogroup", { name: "View layout" }).className).toContain("h-6");
    expect(screen.getByRole("radio", { name: "List view" }).textContent).toBe("");
  });
});

