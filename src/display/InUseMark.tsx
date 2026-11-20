import { cn } from "../classNames";
import { Tooltip } from "../overlays/Tooltip";
import { Avatar, AvatarFallback, AvatarImage, type AvatarTone } from "./Avatar";
import { Text } from "./Text";

/** Someone who has a file open, on one of their computers. */
export type InUsePerson = {
  /** Their name, as the Space shows it. */
  name: string;
  /** Their picture. Without one, their initial shows on their tone. */
  image?: string;
  /** Their tone, the same one their avatar wears everywhere else. */
  tone?: AvatarTone;
  /** They are changing the file, not only reading it. */
  editing?: boolean;
  /** The computer they have it open on, such as "MacBook". */
  device?: string;
  /** It is the person looking: the tooltip says "You" instead of the name. */
  you?: boolean;
};

export type InUseMarkProps = {
  /** Who has the file open, in the order to show them. */
  people: InUsePerson[];
  /** Layout only: margins or placement. */
  className?: string;
};

/** How many faces show before the rest are counted. */
const mostFaces = 3;

/** "Ana is editing this on MacBook", "You have this open". */
export function inUseLabel(person: InUsePerson): string {
  const on = person.device ? ` on ${person.device}` : "";
  if (person.you) return person.editing ? `You're editing this${on}` : `You have this open${on}`;
  return person.editing
    ? `${person.name} is editing this${on}`
    : `${person.name} has this open${on}`;
}

/** "Grace has this open", "Grace, Linus and Mia have this open". */
function othersLabel(people: InUsePerson[]): string {
  const names = people.map((person) => (person.you ? "You" : person.name));
  const list =
    names.length === 1
      ? names[0]
      : `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
  return `${list} ${names.length === 1 && !people[0].you ? "has" : "have"} this open`;
}

function initial(name: string) {
  return Array.from(name.trim())[0]?.toUpperCase() ?? "";
}

/**
 * Who has a file open: a small row of their faces, overlapping, at a row's end where its state
 * goes (or beside it). At most three faces show, then "+N" for the rest. Each face names itself
 * in Misty's tooltip ("Ana has this open", "Ana is editing this", "You're editing this on
 * MacBook"), and "+N" names the rest. It is as tall as a StateMark, so it lines up in a column of
 * rows.
 *
 * It is only for a file that people have open right now, such as a file in a Space's drive.
 * Who is in a Space or a channel is the member list (`MemberRow`), someone's pointer on a shared
 * page is `LivePointer`, and an agent's run is a `StateMark`. Show nothing when nobody has the
 * file open.
 *
 * `<InUseMark people={[{ name: "Ana", tone: "blue", editing: true }]} />`
 */
export function InUseMark({ people, className }: InUseMarkProps) {
  if (people.length === 0) return null;
  const shown = people.slice(0, mostFaces);
  const rest = people.slice(mostFaces);
  const name = [...shown.map(inUseLabel), ...(rest.length ? [othersLabel(rest)] : [])].join(", ");
  return (
    <span
      role="group"
      aria-label={name}
      data-slot="in-use-mark"
      className={cn("flex h-4 shrink-0 items-center", className)}
    >
      <span className="flex items-center -space-x-1">
        {shown.map((person, index) => {
          const label = inUseLabel(person);
          return (
            <Tooltip key={`${person.name}-${person.device ?? ""}-${index}`} content={label}>
              <Avatar
                size="xs"
                tone={person.tone}
                role="img"
                aria-label={label}
                // A ring in the page's color cuts each face out of the one under it.
                className="ring-2 ring-charcoal-bg"
              >
                {person.image ? <AvatarImage src={person.image} alt="" /> : null}
                <AvatarFallback aria-hidden="true">{initial(person.name)}</AvatarFallback>
              </Avatar>
            </Tooltip>
          );
        })}
      </span>
      {rest.length ? (
        <Tooltip content={othersLabel(rest)}>
          <span role="img" aria-label={othersLabel(rest)} className="ml-1 flex items-center">
            <Text bare size="caption" tone="muted">
              {`+${rest.length}`}
            </Text>
          </span>
        </Tooltip>
      ) : null}
    </span>
  );
}
