import { ExternalLink } from "lucide-react";
import React from "react";
import {
  Button,
  CatalogNames,
  LetterTile,
  LogoTile,
  MenuItem,
  SettingsRow,
  SettingsSection,
  StoreSheet,
  StoreSheetSection,
  Text,
} from "../../../src";

export const meta = {
  name: "StoreSheet · StoreSheetSection",
  file: "patterns/StoreSheet.tsx",
  about:
    "A store item's details in one card dialog: the hero with its one action, a strip of facts, then its description, what's inside and what is set up here.",
  wide: false,
  order: 0,
};

export default function Example() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open details</Button>
      <StoreSheet
        open={open}
        onOpenChange={setOpen}
        logo={
          <LogoTile size="sheet">
            <LetterTile name="Code review" size="hero" />
          </LogoTile>
        }
        title="Code review"
        maker="wshobson"
        action={<Button variant="get">Get</Button>}
        menu={<MenuItem icon={ExternalLink} label="Open its source" />}
        facts={[
          { label: "Version", value: "Commit 2c57eb1" },
          { label: "Size", value: "42 KB" },
          { label: "License", value: "MIT" },
          { label: "Source", value: "GitHub" },
        ]}
      >
        <Text as="p" size="body" wrap className="m-0">
          Reviews a change end to end: what it does, what it breaks and what it forgot.
        </Text>
        <StoreSheetSection title="What's inside">
          <CatalogNames names={["3 skills", "2 commands", "1 MCP server"]} />
        </StoreSheetSection>
        <SettingsSection title="On your engines">
          <SettingsRow label="Claude Code" description="Installed as the engine's own plugin" />
        </SettingsSection>
        <div>
          <Button variant="danger">Remove</Button>
        </div>
      </StoreSheet>
    </>
  );
}
