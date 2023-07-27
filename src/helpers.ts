import {
  folderElementXSelector,
  folderElementSelector,
  folderSVGPath,
  folderSVGPathX,
} from "./constants";

export function isLibraryX(): boolean {
  return Boolean(document.getElementsByClassName("main-yourLibraryX-entryPoints")[0]);
}

export function getAllFolderElements(): NodeListOf<HTMLLIElement> {
  return isLibraryX()
    ? document.querySelectorAll(folderElementXSelector)
    : document.querySelectorAll(folderElementSelector);
}

export function getFolderIDFromElement(inputElement: Element): string | undefined {
  const match = isLibraryX()
    ? inputElement.getAttribute("aria-labelledby")?.match(/folder:(\w+)$/)
    : inputElement.getAttribute("href")?.match(/folder\/(\w+)$/);
  if (match) return match[1];
  return undefined;
}

export function cleanUpFolderImageContainer(container: Element): void {
  if (isLibraryX()) {
    container.getElementsByClassName("main-image-image")[0]?.remove();
    container.querySelector('div[class *= "imagePlaceholder"]')?.remove();
  } else {
    container.replaceChildren();
  }
}

export function isPlaylistsInGridView(): boolean {
  const { LocalStorageAPI } = Spicetify.Platform;
  return (
    Boolean(LocalStorageAPI.getItem("items-view")) &&
    LocalStorageAPI.getItem("ylx-sidebar-state") === 2
  );
}

export function createFolderIconPlaceholder(): SVGSVGElement {
  const placeholderSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const placeholderSVGPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
  const placeholderSVGPath2 = document.createElementNS("http://www.w3.org/2000/svg", "path");

  placeholderSVG.setAttribute("height", "24px");
  placeholderSVG.setAttribute("viewBox", "0 0 24 24");
  placeholderSVG.setAttribute("width", "24px");
  placeholderSVG.setAttribute("fill", "#FFFFFF");
  placeholderSVGPath.setAttribute("d", "M0 0h24v24H0V0z");
  placeholderSVGPath.setAttribute("fill", "none");
  placeholderSVGPath2.setAttribute("d", folderSVGPath);

  placeholderSVG.append(placeholderSVGPath, placeholderSVGPath2);

  return placeholderSVG;
}

export function createFolderIconPlaceholderX(isGridView: boolean): HTMLDivElement {
  const placeholder = document.createElement("div");
  const placeholderSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const placeholderSVGPath = document.createElementNS("http://www.w3.org/2000/svg", "path");

  const size = isGridView ? "64" : "24";
  placeholder.classList.add(
    isGridView ? "main-card-imagePlaceholder" : "x-entityImage-imagePlaceholder",
  );
  placeholderSVG.classList.add(
    "Svg-sc-ytk21e-0",
    isGridView ? "Svg-img-textSubdued-64-icon" : "Svg-img-24-icon",
  );
  placeholderSVG.setAttribute("height", `${size}px`);
  placeholderSVG.setAttribute("width", `${size}px`);
  placeholderSVG.setAttribute("viewBox", "0 0 24 24");
  placeholderSVG.setAttribute("aria-hidden", "true");
  placeholderSVG.setAttribute("role", "img");
  placeholderSVGPath.setAttribute("d", folderSVGPathX);

  placeholderSVG.appendChild(placeholderSVGPath);
  placeholder.appendChild(placeholderSVG);

  return placeholder;
}
