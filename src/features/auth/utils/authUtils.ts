import usuariosBase from "../../../constants/listBaseUsers";
import type { User } from "../../../constants/listBaseUsers";

export const initializeUsers = (): User[] => {
  const stored = localStorage.getItem("users");
  if (!stored) {
    localStorage.setItem("users", JSON.stringify(usuariosBase));
    return usuariosBase;
  }
  return JSON.parse(stored);
};

export const getCurrentUser = () => {
  const stored = localStorage.getItem("currentUser");
  return stored ? JSON.parse(stored) : null;
};

export const isAdmin = (): boolean => {
  const user = getCurrentUser();
  return user && user.rol === "admin";
};

export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};
