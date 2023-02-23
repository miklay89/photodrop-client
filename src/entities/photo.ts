export default class Photo {
  photoId: string;

  url: string;

  thumbnail: string;

  createdAt: Date;

  albumId: string;

  constructor(
    photoId: string,
    url: string,
    thumbnail: string,
    createdAt: Date,
    albumId: string,
  ) {
    this.photoId = photoId;
    this.url = url;
    this.thumbnail = thumbnail;
    this.createdAt = createdAt;
    this.albumId = albumId;
  }
}
