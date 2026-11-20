import { Download } from "lucide-react";
import { Button, HeroPage } from "../../../src";

export const meta = { name: "HeroPage", file: "patterns/HeroPage.tsx", about: "", wide: true, order: 23 };

export default function Example() {
  return (
    <div className="h-96 overflow-hidden rounded-lg border border-charcoal-border">
      <HeroPage
        title="Welcome to Misty"
        tagline="Your agents, organized into Spaces."
        actions={
          <>
            <Button variant="primary" size="lg">
              Get started
            </Button>
            <Button variant="quiet" size="lg" icon={Download}>
              Import
            </Button>
          </>
        }
        legal="By continuing you agree to the terms."
      />
    </div>
  );
}
