import {
  Button,
  Input,
  PickerList,
  PickerSearch,
  Popover,
  PopoverActions,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverText,
  PopoverTrigger,
  Text,
} from "../../../src";

export const meta = {
  name: "Popover (panel, flush) · PopoverHeader · PopoverText · PopoverBody · PopoverActions · PickerSearch · PickerList",
  file: "overlays/Popover.tsx",
  about: "",
  wide: false,
  order: 5,
};

const row = "flex flex-wrap items-center gap-3";

function PopoverDemo() {
  return (
    <div className={row}>
      <Popover>
        <PopoverTrigger asChild>
          <Button>Panel popover</Button>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverHeader title="Invite people" detail="3 of 10" />
          <PopoverText>They can see and edit everything in this Space.</PopoverText>
          <PopoverBody>
            <Input aria-label="Email" placeholder="name@example.com" />
          </PopoverBody>
          <PopoverActions>
            <Button variant="quiet">Cancel</Button>
            <Button variant="primary">Invite</Button>
          </PopoverActions>
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger asChild>
          <Button>Flush picker</Button>
        </PopoverTrigger>
        <PopoverContent kind="flush" size="sm">
          <PickerSearch aria-label="Find a branch" placeholder="Find a branch" />
          <PickerList>
            {["main", "design-system", "explore-refactor"].map((branch) => (
              <Text key={branch} size="control" className="px-2 py-1.5">
                {branch}
              </Text>
            ))}
          </PickerList>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default function Example() {
  return <PopoverDemo />;
}
