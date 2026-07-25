import { useEffect, useLayoutEffect } from "react";

/**
 * `useLayoutEffect` on the client, `useEffect` on the server — avoids
 * React's "useLayoutEffect does nothing on the server" warning while
 * still getting synchronous, pre-paint cleanup timing in the browser.
 *
 * Needed specifically for GSAP ScrollTrigger `pin: true`: pinning
 * inserts a `.pin-spacer` wrapper directly into the DOM, outside
 * React's own tree bookkeeping. A plain `useEffect` cleanup runs
 * *after* React has already committed its own DOM removals for an
 * unmounting subtree — if that subtree was pinned, its true DOM parent
 * (the pin-spacer) no longer matches what React's fiber tree expected,
 * and `removeChild` throws "the node to be removed is not a child of
 * this node." Reverting the GSAP context in a layout effect instead
 * un-wraps the pin-spacer synchronously, before React's own commit
 * removes anything, so the DOM matches what React expects again.
 */
export const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;
