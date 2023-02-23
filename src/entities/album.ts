import Photo from "./photo";

export default class Album {
  albumId: string;

  name: string | null;

  location: string | null;

  createdAt: Date;

  isUnlocked: boolean;

  cover: string;

  photos: Photo[];

  constructor(
    albumId: string,
    name: string | null,
    location: string | null,
    createdAt: Date,
    isUnlocked: boolean,
    cover: string,
    photos: Photo[],
  ) {
    this.albumId = albumId;
    this.name = name;
    this.location = location;
    this.createdAt = createdAt;
    this.isUnlocked = isUnlocked;
    this.cover = cover;
    this.photos = photos;
  }
}
