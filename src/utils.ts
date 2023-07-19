import {
  imageContainerXSelector,
  imageContainerXCardSelector,
  playlistIconsExtensionClass,
  storageItemPrefix,
  rootlistAPIURL,
  playlistsContainerGridSelector,
  playlistsContainerSelector,
} from "./constants";
import {
  cleanUpFolderImageContainer,
  getFolderIDFromElement,
  getAllFolderElements,
  isPlaylistsInGridView,
  createFolderIconPlaceholder,
  createFolderIconPlaceholderX,
  isLibraryX
} from "./helpers";
import { RootlistRow, RootlistRoot, RootlistFolder } from "./types/rootlist";

export function getPlaylistsContainer(): Element | null {
  if (isLibraryX()) {
    if (isPlaylistsInGridView()) return document.querySelector(playlistsContainerGridSelector);
  }
  return document.querySelector(playlistsContainerSelector);
}

export function getFolderElement(id: string): HTMLLIElement | null {
  return document.querySelector(
    isLibraryX()
      ? `li.main-useDropTarget-folder:has(div[aria-labelledby *= "folder:${id}"])`
      : `li.main-rootlist-rootlistItem:has(.main-rootlist-rootlistItemLink[href *= "folder/${id}"])`,
  );
}

export function getFolderImageContainer(inputElement: Element): Element | null {
  if (isLibraryX()) {
    let container = inputElement.querySelector(imageContainerXSelector);
    if (!container) {
      container = inputElement.querySelector(imageContainerXCardSelector);
    }
    return container;
  }

  const hasPlaceForIcon = inputElement.firstElementChild?.classList.contains(
    playlistIconsExtensionClass,
  );
  return hasPlaceForIcon ? inputElement : null;
}

export function getFolderIDFrom(input: Element | string): string | undefined {
  if (input instanceof Element) {
    let id = getFolderIDFromElement(input);
    if (!id) {
      const target: HTMLElement | null = input.querySelector(
        isLibraryX()
          ? 'div[aria-labelledby *= "folder:"]'
          : 'a.main-rootlist-rootlistItemLink[href *= "folder/"]',
      );
      if (target) id = getFolderIDFromElement(target);
    }
    return id;
  }

  return Spicetify.URI.from(input)?.id;
}

export function getFolderImagesData(): { imageContainer: HTMLElement; imageBase64: string }[] {
  const foldersImageData: { imageContainer: HTMLElement; imageBase64: string }[] = [];
  const folderElements = getAllFolderElements();

  for (let i = 0, max = folderElements.length; i < max; i += 1) {
    const id = getFolderIDFrom(folderElements[i]);
    if (id) {
      const imageBase64 = localStorage.getItem(`${storageItemPrefix}:${id}`);
      if (imageBase64) {
        const imageContainer = getFolderImageContainer(folderElements[i]);
        if (imageContainer) {
          foldersImageData.push({ imageContainer: imageContainer as HTMLElement, imageBase64 });
        }
      }
    }
  }

  return foldersImageData;
}

export function addImageToFolderElement(imageContainer: Element, imageBase64: string): void {
  const image = document.createElement("img");
  if (isLibraryX()) {
    const isCardView = imageContainer.className === "";
    image.classList.add(
      "main-image-image",
      "main-image-loaded",
      isCardView ? "main-cardImage-image" : "x-entityImage-image",
    );
  } else {
    image.classList.add(playlistIconsExtensionClass);
  }
  image.src = imageBase64;
  cleanUpFolderImageContainer(imageContainer);
  imageContainer.prepend(image);
}

export function addPlaceholderToFolderElement(imageContainer: Element): void {
  const isGridView = imageContainer.className === "";
  const placeholder = isLibraryX()
    ? createFolderIconPlaceholderX(isGridView)
    : createFolderIconPlaceholder();
  cleanUpFolderImageContainer(imageContainer);
  imageContainer.prepend(placeholder);
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
    "image/svg+xml",
    "image/webp",
  ].join(",");
  filePickerForm.appendChild(filePickerInput);

  return [filePickerForm, filePickerInput];
}

export async function fetchFolderIDsAsync(): Promise<string[]> {
  const IDs: string[] = [];
  const result: RootlistRoot = await Spicetify.CosmosAsync.get(rootlistAPIURL);

  function processRowsRecursive(inputRow: RootlistRow) {
    if (inputRow.type === "folder") {
      IDs.push(inputRow.id);
      (inputRow as RootlistFolder).rows?.forEach((row) => processRowsRecursive(row));
    }
  }

  result.rows?.forEach((row) => processRowsRecursive(row));
  return IDs;
}

export function hasImage(id: string): boolean {
  return Boolean(localStorage.getItem(`${storageItemPrefix}:${id}`));
}
