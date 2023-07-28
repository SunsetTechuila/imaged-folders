import FolderImageData from "./types/folderImageData";
import { RootlistRow, RootlistRoot, RootlistFolder } from "./types/rootlist";
import {
  imageContainerSelector,
  imageContainerCardSelector,
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
} from "./helpers";

export function getPlaylistsContainer(): Element | null {
  return document.querySelector(
    isPlaylistsInGridView() ? playlistsContainerGridSelector : playlistsContainerSelector,
  );
}

export function getFolderElement(id: string): HTMLLIElement | null {
  return document.querySelector(
    `li.main-useDropTarget-folder:has(div[aria-labelledby *= "folder:${id}"])`,
  );
}

export function getFolderImageContainer(inputElement: Element): Element | null {
  return inputElement.querySelector(
    isPlaylistsInGridView() ? imageContainerCardSelector : imageContainerSelector,
  );
}

export function getFolderIDFrom(input: Element | string): string | undefined {
  if (input instanceof Element) {
    let id = getFolderIDFromElement(input);
    if (!id) {
      const target: HTMLElement | null = input.querySelector('div[aria-labelledby *= "folder:"]');
      if (target) id = getFolderIDFromElement(target);
    }
    return id;
  }

  return Spicetify.URI.from(input)?.id;
}

export function getFolderImageDataFromElement(inputElement: Element): FolderImageData | null {
  const id = getFolderIDFrom(inputElement);
  if (id) {
    const imageBase64 = localStorage.getItem(`${storageItemPrefix}:${id}`);
    if (imageBase64) {
      const imageContainer = getFolderImageContainer(inputElement);
      if (imageContainer) {
        return { imageContainer: imageContainer as HTMLElement, imageBase64 };
      }
    }
  }
  return null;
}

export function getFolderImagesData(): FolderImageData[] {
  const foldersImageData: FolderImageData[] = [];
  const folderElements = getAllFolderElements();

  for (let i = 0, max = folderElements.length; i < max; i += 1) {
    const folderImageData = getFolderImageDataFromElement(folderElements[i]);
    if (folderImageData) foldersImageData.push(folderImageData);
  }

  return foldersImageData;
}

export function addImageToFolderElement(imageContainer: Element, imageBase64: string): void {
  const image = document.createElement("img");
  const isCardView = imageContainer.className === "";
  image.classList.add(
    "main-image-image",
    "main-image-loaded",
    isCardView ? "main-cardImage-image" : "x-entityImage-image",
  );
  image.src = imageBase64;
  cleanUpFolderImageContainer(imageContainer);
  imageContainer.prepend(image);
}

export function addPlaceholderToFolderElement(imageContainer: Element): void {
  const isGridView = imageContainer.className === "";
  const placeholder = createFolderIconPlaceholder(isGridView);
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
