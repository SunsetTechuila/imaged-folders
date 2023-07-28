import { folderSVGPath, storageItemPrefix } from "./constants";

export function hasImage(id: string): boolean {
  return Boolean(localStorage.getItem(`${storageItemPrefix}:${id}`));
}

export function isPlaylistsInGridView(): boolean {
  const { LocalStorageAPI } = Spicetify.Platform;
  return (
    Boolean(LocalStorageAPI.getItem("items-view")) &&
    LocalStorageAPI.getItem("ylx-sidebar-state") === 2
  );
}

export function cleanUpFolderImageContainer(container: Element): void {
  container.getElementsByClassName("main-image-image")[0]?.remove();
  container.querySelector('div[class *= "imagePlaceholder"]')?.remove();
}

export function createFolderIconPlaceholder(isGridView: boolean): HTMLDivElement {
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
  placeholderSVGPath.setAttribute("d", folderSVGPath);

  placeholderSVG.appendChild(placeholderSVGPath);
  placeholder.appendChild(placeholderSVG);

  return placeholder;
}

export function createFilePicker(): [HTMLFormElement, HTMLInputElement] {
  const filePickerForm = document.createElement("form");
  filePickerForm.setAttribute("aria-hidden", "true");

  const filePickerInput = document.createElement("input");
  filePickerInput.classList.add("hidden-visually");
  filePickerInput.setAttribute("type", "file");
  filePickerInput.accept = [
    "image/jpeg",
    "image/apng",
    "image/avif",
    "image/gif",
    "image/png",
    "image/webp",
  ].join(",");
  filePickerForm.appendChild(filePickerInput);

  return [filePickerForm, filePickerInput];
}
