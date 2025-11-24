export interface Wish {
  id: number;
  kidName: string;
  wish: string;
  price: number;
  bought: boolean;
  whereToBuy?: string;
  expectedDate?: string;
  obtained: boolean;
  createdAt: string;
}
