import { ListRowSkeleton, Skeleton, SkeletonControl, SkeletonList } from "../../../src";

export const meta = {
  name: "Skeleton · SkeletonList · ListRowSkeleton · SkeletonControl",
  file: "feedback/Skeleton.tsx",
  about: "",
  wide: false,
  order: 3,
};

const row = "flex flex-wrap items-center gap-3";

const column = "grid gap-3";

export default function Example() {
  return (
    <div className={column}>
      <Skeleton className="h-4 w-40" />
      <SkeletonList label="Loading chats" rows={3} lines={2} trailing />
      <ListRowSkeleton label="Loading rows" rows={2} />
      <div className={row}>
        {(["button", "button-sm", "icon", "switch", "field", "select", "badge"] as const).map((kind) => (
          <SkeletonControl key={kind} kind={kind} />
        ))}
      </div>
    </div>
  );
}
