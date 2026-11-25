import { Ban, MessageCircle, Phone, Trash2, Video } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  Button,
  IconButton,
  MenuItem,
  PersonProfile,
  PersonProfileSection,
  PresenceFace,
  Text,
} from "../../../src";

export const meta = {
  name: "PersonProfile · PersonProfileSection",
  file: "patterns/channel/PersonProfile.tsx",
  about: "",
  order: 15,
};

export default function Example() {
  return (
    <div className="h-96 w-72 overflow-hidden rounded-lg border border-charcoal-border">
      <PersonProfile
        label="Profile"
        face={
          <PresenceFace presence="online" face="xl">
            <Avatar size="xl" tone="blue">
              <AvatarFallback>J</AvatarFallback>
            </Avatar>
          </PresenceFace>
        }
        name="justnatureusa"
        line="Shipping the drive tonight"
        actions={
          <>
            <Button icon={MessageCircle}>Message</Button>
            <IconButton label="Voice call" variant="secondary">
              <Phone />
            </IconButton>
            <IconButton label="Video call" variant="secondary">
              <Video />
            </IconButton>
          </>
        }
        menu={
          <>
            <MenuItem icon={Trash2} label="Remove friend" danger />
            <MenuItem icon={Ban} label="Block" danger />
          </>
        }
      >
        <PersonProfileSection title="Friends since">
          <Text size="control">November 2, 2026</Text>
        </PersonProfileSection>
      </PersonProfile>
    </div>
  );
}
