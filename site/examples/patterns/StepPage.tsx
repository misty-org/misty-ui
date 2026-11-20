import { Button, StepPage, Text } from "../../../src";

export const meta = { name: "StepPage", file: "patterns/StepPage.tsx", about: "", wide: true, order: 22 };

export default function Example() {
  return (
    <div className="h-96 overflow-hidden rounded-lg border border-charcoal-border">
      <StepPage
        label="Setup"
        steps={3}
        current={1}
        onBack={() => undefined}
        title="Pick your default agent"
        actions={
          <Button variant="primary" size="lg">
            Continue
          </Button>
        }
      >
        <Text size="page" tone="muted">
          It does Misty's own work: the Lab, Tutor and reading pages.
        </Text>
      </StepPage>
    </div>
  );
}
