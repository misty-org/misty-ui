let previewSequence = 0;

/** Freeze the painted row before detaching it from ancestor styles and hover state. */
export function createDragPreview(surface: HTMLElement) {
  const rect = surface.getBoundingClientRect();
  const copy = surface.cloneNode(true) as HTMLElement;
  const originals = [surface, ...surface.querySelectorAll<HTMLElement | SVGElement>("*")];
  const copies = [copy, ...copy.querySelectorAll<HTMLElement | SVGElement>("*")];
  const prefix = `reorder-preview-${++previewSequence}-`;
  const ids = new Map(
    originals.filter((node) => node.id).map((node) => [node.id, prefix + node.id]),
  );
  originals.forEach((node, index) => {
    const clone = copies[index];
    const style = getComputedStyle(node);
    for (const property of Array.from(style))
      clone.style.setProperty(property, style.getPropertyValue(property));
    clone.style.transition = "none";
    clone.style.animation = "none";
    for (const attribute of [...clone.attributes]) {
      if (attribute.name.startsWith("data-reorder-") || attribute.name === "autofocus") {
        clone.removeAttribute(attribute.name);
      } else if (attribute.name === "id") {
        clone.id = ids.get(attribute.value)!;
      } else {
        const value = attribute.value.replace(
          /url\(["']?#([^)'"\s]+)["']?\)/g,
          (match, id: string) => (ids.has(id) ? `url(#${ids.get(id)})` : match),
        );
        clone.setAttribute(
          attribute.name,
          value.startsWith("#") && ids.has(value.slice(1)) ? `#${ids.get(value.slice(1))}` : value,
        );
      }
    }
  });
  Object.assign(copy.style, {
    position: "relative",
    inset: "auto",
    margin: "0",
    transform: "none",
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    minWidth: "0",
    maxWidth: "none",
    maxHeight: "none",
    boxSizing: "border-box",
  });
  const preview = document.createElement("div");
  preview.className = "pointer-reorder-preview";
  preview.setAttribute("aria-hidden", "true");
  preview.inert = true;
  preview.style.width = `${rect.width}px`;
  preview.style.height = `${rect.height}px`;
  preview.append(copy);
  return { preview, rect };
}

/** Several items dragged as one (a tab group by its chip): each frozen in place, side by side. */
export function createGroupDragPreview(items: HTMLElement[]) {
  const rects = items.map((item) => item.getBoundingClientRect());
  const left = Math.min(...rects.map((rect) => rect.left));
  const top = Math.min(...rects.map((rect) => rect.top));
  const width = Math.max(...rects.map((rect) => rect.right)) - left;
  const height = Math.max(...rects.map((rect) => rect.bottom)) - top;
  const preview = document.createElement("div");
  preview.className = "pointer-reorder-preview";
  preview.setAttribute("aria-hidden", "true");
  preview.inert = true;
  preview.style.width = `${width}px`;
  preview.style.height = `${height}px`;
  items.forEach((item, index) => {
    const copy = createDragPreview(item).preview.firstElementChild as HTMLElement;
    Object.assign(copy.style, {
      position: "absolute",
      left: `${rects[index].left - left}px`,
      top: `${rects[index].top - top}px`,
    });
    preview.append(copy);
  });
  return { preview, rect: new DOMRect(left, top, width, height) };
}
