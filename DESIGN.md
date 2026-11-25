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
each page has a "Don't like" mark for review. `npm run catalog` regenerates the catalog, the props and the
list of examples (`site/examples.json`, read from each example's `meta`); `tests/design_catalog.contract.test.ts`
fails when the catalog or the list is out of date.

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
Misty, `src/tests/architecture/ui_rules.ts` enforces this. Its baseline only shrinks: a rule that reaches zero is locked
there for good with no exceptions, and a new rule starts locked, so debt can't be recorded, only paid.
`tests/RowHeights.contract.test.tsx` renders the shared rows and checks every control in a row has the row's height.

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
| Edge | `--misty-theme-border` | The page's frame: under toolbar rows, column seams, a field's edge |
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
- **Kind of file** (`--tone-code`, `-style`, `-data`, `-doc`, `-image`) through `item_tones.ts`.
- **Kind of made thing** (`--tint-*`): audio, video, report, cards… through `Surface`/`Text` `tint`.
- **Art** (`--color-art-*`): only for full-color art drawn over any theme (Tutor, pets, the desktop overlay).
- **Avatars** (`--color-avatar-*`): soft pastels assigned per person, behind dark ink.
- **Tab groups** (`--tone-group-grey`, `-blue`, `-red`, `-yellow`, `-green`, `-pink`, `-purple`, `-cyan`,
  `-orange`, Chrome's nine, with `--tone-group-ink` for a chip's name): only through `TabStrip`'s groups and
  `TabGroupDot`.
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
semibold. Sentence case everywhere, except the heading of a sidebar's group of rows (`NavGroupHeading`, or a
frame column's `SectionHeading strong`: "Direct Messages", "Quick Access"), which is title case; otherwise
capitals only for real acronyms. Monospace only inside code itself (code
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
  size class. The only larger icons are `PlaceholderIcon`, for a thumbnail, drop zone or empty state, and a
  place's glyph on the `SpaceRail` (22.5px at the same stroke weight, on a neutral tile the size of a Space's
  picture), which stands beside the Spaces' pictures.
- **Depth** comes from two fills and hairlines, as in Kura: every page is a framed window. Its frame (the
  page's bars, its own sidebar or rail, its side panels and preview) wears the sidebar's color, so with
  Misty's own sidebar it reads as one frame around the work; the work itself (the chat, the list, the
  editor, the settings rows) sits on the page's color. Hairlines part them. **No shadows anywhere.**
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
| Groups of a list (categories, kinds, scopes) | Stacked `Shelf`s or groups under a `SectionHeading`, one under another, each with See all where it's cut | A row of chips or buttons to switch between them, in any form |
| Sections of a long page (Settings) | Rows for them in the page's rail or sidebar, under the page's own row; picking one scrolls there | A row of chips or tabs across the page's top |
| A collection's controls (sort, filter, refresh, view) | `CollectionControls` | A hand-made bar |
| Questions or notes that open under their heading (an FAQ, release notes, a docs sidebar group) | `Disclosure` (`kind` section or row) in a `DisclosureList` | An accordion of styled buttons |
| A tab strip | `TabStrip`: with many tabs they shrink to their icons (the open tab keeps its name), then scroll with a faded edge, and Search tabs lists them all | Buttons styled as tabs, a cap on how many tabs open, a second row of tabs |
| A tab's icon | The icon its subject's sidebar row wears, in the glyph's 18px box: a place's glyph (`spaceIcons`), a channel's #, a voice channel's speaker, a person's face (`Avatar size="glyph"`, a group's first face) or an agent's (`AgentFace size="glyph"`), with no presence dot, an app's `AppLogoImage size="glyph"`; a page with no subject of its own goes without | A stand-in glyph (a grid, a house) for a page it can't name, an engine's mark in place of an agent's face, a presence dot or a spinner |
| Groups of tabs, as Chrome's | `TabStrip` `groups` (`TabStripGroup`: `label`, `color`, `collapsed`, `menu`) with each tab's `group`; a group's color in a menu is `TabGroupDot`, named by `tabGroupColorName` | Colored tabs, a heading row over the tabs |
| A toolbar | `ActionBar` (gives way: labels → icons → fade → ⋯), groups set a step apart by `ToolbarDivider`, which draws no line | A flex row that wraps or scrolls |
| Related rows that belong together (a settings section, Friends' Online, a store item's facts) | `RowGroupSection` (a `RowGroupLabel` over one `RowGroup`), sections one under another in a `RowGroupStack`; facts as `PropertyList layout="grouped"` | A bordered card, a hairline between rows, a heading a row's height above its rows |
| A setting | `SettingsSection` of `SettingsRow`s (`label`, a `description` only where it explains, the control as children, `sub`, `disabled`) | Hand-built rows, bright medium labels, a card per section |
| Rows that belong to the row above them (a thread under its agent, a section of the open Settings page) | `NavBranch` (`under` glyph or face) right after the parent `NavRow`, its rows `nested` (`nested="face"` under a face): set in under it beside one straight hairline from the parent's mark, as a docs sidebar's pages are | Rows indented with nothing joining them, elbows or tree branches, a fold of their own |
| A list of things | `ListRow` (`label`, `description`, `badge`, `state`, `menu`, `trailing`); `TreeRow` for trees | Hand-built rows |
| A row's own buttons | `RowTools` (`reveal` hover / cover); a row's ⋯ is `RowActions` / `ListRow menu` | Stray icons beside the row |
| A menu of actions | `DropdownMenu` + `MenuTrigger` with `MenuItem`, `MenuCheckItem`, `MenuRadioItem`, `MenuSubmenu`; right-click is `ContextMenu` with the same items | A `Popover` listing actions, raw menu items |
| The place a sidebar lists (the Space's selector, a channel column's place, a docs site's section), opening its menu | `MenuTrigger heading` (`value` the name, `mark` its avatar): the mark first, its left edge on the line the rows' icons start on, then the name and chevron as one compact button that alone takes the hover wash, alone in its row; the place's actions (Invite people) live in its menu | A name button beside a separate boxed chevron, a trigger of its own |
| A popover | `Popover` kind `panel` (`PopoverHeader`, `PopoverText`, `PopoverBody`, `PopoverActions`), `list`, or `flush` (`PickerSearch`, `PickerList`, `Command`) | `className` on a popover |
| A dialog | `Dialog` (`DialogHeader`, `DialogTitle`, `DialogBody`, `DialogFooter`); deletes use `ConfirmDeleteDialog` / `useConfirmDelete`; renames `RenameItemDialog` | A fixed full-screen div |
| A full-page overlay | `WorkspaceOverlay` or `Sheet` | Custom portals |
| A tooltip | `Tooltip` (IconButton has one built in) | `title=` |
| A notice | `notify` (bottom right, at most one action, leaves on its own) | Inline "Saved" text |
| A file's sync state in a Space's drive | `StateMark` kinds `online-only` (cloud), `downloading` and `uploading` (the spinner), `not-synced` (crossed-out cloud), all muted; a grid card takes `sync` on its `CollectionItem`. A file in step shows no mark; a conflicting copy has no color of its own | A colored chip, a status word, the `online` (connected) kind |
| Someone's status on their face (a member, a DM, a friend) | `PresenceFace` (`presence` online, idle, dnd, invisible, offline; `working` and `waiting` for their agent; `face` the Avatar's size, which the dot scales with); a status alone in a menu row is `PresenceDot` | A colored chip, a status word in the row, a dot painted over the face |
| The person's own profile, opened from their name in the bar along the foot of the rail and sidebar: their banner, face, status and account | `DropdownMenuContent kind="card"` holding `ProfileCardBanner` (cropped to `profileBannerSize`), `ProfileCardHeader` (an xl face, centered), `ProfileCardName` (the name, a line and `ProfileCardStatus`, centered under it), then `ProfileCardGroup`s of `MenuItem`s and `MenuSubmenu`s (Status opens the statuses) | A separate status button, a menu headed by an email |
| A list of people (Friends): face, name and a line about them now | `PersonRow` (`face` in a `PresenceFace`, `line`, `away` when offline; `actions` for a request's answers, `tools` on hover, `menu`; `selected` for the one whose profile is open beside the list), straight on the page under a `SectionHeading` per group (Requests, Online, Offline), each with its count, an empty one showing 0 | `ListRow` with an avatar squeezed in, a hand-made card per person |
| Who is around now, in a page's bar (Friends' online friends) | `FaceStack` (`people` with their `face` at `sm`, `label` "7 online", `onSelect`) beside the bar's search | A row of separate avatars, a count on its own, `InUseMark` (that is who has a file open) |
| The other person beside a one-to-one direct message, or beside Friends' list | `PersonProfile` (`banner`, `face`: an xl `Avatar` in a `PresenceFace face="xl"` centered half into it, `name`, their status as `line`, Remove friend and Block in its `menu`; beside a list, Message and the calls as `actions` under the name) with `PersonProfileSection`s; a group's people are a `MemberList` | A member list of two, a hand-made card |
| Switching between Personal and the Spaces (the window's far edge) | `SpaceRail`: at its top (`start`) what is the person's own, Personal's face then Files, Apps, Browser and Explore; under the hairline that starts what is shared, every Space's picture as a `SpaceRailItem` (40.5px tiles, each place's glyph on a neutral tile of the same size; the open one `selected` and ringed, a fainter ring under the pointer, never a fill; its `count` on the picture's corner, `waiting` amber), then New Space as `+` | A toggle of two sides, a Space list in a menu, an edge pill or a wash on the open Space |
| Who is in a voice channel, under its row in the sidebar | `VoicePerson` (`avatar` at xs, `name`, `speaking` rings the face in the done tone, `muted`) | A list of names, a colored chip |
| A call in full (a voice channel's page, a DM's call, full screen) | `CallStage` of `CallTile`s (`picture`, else `face`; `speaking`, `muted`, `deafened`; a shared screen as `focus`, `fit="contain"`), then a `CallBar`: the microphone and camera as `CallControl`s (filled while off, a chevron for their devices), reactions as `CallReactions`, the rest IconButtons, ending in `CallLeave` (a phone on its side, white on red); a raised hand is `hand` (with `handPlace` while several are up) and a sent reaction `reaction` on the tile, live captions a `CallCaptions` between the stage and the bar, a shared screen zooms with `zoom`; a weak connection is `weak` on its tile, a lost one `dimmed` on the stage; away from the call, `FloatingPip` | A grid of hand-made video boxes, a floating card of buttons |
| Changing a picture on its face (the person's own, a Space's they may change) | `FaceEdit` over the face: the pencil shows only while the face itself is hovered, and opens the `PictureEditorDialog` (crop in the face's shape, zoom, quarter turns, and the outline); a sidebar Space's is `MenuTrigger`'s `markEdit`, the profile card's `ProfileCardHeader`'s `onFaceEdit` | A Change button beside the face as the only way, a pencil on someone else's face, uploading a picked file without the editor |
| A face's outline, its avatar decoration | `Avatar` `outline` (the `#rrggbb` the person chose, a ring inside the face's edge); with none, a Space's picture wears `edge` | A border class, a ring drawn around the face from outside |
| An agent's face, wherever a person's would be (a chat's bar, its welcome, a message, a list, a call) | `AgentFace` at the `Avatar` size a person's face takes there: its engine's `mark`, a persona's `icon` on its `color`, an emoji, or a `picture` | A bare engine mark standing in for a face, a square tile |
| How many wait on a row (unread messages, an agent's threads that need the person or are new) | `CountMark` at the row's end (`waiting` while one needs the person); on an icon, `IndicatorDot` with `count` | A bare dot where the number is known, a red pill, plain number text |
| Who has a file open | `InUseMark` (`people`: at most three faces, then "+N", each named in its tooltip), at the row's end where its state goes | A list of names, a lock icon |
| Nothing here yet / failed | `EmptyState`, `ErrorState` | A custom centered block |
| First load of content you can draw before it arrives (rows, cards, settings rows, shelves, a tree) | A `Skeleton` shaped like it (`ListRowSkeleton`, `SkeletonList`, `CollectionSkeleton`, `ShelfSkeleton`) | "Loading…" text |
| First load whose layout depends on the data (a chat's messages, a thread, a document or file preview, a diff, an item's details) | `PaneLoading`, one spinner in the pane's middle; `inline` for one part of a loaded page | A skeleton guessing the shape, "Loading…" text |
| Work in progress | `Spinner` or `Progress` where the work happens | A spinner in a button |
| A store action while what it gets downloads (Get, Update) | `ProgressPill` in the button's place, at its size with the same `widthOf`, filling as the download goes, the percentage its label | A Get button left pressable, a "Downloading 42%" line beside it, a spinner in the button |
| A documentation site (guides, SDK, design system) | `DocsLayout` in three panels, as Vercel's: `DocsHeader` (Misty's mark back to the site's `home`, the docs' name, the docs switcher), the docs' `DocsNavGroup`s (sections that fold) of `NavRow tone="page"`, the article (`DocsTitle`, `DocsHeading`s), `DocsToc` ("On this page") and the `DocsPager` cards; only for a docs site | The app's page layouts, a hand-built sidebar and rail |
| A page's frame: toolbar rows, a rail or sidebar, side panels, the work between | `FramedPage` (`toolbar` rows across the page, the work's own `header`, `start` and `end` columns in design px with an optional `header` each, `autoSaveId`, `footer`), as Kura's window | A page that lays out its own fills, lines and columns; percent widths; a fixed-width side column |
| One toolbar row, or the header of the work or a column | `FramedBar` (`size` main 54 or tools 45, `start`, its actions as children); a channel's or DM's is `ChannelHeader`, built on it | A hand-made bar with its own height, padding or hairline |
| A side view beside a chat (members, a thread, search, pinned, a profile, an agent's files or terminal) | One FramedPage `end` column whose `id` is the open view, so each keeps its own width; a closable panel with its own header is a `SidePanel` as the column's content | A fixed-width div with a border beside the chat |
| A page's top band | `PageHeader` (pages), `ViewHeader` (views of a Space), `CollectionHeading` (collections) | A hand-made header |
| A browsable collection | `CollectionPage`, `CollectionHeading`, `CollectionControls`, `CollectionSearch`, `CollectionViewToggle`, `CollectionSortMenu`, `CollectionFilterMenu`, `CollectionItems` | Custom bars |
| Finder's column view (Files) | `ColumnBrowser` (`columns` of `rows`, `selected`, `onSelect`, `onOpen`, `menu`, `preview` as the last column), switched to by `CollectionViewToggle`'s `columns` | Side-by-side lists, a tree squeezed into columns |
| Moving items by dragging them (files into folders) | `drag` on `CollectionItems` (items marked `dropTarget`) or `ColumnBrowser`: pointer dragging, ⌥ copies, the dragged items dim, a drag resting on a folder opens it (`onDwell`) and carries on into it, another collection or a tab (`carries`); places outside the collection that take the items (a sidebar's folders, the open folder's pane) are `useCollectionDropPlaces` | HTML5 `draggable`, the native drag loop |
| An item's Finder tags | `TagDots` after its name (`CollectionItem` `marks`, `ColumnBrowserRow` `marks`); one tag's color in a menu is `TagDot`, named by `tagToneName` | Colored chips, a list of tag names in the row |
| A file's path whose folders open | `PathLine` with `onSelect` on each folder's segment | A row of buttons, a breadcrumb bar |
| A file manager's path bar, which can be typed into (Files) | `PathField` (`segments` with `onSelect`, `value`, `onSubmit`) | A hand-made breadcrumb box, a PathLine in a bordered div |
| A file manager's icon view and list (Files) | `CollectionItems` `view="grid"` `gridLayout="icons"`, sized by `zoom` 0 to 2; the list with `listIcons="inline"`, its columns sized by dragging their seams (kept with `remember`); details in the inspector are `PropertyList layout="info"`; a ⋯ menu's Sort holds the order through `sort` and `onSortChange`; a drive in the sidebar is a `NavRow tall` with a `Meter` | Preview cards for files, a hand-made tile grid or details table |
| A catalog of installables | `CatalogGrid` + `CatalogCard` (`logo`, `title`, `maker`, `description`, `tag`, `detail`, `action`, `menu`); what's already added is a `CatalogTileRow` of `CatalogTile`s | A long full-width list with per-row toggles |
| A store page's shelves (Explore) | `Shelf` + `ShelfItem` (`logo` at `tile`, `title`, `line`, one `action` at the row's end, `menu`): Get, Update, Open, or a secondary Manage for what the person has; featured picks are `FeatureCard`s in a `FeatureRow`, shown only with a banner; picking one opens its `ProductPage` | A grid of cards per section, a list with per-row toggles, a check mark or "Installed" for what the person has |
| A store item's own page (Explore) | `ProductPage` (hero: `logo` at `hero`, `title`, `line`, `maker`, one `action`, `menu`; `facts` as one strip with no lines between its columns), then `ProductSection`s: Manage (a `SettingsSection` of rows with switches and buttons), About, What's inside (`ProductTiles` of `ProductTile`s), Information (`ProductInfo`), then `Shelf`s; the page's bar is a `ProductBar` that takes the name and action once the hero scrolls away | A dialog of details, a bordered card per fact, lines between the facts |
| A persona's logo | `PersonaLogo` (`icon` for what it does, `color` from `personaTone(id)`) | The catalog's emoji, a bare initial |
| The top of a chat's history | `ChannelWelcome`: a channel's icon, or a direct message's or an agent's face as `mark` with `align="center"`, its title, one line, and a few buttons as `actions` (Wave while nothing has been said) | A hand-made avatar and heading |
| A channel's messages (Space chat) | `ChannelMessage` with `ChannelMessageText`, `ChannelReply` over a reply, `ChannelReactions` of `ReactionChip`s, `ThreadRepliesButton`; days and unread with `ChannelDivider` | Hand-built message rows |
| An agent's turn in a chat | What it wrote, in full, between its runs of steps; each run one `ToolList` table, always open, a `ToolRow` per step so every action reads on its own line (a run of reads and searches as one Explored row), each opening to its `ToolBody`, with the pictures its steps took as `TurnPictures` after the table; the agent's task list, whichever engine or Misty keeps it, as one `TurnTasks` card (while it runs, or after if unfinished); then one `TurnStatus` line, with the turn's state mark, naming the running step (which shows no row of its own until it ends) and opening to its live output; once the turn has ended nothing in it moves, and a step it never finished shows as failed; a question or approval as a `QuestionPanel` card, the primary action first | A run folded into one summary line, a running step shown both as a row and in the status line, a moving highlight on a turn that has ended, a task list squeezed into one line by the composer |
| Picking an emoji | `EmojiPicker`, handed the caller's emoji (`sections`, `search`) | A grid of styled buttons in a popover |
| A file waiting to go with a message | `ComposerAttachment` in the composer's `context` | A hand-made chip |
| Panes the person resizes inside the work (a call's stage over its chat) | `SplitPanes` of `SplitPane`s with a `SplitHandle` between; a page's own columns are FramedPage's | react-resizable-panels directly |
| A command palette (⌘K) | `CommandPalette` holding `CommandPaletteInput`, `CommandPaletteList`, `CommandPaletteGroup`, `CommandPaletteItem` | cmdk directly |
| A subject's icon | `spaceIcons`, `appIcons`, `AppLogoImage` (an app's own icon), `EngineMark`, `MistyMark`, `BrandIcon` | A stand-in Lucide glyph or an emoji |

## Rules

### Layout

- The interface is quiet and mostly neutral and looks finished, laid out as Kura's window: every page is a
  `FramedPage`. Its toolbar rows run across the top on the frame's color, a hairline under each; its side
  columns (a rail, a sidebar, a side panel, a preview) stand beside the content on the frame's color, parted
  from it by a hairline seam the person drags to resize; the content sits on the page's color between them.
  Misty's own sidebar keeps its hairline with the page. Generous spacing, nothing floating over the work.
  Every bar in the frame is a `FramedBar`: 54px (or 45 for a tool page's second row), one 13.5px gutter, its
  hairline drawn by the frame, so the work's header and a column's header meet in one line. Columns are sized
  in design px, kept for the device, never narrower than their least width; the work keeps at least
  `workMinWidth`, and when the window can't hold both the end column folds away before the start column. A
  start column that is the page's only navigation (Settings' sections, Explore's rail) is `keep`: it never
  folds away, it holds its least width and the work gives way. A seam brightens under the pointer and while
  dragged; a double-click puts the column back to its width.
- Hairlines meet. A line that parts two things runs edge to edge and joins the lines it reaches, with no gap
  at either end: a list's header hairline runs to both sides of its pane, and a column's seam runs the
  header's whole height, from the bar's hairline above to the header's below, and while the list is hovered
  it carries on down through every row, unbroken, to the last. Space between a line and the
  content comes from inside the component (a list's edge gutters, a row's own inset), never from padding
  around it, so a list or table sits flush in its pane.
- Never a row of category chips or section buttons over a list or a page. A list's groups stack, one under
  another, under their headings; a page's sections are rows in its rail or sidebar.
- Nothing wraps into ragged rows or spills past its edge. Every bar declares what gives way first: labels turn
  into icons, then the longest name shortens, then items move into a ⋯ menu. No horizontal page scrolling.
- Labels never get cut off. When tiles or buttons are too narrow for their labels, the grid drops a column
  first.
- On a wide page, panels pair up; one panel never stretches alone across the whole width. A list or grid keeps
  a readable width or shares the row with a companion panel.
- Pages have no title bar: the sidebar names the page. A page's top bar holds its controls, in the
  `FramedPage`'s toolbar rows (a tool page may have two, Kura's 54 and 45px), on the frame's color with a
  hairline under each.
- A page's create action (New, Create notebook, New task) is its primary button, filled: white in the dark
  theme, black in the light one. It lives where the things it makes are listed, not inside one of them.
- A bar's controls stand bare, never some boxed and some not. Grid and list are two bare icons, the open one
  pressed (`CollectionViewToggle`, with a third for column view where a collection has one); the order is one sort icon (`CollectionSortMenu`) and filtering one filter
  icon (`CollectionFilterMenu`), never a spelled-out "Most recent". Groups of controls sit a step apart
  (`ToolbarDivider`), never split by a line.
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
- A chat's context panel (session, steps, changes, files, terminal, browser) is a side column of its
  `FramedPage`: docked beside the chat on the frame's color, parted from it by a seam, taking its width from
  the chat. Only the narrow glance card (`SideCard floating`) still floats over the chat's corner, and
  settings open as their own overlay.
- When one panel opens, animates or stacks over another popup, the others are never dimmed. The scrim is only
  behind a dialog, sheet or workspace overlay.

### Rows and lists

- Rows that belong together sit on one faint fill (`RowGroup`): 14px corners, 4.5px in, 2.25px between
  rows, groups 22.5px apart under a muted label. No line between rows and no bordered card around a
  section; lines are only the page's frame. A group's label starts on the same line as the page's title.
- In a group, a row's label is the text color at the control size, its line muted at the meta size. Bright
  and medium is for a name that leads its row (a person), not every label.
- Long text (names, models, paths, branches) shortens with a fade-out edge (`OverflowFadeText`), never an
  ellipsis.
- A row's state sits at its right end: how many wait there as a `CountMark` (unread messages, or an agent's
  threads that need the person or have results they haven't seen, amber while one needs them), else a
  spinner while an agent works, otherwise the time. Where something can be counted it shows the number,
  never a bare dot.
- A row's actions are one ⋯ at its right end on hover, opening the same menu as right-click. An item's actions
  live in one place, its action bar or its ⋯ menu, never as a stray icon beside it.
- No middle dot between facts ("Sam made Harbor · just now", "3 replies · Ana"). A time or state takes its own
  place at the row's end; otherwise say it in plain words ("3 replies from Ana"), split it into a label and a
  description, or use a comma. Never another separator glyph.
- No loose status words ("Saved", "Done") in a row. Changes save themselves, and a failure shows next to what
  failed.
- A control that doesn't apply where it is isn't shown. In a toolbar, a tool that applies here but can't run
  right now (Cut with nothing picked, Redo with nothing to redo) stays in its place, disabled, so the bar never
  shifts as the selection changes, as in Kura's toolbar. Menus and rows still leave out what doesn't apply.

### Buttons

- Four roles and three sizes: primary (at most one per surface), secondary (a soft fill, never an outlined
  box), quiet, and danger (only where something is deleted), at 27, 36 and 40.5px, with 40.5 only in dialogs and
  empty states.
- Buttons keep the system's shape: no `rounded-full` or circular icon buttons.
- Focus never draws a ring, an outline or a glow, on anything: a focused control shows its hover wash, a
  field its edge. `styles/focus.css` takes the browser's own away, and `tests/no_focus_ring.contract.test.ts`
  fails on any focus ring added back.
- Getting something from a store (Get, Install, Make agent, Update) is the filled primary look, white in the
  dark theme and black in the light one: `variant="get"` on shelf items, `variant="get-filled"` as the one action
  of an item's details. Buttons are never blue.
- A button never shows loading: while its work runs it is just disabled, and progress shows where the work
  happens (the row, item or content it changes). A store action that downloads gives its place to a `ProgressPill`
  until the download is done.
- A button whose label changes with its state (Invite, then Sent) keeps one width: `widthOf` lists every
  label it shows, so it never jumps and a column of them stays even. Keep state words short.

### Popups and menus

- Popups have 14px corners and three widths: sm 288, md 324 (the default) and lg 360 (`trigger` matches a
  combobox's field). The popup look is locked: never override it.
- A menu, list or select popup is as tall as its rows and scrolls only once it reaches the window's edge.
  It has no height cap of its own: a scrollbar is the last resort. A menu that would still scroll is too
  long; shorten it, or move its long list into a `SearchablePicker`.
- A popover is one of three kinds and takes no `className`: a `panel` (12px in; `PopoverHeader` with its title
  and close button, `PopoverText`, `PopoverBody`, then `PopoverActions` at the bottom right, quiet buttons before
  the action), a `list` of menu-like rows, or `flush`, for a picker whose search is its top row
  (`PickerSearch`, `PickerList`, or `Command`). A list of actions is a `DropdownMenu`.
- A menu's rows sit flat on the popup, one layer: groups of rows are parted by a `MenuSeparator`'s hairline,
  never set on fills or boxes of their own. Grouped fills are the profile card's alone, where a banner and a
  face head them.
- A menu row (dropdowns and right-click) has a 16px icon only when the icon tells it apart. A list of like
  things (models, efforts, folders, agents, chats, columns) is text alone, never one icon repeated down the
  list; a choice of a few different things (Build and Plan, sort orders) keeps its own icons. A choice shows no
  shortcut. The selection is a checkmark. `MenuRadioGroup` drops icons that don't differ.
- Two chevrons, never drawn by hand. Anything that opens a menu is a `MenuTrigger` (a field that picks a value is
  `Select`), ending in `MenuChevron`: down, muted, turning over while open. Anything that shows or hides what is
  under it (a heading's group, a question's answer, more of a list, a tree's folder) wears `FoldChevron`:
  right while closed, down while open. A fold's heading brightens under the pointer with no wash behind it.
- A dialog that holds a page (a viewer, a file browser, a collection) is one sheet: `DialogContent`
  `tone="page"` (always so at `size="media"`), in the page's own color with no inset, its
  `DialogHeader` a 54px bar with a hairline under it and the close button in it, and the page flush
  under that. Never a card-colored frame padded around a darker page, and never `p-0` or a color
  passed to a dialog to fake it. A form or a question stays a `card` dialog, set in from its edges.
- Deleting always asks first in a small dialog: what goes, then Cancel (quiet) and Delete (danger).
- Tooltips are Misty's own (`Tooltip`), quick, with the shortcut when shortcut hints are on, never the system
  title.
- Notices stack at the bottom right, carry at most one action and leave on their own. Errors in a form show
  next to the field.

### Icons and logos

- An icon is its subject's, the same one everywhere that subject shows: a row, an option, a tab, a tile and the
  sidebar all wear the icon the thing already has, never a stand-in (a house for a Space, a keyboard on every
  shortcut category, a generic fallback for a page). Look it up first: `spaceIcons` and `appIcons`
  (`src/icons/app_icons.ts`), `AppLogoImage` (`AppLogos.tsx`), `EngineMark`, `MistyMark`. A subject with
  no icon yet gets one added there, not chosen at the call site. When nothing tells the items apart, they go
  text alone. Never one icon repeated down a list, and never emoji in place of an icon.
- Icons, logos and engine marks stand bare, never inside a box: no fill, border or rounded tile behind them.
  Only an avatar has a shape of its own, with two exceptions: an app's logo is its maker's own icon, already on
  its own tile (`AppLogoImage`), and a place's glyph on the `SpaceRail` sits on a neutral tile the size and
  shape of the Spaces' pictures beside it.
- Every third-party logo is the brand's official artwork in its own colors: a single-color mark follows the
  theme (black on light, white on dark), and one with no artwork shows its initial. A colored logo that would
  disappear on one theme uses the brand's own variant; only when none exists does it sit on a small plate
  (`logoPlates` in `LogoFallbacks.tsx`). Misty's `LogoArtwork.contract.test.tsx` checks every logo on both themes.
- Never the sparkles star, in any form: it reads as AI filler. An icon shows what the thing is.

### Copy

- Say what the thing is, plainly, in sentence case. No explanatory captions or reassurance labels the UI
  already makes obvious, and no subtext under titles, buttons or forms, except settings rows.
- Never "Loading…" text. A tool getting ready (an editor, the terminal, a webview, an engine) says so with
  `SetupState` ("Setting up the video editor"); a tool's lazily loaded code is a `lazyTool` inside
  `ToolSuspense`. A failed load shows an error, never the empty state, and a stalled setup says so with Try
  again. Data loading follows "Waiting for data" below.
- An *agent* is what a person makes in Misty. Claude Code, Codex, Antigravity, Gemini CLI and the rest are
  *engines*: an agent runs on one, and plugins, skills and connectors belong to the engine. Ready-made instructions
  to start an agent from are *templates*. Copy never calls an engine an agent.
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
  bar doesn't repeat that button while it shows. A side column's quiet note (a preview with nothing picked)
  is an `icon` in a round well over one muted line, with no title, as Kura's.
- Section headings in a frame column (a tool page's sidebar: Spaces, Quick Access, Tags) are bright and
  semibold (`SectionHeading strong`), leading their rows as Kura's do; elsewhere they stay muted.
- A person's face at the head of what is about them (the profile card, a direct message's profile column) is
  centered over their name, never set at the start; a direct message's and an agent chat's welcome are centered the same way. A channel's welcome sits at the start. Calls start only from the chat's bar.
- The profile row is one bar along the foot of the `SpaceRail` and the sidebar together, its 36px row 13.5px above
  the window's bottom, with 13.5px over it under its hairline: the line every chat's composer bar sits on (the
  composer 18px in from its pane's sides and 4.5px up from its bottom, its bar 9px inside the card), so the two read as one line across the window. Its
  buttons stand 9px apart, measured between what each one draws.
- The composer is one card that never wraps, the same in every chat, with nothing under it: where the chat works (Space, folder,
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

A docs site (`DocsLayout`) is the one place with three panels, laid out as Vercel's docs. Its rules, so a docs
page is never tuned by eye:

- Panels: the docs' sections in a column at the start, the article (768px at most, set 45px past that column
  rather than centered) and "On this page", the contents, in a column at the end; the side columns are 243 and
  216px, then 297 and 270px from 80rem. They have no divider lines
  between them; the page's only lines are the header's bottom edge, the contents column's trail (a hairline
  with the section being read marked bright) and the fields' and cards' own edges.
- The header always leads back to the site's own home: Misty's mark and name, a slash, the docs' name, a slash,
  then the docs switcher, every name in the trail at one size and weight, each taking the control wash under
  the pointer (`DocsCrumb`, `DocsSwitcher`). A docs page is never a dead end.
- All three panels start at the same height: they share one top padding, so the search field, the article's
  eyebrow and the contents heading begin on the same line, under the header.
- The sidebar's sections fold: each is a row with its name and a FoldChevron that opens to its pages, set in a
  step on a hairline. The section holding the open page is open.
- Type: the title 40px set tight, a section's heading 24px and a part's 19px, the lead and the text 16px at an
  easy line height; headings sit 45px under what comes before them and 18px over what follows.
- Three steps of text, so a page reads at a glance: the title, headings, bold terms and links bright; the running
  text a step down, between the text color and the muted one; the eyebrow, lead and captions muted.
- Under 52rem the sections move into a sheet opened from a bar under the header that names the open page; under
  62rem the contents go. Every page with sections has its contents, component pages too.
- The previous and next pages are two cards along the article's bottom edge that stay on screen as it scrolls,
  over a fade of the page's color.
- The page is as wide as the site around it and has its side padding (`--docs-max`, `--docs-gutter`); things
  that stay in view sit below the site's bar (`--docs-top`).
- The docs' own sizes (the title, the headings, the hero) exist only here.

### Where stylesheets are allowed

Features have no stylesheets. The only ones are for content, not interface: code views, presented media (a
Tutor slide or video scene) and the skins of third-party widgets (`contentStylesheets` in
Misty's `src/tests/architecture/ui_rule_definitions.ts`). Feature stylesheets never restyle a shared component's parts
(`[data-slot]`), its button states or its glyph sizes.

## Recipes

### Explore

Laid out as the Mac App Store, from the registry's signed index only.

- A `FramedPage` whose start column is the rail (search, then All, Apps, Templates, Skills, Plugins, MCP,
  Engines, Speech, a hairline, then My apps with its count of downloads and updates) on the frame's color,
  rows as `NavRow`; the shelves sit on the page's color beside it, under the work's own `FramedBar` with the
  page's controls.
  Engines and Speech wear `appIcons.engines` and `appIcons.speech`.
- All opens with a `FeatureRow` of picks that have banners, then a `Shelf` per kind, each the kind's most
  popular, with See all opening the kind.
- A kind's page is its categories as stacked shelves, one under another, the most popular first, each with
  See all; filter (categories shown, what a thing holds) and sort are `CollectionFilterMenu` and
  `CollectionSortMenu` in the bar, never a row of chips.
- See all opens one category's whole list in the same work column, with Back in the bar: `CollectionItems`
  (only the rows in view are drawn), grid or list (`CollectionViewToggle`), sort and filter. Its first
  load is a `CollectionSkeleton`, a failure an `ErrorState` with Try again.
- Search covers every kind at once and shows a shelf per kind that matched, each with See all.
- Every row ends in its one action: Get, Update, Open, or Manage for what the person has, which opens
  the item's page at its Manage section. Nothing says "Installed" and nothing wears a check mark.
- A name, a logo or Manage opens the item's `ProductPage` in the work column (never a dialog), with a
  `ProductBar` (Back, then the name and action once the hero scrolls away); its first load is
  `PaneLoading`.
- My apps is the one place for what the person has and what is on its way: a Downloading shelf first, every
  transfer in progress with its `ProgressPill`, then a shelf of updates per kind with Update all in the bar,
  then the apps on this computer with Open.

### A catalog page (the apps catalog)

- One `CollectionPage`. Its `CollectionHeading` holds the page's controls; no page title (the sidebar names it).
- Switching between kinds of thing (Templates, Plugins, Skills…) is the page's rail of `NavRow`s, never a row
  of chips or tabs over the page.
- Categories are stacked shelves or headed groups, one under another, never a row of chips. The page's
  controls (sort, filter, refresh) are `CollectionControls`, an `ActionBar` that gives way instead of wrapping.
- Search is `CollectionSearch`; sort and filter are one icon each.
- Items are a `CatalogGrid` of `CatalogCard`s, each wearing its own logo or subject icon, with one `action` and
  the rest in its `menu`. What the person already added sits above as a `CatalogTileRow`.
- First load is `CollectionSkeleton`; nothing found is `EmptyState inline`.

### A list page

`CollectionPage` → `CollectionHeading` (create action as the primary button) → `CollectionControls` → `ListRow`s
with `state` at the end and `menu` for the ⋯. No leading icon unless it tells rows apart.

### A form or settings section

A `RowGroupStack` of `SettingsSection`s, each a label over one group of 45px `SettingsRow`s: the label, a
muted line only where it explains something, the control at the end, a dependent row as `sub`. Switches
for on/off, `OptionSelect` for short choices, `SecretField` for secrets. Changes save themselves; errors
show under the field with `FieldError`. A form in a dialog is `Field` + `Label` + control, and a choice of
several there is a `RowGroupSection` of rows.

### A dialog

`Dialog` → `DialogHeader`/`DialogTitle` → `DialogBody` → `DialogFooter` with a quiet Cancel then the one primary
(or danger) action, at `lg` (36px).

## Changing the system

The system changes here, in `src`, `styles` and this file, never in an app or a feature. When you add or change a
component, give it a doc comment that says what it is for and when not to use it, add its example in
`site/examples/`, run `npm run catalog`, and update this file if a rule or a "which piece" entry changes.
