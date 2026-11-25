import { Blocks, Cable, ScrollText, SquareSlash, Users } from "lucide-react";
import React from "react";
import {
  BackButton,
  Button,
  LogoTile,
  MenuItem,
  ProductBar,
  ProductInfo,
  ProductPage,
  ProductSection,
  ProductTile,
  ProductTiles,
  SettingsRow,
  SettingsSection,
  Switch,
  Text,
} from "../../../src";

export const meta = {
  name: "ProductPage · ProductBar · ProductSection",
  file: "patterns/ProductPage.tsx",
  about: "A store item's own page, as the App Store's: hero, facts, Manage, About, what's inside and information.",
  wide: true,
  order: 0,
};

export default function Example() {
  const [pinned, setPinned] = React.useState(false);
  const [on, setOn] = React.useState(true);
  const action = <Button size="md">Manage</Button>;
  return (
    <div className="grid gap-6">
      <ProductBar back={<BackButton />} title="Claude mem" action={action} pinned={pinned} />
      <ProductPage
        logo={<LogoTile size="hero"><Blocks /></LogoTile>}
        title="Claude mem"
        line="Persistent memory: the next session starts where the last one left off."
        maker="thedotmack"
        onMaker={() => undefined}
        action={action}
        menu={<MenuItem label="Open its repository" />}
        facts={[
          { label: "Stars", value: "119k", detail: "On GitHub" },
          { label: "Category", value: "Development" },
          { label: "Adds", value: "30", detail: "Skills, agents, commands" },
          { label: "License", value: "Apache-2.0" },
        ]}
        onHeroOut={setPinned}
      >
        <ProductSection title="Manage">
          <SettingsSection>
            <SettingsRow label="Claude Code">
              <Switch checked={on} onCheckedChange={setOn} aria-label="Claude Code" />
            </SettingsRow>
            <SettingsRow label="Remove from every engine">
              <Button variant="danger" size="sm">Remove</Button>
            </SettingsRow>
          </SettingsSection>
        </ProductSection>
        <ProductSection title="About">
          <Text as="p" size="body" wrap className="m-0">
            Persistent memory for Claude Code: the next session starts where the last one left off.
          </Text>
        </ProductSection>
        <ProductSection title="What's inside">
          <ProductTiles>
            <ProductTile icon={ScrollText} value={30} label="Skills" />
            <ProductTile icon={Users} value={0} label="Agents" />
            <ProductTile icon={SquareSlash} value={0} label="Commands" />
            <ProductTile icon={Cable} value="Yes" label="MCP server" />
          </ProductTiles>
        </ProductSection>
        <ProductSection title="Information">
          <ProductInfo
            items={[
              { label: "Made by", value: "thedotmack" },
              { label: "Source", value: "thedotmack/claude-mem" },
              { label: "Pinned at", value: "Commit 2c57eb1" },
            ]}
          />
        </ProductSection>
      </ProductPage>
    </div>
  );
}
