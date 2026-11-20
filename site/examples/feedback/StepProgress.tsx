import { StepProgress } from "../../../src";

export const meta = {
  name: "StepProgress",
  file: "feedback/StepProgress.tsx",
  about: "",
  wide: false,
  order: 9,
};

export default function Example() {
  return <StepProgress steps={4} current={2} label="Setup" className="w-48" />;
}
