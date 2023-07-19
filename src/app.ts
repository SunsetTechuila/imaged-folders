
import {
  cleanUpStorageAsync,
  createContextMenus,
  updateFolderImages,
  trackPlaylistsChanges,
  waitForInitAsync,
} from "./modules";

export default async function main() {
  await waitForInitAsync();
  cleanUpStorageAsync();
  updateFolderImages();
  createContextMenus();
  trackPlaylistsChanges();
}
