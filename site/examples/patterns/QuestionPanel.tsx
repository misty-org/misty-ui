import React from "react";
import { Button, ChoiceList, QuestionPanel } from "../../../src";

export const meta = {
  name: "QuestionPanel",
  file: "patterns/QuestionPanel.tsx",
  about: "",
  wide: false,
  order: 12,
};

function QuestionDemo() {
  const [pick, setPick] = React.useState(["main"]);
  return (
    <QuestionPanel
      label="Question from the agent"
      title="Which branch should I work on?"
      actions={
        <>
          <Button variant="quiet">Skip</Button>
          <Button variant="primary">Answer</Button>
        </>
      }
    >
      <ChoiceList
        label="Branch"
        selected={pick}
        onSelect={(value) => setPick([value])}
        options={[
          { value: "main", label: "main" },
          { value: "design", label: "design-system" },
        ]}
      />
    </QuestionPanel>
  );
}

export default function Example() {
  return <QuestionDemo />;
}
