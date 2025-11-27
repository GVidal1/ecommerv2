// src/features/auth/utils/authUtils.ts

import {
  getAuthToken,
  validateTokenApi,
  logoutUser,
} from "../../../services/authService";

export interface CurrentUser {
  id: number;
  email: string;
  nombre: string;
  rol: "admin" | "user";
}

/**
 * Obtiene el usuario actual desde localStorage
 */
export const getCurrentUser = (): CurrentUser | null => {
  const stored = localStorage.getItem("currentUser");
  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch (error) {
    console.error("Error al parsear currentUser:", error);
    return null;
  }
};

/**
 * Verifica si el usuario es administrador
 */
export const isAdmin = (): boolean => {
  const user = getCurrentUser();
  return user?.rol === "admin";
};

/**
 * Verifica si hay un usuario autenticado (con token válido)
 */
export const isAuthenticated = (): boolean => {
  const user = getCurrentUser();
  const token = getAuthToken();
  return !!(user && token);
};

/**
 * Valida el token con el backend
 */
export const validateCurrentSession = async (): Promise<boolean> => {
  const token = getAuthToken();

  if (!token) {
    clearSession();
    return false;
  }

  const isValid = await validateTokenApi(token);

  if (!isValid) {
    clearSession();
    return false;
  }

  return true;
};

/**
 * Limpia la sesión del usuario
 */
export const clearSession = (): void => {
  logoutUser();
};

/**
 * Obtiene el ID del usuario actual
 */
export const getCurrentUserId = (): number | null => {
  const user = getCurrentUser();
  return user?.id || null;
};

/**
 * DEPRECADO: Ya no necesitamos inicializar usuarios en localStorage
 * El backend maneja todo esto ahora
 */
export const initializeUsers = () => {
  console.warn(
    "initializeUsers está deprecado. Los usuarios se manejan en el backend."
  );
  return [];
};
