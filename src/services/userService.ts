// src/services/usersService.ts

import { API_USERS_URL } from "../constants/apiLinks";

// ========== INTERFACES ==========

export interface UserListDto {
  id: number;
  nombre: string;
  rol: "admin" | "user";
}

export interface UserDetailDto {
  id: number;
  nombre: string;
  email: string;
  rol: "admin" | "user";
  createdAt: string;
}

export interface UserResponse {
  id: number;
  nombre: string;
  email: string;
  rol: "admin" | "user";
  createdAt: string;
}

// ========== ERROR PERSONALIZADO ==========

export class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnauthorizedError";
  }
}

// ========== FUNCIONES DE API ==========

function getAuthHeadersWithBearer(): HeadersInit {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new UnauthorizedError("No hay token de autenticación");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function getAllUsersApi(): Promise<UserListDto[]> {
  try {
    const response = await fetch(`${API_USERS_URL}`, {
      method: "GET",
      headers: getAuthHeadersWithBearer(),
    });

    if (response.status === 401) {
      throw new UnauthorizedError("Sesión expirada o token inválido");
    }

    if (!response.ok) {
      throw new Error("Error al obtener usuarios");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en getAllUsersApi:", error);
    throw error;
  }
}

export async function getAllUsersDetailedApi(): Promise<UserDetailDto[]> {
  try {
    const token = localStorage.getItem("authToken");

    if (!token) {
      throw new UnauthorizedError("No hay token de autenticación");
    }

    if (token.trim() === "") {
      throw new UnauthorizedError("Token vacío");
    }

    console.log("  - Token existe:", !!token);
    console.log("  - Longitud del token:", token.length);
    console.log(
      "  - Primeros 20 caracteres del token:",
      token.substring(0, 20) + "..."
    );

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    console.log(
      "  - Header Authorization construido:",
      headers.Authorization
        ? `Bearer ${token.substring(0, 20)}...`
        : "NO CONSTRUIDO"
    );
    console.log("  - URL de la petición:", `${API_USERS_URL}/detailed`);

    const response = await fetch(`${API_USERS_URL}/detailed`, {
      method: "GET",
      headers,
    });

    console.log("  - Response status:", response.status);
    console.log("  - Response ok:", response.ok);

    if (response.status === 401) {
      let errorMessage = "Sesión expirada o token inválido";
      let errorData: any = null;
      try {
        const responseText = await response.text();
        console.log("  - Response body (text):", responseText);
        if (responseText) {
          errorData = JSON.parse(responseText);
          errorMessage = errorData.mensaje || errorData.message || errorMessage;
        }
        console.log("  - Mensaje de error del backend:", errorMessage);
      } catch (e) {
        console.log("  - No se pudo parsear el error del backend:", e);
      }
      throw new UnauthorizedError(errorMessage);
    }

    if (!response.ok) {
      let errorMessage = `Error HTTP: ${response.status}`;
      try {
        const responseText = await response.text();
        if (responseText) {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.mensaje || errorData.message || errorMessage;
        }
      } catch {}
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log("  - Datos recibidos correctamente");
    return data;
  } catch (error) {
    console.error("Error en getAllUsersDetailedApi:", error);
    throw error;
  }
}

export async function getUserByIdApi(id: number): Promise<UserResponse> {
  try {
    const response = await fetch(`${API_USERS_URL}/${id}`, {
      method: "GET",
      headers: getAuthHeadersWithBearer(),
    });

    if (response.status === 401) {
      throw new UnauthorizedError("Sesión expirada o token inválido");
    }

    if (!response.ok) {
      throw new Error("Usuario no encontrado");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en getUserByIdApi:", error);
    throw error;
  }
}

export async function searchUsersApi(query: string): Promise<UserDetailDto[]> {
  try {
    const response = await fetch(
      `${API_USERS_URL}/search?query=${encodeURIComponent(query)}`,
      {
        method: "GET",
        headers: getAuthHeadersWithBearer(),
      }
    );

    if (response.status === 401) {
      throw new UnauthorizedError("Sesión expirada o token inválido");
    }

    if (!response.ok) {
      throw new Error("Error al buscar usuarios");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en searchUsersApi:", error);
    throw error;
  }
}

export async function getUsersByRoleApi(
  role: "admin" | "user"
): Promise<UserDetailDto[]> {
  try {
    const response = await fetch(`${API_USERS_URL}/by-role?role=${role}`, {
      method: "GET",
      headers: getAuthHeadersWithBearer(),
    });

    if (response.status === 401) {
      throw new UnauthorizedError("Sesión expirada o token inválido");
    }

    if (!response.ok) {
      throw new Error("Error al filtrar usuarios por rol");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en getUsersByRoleApi:", error);
    throw error;
  }
}

export async function updateUserRoleApi(
  id: number,
  newRole: "admin" | "user"
): Promise<UserResponse> {
  try {
    const response = await fetch(`${API_USERS_URL}/${id}/role`, {
      method: "PUT",
      headers: getAuthHeadersWithBearer(),
      body: JSON.stringify({ rol: newRole }),
    });

    if (response.status === 401) {
      throw new UnauthorizedError("Sesión expirada o token inválido");
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.mensaje || "Error al actualizar rol");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en updateUserRoleApi:", error);
    throw error;
  }
}

export async function deleteUserApi(id: number): Promise<void> {
  try {
    const response = await fetch(`${API_USERS_URL}/${id}`, {
      method: "DELETE",
      headers: getAuthHeadersWithBearer(),
    });

    if (response.status === 401) {
      throw new UnauthorizedError("Sesión expirada o token inválido");
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.mensaje || "Error al eliminar usuario");
    }
  } catch (error) {
    console.error("Error en deleteUserApi:", error);
    throw error;
  }
}
