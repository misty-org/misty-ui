import { act, render, screen } from "@testing-library/react";
import { Plus } from "lucide-react";
import { describe, expect, it, vi } from "vitest";
import {
  ActionBar,
  actionBarGiveWayOrder,
  planActionBar,
  type ActionBarMeasure,
  type ActionBarPlan,
} from "./ActionBar";

const items: ActionBarMeasure[] = [
  { id: "attach", priority: 3, full: 80, icon: 32 },
  { id: "model", priority: 4, shrink: true, full: 160, icon: 32, minWidth: 80 },
  { id: "mode", priority: 1, full: 70, icon: 32 },
  { id: "engine", priority: 2, full: 90, icon: 32 },
];
const end = 32;
const more = 32;

const describePlan = (plan: ActionBarPlan) =>
  [
    ...items.map((item) => `${item.id}:${plan.placements[item.id]}`),
    `shrink:${plan.shrinkWidth ?? "-"}`,
  ].join(" ");

const planAt = (available: number, list = items) =>
  planActionBar({ available, items: list, more, end });

describe("ActionBar give-way order", () => {
  it("is lowest priority first, the rightmost first among equals", () => {
    expect(actionBarGiveWayOrder(items)).toEqual(["mode", "engine", "attach", "model"]);
    expect(
      actionBarGiveWayOrder([
        { id: "a", priority: 1 },
        { id: "b", priority: 1 },
        { id: "c", priority: 0 },
        { id: "d", priority: 1 },
      ]),
    ).toEqual(["c", "d", "b", "a"]);
  });

  it("does not depend on the order the items are listed in memory", () => {
    const first = actionBarGiveWayOrder(items);
    for (let round = 0; round < 5; round += 1)
      expect(actionBarGiveWayOrder([...items])).toEqual(first);
  });
});

describe("planActionBar", () => {
  it("gives way in the fixed order: labels, then the shrink item, then folding", () => {
    expect(describePlan(planAt(448))).toBe("attach:full model:full mode:full engine:full shrink:-");
    expect(describePlan(planAt(447))).toBe("attach:full model:full mode:icon engine:full shrink:-");
    expect(describePlan(planAt(389))).toBe("attach:full model:full mode:icon engine:icon shrink:-");
    expect(describePlan(planAt(340))).toBe("attach:icon model:full mode:icon engine:icon shrink:-");
    expect(describePlan(planAt(304))).toBe("attach:icon model:full mode:icon engine:icon shrink:-");
    expect(describePlan(planAt(303))).toBe(
      "attach:icon model:full mode:icon engine:icon shrink:159",
    );
    expect(describePlan(planAt(224))).toBe(
      "attach:icon model:full mode:icon engine:icon shrink:80",
    );
    expect(describePlan(planAt(223))).toBe(
      "attach:icon model:full mode:folded engine:folded shrink:115",
    );
    expect(describePlan(planAt(188))).toBe(
      "attach:icon model:full mode:folded engine:folded shrink:80",
    );
    expect(describePlan(planAt(187))).toBe(
      "attach:folded model:full mode:folded engine:folded shrink:115",
    );
    expect(describePlan(planAt(152))).toBe(
      "attach:folded model:full mode:folded engine:folded shrink:80",
    );
    expect(describePlan(planAt(151))).toBe(
      "attach:folded model:folded mode:folded engine:folded shrink:-",
    );
  });

  it("never unfolds as the bar narrows", () => {
    const rank = { full: 0, icon: 1, folded: 2 } as const;
    let previous = planAt(1000);
    for (let width = 999; width >= 0; width -= 1) {
      const next = planAt(width);
      for (const item of items)
        expect(rank[next.placements[item.id]]).toBeGreaterThanOrEqual(
          rank[previous.placements[item.id]],
        );
      previous = next;
    }
  });

  it("gives the same answer every time for the same widths", () => {
    for (const width of [600, 400, 300, 200, 160, 100, 40]) {
      const once = describePlan(planAt(width));
      expect(describePlan(planAt(width))).toBe(once);
      expect(describePlan(planAt(width, [...items]))).toBe(once);
    }
  });

  it("marks the bar as overflowing only when even ⋯ and the end slot don't fit", () => {
    expect(planAt(68).overflowing).toBe(false);
    expect(planAt(67).overflowing).toBe(true);
  });

  it("folds a bar without a shrink item straight after its labels", () => {
    const plain = items.map((item) => ({ ...item, shrink: false }));
    const plan = planActionBar({ available: 140, items: plain, more, end: 0 });
    expect(plan.shrinkWidth).toBeNull();
    expect(Object.values(plan.placements)).toEqual(["icon", "icon", "icon", "icon"]);
    const folded = planActionBar({ available: 139, items: plain, more, end: 0 });
    expect(folded.placements).toEqual({
      attach: "icon",
      model: "icon",
      mode: "folded",
      engine: "folded",
    });
  });
});

describe("ActionBar", () => {
  it("shows every item with its label before it has been measured", () => {
    render(
      <ActionBar
        label="Page actions"
        items={[
          { id: "new", icon: Plus, label: "New page", priority: 1, onSelect: () => {} },
          { id: "share", icon: Plus, label: "Share", priority: 0, onSelect: () => {} },
        ]}
      />,
    );
    const bar = screen.getByRole("toolbar", { name: "Page actions" });
    expect(bar.querySelector('[data-action-bar-item="new"]')?.getAttribute("data-mode")).toBe(
      "full",
    );
    expect(screen.getByRole("button", { name: "New page" })).toBeDefined();
    expect(screen.getByRole("button", { name: "Share" })).toBeDefined();
  });

  it("gives way as the measured row narrows", () => {
    const observers: Array<() => void> = [];
    vi.stubGlobal(
      "ResizeObserver",
      class {
        constructor(callback: () => void) {
          observers.push(callback);
        }
        observe() {}
        unobserve() {}
        disconnect() {}
      },
    );
    let rowWidth = 200;
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
      this: HTMLElement,
    ) {
      const measure = this.getAttribute("data-measure");
      const width =
        this.getAttribute("data-slot") === "action-bar"
          ? rowWidth
          : measure?.endsWith(":full")
            ? 100
            : 0;
      return {
        width,
        height: 32,
        top: 0,
        left: 0,
        right: width,
        bottom: 32,
        x: 0,
        y: 0,
      } as DOMRect;
    });
    render(
      <ActionBar
        label="Note actions"
        items={[
          { id: "a", icon: Plus, label: "Alpha", priority: 3 },
          { id: "b", icon: Plus, label: "Beta", priority: 2 },
          { id: "c", icon: Plus, label: "Gamma", priority: 1 },
        ]}
      />,
    );
    const bar = screen.getByRole("toolbar", { name: "Note actions" });
    const modes = () =>
      ["a", "b", "c"].map(
        (id) =>
          bar.querySelector(`[data-action-bar-item="${id}"]`)?.getAttribute("data-mode") ??
          "folded",
      );
    expect(modes()).toEqual(["full", "icon", "icon"]);
    expect(screen.queryByRole("button", { name: "More" })).toBeNull();

    rowWidth = 90;
    act(() => observers.forEach((notify) => notify()));
    expect(modes()).toEqual(["icon", "folded", "folded"]);
    expect(screen.getByRole("button", { name: "More" })).toBeDefined();
    vi.unstubAllGlobals();
  });
});
