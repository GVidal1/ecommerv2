import { createContext, useState, useEffect } from "react";
import { getProductsFromApi } from "../services/api";
import {
  getCartFromApi,
  addItemToCartApi,
  removeItemFromCartApi,
  updateCartQuantityApi,
  clearCartApi,
} from "../services/cartService";
import { logoutUser as logoutAuthService } from "../services/authService"; // Import del servicio real

import type { ReactNode } from "react";
import type { Product, User, CartItem } from "../types";

// Función auxiliar para manejar errores de la API de forma segura
const getErrorMessage = (error: unknown, defaultMessage: string): string => {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string"
  ) {
    return (error as { message: string }).message;
  }
  return defaultMessage;
};

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
  const [users] = useState<User[]>([]);
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

        const storedCurrentUser = localStorage.getItem("currentUser");
        if (storedCurrentUser) {
          const user = JSON.parse(storedCurrentUser);
          setCurrentUser(user);
          fetchUserCart(user.email);
        }

        setError(null);
      } catch (err: unknown) {
        console.error(err);
        setError("No se pudieron cargar los datos iniciales.");
      } finally {
        setIsLoading(false);
      }
    }
    loadInitialData();
  }, []);

  const fetchUserCart = async (email: string) => {
    try {
      const items = await getCartFromApi(email);
      setCart(items);
    } catch (e: unknown) {
      console.error("Error cargando carrito", e);
    }
  };

  const updateProductsState = (newProducts: Product[]) => {
    setProducts(newProducts);
  };

  const logoutUser = () => {
    setCurrentUser(null);
    setCart([]);
    logoutAuthService();
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
          // Aseguramos que el carrito se actualice si el producto cambia (ej: precio)
          const productUpdate = newProducts.find((p) => p.id === productId);
          return {
            ...item,
            ...updates,
            ...(productUpdate && {
              price: productUpdate.price,
              discountPercentage: productUpdate.discountPercentage,
            }),
          };
        }
        return item;
      })
    );
  };

  const generateNewProductId = (): number => {
    const currentMax = products.reduce(
      (maxId, product) =>
        typeof product.id === "number" ? Math.max(maxId, product.id) : maxId,
      0
    );
    return currentMax + 1;
  };

  // ACCIONES DEL CARRITO (API)

  const addProductToCart = async (product: Product, quantity = 1) => {
    if (!currentUser) {
      alert("Debes iniciar sesión para agregar al carrito");
      return;
    }
    try {
      const updatedItems = await addItemToCartApi(
        currentUser.email,
        product.id,
        quantity
      );
      setCart(updatedItems);
    } catch (error: unknown) {
      console.error("Error agregando al carrito", error);
      alert(getErrorMessage(error, "Error al agregar el producto al carrito."));
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
    } catch (error: unknown) {
      console.error("Error eliminando del carrito", error);
      alert(
        getErrorMessage(error, "Error al eliminar el producto del carrito.")
      );
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
    } catch (error: unknown) {
      console.error("Error actualizando cantidad", error);
      alert(
        getErrorMessage(error, "Error al actualizar la cantidad del carrito.")
      );
    }
  };

  const clearCart = async () => {
    if (!currentUser) return;
    try {
      await clearCartApi(currentUser.email);
      setCart([]);
    } catch (error: unknown) {
      console.error("Error vaciando carrito", error);
      alert(getErrorMessage(error, "Error al vaciar el carrito."));
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
    logoutUser,
    addProductToCart,
    removeProductFromCart,
    updateCartQuantity,
    clearCart,
    getTotalProductsInCart,
    getCartTotal,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
