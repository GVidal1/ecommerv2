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
  email: string;
  password: string;
  nombre: string;
  rol: 'admin' | 'user';
}

export interface CartItem extends Product {
  quantity: number;
  productId: number;
}
