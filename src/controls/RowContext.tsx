import { createContext, useContext, type ReactNode } from "react";

/**
 * Whether a control sits on a row (a tree's, a list's, a file's). A row is 36px; a 36px button on
 * it would fill it edge to edge and look taller than the row, with its padding opening wide gaps
 * between icons. So on a row every IconButton is 27px (sm), set here, never by the feature: 4.5px
 * of the row shows around each, and icons sit close together.
 */
const OnRow = createContext(false);

/** Makes the controls inside a row's own: their IconButtons are 27px. Rows give it to their
 * control slots (ListRow's `trailing`, TreeRow's `end`, RowTools); features never do. */
export function RowControls({ children }: { children: ReactNode }) {
  return <OnRow.Provider value>{children}</OnRow.Provider>;
}

/** Ends a row's reach: what a control opens (a menu, a dialog) portals out of the row, but React
 * context follows it there, so each overlay's content starts off the row again. */
export function OutOfRow({ children }: { children: ReactNode }) {
  return (
    <OnRow.Provider value={false}>
      <Compact.Provider value={false}>
        <InFooter.Provider value={false}>{children}</InFooter.Provider>
      </Compact.Provider>
    </OnRow.Provider>
  );
}

/** Whether the control is on a row, so IconButton takes the row's size. */
export function useOnRow(): boolean {
  return useContext(OnRow);
}

const Compact = createContext(false);

/**
 * Makes the controls inside a compact bar (the 36px bottom bar) 27px: buttons and icon buttons
 * alike, set by the bar, never by the feature, so 4.5px of the bar shows above and below each.
 */
export function CompactControls({ on = true, children }: { on?: boolean; children: ReactNode }) {
  return <Compact.Provider value={on}>{children}</Compact.Provider>;
}

/** Whether the control sits in a compact bar, so it takes the small size. */
export function useCompactControls(): boolean {
  return useContext(Compact);
}

const InFooter = createContext(false);

/**
 * Makes every button in a dialog's footer one size, 40.5px (lg): Cancel, the action and any other
 * button the feature adds, whatever size it asks for, so a footer never shows buttons of different
 * heights. DialogFooter and AlertDialogFooter give it; features never do.
 */
export function FooterControls({ children }: { children: ReactNode }) {
  return <InFooter.Provider value>{children}</InFooter.Provider>;
}

/** Whether the control sits in a dialog's footer, so it takes the footer's size. */
export function useFooterControls(): boolean {
  return useContext(InFooter);
}
