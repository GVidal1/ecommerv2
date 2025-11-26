import { createContext, useState, useEffect } from 'react';
import { getProductsFromApi } from '../services/api';
import type { ReactNode } from 'react';
import type { Product, User, CartItem } from '../types';

interface AppContextType {
  products: Product[];
  users: User[];
  currentUser: User | null;
  cart: CartItem[];
  isLoading: boolean;
  error: string | null;
  // Acciones de Productos
  addProduct: (product: Product) => void;
  removeProductById: (productId: number) => void;
  updateProductById: (productId: number, updates: Partial<Product>) => void;
  generateNewProductId: () => number;
  // Acciones de Autenticación/Usuarios
  loginUser: (email: string, password: string) => boolean;
  logoutUser: () => void;
  addUser: (user: User) => boolean;
  removeUserByEmail: (email: string) => void;
  // Acciones del Carrito
  addProductToCart: (product: Product, quantity?: number) => void;
  removeProductFromCart: (productId: number) => void;
  updateCartQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalProductsInCart: () => number;
  getCartTotal: () => number;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadInitialData() {
      setIsLoading(true);
      try {
        const apiProducts = await getProductsFromApi();
        setProducts(apiProducts);

        const storedUsers = localStorage.getItem('users');
        if (storedUsers) {
          setUsers(JSON.parse(storedUsers));
        }

        const storedCurrentUser = localStorage.getItem('currentUser');
        if (storedCurrentUser) {
          setCurrentUser(JSON.parse(storedCurrentUser));
        }

        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
          setCart(JSON.parse(storedCart));
        }

        setError(null);
      } catch (err) {
        console.error(err);
        setError('No se pudieron cargar los datos iniciales.');
      } finally {
        setIsLoading(false);
      }
    }

    loadInitialData();
  }, []);

  const updateProductsState = (newProducts: Product[]) => {
    setProducts(newProducts);
  };

  const persistUsers = (newUsers: User[]) => {
    setUsers(newUsers);
    localStorage.setItem('users', JSON.stringify(newUsers));
  };

  const persistCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  // AUTENTICACION
  const loginUser = (email: string, password: string): boolean => {
    const userFound = users.find(
      (u) => u.email === email && u.password === password
    );
    if (userFound) {
      setCurrentUser(userFound);
      localStorage.setItem('currentUser', JSON.stringify(userFound));
      return true;
    }
    return false;
  };

  const logoutUser = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  // USUARIOS
  const addUser = (user: User): boolean => {
    if (users.find((u) => u.email === user.email)) {
      console.error('El email ya está registrado');
      return false;
    }
    persistUsers([...users, user]);
    return true;
  };

  const removeUserByEmail = (email: string) => {
    persistUsers(users.filter((u) => u.email !== email));
  };

  // PRODUCTOS

  const addProduct = (product: Product) => {
    updateProductsState([product, ...products]);
  };

  const removeProductById = (productId: number) => {
    updateProductsState(products.filter((p) => p.id !== productId));
  };

  const updateProductById = (productId: number, updates: Partial<Product>) => {
    const newProducts = products.map((product) => {
      if (product.id === productId) {
        return { ...product, ...updates };
      }
      return product;
    });
    updateProductsState(newProducts);
  };

  const generateNewProductId = (): number => {
    const currentMax = products.reduce((maxId, product) => {
      if (typeof product.id === 'number') {
        return Math.max(maxId, product.id);
      }
      return maxId;
    }, 0);
    return currentMax + 1;
  };

  // CARRITO
  const addProductToCart = (product: Product, quantity = 1) => {
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      updateCartQuantity(product.id, existingItem.quantity + quantity);
    } else {
      persistCart([...cart, { ...product, quantity: quantity }]);
    }
  };

  const removeProductFromCart = (productId: number) => {
    persistCart(cart.filter((item) => item.id !== productId));
  };

  const updateCartQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeProductFromCart(productId);
      return;
    }

    const updatedCart = cart.map((item) =>
      item.id === productId ? { ...item, quantity } : item
    );
    persistCart(updatedCart);
  };

  const clearCart = () => {
    persistCart([]);
  };

  const getTotalProductsInCart = (): number => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = (): number => {
    return cart.reduce((total, item) => {
      const itemTotal = item.price * item.quantity;
      const discount = item.discountPercentage
        ? (itemTotal * item.discountPercentage) / 100
        : 0;
      return total + (itemTotal - discount);
    }, 0);
  };

  const value = {
    products,
    users,
    currentUser,
    cart,
    isLoading,
    error,
    addProduct,
    removeProductById,
    updateProductById,
    generateNewProductId,
    loginUser,
    logoutUser,
    addUser,
    removeUserByEmail,
    addProductToCart,
    removeProductFromCart,
    updateCartQuantity,
    clearCart,
    getTotalProductsInCart,
    getCartTotal,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
