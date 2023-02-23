export default class Selfie {
  selfieId: string;

  selfieUrl: string;

  selfieThumbnail: string;

  shiftX: number | null;

  shiftY: number | null;

  zoom: number | null;

  width: number | null;

  height: number | null;

  constructor(
    selfieId: string,
    selfieUrl: string,
    selfieThumbnail: string,
    shiftX: number | null,
    shiftY: number | null,
    zoom: number | null,
    width: number | null,
    height: number | null,
  ) {
    this.selfieId = selfieId;
    this.selfieUrl = selfieUrl;
    this.selfieThumbnail = selfieThumbnail;
    this.shiftX = shiftX;
    this.shiftY = shiftY;
    this.zoom = zoom;
    this.width = width;
    this.height = height;
  }
}
