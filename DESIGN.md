# Misty design system

The one source of truth for how Misty looks and behaves, and for everything built with `@misty/ui`: Misty itself,
its website, and the apps people make for Misty. Two companions go with it:

- [docs/components.md](docs/components.md): every export of `@misty/ui` and what it is for, generated from the
  code. If a component isn't there, it doesn't exist.
- Misty's own repository adds `docs/design/rules.md`: the automated UI rules its tests hold Misty's code to,
  each with what to do instead.

The docs site (`npm run dev`, hosted at https://misty-org.github.io/misty-ui/) gives every component a page:
a live example, the code that draws it, its props (`docs/props.json`, read from the source) and its rows of
"Which piece for which job" below. Examples live in `site/examples/<group>/`, one file per component; locally
each page has a "Don't like" mark for review. `npm run catalog` regenerates the catalog and the props;
`tests/designCatalog.contract.test.ts` fails when the catalog is out of date.

## Using it

```bash
npm install @misty/ui lucide-react
```

```css
/* Your Tailwind entry */
@import "tailwindcss";
@import "@misty/ui/styles.css";
```

```tsx
import { Button, TooltipProvider } from "@misty/ui";
```

- Import everything from `@misty/ui`, never a subfolder. Never a raw `<button>`, `<input>` or `<select>`.
- Mount `TooltipProvider` once at the root, and `NoticeViewport` if you use `notify`.
- The theme is dark by default. `data-theme="light"` on `<html>` switches every token to light.
- What people choose for a collection (its view, its filters) is kept in localStorage. An app with its own
  settings store hands it in once at startup with `setUiStorage`.

## Before writing any UI

1. **Find the pieces.** Look the job up in the catalog and in "Which piece for which job" below. Use the
   component that does it, imported from `@misty/ui` only, never a subfolder.
2. **Read its source** the first time you use it. The props and the doc comment are the contract; don't guess a
   prop, a variant or a size.
3. **Missing a look?** Add it to `@misty/ui` first (a variant, a prop, a new component), with a doc comment
   that says what it is for, then use it, then run `npm run catalog`. Never build the look in the feature.
4. **Keep the page as it was.** The system governs the pieces, not the pages. A page's layout, hierarchy,
   sections, cards, icons and color are its own and change only when the person asks for that page to change.
   Moving a page onto shared components keeps it looking as it did.
5. **Don't invent.** No new colors, sizes, corners, shadows, fonts, spacing steps or motion. If this file and
   the catalog don't name it, it isn't part of Misty. Ask instead of improvising.

A feature never picks its own colors, borders, corners, sizes or spacing, and never adds a stylesheet. In
Misty, `src/tests/architecture/uiRules.ts` enforces this. Its baseline only shrinks: a rule that reaches zero is locked
there for good with no exceptions, and a new rule starts locked, so debt can't be recorded, only paid.
`tests/rowHeights.contract.test.tsx` renders the shared rows and checks every control in a row has the row's height.

## Tokens

All defined in `styles/theme.css`. Features reach them through shared components (`Text`, `Surface`,
`Pressable`), never as raw classes or hex.

### Color

Misty is neutral: charcoal on dark, cream on light, one coherent palette the Themes extension can swap.

| Role | Token | Use |
| --- | --- | --- |
| Window | `--misty-theme-workspace` (`window-chrome`) | The window around the pages; the same as the page, so the window reads as one sheet |
| Page | `--misty-theme-bg` (`pane`) | The pane every page sits on |
| Sidebar | `--misty-theme-sidebar` | The sidebar |
| Card | `--misty-theme-card` | Cards and raised surfaces (`Surface tone="card"`) |
| Edge | `--misty-theme-border` | Hairlines between rows and around cards |
| Field edge | `--misty-theme-border-strong` | Fields people type into or pick from |
| Text | `--misty-theme-text` / `-bright` / `-muted` | `Text tone="default" \| "bright" \| "muted"` |
| Danger | `--misty-theme-danger` | Only what deletes or has failed |
| Control wash | `--color-control-hover` / `-active` | A control's hover and press |
| Row wash | `--color-row-hover` / `-active` | A row's hover and the selected row; lighter, so lists stay quiet |
| Scrim | `--color-scrim` | Behind a dialog, sheet or workspace overlay only |

Color that carries meaning comes from the tones, never a new hex:

- **State** (`--tone-*`, `bg-state-*`): idle, working (blue), waiting on the person (amber), failed (red),
  done (green). An agent's state, a run, a Git change.
- **A Space's own color** (the tone its picture tile wears), washed faintly into its sidebar through
  `Surface tone="sidebar" place=…`. Only the sidebar's fill takes it: its rows, selection and text stay neutral,
  and Personal stays neutral.
- **Kind of file** (`--tone-code`, `-style`, `-data`, `-doc`, `-image`) through `itemTones.ts`.
- **Kind of made thing** (`--tint-*`): audio, video, report, cards… through `Surface`/`Text` `tint`.
- **Art** (`--color-art-*`): only for full-color art drawn over any theme (Tutor, pets, the desktop overlay).
- **Avatars** (`--color-avatar-*`): soft pastels assigned per person, behind dark ink.
- **Finder tags** (`--tone-tag-gray`, `-green`, `-purple`, `-blue`, `-yellow`, `-red`, `-orange`, Finder's 1 to 7):
  only through `TagDot` and `TagDots`.

Everything else in the interface is neutral. No pastel washes, highlighter strokes or colored chips to make a
page "less monochrome". Selection is the neutral row wash.

### Type

One font everywhere: Inter (bundled), system font only as fallback. Sizes come from roles, never `text-[Npx]`
and never Tailwind's `text-xs`…`text-3xl`:

| Role | Size | For |
| --- | --- | --- |
| `micro` | 12 | Rare: tiny counts |
| `caption` | 13 | Badges, shortcut text |
| `meta` | 14 | Times, counts, the path line, descriptions under a label |
| `control` | 15 | Every button, field, menu row, tab and list row |
| `body` | 16 | Messages, notes, prose |
| `page` | 17 | Page text, reading |
| `title` | 20 | Titles |
| `display` | 26 | Empty-state and hero titles |

The root font size is always 100% (16px), in every app, window and site: never set `html { font-size }` to a
percentage, and never scale the page to make the UI bigger or smaller. A size in rem is the size it says, and
the person's own page zoom is the only thing that scales Misty. To make the whole interface bigger or smaller,
change the type roles and the spacing step (`--spacing`) in `styles/theme.css`, never the root.

Use `<Text size=… tone=… weight=…>` (`bare` keeps the element's own layout). Weights: regular, medium,
semibold. Sentence case everywhere; capitals only for real acronyms. Monospace only inside code itself (code
blocks, the editor, diffs, the terminal), never for URLs, paths, IDs, model names or shortcuts.

### Size and spacing

- **Spacing** is one step, 4.5px (`--spacing`), and every size is a multiple of it (`gap-1` 4.5, `gap-2` 9,
  `p-4` 18…). No one-off pixel values.
- **Heights:** controls 27 (`sm`, `h-6`), 36 (`md`, `h-8`, the default) and 40.5 (`lg`, `h-9`, only in dialogs
  and empty states). A row is 36 (two-line rows grow). The top band is 54 (`--ui-header`, 12 steps); the bottom
  bar 36 (`--ui-bottom-bar`).
- **Corners:** 4 (`radius-sm`, marks and chips inside rows), 8 (`radius-md`, controls and rows), 10
  (`radius-lg`, fields and menus), 14 (`radius-xl`, panels, popups, dialogs, cards). No `rounded-full` on
  buttons: buttons keep their own shape. Only avatars are round.
- **Edges:** `var(--hairline)` or the `hairline-outline` utility, never `0.5px`. Popups use `popup-edge`, never
  ring, border or shadow.
- **Icons:** every glyph is 18px at one stroke (`styles/glyphs.css`). Icons take no `size`, `strokeWidth` or
  size class. The only larger icon is `PlaceholderIcon`, for a thumbnail, drop zone or empty state.
- **Depth** comes from faint edges and hairlines, never from a fill. The page, the window's tab row and
  bottom bar, a chat and its floating panels (side panels, side cards) are all the page's one color;
  only the sidebar is a color of its own. **No shadows anywhere.**
- **Layers:** z-order uses named layer tokens (`layers.css`, `--stack-*`), never a number.
- **Motion:** keyframes live in `styles/animations.css`, named for the motion. Popups keep the shared
  open/close motion.

## Which piece for which job

The everyday components, several of which have no doc comment in the catalog yet:

| Job | Use | Not |
| --- | --- | --- |
| Any button with a label | `Button` `variant` primary / secondary (default) / quiet / danger, `size` sm / md / lg, `icon`, `iconEnd` | A styled `<button>`, size or padding classes |
| An icon-only button | `IconButton` with `label` (its tooltip and accessible name), icon as children, size md (sm only for an inline closer) | `Button` with only an icon, `title=` |
| A clickable surface (a card, a tile) | `Pressable` / `Surface` with `wash` | Hover classes on a div |
| Text | `Text` (`size`, `tone`, `weight`, `wrap`) | Color or size classes |
| A background or edge | `Surface` (`tone`, `edge`, `radius`) | `bg-*` / `border-*` classes |
| Long single-line text | `OverflowFadeText` (built into `Text`, `ListRow`, `Button`) | `truncate`, an ellipsis |
| A field | `Input`, `Textarea`, `SearchField`, `SecretField`, `ShortcutField`, inside `Field` with `Label` | Raw `<input>` |
| One choice of a few, always answered | `ChoiceGroup` (segmented) | Hand-built tabs or chips |
| A short fixed choice in a form | `OptionSelect` / `Select` | A dropdown of buttons |
| A long, searchable choice | `SearchablePicker` | A custom popover list |
| On/off | `Switch` (settings), `Checkbox` (lists, multi-select) | A toggle button |
| Section tabs over a list | `FilterChip`s in a `CollectionFilters` / `ActionBar` | A free-wrapping chip row |
| Questions or notes that open under their heading (an FAQ, release notes, a docs sidebar group) | `Disclosure` (`kind` section or row) in a `DisclosureList` | An accordion of styled buttons |
| A tab strip | `TabStrip` | Buttons styled as tabs |
| A toolbar | `ActionBar` (gives way: labels → icons → fade → ⋯), groups split by `ToolbarDivider` | A flex row that wraps or scrolls |
| A list of things | `ListRow` (`label`, `description`, `badge`, `state`, `menu`, `trailing`); `TreeRow` for trees | Hand-built rows |
| A row's own buttons | `RowTools` (`reveal` hover / cover); a row's ⋯ is `RowActions` / `ListRow menu` | Stray icons beside the row |
| A menu of actions | `DropdownMenu` + `MenuTrigger` with `MenuItem`, `MenuCheckItem`, `MenuRadioItem`, `MenuSubmenu`; right-click is `ContextMenu` with the same items | A `Popover` listing actions, raw menu items |
| The place a sidebar lists (the Space's selector), opening its menu | `NavTitleButton` (`mark`, `name`) in a `DropdownMenuTrigger asChild`: avatar, name and chevron as one compact button, alone in its row; the place's actions (Invite people) live in its menu | A name button beside a separate boxed chevron |
| A popover | `Popover` kind `panel` (`PopoverHeader`, `PopoverText`, `PopoverBody`, `PopoverActions`), `list`, or `flush` (`PickerSearch`, `PickerList`, `Command`) | `className` on a popover |
| A dialog | `Dialog` (`DialogHeader`, `DialogTitle`, `DialogBody`, `DialogFooter`); deletes use `ConfirmDeleteDialog` / `useConfirmDelete`; renames `RenameItemDialog` | A fixed full-screen div |
| A full-page overlay | `WorkspaceOverlay` or `Sheet` | Custom portals |
| A tooltip | `Tooltip` (IconButton has one built in) | `title=` |
| A notice | `notify` (bottom right, at most one action, leaves on its own) | Inline "Saved" text |
| A file's sync state in a Space's drive | `StateMark` kinds `online-only` (cloud), `downloading` and `uploading` (the spinner), `not-synced` (crossed-out cloud), all muted; a grid card takes `sync` on its `CollectionItem`. A file in step shows no mark; a conflicting copy has no color of its own | A colored chip, a status word, the `online` (connected) kind |
| Someone's status on their face (a member, a DM, a friend) | `PresenceFace` (`presence` online, idle, dnd, offline; `working` and `waiting` for their agent) | A colored chip, a status word in the row |
| Switching between Personal and Spaces (the sidebar's top row) | `ChoiceGroup` (`track="well"`) with two `iconOnly` options: `spaceIcons.personal` for Personal, `spaceIcons.space` for Spaces, each with an `IndicatorDot` while something waits there | Two buttons, a tab strip |
| Who is in a voice channel, under its row in the sidebar | `VoicePerson` (`avatar` at xs, `name`, `speaking` rings the face in the done tone, `muted`) | A list of names, a colored chip |
| A call in full (a voice channel's page, a DM's call, full screen) | `CallStage` of `CallTile`s (`picture`, else `face`; `speaking`, `muted`; a shared screen as `focus`, `fit="contain"`), then a `CallBar` of IconButtons ending in a danger Leave; away from the call, `FloatingPip` | A grid of hand-made video boxes, a floating card of buttons |
| Who has a file open | `InUseMark` (`people`: at most three faces, then "+N", each named in its tooltip), at the row's end where its state goes | A list of names, a lock icon |
| Nothing here yet / failed | `EmptyState`, `ErrorState` | A custom centered block |
| First load of content you can draw before it arrives (rows, cards, settings rows, shelves, a tree) | A `Skeleton` shaped like it (`ListRowSkeleton`, `SkeletonList`, `CollectionSkeleton`, `ShelfSkeleton`) | "Loading…" text |
| First load whose layout depends on the data (a chat's messages, a thread, a document or file preview, a diff, an item's details) | `PaneLoading`, one spinner in the pane's middle; `inline` for one part of a loaded page | A skeleton guessing the shape, "Loading…" text |
| Work in progress | `Spinner` or `Progress` where the work happens | A spinner in a button |
| A documentation site (guides, SDK, design system) | `DocsLayout` in three panels: `DocsHeader` (sections as chips), the section's `NavList`, the article, `DocsToc` ("On this page") and a sticky `DocsPager`; only for a docs site | The app's page layouts, a hand-built sidebar and rail |
| A page's top band | `PageHeader` (pages), `ViewHeader` (views of a Space), `CollectionHeading` (collections) | A hand-made header |
| A browsable collection | `CollectionPage`, `CollectionHeading`, `CollectionFilters`, `CollectionSearch`, `CollectionViewToggle`, `CollectionSortMenu`, `CollectionFilterMenu`, `CollectionItems` | Custom bars |
| Finder's column view (Files) | `ColumnBrowser` (`columns` of `rows`, `selected`, `onSelect`, `onOpen`, `menu`, `preview` as the last column), switched to by `CollectionViewToggle`'s `columns` | Side-by-side lists, a tree squeezed into columns |
| Moving items by dragging them (files into folders) | `drag` on `CollectionItems` (items marked `dropTarget`) or `ColumnBrowser`: pointer dragging, ⌥ copies, the dragged items dim | HTML5 `draggable`, the native drag loop |
| An item's Finder tags | `TagDots` after its name (`CollectionItem` `marks`, `ColumnBrowserRow` `marks`); one tag's color in a menu is `TagDot`, named by `tagToneName` | Colored chips, a list of tag names in the row |
| A file's path whose folders open | `PathLine` with `onSelect` on each folder's segment | A row of buttons, a breadcrumb bar |
| A catalog of installables | `CatalogGrid` + `CatalogCard` (`logo`, `title`, `maker`, `description`, `tag`, `detail`, `action`, `menu`); what's already added is a `CatalogTileRow` of `CatalogTile`s | A long full-width list with per-row toggles |
| A store page's shelves (Explore) | `Shelf` + `ShelfItem` (`logo` at `tile`, `title`, `line`, one `action`, `menu`); featured picks are `FeatureCard`s in a `FeatureRow`, shown only with a banner; picking one opens `StoreDetail` | A grid of cards per section, a list with per-row toggles |
| A persona's logo | `PersonaLogo` (`icon` for what it does, `color` from `personaTone(id)`) | The catalog's emoji, a bare initial |
| A channel's messages (Space chat) | `ChannelMessage` with `ChannelMessageText`, `ChannelReply` over a reply, `ChannelReactions` of `ReactionChip`s, `ThreadRepliesButton`; days and unread with `ChannelDivider` | Hand-built message rows |
| Picking an emoji | `EmojiPicker`, handed the caller's emoji (`sections`, `search`) | A grid of styled buttons in a popover |
| A file waiting to go with a message | `ComposerAttachment` in the composer's `context` | A hand-made chip |
| Panes the person resizes | `SplitPanes` of `SplitPane`s with a `SplitHandle` between | react-resizable-panels directly |
| A command palette (⌘K) | `CommandPalette` holding `CommandPaletteInput`, `CommandPaletteList`, `CommandPaletteGroup`, `CommandPaletteItem` | cmdk directly |
| A subject's icon | `spaceIcons`, `appIcons`, `AppLogoImage` (an app's own icon), `EngineMark`, `MistyMark`, `BrandIcon` | A stand-in Lucide glyph or an emoji |

## Rules

### Layout

- The interface is quiet and mostly neutral and looks finished: flat panes on the window's surface that read as
  one sheet, with no divider lines between them, generous spacing, modelled on OpenChamber. The one exception
  is the window's sidebar: while open, a hairline (`Separator`) runs down its edge with the page.
- Nothing wraps into ragged rows or spills past its edge. Every bar declares what gives way first: labels turn
  into icons, then the longest name shortens, then items move into a ⋯ menu. No horizontal page scrolling.
- Labels never get cut off. When tiles or buttons are too narrow for their labels, the grid drops a column
  first.
- On a wide page, panels pair up; one panel never stretches alone across the whole width. A list or grid keeps
  a readable width or shares the row with a companion panel.
- Pages have no title bar: the sidebar names the page. A page's top bar holds only its controls: a
  `PageHeader` or `CollectionHeading` with no `title`, which draws them at its end with no hairline.
- A page's create action (New, Create notebook, New task) is its primary button, filled: white in the dark
  theme, black in the light one. It lives where the things it makes are listed, not inside one of them.
- A bar's controls stand bare, never some boxed and some not. Grid and list are two bare icons, the open one
  pressed (`CollectionViewToggle`, with a third for column view where a collection has one); the order is one sort icon (`CollectionSortMenu`) and filtering one filter
  icon (`CollectionFilterMenu`), never a spelled-out "Most recent". Groups of controls are split by a
  `ToolbarDivider`.
- Controls in one row share one height. A container decides its controls' geometry: a bar gives every control
  the same height and inner padding, and a feature never passes size, height, width or padding classes to a
  shared button. IconButton `sm` (24px) is only for an inline closer in a row or tab. A row's own buttons go in
  `RowTools` (`reveal` "hover" or "cover"), which makes them 24px and 2px apart inside the 32px row; ListRow's
  `trailing` and TreeRow's `end` do the same.
- A site's navbar keeps one width, the site's content width, and never resizes, shrinks or animates as the
  page scrolls: its padding lines up with the page below it at every scroll position.
- The window, and every popup or overlay with a tour, keeps a `BottomBar` along its bottom; the "i" for its tour
  (`TourInfoButton` / `InfoCorner`) sits last at its end, never floating over content.
- The window's own bars (the chat's right rail, the bottom bar, the sidebar's places) are `CustomizableBar`s:
  the person drags items into their order (or moves one with ⌥⇧ and an arrow), and a right-click on the bar
  shows or hides each item and resets the bar. Each bar keeps its arrangement for the device.
- Floating cards overlay; they never push the chat aside. Only the terminal and browser side panels take the
  chat's width. A chat's context panel (session, steps, changes, files, terminal, browser) floats beside the
  chat as a rounded card with a faint edge; the session card is narrow and only as tall as it needs. Those, and
  settings, are the only floating panels. The chat page itself is one flat sheet: no line parts its title bar,
  the chat, the panel and the rail.
- When one panel opens, animates or stacks over another popup, the others are never dimmed. The scrim is only
  behind a dialog, sheet or workspace overlay.

### Rows and lists

- Long text (names, models, paths, branches) shortens with a fade-out edge (`OverflowFadeText`), never an
  ellipsis.
- A row's state sits at its right end: a spinner while an agent works, an amber dot when it waits on the
  person, a dot when unread, otherwise the time.
- A row's actions are one ⋯ at its right end on hover, opening the same menu as right-click. An item's actions
  live in one place, its action bar or its ⋯ menu, never as a stray icon beside it.
- No middle dot between facts ("Sam made Harbor · just now", "3 replies · Ana"). A time or state takes its own
  place at the row's end; otherwise say it in plain words ("3 replies from Ana"), split it into a label and a
  description, or use a comma. Never another separator glyph.
- No loose status words ("Saved", "Done") in a row. Changes save themselves, and a failure shows next to what
  failed.
- A control that doesn't work, or doesn't apply where it is, isn't shown.

### Buttons

- Four roles and three sizes: primary (at most one per surface), secondary (a soft fill, never an outlined
  box), quiet, and danger (only where something is deleted), at 27, 36 and 40.5px, with 40.5 only in dialogs and
  empty states.
- Buttons keep the system's shape: no `rounded-full` or circular icon buttons.
- Focus never draws a ring, an outline or a glow, on anything: a focused control shows its hover wash, a
  field its edge. `styles/focus.css` takes the browser's own away, and `tests/noFocusRing.contract.test.ts`
  fails on any focus ring added back.
- Getting something from a store (Get, Install, Make agent, Update) is the filled primary look, white in the
  dark theme and black in the light one: `variant="get"` on shelf items, `variant="get-filled"` as the one action
  of an item's details. Buttons are never blue.
- A button never shows loading: while its work runs it is just disabled, and progress shows where the work
  happens (the row, item or content it changes).

### Popups and menus

- Popups have 14px corners and three widths: sm 288, md 324 (the default) and lg 360 (`trigger` matches a
  combobox's field). The popup look is locked: never override it.
- A popover is one of three kinds and takes no `className`: a `panel` (12px in; `PopoverHeader` with its title
  and close button, `PopoverText`, `PopoverBody`, then `PopoverActions` at the bottom right, quiet buttons before
  the action), a `list` of menu-like rows, or `flush`, for a picker whose search is its top row
  (`PickerSearch`, `PickerList`, or `Command`). A list of actions is a `DropdownMenu`.
- A menu row (dropdowns and right-click) has a 16px icon only when the icon tells it apart. A list of like
  things (models, efforts, folders, agents, chats, columns) is text alone, never one icon repeated down the
  list; a choice of a few different things (Build and Plan, sort orders) keeps its own icons. A choice shows no
  shortcut. The selection is a checkmark. `MenuRadioGroup` drops icons that don't differ.
- Deleting always asks first in a small dialog: what goes, then Cancel (quiet) and Delete (danger).
- Tooltips are Misty's own (`Tooltip`), quick, with the shortcut when shortcut hints are on, never the system
  title.
- Notices stack at the bottom right, carry at most one action and leave on their own. Errors in a form show
  next to the field.

### Icons and logos

- An icon is its subject's, the same one everywhere that subject shows: a row, an option, a tab, a tile and the
  sidebar all wear the icon the thing already has, never a stand-in (a house for a Space, a keyboard on every
  shortcut category, a generic fallback for a page). Look it up first: `spaceIcons` and `appIcons`
  (`src/icons/appIcons.ts`), `AppLogoImage` (`AppLogos.tsx`), `EngineMark`, `MistyMark`. A subject with
  no icon yet gets one added there, not chosen at the call site. When nothing tells the items apart, they go
  text alone. Never one icon repeated down a list, and never emoji in place of an icon.
- Icons, logos and engine marks stand bare, never inside a box: no fill, border or rounded tile behind them.
  Only an avatar has a shape of its own, and one exception: an app's logo is its maker's own icon, already on
  its own tile (`AppLogoImage`).
- Every third-party logo is the brand's official artwork in its own colors: a single-color mark follows the
  theme (black on light, white on dark), and one with no artwork shows its initial. A colored logo that would
  disappear on one theme uses the brand's own variant; only when none exists does it sit on a small plate
  (`logoPlates` in `LogoFallbacks.tsx`). Misty's `logoArtwork.contract.test.tsx` checks every logo on both themes.
- Never the sparkles star, in any form: it reads as AI filler. An icon shows what the thing is.

### Copy

- Say what the thing is, plainly, in sentence case. No explanatory captions or reassurance labels the UI
  already makes obvious, and no subtext under titles, buttons or forms, except settings rows.
- Never "Loading…" text. A tool getting ready (an editor, the terminal, a webview, an engine) says so with
  `SetupState` ("Setting up the video editor"); a tool's lazily loaded code is a `lazyTool` inside
  `ToolSuspense`. A failed load shows an error, never the empty state, and a stalled setup says so with Try
  again. Data loading follows "Waiting for data" below.
- An *agent* is what a person makes in Misty. Claude Code, Codex, Grok CLI and the rest are *engines*: an agent
  runs on one, and plugins, skills and connectors belong to the engine. Ready-made instructions to start an agent
  from are *templates*. Copy never calls an engine an agent.
- Apps connect through each maker's own sign-in.

### Waiting for data

One question picks the loader: can the content be drawn before the data arrives?

- **Yes: a skeleton.** The shape is known and repeats (rows, cards, settings rows, shelves, a tree), so the
  frame stays put and the data fills it: `ListRowSkeleton`, `SkeletonList`, `CollectionSkeleton`,
  `ShelfSkeleton`. The sidebar's lists, settings sections, Files, Explore, the member list, search results,
  an agent's Memory.
- **No: `PaneLoading`.** The layout depends on the data, so a skeleton would only guess: a chat's messages, a
  thread, a document or file preview, a diff, a store item's or a skill's details, a pane where unrelated
  things load at once.

Both hold to the same rules:

- Nothing shows for the first 300ms, so a quick load shows nothing at all. Both build this in.
- One loader per pane: never a spinner inside a skeleton or beside another. A part of a loaded page that still
  waits takes its own loader at its own size (`PaneLoading inline`, or a skeleton of that part).
- First load only. Once something has been shown, a refresh happens behind it (`useCachedResource`).
- Neither is for a tool getting ready: that is `SetupState`.
- A failed or stalled load gives way to `ErrorState` with Try again; neither stays up forever.

### Specific surfaces

- An empty state is centered in its pane: a title, one muted line, one button (`EmptyState`). The page's top
  bar doesn't repeat that button while it shows.
- The composer is one bar that never wraps, with nothing under the box: where the chat works (Space, folder,
  branch) is shown in the chat's context panel. Screen capture lives in the + menu.
- Every message has the same action bar under it, aligned to its edge, shown only on hover. A toggle that is on
  (a thumbs up given) fills its icon, never a gray chip. Replies have no avatar beside them.
- A saved secret is one field the size of the empty one that says it's saved, with Replace and Remove in its ⋯
  menu.
- A shortcut is recorded in an ordinary field, one per command, cleared with its ×.
- Settings keep their sections and rows as they are, and list only what exists today.
- A Space's name is at most 64 characters and the Space switcher always shows it whole, never faded.
- The agent browser opens on a blank page and searches with Google, never DuckDuckGo.
- The Tutor is in full color; Misty itself stays neutral.

### Docs sites

A docs site (`DocsLayout`) is the one place with three panels. Its rules, so a docs page is never tuned by eye:

- Panels: the section's pages on the left, the article, "On this page" on the right. They have no divider
  lines between them; the page's only lines are the footer's top edge, the contents column's trail (a
  hairline with the section being read marked bright) and the fields' own edges.
- All three panels start at the same height: they share one top padding, so the search field, the article's
  eyebrow and the contents heading begin on the same line, and the site's navbar above them is the only band.
- Lists breathe: a sidebar group's pages sit a step below its heading, groups are 8px apart, and a contents
  entry is 32px tall with its trail beside it, never packed tighter than a row.
- The page is as wide as the site around it and has its side padding (`--docs-max`, `--docs-gutter`); things
  that stay in view sit below the site's bar (`--docs-top`).
- The docs' own sizes (the large title, the hero) exist only here.

### Where stylesheets are allowed

Features have no stylesheets. The only ones are for content, not interface: code views, presented media (a
Tutor slide or video scene) and the skins of third-party widgets (`contentStylesheets` in
Misty's `src/tests/architecture/uiRuleDefinitions.ts`). Feature stylesheets never restyle a shared component's parts
(`[data-slot]`), its button states or its glyph sizes.

## Recipes

### Explore

- A rail on the page's left (search, then All, Apps, Agents, Plugins, Skills, Prompts, Connectors, a
  hairline, then Updates), flat on the page like every pane, rows as `NavRow tone="page"`.
- All opens with a `FeatureRow` of picks that have banners, then `Shelf`s: open-source apps first, then
  agents. Each section is the same shelves, with `FilterChip`s for its groups.
- Get, a name or a logo opens `StoreDetail`: banner, logo, name, line, the one action, facts, previews,
  about.

### A catalog page (the apps catalog)

- One `CollectionPage`. Its `CollectionHeading` holds the page's controls; no page title (the sidebar names it).
- Switching between kinds of thing (Personas, Plugins, Skills…) is one `ChoiceGroup` or `TabStrip`, never two
  stacked full-width bars.
- Categories are `FilterChip`s inside `CollectionFilters`, which is an `ActionBar`: it gives way instead of
  scrolling sideways. Counts go in the chip's label only if they help choosing.
- Search is `CollectionSearch`; sort and filter are one icon each.
- Items are a `CatalogGrid` of `CatalogCard`s, each wearing its own logo or subject icon, with one `action` and
  the rest in its `menu`. What the person already added sits above as a `CatalogTileRow`.
- First load is `CollectionSkeleton`; nothing found is `EmptyState inline`.

### A list page

`CollectionPage` → `CollectionHeading` (create action as the primary button) → `CollectionFilters` → `ListRow`s
with `state` at the end and `menu` for the ⋯. No leading icon unless it tells rows apart.

### A form or settings section

`SectionHeading`, then rows of `Field` + `Label` + control. Switches for on/off, `OptionSelect` for short
choices, `SecretField` for secrets. Changes save themselves; errors show under the field with `FieldError`.

### A dialog

`Dialog` → `DialogHeader`/`DialogTitle` → `DialogBody` → `DialogFooter` with a quiet Cancel then the one primary
(or danger) action, at `lg` (36px).

## Changing the system

The system changes here, in `src`, `styles` and this file, never in an app or a feature. When you add or change a
component, give it a doc comment that says what it is for and when not to use it, add its example in
`site/examples/`, run `npm run catalog`, and update this file if a rule or a "which piece" entry changes.
