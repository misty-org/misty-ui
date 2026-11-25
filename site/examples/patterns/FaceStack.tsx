import { Avatar, AvatarFallback, FaceStack, FramedBar, SearchField } from "../../../src";

export const meta = {
  name: "FaceStack",
  file: "patterns/people/FaceStack.tsx",
  about: "",
  order: 17,
};

const people = [
  { id: "ana", tone: "blue" },
  { id: "theo", tone: "green" },
  { id: "mara", tone: "pink" },
  { id: "jun", tone: "violet" },
  { id: "sol", tone: "orange" },
  { id: "priya", tone: "teal" },
  { id: "kenji", tone: "amber" },
] as const;

export default function Example() {
  return (
    <div className="max-w-2xl">
      <FramedBar
        start={
          <div className="flex min-w-0 items-center gap-4">
            <div className="w-64 min-w-0">
              <SearchField placeholder="Search friends" aria-label="Search friends" />
            </div>
            <FaceStack
              label={`${people.length} online`}
              onSelect={() => {}}
              people={people.map((person) => ({
                id: person.id,
                name: person.id,
                face: (
                  <Avatar size="sm" tone={person.tone}>
                    <AvatarFallback>{person.id[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                ),
              }))}
            />
          </div>
        }
      />
    </div>
  );
}
