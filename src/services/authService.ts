// src/services/authService.ts

import { API_AUTH_URL } from "../constants/apiLinks";

// ========== INTERFACES ==========
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nombre: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  token: string;
  tipo: string;
  id: number;
  email: string;
  nombre: string;
  rol: "admin" | "user";
}

export interface ErrorResponse {
  mensaje: string;
  status: number;
}

// ========== FUNCIONES DE API ==========

/**
 * Registrar un nuevo usuario
 */
export async function registerUserApi(
  request: RegisterRequest
): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_AUTH_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.mensaje || "Error al registrar usuario");
    }

    // Guardar token en localStorage
    localStorage.setItem("authToken", data.token);
    localStorage.setItem(
      "currentUser",
      JSON.stringify({
        id: data.id,
        email: data.email,
        nombre: data.nombre,
        rol: data.rol,
      })
    );

    return data;
  } catch (error) {
    console.error("Error en registerUserApi:", error);
    throw error;
  }
}

/**
 * Iniciar sesión
 */
export async function loginUserApi(
  request: LoginRequest
): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_AUTH_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.mensaje || "Usuario o contraseña incorrectos");
    }

    // Guardar token en localStorage
    localStorage.setItem("authToken", data.token);
    localStorage.setItem(
      "currentUser",
      JSON.stringify({
        id: data.id,
        email: data.email,
        nombre: data.nombre,
        rol: data.rol,
      })
    );

    return data;
  } catch (error) {
    console.error("Error en loginUserApi:", error);
    throw error;
  }
}

/**
 * Validar token JWT
 */
export async function validateTokenApi(token: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_AUTH_URL}/validate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.ok;
  } catch (error) {
    console.error("Error en validateTokenApi:", error);
    return false;
  }
}

/**
 * Cerrar sesión
 */
export function logoutUser(): void {
  localStorage.removeItem("authToken");
  localStorage.removeItem("currentUser");
}

/**
 * Obtener token del localStorage
 */
export function getAuthToken(): string | null {
  return localStorage.getItem("authToken");
}

/**
 * Obtener headers de autenticación
 */
export function getAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}
