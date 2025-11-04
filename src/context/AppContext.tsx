import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { getProductsFromApi } from '../services/api';
import usuariosBase from '../constants/listBaseUsers';

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
}

export interface User {
  email: string;
  password: string;
  nombre: string;
  rol: 'admin' | 'user';
}

interface AppContextType {
  products: Product[];
  users: User[];
  currentUser: User | null;
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
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadInitialData() {
      setIsLoading(true);
      try {
        // 1. Cargar Productos
        const apiProducts = await getProductsFromApi();
        setProducts(apiProducts);

        // 2. Cargar Usuarios
        const storedUsers = localStorage.getItem('users');
        if (storedUsers) {
          setUsers(JSON.parse(storedUsers));
        } else {
          // Si no hay nada, cargamos la lista base y la guardamos
          setUsers(usuariosBase);
          localStorage.setItem('users', JSON.stringify(usuariosBase));
        }

        // 3. Cargar Usuario Actual
        const storedCurrentUser = localStorage.getItem('currentUser');
        if (storedCurrentUser) {
          setCurrentUser(JSON.parse(storedCurrentUser));
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
  }, []); // El array vacío [] significa que solo se ejecuta al montar el componente

  // --- Funciones "Helper" para persistir ---
  // (Actualizan el estado Y el localStorage)

  const persistProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    localStorage.setItem('products', JSON.stringify(newProducts));
  };

  const persistUsers = (newUsers: User[]) => {
    setUsers(newUsers);
    localStorage.setItem('users', JSON.stringify(newUsers));
  };

  // --- Acciones (Lógica de tu antiguo store.ts) ---

  // Acciones de Autenticación
  const loginUser = (email: string, password: string): boolean => {
    const userFound = users.find(
      (u) => u.email === email && u.password === password
    );
    if (userFound) {
      setCurrentUser(userFound); // <-- Esto es REACTIVO
      localStorage.setItem('currentUser', JSON.stringify(userFound));
      return true;
    }
    return false;
  };

  const logoutUser = () => {
    setCurrentUser(null); // <-- Esto es REACTIVO
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

  // --- 5. Exponer el Valor ---
  // (Pasamos todos los estados y funciones al proveedor)
  const value = {
    products,
    users,
    currentUser,
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
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
