import { Plus, Trash2 } from "lucide-react";
import { Button, Text } from "../../../src";

export const meta = {
  name: "Button",
  file: "controls/Button.tsx",
  about: "Four roles × three sizes, with icons, disabled.",
  wide: true,
  order: 0,
};

const row = "flex flex-wrap items-center gap-3";

const column = "grid gap-3";

export default function Example() {
  return (
    <div className={column}>
      {(["primary", "secondary", "quiet", "danger"] as const).map((variant) => (
        <div key={variant} className={row}>
          <Text size="meta" tone="muted" className="w-20">
            {variant}
          </Text>
          <Button variant={variant} size="sm">
            Small
          </Button>
          <Button variant={variant}>Medium</Button>
          <Button variant={variant} size="lg">
            Large
          </Button>
          <Button variant={variant} icon={variant === "danger" ? Trash2 : Plus}>
            With icon
          </Button>
          <Button variant={variant} disabled>
            Disabled
          </Button>
        </div>
      ))}
      <div className={row}>
        <Text size="meta" tone="muted" className="w-20">
          caption
        </Text>
        <Button caption="in 10 minutes">Again</Button>
        <Button caption="tomorrow">Good</Button>
        <Button caption="in 4 days">Easy</Button>
      </div>
    </div>
  );
}
