export interface IPaymentObject {
  albumInfo: {
    createdAt: Date;
    name: string | null;
    albumId: string;
    location: string | null;
    userId: string;
  };
  count: number;
}
