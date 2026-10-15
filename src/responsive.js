// Shared breakpoint for scroll, animation visibility and the mobile layout.
export const mobileLayout = globalThis.matchMedia?.('(max-width: 1023px)') || { matches: false };
export const mediaScrollRoot = stage => mobileLayout.matches ? null : stage;
