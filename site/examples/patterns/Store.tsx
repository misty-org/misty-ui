import {
  AppLogoImage,
  Button,
  LetterTile,
  LogoTile,
  Mark,
  ProgressPill,
  StoreCard,
  StoreCards,
  StoreList,
  StoreRow,
  StoreSection,
  StoreTile,
  StoreTiles,
} from "../../../src";

export const meta = {
  name: "StoreSection · StoreList · StoreTiles · StoreCards",
  file: "patterns/Store.tsx",
  about:
    "Explore's sections: apps as big tiles, things to add as compact rows with their maker, engines and speech as cards with their state in words.",
  wide: true,
  order: 0,
};

const seeAll = (
  <Button variant="quiet" size="sm">
    See all
  </Button>
);

export default function Example() {
  return (
    <div className="grid gap-9">
      <StoreSection title="Apps" action={seeAll}>
        <StoreTiles>
          <StoreTile
            logo={<AppLogoImage name="Sketch" size="card" />}
            title="Sketch"
            line="Hand-drawn style whiteboard"
            action={
              <Button variant="get" size="sm">
                Get
              </Button>
            }
            onOpen={() => undefined}
          />
          <StoreTile
            logo={<AppLogoImage name="Decks" size="card" />}
            title="Decks"
            line="Slide presentations and delivery"
            action={<Button size="sm">Open</Button>}
            onOpen={() => undefined}
          />
          <StoreTile
            logo={<AppLogoImage name="Sound" size="card" />}
            title="Sound"
            line="Open-source chiptune sequencer"
            action={
              <Button variant="get" size="sm">
                Update
              </Button>
            }
            onOpen={() => undefined}
          />
          <StoreTile
            logo={<AppLogoImage name="Draft" size="card" />}
            title="Draft"
            line="Open-source CAD and drafting"
            action={
              <Button variant="get" size="sm">
                Get
              </Button>
            }
            onOpen={() => undefined}
          />
        </StoreTiles>
      </StoreSection>
      <StoreSection title="Popular skills" action={seeAll}>
        <StoreList>
          {["A/B test statistics", "Accessibility testing", "API tester"].map((name) => (
            <StoreRow
              key={name}
              logo={
                <LogoTile size="item">
                  <LetterTile name={name} />
                </LogoTile>
              }
              title={name}
              line="Plans and reads tests"
              maker="wshobson"
              action={
                <Button variant="get" size="sm">
                  Get
                </Button>
              }
              onOpen={() => undefined}
            />
          ))}
        </StoreList>
      </StoreSection>
      <StoreSection title="On this computer" detail="3 engines">
        <StoreCards>
          <StoreCard
            logo={
              <LogoTile size="item">
                <Mark of="engine:claude" label="Claude Code" size={36} />
              </LogoTile>
            }
            title="Claude Code"
            state="on"
            line="Signed in, by Anthropic"
            onOpen={() => undefined}
          />
          <StoreCard
            logo={
              <LogoTile size="item">
                <Mark of="engine:codex" label="Codex" size={36} />
              </LogoTile>
            }
            title="Codex"
            state="on"
            line="Signed in, by OpenAI"
            action={
              <Button variant="get" size="sm">
                Update
              </Button>
            }
            onOpen={() => undefined}
          />
          <StoreCard
            logo={
              <LogoTile size="item">
                <Mark of="engine:gemini" label="Gemini CLI" size={36} />
              </LogoTile>
            }
            title="Gemini CLI"
            state="off"
            line="Signed out, by Google"
            action={<Button size="sm">Sign in</Button>}
            onOpen={() => undefined}
          />
          <StoreCard
            logo={<AppLogoImage name="Voicebox" size="item" />}
            title="Voicebox"
            line="Voices, 212 MB"
            action={
              <ProgressPill value={0.43} label="Downloading Voicebox" size="sm" widthOf={["Get"]} />
            }
            onOpen={() => undefined}
          />
        </StoreCards>
      </StoreSection>
    </div>
  );
}
