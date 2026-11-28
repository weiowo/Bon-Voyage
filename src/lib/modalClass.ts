/**
 * Class names for the CSS-animated modals in animation.css (`.modal`, `.search-friend-modal`).
 * `open` is null until the modal is first opened, so the hide animation does not play on load.
 */
export function modalClass(base: string, open: boolean | null): string {
  if (open === null) return base;
  return `${base} ${open ? 'show' : 'hide'}`;
}

export function modalBackgroundClass(base: string, open: boolean | null): string {
  return open ? `${base}-background show` : `${base}-background`;
}
