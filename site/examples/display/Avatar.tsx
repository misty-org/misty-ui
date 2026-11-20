import { Avatar, AvatarFallback } from "../../../src";

export const meta = { name: "Avatar", file: "display/Avatar.tsx", about: "", wide: false, order: 10 };

const row = "flex flex-wrap items-center gap-3";

export default function Example() {
  return (
    <div className={row}>
      {(["xs", "sm", "default", "lg", "xl"] as const).map((size, index) => (
        <Avatar key={size} size={size} tone={(["blue", "green", "violet", "amber", "pink"] as const)[index]}>
          <AvatarFallback>AL</AvatarFallback>
        </Avatar>
      ))}
    </div>
  );
}
