import { storageItemPrefix, rootlistXClass } from "./constants";
import {
  createFilePicker,
  fetchFolderIDsAsync,
  addImageToFolderElement,
  getFolderElement,
  getFolderImagesData,
  getFolderImageContainer,
  addPlaceholderToFolderElement,
  getFolderIDFrom,
  hasImage,
  getPlaylistsContainer,
} from "./utils";

function setFolderImage(id: string, imageBase64: string): void {
  localStorage.setItem(`${storageItemPrefix}:${id}`, imageBase64);
  const folderElement = getFolderElement(id);
  if (folderElement) {
    const imageContainer = getFolderImageContainer(folderElement);
    if (imageContainer) addImageToFolderElement(imageContainer, imageBase64);
  }
}

function removeFolderImage(id: string): void {
  localStorage.removeItem(`${storageItemPrefix}:${id}`);
  const folderElement = getFolderElement(id);
  if (folderElement) {
    const imageContainer = getFolderImageContainer(folderElement);
    if (imageContainer) addPlaceholderToFolderElement(imageContainer);
  }
}

export async function cleanUpStorageAsync(): Promise<void> {
  const IDs = await fetchFolderIDsAsync();
  for (let i = 0, max = localStorage.length; i < max; i += 1) {
    // @ts-ignore
    const key: string = localStorage.key(i);
    const regex = new RegExp(`${storageItemPrefix}:(\\w+)$`);
    const match = key.match(regex);
    if (match) {
      const id = match[1];
      const index = IDs.indexOf(id);
      if (index === -1) localStorage.removeItem(key);
    }
  }
}

export function updateFolderImages(): void {
  const foldersImageData = getFolderImagesData();
  for (let i = 0, max = foldersImageData.length; i < max; i += 1) {
    addImageToFolderElement(foldersImageData[i].imageContainer, foldersImageData[i].imageBase64);
  }
}

export function createContextMenus(): void {
  // @ts-ignore
  const { ContextMenu, Locale } = Spicetify;
  const { isFolder } = Spicetify.URI;
  const removePhotoText = Locale.get("playlist.edit-details.remove-photo");
  const notificationText = Locale.get("playlist.edit-details.error.file-upload-failed");
  const addPhotoText = Locale.get("choose_photo");

  const [filePickerForm, filePickerInput] = createFilePicker();
  document.body.appendChild(filePickerForm);
  filePickerInput.onchange = () => {
    if (!filePickerInput.files?.length) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        setFolderImage(filePickerInput.id, event.target?.result as string);
      } catch {
        Spicetify.showNotification(notificationText);
      }
    };
    reader.readAsDataURL(filePickerInput.files[0]);
  };

  new ContextMenu.Item(
    removePhotoText,
    ([uri]) => {
      const id = getFolderIDFrom(uri);
      if (id) removeFolderImage(id);
    },
    ([uri]) => isFolder(uri) && hasImage(getFolderIDFrom(uri) as string),
    "x",
  ).register();

  new ContextMenu.Item(
    addPhotoText,
    ([uri]) => {
      const id = getFolderIDFrom(uri);
      if (id) {
        filePickerInput.id = id;
        filePickerForm.reset();
        filePickerInput.click();
      }
    },
    ([uri]) => isFolder(uri),
    "edit",
  ).register();
}

export async function waitForInitAsync(): Promise<unknown> {
  return new Promise((resolve) => {
    const checkInit = () => {
      if (
        // @ts-ignore
        Spicetify?.Locale &&
        Spicetify?.URI &&
        Spicetify?.ContextMenu &&
        Spicetify?.CosmosAsync &&
        Spicetify?.Platform?.LocalStorageAPI &&
        getPlaylistsContainer()
      ) {
        resolve(true);
      } else {
        setTimeout(checkInit, 300);
      }
    };
    checkInit();
  });
}

export function trackPlaylistsChanges(): void {
  let playlistsContainer = getPlaylistsContainer();
  const playlistsContainerObserverConfig = { childList: true };
  const playlistsContainerObserver = new MutationObserver(updateFolderImages);

  const rootlist = document.getElementsByClassName(rootlistXClass)[0];
  const rootlistObserverConfig = { childList: true, subtree: true };
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const rootlistObserver = new MutationObserver(handleRootlistMutation);

  function handleRootlistMutation(): void {
    if (!playlistsContainer?.isConnected) {
      playlistsContainer = getPlaylistsContainer();
      if (!playlistsContainer) {
        setTimeout(handleRootlistMutation, 300);
        return;
      }
      playlistsContainerObserver.observe(
        playlistsContainer as Node,
        playlistsContainerObserverConfig,
      );
    }
  }

  rootlistObserver.observe(rootlist, rootlistObserverConfig);
  playlistsContainerObserver.observe(playlistsContainer as Node, playlistsContainerObserverConfig);
}
