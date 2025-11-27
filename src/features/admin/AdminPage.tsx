import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  UsersRound,
  Trash2,
  Package,
  Edit2,
  Shield,
} from 'lucide-react';

// Servicios y Contexto
import {
  deleteUserApi,
  getAllUsersDetailedApi,
  type UserDetailDto,
  UnauthorizedError,
} from '../../services/userService';
import {
  createProductApi,
  updateProductApi,
  deleteProductApi,
} from '../../services/api'; // Asegúrate de importar esto
import { logoutUser, getAuthToken } from '../../services/authService';
import {
  getCurrentUser,
  isAdmin,
  type CurrentUser,
} from '../auth/utils/authUtils';
import { useAppContext } from '../../hooks/useAppContext';
import listOfCategories from '../../constants/listOfCategories'; // Asegúrate de importar esto

// Componentes
import { AdminLayout } from './components/Admin';
import { Dashboard } from './components/Dashboard';
import './styles/Admin.css';
import './styles/Dashboard.css';

// Interfaz para el formulario de productos
interface ProductForm {
  id?: number;
  title: string;
  price: number;
  category: string;
  description?: string;
  thumbnail?: string;
  images?: string[];
  stock?: number;
}

export function AdminPage() {
  const navigate = useNavigate();

  // Contexto global (para productos)
  const { products, addProduct, updateProductById, removeProductById } =
    useAppContext();

  // Estado de Usuarios (Lógica del código ACTUAL)
  const [users, setUsers] = useState<UserDetailDto[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  // Estado de Productos (Recuperado del código ANTERIOR)
  const [editingProduct, setEditingProduct] = useState<ProductForm | null>(
    null
  );
  const [selectedImage, setSelectedImage] = useState('');
  const [isLoadingAction, setIsLoadingAction] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: '',
    description: '',
    thumbnail: '',
    stock: '',
  });

  // ==========================================
  // 1. LOGICA DE CARGA INICIAL Y USUARIOS
  // ==========================================

  const loadUsers = useCallback(async () => {
    setIsLoadingUsers(true);
    const token = getAuthToken();
    const currentUserData = getCurrentUser();

    if (!token) {
      alert('No hay sesión activa. Redirigiendo al inicio de sesión.');
      logoutUser();
      navigate('/', { replace: true });
      setIsLoadingUsers(false);
      return;
    }

    if (!currentUserData || !isAdmin()) {
      alert('No tienes permisos de administrador. Redirigiendo...');
      navigate('/', { replace: true });
      setIsLoadingUsers(false);
      return;
    }

    try {
      const usersFromApi = await getAllUsersDetailedApi();
      setUsers(usersFromApi);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      // ... (Manejo de errores original mantenido simplificado para brevedad)
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      if (
        errorMessage.includes('401') ||
        errorMessage.includes('Unauthorized')
      ) {
        logoutUser();
        navigate('/', { replace: true });
      }
    } finally {
      setIsLoadingUsers(false);
    }
  }, [navigate]);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || !isAdmin()) {
      navigate('/', { replace: true });
      return;
    }
    setCurrentUser(user);
    void loadUsers();
  }, [navigate, loadUsers]);

  const removeUser = useCallback(async (id: number, email: string) => {
    const confirmed = window.confirm(
      `¿Eliminar usuario ${email}? Esta acción es irreversible.`
    );
    if (!confirmed) return;

    try {
      await deleteUserApi(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      alert('Usuario eliminado exitosamente');
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      alert('Error al eliminar el usuario');
    }
  }, []);

  // ==========================================
  // 2. LOGICA DE PRODUCTOS (RECUPERADA)
  // ==========================================

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setSelectedImage('');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const resetProductForm = () => {
    setFormData({
      title: '',
      price: '',
      category: '',
      description: '',
      thumbnail: '',
      stock: '',
    });
    setEditingProduct(null);
    setSelectedImage('');
  };

  const editProduct = (product: any) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      price: product.price.toString(),
      category: product.category,
      description: product.description || '',
      thumbnail: product.thumbnail || '',
      stock: product.stock?.toString() || '',
    });
    setSelectedImage(product.thumbnail || '');
    // Scroll al formulario si es necesario, o manejarlo con UI
    const formElement = document.querySelector('.admin-form');
    if (formElement) formElement.scrollIntoView({ behavior: 'smooth' });
  };

  const removeProduct = async (id: number) => {
    if (
      window.confirm(`¿Eliminar producto ${id}? Esta acción es irreversible.`)
    ) {
      try {
        await deleteProductApi(id);
        removeProductById(id);
      } catch (error) {
        console.error(error);
        alert('Error al eliminar el producto.');
      }
    }
  };

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const { title, price, category, description, thumbnail, stock } = formData;

    if (!title || !price || !category) return;

    setIsLoadingAction(true);

    const finalThumbnail = selectedImage || thumbnail || '';
    const finalImages = selectedImage
      ? [selectedImage]
      : thumbnail
      ? [thumbnail]
      : [];

    const productPayload = {
      title,
      price: parseFloat(price),
      category,
      description,
      thumbnail: finalThumbnail,
      images: finalImages,
      stock: stock ? parseInt(stock) : 0,
      rating: 0,
      discountPercentage: 0,
    };

    try {
      if (editingProduct && editingProduct.id) {
        const updatedProduct = await updateProductApi(
          editingProduct.id,
          productPayload
        );
        updateProductById(editingProduct.id, updatedProduct);
        alert('Producto actualizado');
      } else {
        const newProduct = await createProductApi(productPayload);
        addProduct(newProduct);
        alert('Producto creado');
      }
      resetProductForm();
    } catch (error) {
      console.error(error);
      alert('Ocurrió un error al guardar el producto');
    } finally {
      setIsLoadingAction(false);
    }
  };

  // ==========================================
  // 3. NAVEGACIÓN Y HEADER
  // ==========================================

  // MODIFICADO: Solo navega a home, NO cierra sesión (logoutUser)
  const handleExit = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const headerAvatar = useMemo(() => {
    if (!currentUser) return undefined;
    const nameOrEmail = currentUser.nombre || currentUser.email;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      nameOrEmail
    )}&background=2563eb&color=fff`;
  }, [currentUser]);

  // ==========================================
  // 4. RENDERIZADORES
  // ==========================================

  const renderUsers = () => (
    <>
      <div className="admin-section-header">
        <h2>Gestión de Usuarios</h2>
        <p>Administra los usuarios del sistema desde la Base de Datos</p>
      </div>

      <div className="admin-card">
        {isLoadingUsers ? (
          <div className="text-center" style={{ padding: '2rem' }}>
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
                            user.nombre || 'User'
                          }&background=2563eb&color=fff`}
                          alt={user.nombre || user.email}
                        />
                        <div>
                          <div className="user-name">
                            {user.nombre || 'Sin nombre'}
                          </div>
                          <div className="user-email">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          user.rol === 'admin' ? 'badge-admin' : 'badge-user'
                        }`}>
                        {user.rol}
                      </span>
                    </td>
                    <td>
                      {new Date(user.createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="td-actions">
                      <button
                        className="admin-btn admin-btn-danger"
                        onClick={() => removeUser(user.id, user.email)}>
                        <Trash2 size={16} /> Eliminar
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

  const renderProducts = () => (
    <>
      <div className="admin-section-header">
        <h2>Gestión de Productos</h2>
        <p>Administra el catálogo de productos</p>
      </div>

      <div className="admin-grid">
        {/* Formulario de Productos */}
        <div className="admin-form">
          <h3>{editingProduct ? 'Editar Producto' : 'Añadir Producto'}</h3>
          <form onSubmit={handleSubmitProduct}>
            <div className="grid">
              <label>
                <span>Título del Producto</span>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Ej: Camiseta Casual"
                  required
                />
              </label>
              <label>
                <span>Precio</span>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  required
                />
              </label>
              <label>
                <span>Categoría</span>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required>
                  <option value="" disabled>
                    Selecciona una categoría
                  </option>
                  {listOfCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>Stock</span>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                />
              </label>
              <label className="full">
                <span>Descripción</span>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe el producto..."
                  rows={3}
                />
              </label>
              <label>
                <span>URL de Imagen</span>
                <input
                  type="url"
                  name="thumbnail"
                  value={formData.thumbnail}
                  onChange={handleInputChange}
                  placeholder="https://..."
                />
              </label>
              <label>
                <span>Subir Imagen</span>
                <input
                  type="file"
                  accept="image/*"
                  className="file-input"
                  onChange={handleImageUpload}
                />
              </label>
            </div>

            {selectedImage && (
              <div className="image-preview-wrap">
                <img
                  src={selectedImage}
                  alt="Preview"
                  className="image-preview"
                />
              </div>
            )}

            <div className="form-actions">
              {editingProduct && (
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={resetProductForm}>
                  Cancelar
                </button>
              )}
              <button
                type="submit"
                className="admin-btn admin-btn-primary"
                disabled={isLoadingAction}>
                {isLoadingAction
                  ? 'Procesando...'
                  : editingProduct
                  ? 'Guardar Cambios'
                  : 'Agregar Producto'}
              </button>
            </div>
          </form>
        </div>

        {/* Tabla de Productos */}
        <div className="admin-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className="product-info">
                        <img
                          src={
                            product.thumbnail ||
                            'https://via.placeholder.com/50'
                          }
                          alt={product.title}
                        />
                        <div>
                          <div className="product-title">{product.title}</div>
                          <div className="product-category">
                            {product.category}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>${Number(product.price).toFixed(2)}</td>
                    <td>{product.stock || 'N/A'}</td>
                    <td className="td-actions">
                      <button
                        className="admin-btn admin-btn-secondary"
                        onClick={() => editProduct(product)}>
                        <Edit2 size={16} />
                      </button>
                      <button
                        className="admin-btn admin-btn-danger"
                        onClick={() => removeProduct(product.id)}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center">
                    No hay productos registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  return (
    <AdminLayout defaultTab="dashboard">
      <AdminLayout.Sidebar>
        <AdminLayout.SidebarHeader
          title="Panel Admin"
          icon={<Shield size={32} />}
        />
        <AdminLayout.SidebarNav>
          <AdminLayout.NavItem
            id="dashboard"
            icon={<LayoutDashboard size={18} />}
            label="Dashboard"
          />
          <AdminLayout.NavItem
            id="products"
            icon={<Package size={18} />}
            label="Productos"
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
          onLogout={handleExit} // Usamos handleExit que no cierra sesión
        />
      </AdminLayout.Header>

      <AdminLayout.Main>
        <AdminLayout.Content id="dashboard">
          <Dashboard />
        </AdminLayout.Content>
        <AdminLayout.Content id="products">
          {renderProducts()}
        </AdminLayout.Content>
        <AdminLayout.Content id="users">{renderUsers()}</AdminLayout.Content>
      </AdminLayout.Main>
    </AdminLayout>
  );
}
