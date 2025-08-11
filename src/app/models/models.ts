export interface Category {
  id: string;
  name: string;
  urlImage: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  categoryId: string;
  oldPrice?: number;
}

export interface CartItem {
  product: Product;
  qty: number;
}
