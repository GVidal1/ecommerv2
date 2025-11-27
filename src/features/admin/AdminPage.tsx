import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, UsersRound, Trash2 } from "lucide-react";

import {
  deleteUserApi,
  getAllUsersDetailedApi,
  type UserDetailDto,
  UnauthorizedError,
} from "../../services/userService";
import { logoutUser, getAuthToken } from "../../services/authService";
import {
  getCurrentUser,
  isAdmin,
  type CurrentUser,
} from "../auth/utils/authUtils";
import { AdminLayout } from "./components/Admin";
import { Dashboard } from "./components/Dashboard";
import "./styles/Admin.css";
import "./styles/Dashboard.css";

export function AdminPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserDetailDto[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  const loadUsers = useCallback(async () => {
    setIsLoadingUsers(true);

    // Verificar que el token existe antes de hacer la petición
    const token = getAuthToken();
    const currentUserData = getCurrentUser();

    console.log(" DEBUG AdminPage.loadUsers:");
    console.log("  - Token existe:", !!token);
    console.log("  - Usuario actual:", currentUserData);
    console.log("  - Es admin?:", isAdmin());

    if (!token) {
      alert("No hay sesión activa. Redirigiendo al inicio de sesión.");
      logoutUser();
      navigate("/", { replace: true });
      setIsLoadingUsers(false);
      return;
    }

    if (!currentUserData || !isAdmin()) {
      console.error("Usuario no es admin o no está autenticado");
      alert("No tienes permisos de administrador. Redirigiendo...");
      navigate("/", { replace: true });
      setIsLoadingUsers(false);
      return;
    }

    try {
      console.log("Intentando cargar usuarios desde la API...");
      const usersFromApi = await getAllUsersDetailedApi();
      console.log("Usuarios cargados exitosamente:", usersFromApi.length);
      setUsers(usersFromApi);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);

      // Detección del error 401 usando la clase de error personalizada
      const isUnauthorizedError =
        error instanceof UnauthorizedError ||
        error?.constructor?.name === "UnauthorizedError" ||
        (error instanceof Error && error.name === "UnauthorizedError");

      // Detección alternativa por mensaje de error
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      const isUnauthorized =
        isUnauthorizedError ||
        errorMessage.includes("401") ||
        errorMessage.includes("Unauthorized") ||
        errorMessage.toLowerCase().includes("unauthorized") ||
        errorMessage.includes("Token inválido") ||
        errorMessage.includes("Sesión expirada");

      if (isUnauthorized) {
        console.error("Error 401 detectado. Mensaje:", errorMessage);
        alert(
          `Error de autenticación: ${errorMessage}\n\nPor favor, inicia sesión nuevamente.`
        );
        logoutUser();
        navigate("/", { replace: true });
        setIsLoadingUsers(false);
        return;
      } else {
        console.error("Error desconocido:", errorMessage);
        alert(
          `Error al cargar usuarios: ${errorMessage}\n\nVerifica la conexión o los permisos.`
        );
      }
    } finally {
      setIsLoadingUsers(false);
    }
  }, [navigate]);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || !isAdmin()) {
      navigate("/", { replace: true });
      return;
    }
    setCurrentUser(user);
    void loadUsers();
  }, [navigate, loadUsers]);

  const removeUser = useCallback(async (id: number, email: string) => {
    const confirmed = window.confirm(
      `¿Eliminar usuario ${email}? Esta acción es irreversible.`
    );
    if (!confirmed) {
      return;
    }

    try {
      await deleteUserApi(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      alert("Usuario eliminado exitosamente");
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      const message =
        error instanceof Error ? error.message : "Error al eliminar el usuario";
      alert(message);
    }
  }, []);

  const handleLogout = useCallback(() => {
    logoutUser();
    navigate("/", { replace: true });
  }, [navigate]);

  const headerAvatar = useMemo(() => {
    if (!currentUser) return undefined;
    const nameOrEmail = currentUser.nombre || currentUser.email;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      nameOrEmail
    )}&background=2563eb&color=fff`;
  }, [currentUser]);

  const renderUsers = () => (
    <>
      <div className="admin-section-header">
        <h2>Gestión de Usuarios</h2>
        <p>Administra los usuarios del sistema desde la Base de Datos</p>
      </div>

      <div className="admin-card">
        {isLoadingUsers ? (
          <div className="text-center" style={{ padding: "2rem" }}>
            Cargando usuarios...
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Rol</th>
                <th>Fecha Registro</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="user-info">
                        <img
                          src={`https://ui-avatars.com/api/?name=${
                            user.nombre || "User"
                          }&background=2563eb&color=fff`}
                          alt={user.nombre || user.email}
                        />
                        <div>
                          <div className="user-name">
                            {user.nombre || "Sin nombre"}
                          </div>
                          <div className="user-email">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          user.rol === "admin" ? "badge-admin" : "badge-user"
                        }`}
                      >
                        {user.rol}
                      </span>
                    </td>
                    <td>
                      {new Date(user.createdAt).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </td>
                    <td className="td-actions">
                      <button
                        className="admin-btn admin-btn-danger"
                        onClick={() => removeUser(user.id, user.email)}
                      >
                        <Trash2 size={16} />
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center">
                    No hay usuarios registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </>
  );

  return (
    <AdminLayout defaultTab="dashboard">
      <AdminLayout.Sidebar>
        <AdminLayout.SidebarHeader title="Panel Admin" />
        <AdminLayout.SidebarNav>
          <AdminLayout.NavItem
            id="dashboard"
            icon={<LayoutDashboard size={18} />}
            label="Dashboard"
          />
          <AdminLayout.NavItem
            id="users"
            icon={<UsersRound size={18} />}
            label="Usuarios"
          />
        </AdminLayout.SidebarNav>
      </AdminLayout.Sidebar>

      <AdminLayout.Header>
        <AdminLayout.HeaderLeft breadcrumb="Panel de Administración" />
        <AdminLayout.HeaderRight
          userName={currentUser?.nombre}
          userAvatar={headerAvatar}
          onLogout={handleLogout}
        />
      </AdminLayout.Header>

      <AdminLayout.Main>
        <AdminLayout.Content id="dashboard">
          <Dashboard />
        </AdminLayout.Content>
        <AdminLayout.Content id="users">{renderUsers()}</AdminLayout.Content>
      </AdminLayout.Main>
    </AdminLayout>
  );
}
