import { PenTool, Server, ShieldCheck } from "lucide-react";
import { PersonaLogo, personaTone } from "../../../src";

export const meta = { name: "PersonaLogo", file: "icons/PersonaLogo.tsx", about: "", wide: false, order: 24 };

export default function Example() {
  return (
    <div className="flex items-end gap-4">
      <PersonaLogo icon={PenTool} color={personaTone("ui-designer")} size="tile" />
      <PersonaLogo icon={Server} color={personaTone("backend-architect")} size="card" />
      <PersonaLogo icon={ShieldCheck} color={personaTone("security-engineer")} size="row" />
    </div>
  );
}
