export interface IimageReview {
  image: string;
  imageId: number;
}

export interface Ireviews {
  id: number;
  product_id: number;
  customer_id: number;
  rating: number;
  approved: false;
  created_at: string;
  award: number;
  content?: string;
  customers: {
    firstName: string;
    lastName: string;
    email: string;
    customerId: string;
  };
  images: IimageReview[];
}
