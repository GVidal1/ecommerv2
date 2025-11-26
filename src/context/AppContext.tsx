import { createContext, useState, useEffect } from 'react';
import { getProductsFromApi } from '../services/api';
import {
  getCartFromApi,
  addItemToCartApi,
  removeItemFromCartApi,
  updateCartQuantityApi,
  clearCartApi,
} from '../services/cartService';

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

  // Carga inicial de datos
  useEffect(() => {
    async function loadInitialData() {
      setIsLoading(true);
      try {
        const apiProducts = await getProductsFromApi();
        setProducts(apiProducts);

        const storedUsers = localStorage.getItem('users');
        if (storedUsers) setUsers(JSON.parse(storedUsers));

        const storedCurrentUser = localStorage.getItem('currentUser');
        if (storedCurrentUser) {
          const user = JSON.parse(storedCurrentUser);
          setCurrentUser(user);
          fetchUserCart(user.email);
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

  // para traer el carrito actualizado
  const fetchUserCart = async (email: string) => {
    try {
      const items = await getCartFromApi(email);
      setCart(items);
    } catch (e) {
      console.error('Error cargando carrito', e);
    }
  };

  const updateProductsState = (newProducts: Product[]) => {
    setProducts(newProducts);
  };

  const persistUsers = (newUsers: User[]) => {
    setUsers(newUsers);
    localStorage.setItem('users', JSON.stringify(newUsers));
  };

  // AUTENTICACION
  const loginUser = (email: string, password: string): boolean => {
    const userFound = users.find(
      (u) => u.email === email && u.password === password
    );
    if (userFound) {
      setCurrentUser(userFound);
      localStorage.setItem('currentUser', JSON.stringify(userFound));
      fetchUserCart(userFound.email);
      return true;
    }
    return false;
  };

  const logoutUser = () => {
    setCurrentUser(null);
    setCart([]);
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

  //PRODUCTOS
  const addProduct = (product: Product) =>
    updateProductsState([product, ...products]);

  const removeProductById = (productId: number) => {
    updateProductsState(products.filter((p) => p.id !== productId));

    setCart((prevCart) =>
      prevCart.filter((item) => item.productId !== productId)
    );
  };

  const updateProductById = (productId: number, updates: Partial<Product>) => {
    const newProducts = products.map((product) =>
      product.id === productId ? { ...product, ...updates } : product
    );
    updateProductsState(newProducts);

    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.productId === productId) {
          return { ...item, ...updates };
        }
        return item;
      })
    );
  };

  const generateNewProductId = (): number => {
    const currentMax = products.reduce(
      (maxId, product) =>
        typeof product.id === 'number' ? Math.max(maxId, product.id) : maxId,
      0
    );
    return currentMax + 1;
  };

  // ACCIONES DEL CARRITO (API)

  const addProductToCart = async (product: Product, quantity = 1) => {
    if (!currentUser) {
      alert('Debes iniciar sesión para agregar al carrito');
      return;
    }
    try {
      // actualizamos el estado con la respuesta
      const updatedItems = await addItemToCartApi(
        currentUser.email,
        product.id,
        quantity
      );
      setCart(updatedItems);
    } catch (error) {
      console.error('Error agregando al carrito', error);
    }
  };

  const removeProductFromCart = async (productId: number) => {
    if (!currentUser) return;
    try {
      const updatedItems = await removeItemFromCartApi(
        currentUser.email,
        productId
      );
      setCart(updatedItems);
    } catch (error) {
      console.error('Error eliminando del carrito', error);
    }
  };

  const updateCartQuantity = async (productId: number, quantity: number) => {
    if (!currentUser) return;
    if (quantity <= 0) {
      removeProductFromCart(productId);
      return;
    }
    try {
      const updatedItems = await updateCartQuantityApi(
        currentUser.email,
        productId,
        quantity
      );
      setCart(updatedItems);
    } catch (error) {
      console.error('Error actualizando cantidad', error);
    }
  };

  const clearCart = async () => {
    if (!currentUser) return;
    try {
      await clearCartApi(currentUser.email);
      setCart([]);
    } catch (error) {
      console.error('Error vaciando carrito', error);
    }
  };

  // Calculos locales
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
