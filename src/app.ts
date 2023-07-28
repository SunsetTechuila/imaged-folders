import {
  cleanUpStorageAsync,
  createContextMenus,
  updateFolderImages,
  trackPlaylistsChanges,
} from "./modules";
import { getPlaylistsContainer } from "./utils";

export default async function main() {
  if (
    !Spicetify?.Locale ||
    !Spicetify?.URI ||
    !Spicetify?.ContextMenu ||
    !Spicetify?.CosmosAsync ||
    !Spicetify?.Platform?.LocalStorageAPI ||
    !getPlaylistsContainer()
  ) {
    setTimeout(main, 300);
    return;
  }

  cleanUpStorageAsync();
  updateFolderImages();
  createContextMenus();
  trackPlaylistsChanges();
}
