import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { getProductsFromApi } from "../services/api";
import usuariosBase from "../constants/listBaseUsers";

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
  rol: "admin" | "user";
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
  const [users, setUsers] = useState<User[]>(usuariosBase);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadInitialData() {
      setIsLoading(true);
      try {
        const apiProducts = await getProductsFromApi();
        setProducts(apiProducts);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los datos iniciales.");
      } finally {
        setIsLoading(false);
      }
    }

    loadInitialData();
  }, []);

  // Acciones de Autenticación
  const loginUser = (email: string, password: string): boolean => {
    const userFound = users.find(
      (u) => u.email === email && u.password === password
    );
    if (userFound) {
      setCurrentUser(userFound);
      return true;
    }
    return false;
  };

  const logoutUser = () => {
    setCurrentUser(null);
  };

  // Acciones de Admin de Usuarios
  const addUser = (user: User): boolean => {
    if (users.find((u) => u.email === user.email)) {
      console.error("El email ya está registrado");
      return false;
    }
    setUsers([...users, user]);
    return true;
  };

  const removeUserByEmail = (email: string) => {
    setUsers(users.filter((u) => u.email !== email));
  };

  // Acciones de Productos
  const addProduct = (product: Product) => {
    setProducts([product, ...products]);
  };

  const removeProductById = (productId: number) => {
    setProducts(products.filter((p) => p.id !== productId));
  };

  const updateProductById = (productId: number, updates: Partial<Product>) => {
    setProducts(
      products.map((product) =>
        product.id === productId ? { ...product, ...updates } : product
      )
    );
  };

  const generateNewProductId = (): number => {
    const currentMax = products.reduce((maxId, product) => {
      if (typeof product.id === "number" && product.id >= 200) {
        return Math.max(maxId, product.id);
      }
      return maxId;
    }, 199);
    return currentMax + 1;
  };

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
