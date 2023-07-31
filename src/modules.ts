import { hasImage, createFilePicker, hasImageElement } from "./helpers";
import {
  storageItemPrefix,
  rootlistSelector,
  localeChoosePhotoString,
  localeFailNotificationString,
  localeRemovePhotoString,
} from "./constants";
import {
  fetchFolderIDsAsync,
  addImageToFolderElement,
  getFolderElement,
  getFolderImagesData,
  getFolderImageContainer,
  addPlaceholderToFolderElement,
  getFolderIdFrom,
  getPlaylistsContainer,
  optimizeImageAsync,
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
    if (!hasImageElement(foldersImageData[i].imageContainer))
      addImageToFolderElement(foldersImageData[i].imageContainer, foldersImageData[i].imageBase64);
  }
}

export function createContextMenus(): void {
  const { ContextMenu, Locale } = Spicetify;
  const { isFolder } = Spicetify.URI;
  const removePhotoText = Locale.get(localeRemovePhotoString);
  const failNotificationText = Locale.get(localeFailNotificationString);
  const choosePhotoText = Locale.get(localeChoosePhotoString);

  const [filePickerForm, filePickerInput] = createFilePicker();
  document.body.appendChild(filePickerForm);
  filePickerInput.onchange = () => {
    if (!filePickerInput.files?.length) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const { id } = filePickerInput;
        let imageBase64 = event.target?.result as string;
        const sizeKB = (`${storageItemPrefix}:${id}${imageBase64}`.length * 2) / 1000;
        if (sizeKB > 150) imageBase64 = await optimizeImageAsync(imageBase64);
        setFolderImage(id, imageBase64);
      } catch (error) {
        Spicetify.showNotification(`${failNotificationText}\n${String(error)}`, true);
      }
    };
    reader.readAsDataURL(filePickerInput.files[0]);
  };

  new ContextMenu.Item(
    removePhotoText,
    ([uri]) => {
      const id = getFolderIdFrom(uri);
      if (id) removeFolderImage(id);
    },
    ([uri]) => isFolder(uri) && hasImage(getFolderIdFrom(uri) as string),
    "x",
  ).register();

  new ContextMenu.Item(
    choosePhotoText,
    ([uri]) => {
      const id = getFolderIdFrom(uri);
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

export function trackPlaylistsChanges(): void {
  let playlistsContainer = getPlaylistsContainer();
  const playlistsContainerObserverConfig = { childList: true };
  const playlistsContainerObserver = new MutationObserver(updateFolderImages);

  const rootlist = document.querySelector(rootlistSelector);
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const rootlistObserver = new MutationObserver(handleRootlistMutation);

  function handleRootlistMutation(): void {
    if (!playlistsContainer?.isConnected) {
      playlistsContainer = getPlaylistsContainer();
      if (!playlistsContainer) {
        setTimeout(handleRootlistMutation, 300);
        return;
      }
      updateFolderImages();
      playlistsContainerObserver.observe(
        playlistsContainer as Node,
        playlistsContainerObserverConfig,
      );
    }
  }

  rootlistObserver.observe(rootlist as Node, { childList: true });
  playlistsContainerObserver.observe(playlistsContainer as Node, playlistsContainerObserverConfig);
}
