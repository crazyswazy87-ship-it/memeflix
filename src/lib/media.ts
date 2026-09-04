import { appwriteConfig, storage } from "./appwrite/config";


export function getImageUrl(imageId: string) {
  return storage
    .getFilePreview(appwriteConfig.storageId, imageId, 800, 800)
    .toString();
}