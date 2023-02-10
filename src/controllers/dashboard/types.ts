export interface IPhoto {
  photoId: string;
  unlockedPhotoUrl?: string;
  unlockedThumbnailUrl?: string;
  lockedPhotoUrl?: string;
  lockedThumbnailUrl?: string;
  createdAt: Date;
  albumId: string;
  clients: string;
  url?: string;
  thumbnail?: string;
  albumCover?: string;
}
export interface IAlbum {
  albumId: string;
  name: string;
  location: string;
  createdAt: Date;
  isUnlocked: boolean;
  photos: IPhoto[];
}
