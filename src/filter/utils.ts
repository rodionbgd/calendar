export function showActiveAnchor(
  elList: HTMLElement[],
  activeAnchor: HTMLAnchorElement
) {
  if (elList.indexOf(activeAnchor) === -1) {
    return;
  }
  elList.forEach((anchor) => anchor.classList.remove("active"));
  activeAnchor.classList.add("active");
}
