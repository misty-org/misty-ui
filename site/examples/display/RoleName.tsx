import { RoleDot, RoleMention, RoleName } from "../../../src";

export const meta = {
  name: "RoleName · RoleDot · RoleMention",
  file: "display/RoleName.tsx",
  about: "",
  wide: false,
  order: 11,
};

const row = "flex flex-wrap items-center gap-3";

export default function Example() {
  return (
    <div className={row}>
      <RoleName color="#e5533d">Ada Lovelace</RoleName>
      <RoleName>No role color</RoleName>
      <RoleDot color="#4f86e8" />
      <RoleMention color="#3fa463" label="Moderator" />
    </div>
  );
}
