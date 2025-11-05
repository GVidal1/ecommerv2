import { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { getProductsFromApi } from '../services/api';
import usuariosBase from '../constants/listBaseUsers';
import type { Product, User, CartItem } from '../types/index';

interface AppContextType {
  products: Product[];
  users: User[];
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;

  // Estado y Acciones del Carrito
  cart: CartItem[];
  addProductToCart: (product: Product) => void;
  removeProductFromCart: (productId: number) => void;
  updateCartQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getTotalProductsInCart: () => number;

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
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estado cal Carrito
  const [cart, setCart] = useState<CartItem[]>([]);

  // Carga Inicial (Productos, Usuarios Y Carrito)
  useEffect(() => {
    async function loadInitialData() {
      setIsLoading(true);
      try {
        const apiProducts = await getProductsFromApi();
        setProducts(apiProducts);

        const storedUsers = localStorage.getItem('users');
        setUsers(storedUsers ? JSON.parse(storedUsers) : usuariosBase);
        if (!storedUsers) {
          localStorage.setItem('users', JSON.stringify(usuariosBase));
        }

        const storedCurrentUser = localStorage.getItem('currentUser');
        if (storedCurrentUser) {
          setCurrentUser(JSON.parse(storedCurrentUser));
        }

        // Cargar carrito de localStorage
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

  // (Se ejecuta CADA VEZ que el 'cart' cambia)
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, isLoading]);

  // Funciones del Carrito

  const addProductToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeProductFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const updateCartQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeProductFromCart(productId);
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === productId ? { ...item, quantity: quantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = (): number => {
    return (
      Math.round(
        cart.reduce(
          (acc, item) =>
            acc +
            (item.price * item.quantity -
              (item.price * item.discountPercentage) / 100),
          0
        ) * 100
      ) / 100
    );
  };

  const getTotalProductsInCart = (): number => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  };

  // --- (Funciones de persistencia de productos y usuarios) ---
  const persistProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    localStorage.setItem('products', JSON.stringify(newProducts));
  };

  const persistUsers = (newUsers: User[]) => {
    setUsers(newUsers);
    localStorage.setItem('users', JSON.stringify(newUsers));
  };

  // Acciones de Autenticación
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

  // Acciones de Admin de Usuarios
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

  // Acciones de Productos
  const addProduct = (product: Product) => {
    persistProducts([product, ...products]);
  };

  const removeProductById = (productId: number) => {
    persistProducts(products.filter((p) => p.id !== productId));
  };

  const updateProductById = (productId: number, updates: Partial<Product>) => {
    let updated = false;
    const newProducts = products.map((product) => {
      if (product.id === productId) {
        updated = true;
        return { ...product, ...updates };
      }
      return product;
    });

    if (updated) {
      persistProducts(newProducts);
    }
  };

  const generateNewProductId = (): number => {
    const currentMax = products.reduce((maxId, product) => {
      if (typeof product.id === 'number' && product.id >= 200) {
        return Math.max(maxId, product.id);
      }
      return maxId;
    }, 199);
    return currentMax + 1;
  };

  const value = {
    // Valores Globales
    products,
    users,
    currentUser,
    isLoading,
    error,

    // Carrito y sus funciones
    cart,
    addProductToCart,
    removeProductFromCart,
    updateCartQuantity,
    clearCart,
    getCartTotal,
    getTotalProductsInCart,

    // (Otras funciones de persistencia en localStorage)
    addProduct,
    removeProductById,
    updateProductById,
    generateNewProductId,
    loginUser,
    logoutUser,
    addUser,
    removeUserByEmail,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
