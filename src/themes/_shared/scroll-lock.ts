// Reference-counted body scroll lock: the envelope and the gift sheet can both hold it, and the page
// only scrolls again when the last holder releases.

interface Lockable {
  style: { overflow: string };
}

export function createScrollLock(getTarget: () => Lockable | undefined) {
  let count = 0;
  let previous = "";
  return function lock(): () => void {
    const target = getTarget();
    if (!target) return () => {};
    if (count === 0) {
      previous = target.style.overflow;
      target.style.overflow = "hidden";
    }
    count += 1;
    let released = false;
    return () => {
      if (released) return;
      released = true;
      count -= 1;
      if (count === 0) target.style.overflow = previous;
    };
  };
}

/** Locks `document.body`. No-op on the server. */
export const lockBodyScroll = createScrollLock(() =>
  typeof document === "undefined" ? undefined : document.body,
);
