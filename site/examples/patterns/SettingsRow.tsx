import React from "react";
import {
  ChoiceGroup,
  OptionSelect,
  RowGroupStack,
  SettingsRow,
  SettingsSection,
  Switch,
} from "../../../src";

export const meta = {
  name: "SettingsSection · SettingsRow",
  file: "patterns/SettingsRow.tsx",
  about: "A settings page's sections: a label over one group of 45px rows.",
  wide: false,
  order: 41,
};

export default function Example() {
  const [reopen, setReopen] = React.useState(false);
  const [open, setOpen] = React.useState("dms");
  const [theme, setTheme] = React.useState("dark");
  return (
    <RowGroupStack className="max-w-2xl">
      <SettingsSection title="Startup">
        <SettingsRow label="Launch on login">
          <Switch aria-label="Launch on login" defaultChecked />
        </SettingsRow>
        <SettingsRow label="Reopen last session">
          <Switch aria-label="Reopen last session" checked={reopen} onCheckedChange={setReopen} />
        </SettingsRow>
        <SettingsRow label="Otherwise open" sub disabled={reopen}>
          <OptionSelect
            aria-label="Otherwise open"
            value={open}
            onValueChange={setOpen}
            disabled={reopen}
            options={[
              { value: "dms", label: "Direct messages" },
              { value: "files", label: "Files" },
            ]}
          />
        </SettingsRow>
      </SettingsSection>
      <SettingsSection title="Window">
        <SettingsRow label="Theme">
          <ChoiceGroup
            label="Theme"
            value={theme}
            onChange={setTheme}
            options={[
              { value: "light", label: "Light" },
              { value: "dark", label: "Dark" },
              { value: "system", label: "System" },
            ]}
          />
        </SettingsRow>
        <SettingsRow
          label="Keep running when closed"
          description="Space drives stay in sync while Misty is in the menu bar."
        >
          <Switch aria-label="Keep running when closed" defaultChecked />
        </SettingsRow>
      </SettingsSection>
    </RowGroupStack>
  );
}
