import { createContext } from "react";

/** Where an open view puts its own controls: the panel's header row. */
export const HeaderSlot = createContext<HTMLElement | null>(null);
/** Whether the tree is inside a SidePanel, so SidePanelHeader waits for its slot. */
export const InPanel = createContext(false);
