// The slider shows the photos plus a copy of the first one at the end. Sliding onto the copy
// looks identical to the first photo, so the jump back to the start is invisible: a loop.
export const slideIndex = (el: HTMLElement) => Math.round(el.scrollLeft / el.clientWidth);

export const jumpTo = (el: HTMLElement, index: number) =>
  el.scrollTo({ left: index * el.clientWidth, behavior: "instant" });

/** Moves one photo forward (1) or back (-1), wrapping round at both ends. */
export function stepSlide(el: HTMLElement, direction: 1 | -1, count: number) {
  let index = slideIndex(el);
  if (index >= count) {
    jumpTo(el, 0); // already on the copy: continue from the real first photo
    index = 0;
  }
  if (direction === -1 && index === 0) jumpTo(el, count); // from the copy, glide back to the last
  el.scrollBy({ left: direction * el.clientWidth });
}

/** After a slide settles on the copy, quietly move to the real first photo. */
export function settleLoop(el: HTMLElement, count: number) {
  if (slideIndex(el) >= count) jumpTo(el, 0);
}
