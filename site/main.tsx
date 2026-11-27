import React from "react";
import { createRoot } from "react-dom/client";
import { ArrowLeft, ArrowRight, BookOpen, Moon, Palette, Sun } from "lucide-react";

import "./docs.css";

import {
  Mark,
  Button,
  Checkbox,
  CodeBlock,
  ErrorState,
  IconButton,
  InlineLink,
  MistyMark,
  NavGroupHeading,
  NavList,
  NavRow,
  NavRowLabel,
  NoticeViewport,
  NumberedList,
  PaneLoading,
  Pressable,
  SearchField,
  Surface,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Text,
  Textarea,
  TextCaret,
  TooltipProvider,
  notify,
} from "../src";

import { allExamples, groups, type Example, type PropDoc } from "./content";
import { guidanceFor, principles } from "./guidance";

const repository = "https://github.com/misty-org/misty-ui";

function useRoute(): string {
  const read = () => window.location.hash.replace(/^#\/?/, "");
  const [route, setRoute] = React.useState(read);
  React.useEffect(() => {
    const onHash = () => {
      setRoute(read());
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  return route;
}

const go = (route: string) => {
  window.location.hash = `/${route}`;
};

function Inline({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, index) =>
        part.startsWith("`") ? (
          <code key={index} className="rounded-sm bg-control-hover px-1 font-mono text-[0.9em] text-tone-teal">
            {part.slice(1, -1)}
          </code>
        ) : part.startsWith("**") ? (
          <strong key={index} className="font-semibold text-cream-bright">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <React.Fragment key={index}>{part}</React.Fragment>
        ),
      )}
    </>
  );
}

class Boundary extends React.Component<{ children: React.ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <Text size="meta" tone="danger" wrap>
          Couldn't render: {this.state.error.message}
        </Text>
      );
    }
    return this.props.children;
  }
}

class LoadBoundary extends React.Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed) {
      return (
        <ErrorState
          inline
          title="Couldn't load this component"
          action={{ label: "Try again", onClick: () => this.setState({ failed: false }) }}
        />
      );
    }
    return this.props.children;
  }
}

type Review = { dislike: boolean; note: string };
const marksKey = "misty-ui-docs-marks";

function readMarks(): Record<string, Review> {
  try {
    return JSON.parse(localStorage.getItem(marksKey) ?? "{}") as Record<string, Review>;
  } catch {
    return {};
  }
}

function useMarks() {
  const [marks, setMarks] = React.useState(readMarks);
  const set = (id: string, mark: Review) =>
    setMarks((current) => {
      const next = { ...current, [id]: mark };
      try {
        localStorage.setItem(marksKey, JSON.stringify(next));
      } catch {
      }
      return next;
    });
  return { marks, set };
}

async function copyMarks(marks: Record<string, Review>) {
  const lines = allExamples
    .filter((example) => marks[example.id]?.dislike)
    .map((example) => {
      const note = marks[example.id]?.note.trim();
      return `- ${example.name} (${example.file})${note ? `: ${note}` : ""}`;
    });
  try {
    await navigator.clipboard.writeText(lines.join("\n") || "Nothing marked.");
    notify({ message: `Copied ${lines.length} marked` });
  } catch {
    notify({ message: "The clipboard refused", tone: "error" });
  }
}

function Sidebar(props: { route: string }) {
  const [query, setQuery] = React.useState("");
  const needle = query.trim().toLowerCase();
  return (
    <Surface
      as="aside"
      tone="sidebar"
      className="grid content-start gap-3 overflow-y-auto p-3 md:sticky md:top-0 md:h-screen"
    >
      <Pressable onClick={() => go("")} className="flex items-center gap-2 px-2 py-1 text-left text-cream-bright">
        <MistyMark size={20} />
        <Text size="control" weight="semibold" tone="bright">
          Misty UI
        </Text>
      </Pressable>
      <SearchField
        aria-label="Find a component"
        placeholder="Find a component"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onClear={() => setQuery("")}
      />
      {needle ? null : (
        <NavList>
          <NavRow current={props.route === ""} onClick={() => go("")}>
            <BookOpen />
            <NavRowLabel bright={props.route === ""}>Getting started</NavRowLabel>
          </NavRow>
          <NavRow current={props.route === "tokens"} onClick={() => go("tokens")}>
            <Palette />
            <NavRowLabel bright={props.route === "tokens"}>Tokens</NavRowLabel>
          </NavRow>
        </NavList>
      )}
      {groups.map((group) => {
        const shown = group.examples.filter(
          (example) => !needle || example.name.toLowerCase().includes(needle),
        );
        if (!shown.length) return null;
        return (
          <div key={group.id} className="grid gap-1">
            <NavGroupHeading name={group.title} />
            <NavList>
              {shown.map((example) => (
                <NavRow
                  key={example.id}
                  current={props.route === example.id}
                  onClick={() => go(example.id)}
                >
                  <NavRowLabel bright={props.route === example.id}>{example.title}</NavRowLabel>
                </NavRow>
              ))}
            </NavList>
          </div>
        );
      })}
    </Surface>
  );
}

function Section(props: { title: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-3">
      <Text as="h2" size="title" weight="semibold" tone="bright">
        {props.title}
      </Text>
      {props.children}
    </section>
  );
}

function HomePage() {
  return (
    <div className="grid gap-10">
      <div className="grid gap-2">
        <Text as="h1" size="display" weight="semibold" tone="bright">
          Misty UI
        </Text>
        <Text size="page" tone="muted" wrap>
          Misty's components and design system. Misty, its website and the apps people build for
          Misty all use it, so everything looks like one product.
        </Text>
      </div>
      <Section title="Install">
        <CodeBlock language="bash" code="npm install @misty/ui lucide-react" />
        <Text size="body" tone="muted" wrap>
          Add the styles to your Tailwind entry, right after Tailwind itself:
        </Text>
        <CodeBlock language="css" code={'@import "tailwindcss";\n@import "@misty/ui/styles.css";'} />
        <Text size="body" tone="muted" wrap>
          Then import components from the package, never a subfolder:
        </Text>
        <CodeBlock
          language="tsx"
          code={
            'import { Button, TooltipProvider } from "@misty/ui";\n\n' +
            "export function App() {\n" +
            "  return (\n" +
            "    <TooltipProvider>\n" +
            '      <Button variant="primary">New chat</Button>\n' +
            "    </TooltipProvider>\n" +
            "  );\n" +
            "}"
          }
        />
      </Section>
      <Section title="Before you build">
        <NumberedList items={principles.map((item) => item.replace(/\*\*|`/g, ""))} />
      </Section>
      <Section title="Theme">
        <Text size="body" tone="muted" wrap>
          Dark is the default. Put <Inline text={'`data-theme="light"`'} /> on <Inline text="`<html>`" />{" "}
          and every token takes its light value.
        </Text>
      </Section>
    </div>
  );
}

const colorTokens = [
  ["Window", "--misty-theme-workspace"],
  ["Page", "--misty-theme-bg"],
  ["Sidebar", "--misty-theme-sidebar"],
  ["Card", "--misty-theme-card"],
  ["Edge", "--misty-theme-border"],
  ["Field edge", "--misty-theme-border-strong"],
  ["Hover", "--misty-theme-hover"],
  ["Selected", "--misty-theme-active"],
  ["Text", "--misty-theme-text"],
  ["Bright text", "--misty-theme-text-bright"],
  ["Muted text", "--misty-theme-text-muted"],
  ["Danger", "--misty-theme-danger"],
  ["Working", "--tone-working"],
  ["Waiting", "--tone-waiting"],
  ["Failed", "--tone-failed"],
  ["Done", "--tone-done"],
] as const;

const typeRoles = [
  ["display", "24", "Empty-state and hero titles"],
  ["title", "18", "Titles"],
  ["page", "16", "Page text, reading"],
  ["body", "15", "Messages, notes, prose"],
  ["control", "14", "Every button, field, menu row, tab and list row"],
  ["meta", "13", "Times, counts, descriptions under a label"],
  ["caption", "12", "Badges, shortcut text"],
] as const;

function TokensPage() {
  return (
    <div className="grid gap-10">
      <div className="grid gap-2">
        <Text as="h1" size="display" weight="semibold" tone="bright">
          Tokens
        </Text>
        <Text size="page" tone="muted" wrap>
          Defined in styles/theme.css. Components reach them for you; an app never picks its own.
        </Text>
      </div>
      <Section title="Color">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-3">
          {colorTokens.map(([label, token]) => (
            <div key={token} className="grid gap-1.5">
              <div
                className="h-12 rounded-lg outline outline-[var(--hairline)] outline-[var(--misty-theme-border)]"
                style={{ background: `var(${token})` }}
              />
              <Text size="control">{label}</Text>
              <Text size="caption" tone="muted">
                {token}
              </Text>
            </div>
          ))}
        </div>
      </Section>
      <Section title="Type">
        <div className="grid gap-3">
          {typeRoles.map(([role, size, use]) => (
            <div key={role} className="grid gap-0.5">
              <Text size={role}>The quick brown fox</Text>
              <Text size="meta" tone="muted">
                {role} · {size}px · {use}
              </Text>
            </div>
          ))}
        </div>
      </Section>
      <Section title="Corners">
        <div className="flex flex-wrap gap-4">
          {(
            [
              ["sm", "4", "marks inside rows"],
              ["md", "7", "controls and rows"],
              ["lg", "9", "fields and menus"],
              ["xl", "12", "panels and dialogs"],
            ] as const
          ).map(([radius, size, use]) => (
            <div key={radius} className="grid justify-items-start gap-1.5">
              <Surface tone="card" edge="strong" radius={radius} className="size-16" />
              <Text size="meta" tone="muted">
                {radius} · {size}px · {use}
              </Text>
            </div>
          ))}
        </div>
      </Section>
      <Section title="Spacing">
        <div className="grid gap-2">
          {[1, 2, 3, 4, 6, 8, 12].map((step) => (
            <div key={step} className="flex items-center gap-3">
              <Surface tone="active" className="h-3" style={{ width: `calc(var(--spacing) * ${step})` }} />
              <Text size="meta" tone="muted">
                {step} · {step * 4}px
              </Text>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

function PropsTable({ name, rows }: { name: string; rows: PropDoc[] | undefined }) {
  if (!rows?.length) return null;
  return (
    <div className="grid gap-2">
      <Text size="control" weight="semibold" tone="bright">
        {name}
      </Text>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Prop</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>What it does</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.name}>
              <TableCell className="align-top">
                <code className="font-mono text-meta text-tone-teal">
                  {row.name}
                  {row.optional ? "?" : ""}
                </code>
              </TableCell>
              <TableCell className="align-top">
                <code className="font-mono text-meta text-tone-violet">{row.type}</code>
              </TableCell>
              <TableCell className="align-top">
                <Text size="meta" tone="muted" wrap>
                  {row.doc}
                </Text>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function ComponentPage(props: { example: Example; mark: Review; onMark(mark: Review): void }) {
  const { example, mark, onMark } = props;
  const index = allExamples.indexOf(example);
  const previous = allExamples[index - 1];
  const next = allExamples[index + 1];
  return (
    <div className="grid gap-8">
      <div className="grid gap-2">
        <div className="flex items-start gap-3">
          <Text as="h1" size="display" weight="semibold" tone="bright" className="min-w-0 flex-1">
            {example.title}
          </Text>
          {import.meta.env.DEV ? (
            <label className="flex shrink-0 items-center gap-2 pt-2">
              <Checkbox
                checked={mark.dislike}
                onCheckedChange={(checked) => onMark({ ...mark, dislike: checked === true })}
              />
              <Text size="meta" tone={mark.dislike ? "danger" : "muted"}>
                Don't like
              </Text>
            </label>
          ) : null}
        </div>
        {example.components.length > 1 ? (
          <Text size="meta" tone="muted" wrap>
            With {example.components.slice(1).join(", ")}
          </Text>
        ) : null}
        {example.about ? (
          <Text size="body" tone="muted" wrap>
            {example.about}
          </Text>
        ) : null}
        <Text size="meta" tone="muted">
          <InlineLink asChild>
            <a href={`${repository}/blob/main/src/${example.file.split(" · ")[0]}`}>src/{example.file}</a>
          </InlineLink>
        </Text>
      </div>
      {import.meta.env.DEV && mark.dislike ? (
        <Textarea
          aria-label={`What's wrong with ${example.title}`}
          placeholder="What's wrong with it?"
          value={mark.note}
          onChange={(event) => onMark({ ...mark, note: event.target.value })}
        />
      ) : null}
      <LoadBoundary key={example.id}>
        <React.Suspense fallback={<PaneLoading inline label={`Loading ${example.title}`} />}>
          <ComponentDetails example={example} />
        </React.Suspense>
      </LoadBoundary>
      <div className="flex justify-between gap-3">
        {previous ? (
          <Button variant="quiet" icon={ArrowLeft} onClick={() => go(previous.id)}>
            {previous.title}
          </Button>
        ) : (
          <span />
        )}
        {next ? (
          <Button variant="quiet" iconEnd={ArrowRight} onClick={() => go(next.id)}>
            {next.title}
          </Button>
        ) : null}
      </div>
    </div>
  );
}

function ComponentDetails({ example }: { example: Example }) {
  const { Component: Preview, code, props } = React.use(example.load());
  const guidance = guidanceFor(example.components);
  const withProps = example.components.filter((name) => (props[name]?.length ?? 0) > 0);
  return (
    <>
      <Surface tone="page" edge="hairline" radius="xl" className="relative min-w-0 p-6">
        <Boundary key={example.id}>
          <Preview />
        </Boundary>
      </Surface>
      {guidance.length ? (
        <Section title="When to use it">
          <div className="grid gap-3">
            {guidance.map((row) => (
              <div key={row.job} className="grid gap-1">
                <Text size="body" weight="medium" wrap>
                  {row.job}
                </Text>
                <Text size="meta" tone="muted" wrap>
                  Use <Inline text={row.use} />
                </Text>
                <Text size="meta" tone="muted" wrap>
                  Not <Inline text={row.not} />
                </Text>
              </div>
            ))}
          </div>
        </Section>
      ) : null}
      <Section title="Code">
        <CodeBlock language="tsx" code={code} />
      </Section>
      {withProps.length ? (
        <Section title="Props">
          <div className="grid gap-6">
            {withProps.map((name) => (
              <PropsTable key={name} name={name} rows={props[name]} />
            ))}
          </div>
        </Section>
      ) : null}
    </>
  );
}

function Docs() {
  const route = useRoute();
  const { marks, set } = useMarks();
  const [light, setLight] = React.useState(false);
  React.useEffect(() => {
    document.documentElement.dataset.theme = light ? "light" : "dark";
  }, [light]);

  const example = allExamples.find((item) => item.id === route);
  const marked = Object.values(marks).filter((mark) => mark.dislike).length;

  return (
    <div className="grid min-h-screen md:grid-cols-[16rem_minmax(0,1fr)]">
      <Sidebar route={route} />
      <div className="grid min-w-0 content-start">
        <Surface tone="page" className="sticky top-0 z-[var(--stack-sticky)] flex items-center justify-end gap-2 px-6 py-2">
          {import.meta.env.DEV ? (
            <Button variant="quiet" onClick={() => void copyMarks(marks)}>
              Copy feedback ({marked})
            </Button>
          ) : null}
          <IconButton label={light ? "Dark theme" : "Light theme"} onClick={() => setLight(!light)}>
            {light ? <Moon /> : <Sun />}
          </IconButton>
          <IconButton label="Source on GitHub" asChild>
            <a href={repository}>
              <Mark of="github" label="GitHub" />
            </a>
          </IconButton>
        </Surface>
        <main className="mx-auto w-full max-w-5xl px-6 pt-4 pb-24">
          {route === "tokens" ? (
            <TokensPage />
          ) : example ? (
            <ComponentPage
              example={example}
              mark={marks[example.id] ?? { dislike: false, note: "" }}
              onMark={(mark) => set(example.id, mark)}
            />
          ) : (
            <HomePage />
          )}
        </main>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <TooltipProvider>
    <Docs />
    <NoticeViewport />
    <TextCaret />
  </TooltipProvider>,
);
