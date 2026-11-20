import React from "react";
import { ModelPicker } from "../../../src";

export const meta = {
  name: "ModelPicker",
  file: "patterns/ModelPicker.tsx",
  about: "",
  wide: false,
  order: 10,
};

function ModelPickerDemo() {
  const [model, setModel] = React.useState("sonnet");
  const [effort, setEffort] = React.useState("medium");
  const models = [
    { value: "opus", label: "Opus 5.5", efforts: ["low", "medium", "high"] },
    { value: "sonnet", label: "Sonnet 5.5", efforts: ["low", "medium", "high"] },
    { value: "haiku", label: "Haiku 5.5", efforts: [] },
  ];
  const current = models.find((item) => item.value === model)!;
  return (
    <ModelPicker
      label="Model"
      models={models}
      value={model}
      shown={current.label}
      effort={effort}
      efforts={current.efforts}
      effortFor={() => effort}
      effortLabel={(level) => level[0].toUpperCase() + level.slice(1)}
      onPick={(value, level) => {
        setModel(value);
        setEffort(level);
      }}
      onEffort={setEffort}
    />
  );
}

export default function Example() {
  return <ModelPickerDemo />;
}
