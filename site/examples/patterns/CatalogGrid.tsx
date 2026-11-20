import { Globe, Plus, Trash2 } from "lucide-react";
import {
  Button,
  CatalogCard,
  CatalogDone,
  CatalogGrid,
  CatalogNames,
  CatalogTile,
  CatalogTileRow,
  LogoTile,
  MenuItem,
  Text,
} from "../../../src";

export const meta = {
  name: "CatalogGrid · CatalogCard · LogoTile · CatalogDone · CatalogTileRow · CatalogTile · CatalogNames",
  file: "patterns/CatalogCard.tsx",
  about: "What the Explore page should be built from.",
  wide: true,
  order: 0,
};

function Logo(props: { name: string }) {
  return (
    <LogoTile>
      <Text size="title" weight="semibold">
        {props.name[0]}
      </Text>
    </LogoTile>
  );
}

const catalog = [
  {
    title: "Anthropologist",
    maker: "agency-agents",
    tag: "Academic",
    description:
      "Expert in cultural systems, rituals, kinship and ethnographic method: builds societies that feel lived-in.",
  },
  {
    title: "UI Designer",
    maker: "agency-agents",
    tag: "Design",
    description: "Visual design systems, component libraries and pixel-perfect interfaces.",
  },
  {
    title: "Statistician",
    maker: "agency-agents",
    tag: "Academic",
    description: "Quantitative research methods, experimental design and statistical inference.",
  },
];

function CatalogDemo() {
  return (
    <div className="grid gap-4">
      <CatalogTileRow label="Added">
        <CatalogTile
          logo={<Logo name="Historian" />}
          title="Historian"
          line="In Research"
          menu={<MenuItem icon={Trash2} label="Remove" danger />}
        />
        <CatalogTile logo={<Logo name="Psychologist" />} title="Psychologist" line="In 2 Spaces" />
      </CatalogTileRow>
      <CatalogGrid label="Personas">
        {catalog.map((item, index) => (
          <CatalogCard
            key={item.title}
            logo={<Logo name={item.title} />}
            title={item.title}
            maker={item.maker}
            description={item.description}
            tag={item.tag}
            detail="12k uses"
            source={{ label: "msitarzewski/agency-agents", href: "#", onOpen: () => undefined }}
            action={index === 0 ? <CatalogDone label="Added" /> : <Button icon={Plus}>Add</Button>}
            menu={<MenuItem icon={Globe} label="View source" />}
            onOpen={() => undefined}
          />
        ))}
      </CatalogGrid>
      <CatalogNames
        names={["brainstorming", "writing-plans", "test-driven-development", "debugging", "code-review"]}
      />
    </div>
  );
}

export default function Example() {
  return <CatalogDemo />;
}
