export interface Product {
  id: number;
  title: string;
  price: number;
  rating: number;
  thumbnail: string;
  description: string;
  category: string;
  images: string[];
  discountPercentage: number;
  stock?: number;
}

export interface User {
  id: number;
  nombre: string;
  email: string;
  rol: "admin" | "user";
  createdAt?: string;
}

export interface CartItem extends Product {
  quantity: number;
  productId: number;
}
