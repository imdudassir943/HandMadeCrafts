export interface Product {
  id: string;
  name: string;
  nameUr: string;
  price: number;
  image: string;
  images: string[];
  category: string;
  categoryUr: string;
  material: string;
  materialUr: string;
  artisan: string;
  artisanUr: string;
  artisanImage: string;
  description: string;
  descriptionUr: string;
  rating: number;
  reviewsCount: number;
  dimensions: string;
  dimensionsUr: string;
  inStock: boolean;
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Review {
  id: string;
  author: string;
  authorUr: string;
  rating: number;
  comment: string;
  commentUr: string;
  date: string;
}

export interface User {
  name: string;
  email: string;
}

