import React from "react";
import { Slider } from "../../../src";

export const meta = { name: "Slider", file: "controls/Slider.tsx", about: "", wide: false, order: 25 };

function SliderDemo() {
  const [value, setValue] = React.useState([40]);
  return <Slider aria-label="Volume" value={value} onValueChange={setValue} max={100} step={1} />;
}

export default function Example() {
  return <SliderDemo />;
}
