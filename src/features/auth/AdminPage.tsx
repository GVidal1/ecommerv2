import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Users,
  Menu,
  X,
  Edit2,
  Trash2,
  Shield,
} from "lucide-react";
import { getCurrentUser, isAdmin } from "../auth/utils/authUtils";
import "../auth/styles/Admin.css";
interface User {
  email: string;
  password: string;
  nombre: string;
  rol: "admin" | "user";
  createdAt?: string;
}

interface CurrentUser {
  email: string;
  nombre: string;
  rol: "admin" | "user";
}

interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  description?: string;
  thumbnail?: string;
  images?: string[];
  stock?: number;
}

const CATEGORIES = [
  "Camisetas",
  "Pantalones",
  "Zapatos",
  "Accesorios",
  "Chaquetas",
  "Vestidos",
  "Otros",
];

export const AdminPage = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Users state
  const [users, setUsers] = useState<User[]>([]);

  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    category: "",
    description: "",
    thumbnail: "",
    stock: "",
  });

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || !isAdmin()) {
      navigate("/");
      return;
    }
    setCurrentUser(user);
    loadUsers();
    loadProducts();
  }, [navigate]);

  const loadUsers = () => {
    const stored = localStorage.getItem("users");
    if (stored) {
      setUsers(JSON.parse(stored));
    }
  };

  const loadProducts = () => {
    const stored = localStorage.getItem("products");
    if (stored) {
      setProducts(JSON.parse(stored));
    } else {
      setProducts([]);
    }
  };

  const removeUser = (email: string) => {
    if (window.confirm(`¿Eliminar usuario ${email}?`)) {
      const updatedUsers = users.filter((u) => u.email !== email);
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setSelectedImage("");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      price: "",
      category: "",
      description: "",
      thumbnail: "",
      stock: "",
    });
    setEditingProduct(null);
    setSelectedImage("");
  };

  const handleSubmitProduct = (e: React.FormEvent) => {
    e.preventDefault();

    const { title, price, category, description, thumbnail, stock } = formData;

    if (!title || !price || !category) return;

    const finalThumbnail = selectedImage || thumbnail || "";
    const finalImages = selectedImage
      ? [selectedImage]
      : thumbnail
      ? [thumbnail]
      : [];

    if (editingProduct) {
      const updatedProducts = products.map((p) =>
        p.id === editingProduct.id
          ? {
              ...p,
              title,
              price: parseFloat(price),
              category,
              description,
              thumbnail: finalThumbnail,
              images: finalImages,
              stock: stock ? parseInt(stock) : 0,
            }
          : p
      );
      localStorage.setItem("products", JSON.stringify(updatedProducts));
      setProducts(updatedProducts);
    } else {
      const newId =
        products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
      const newProduct: Product = {
        id: newId,
        title,
        price: parseFloat(price),
        category,
        description,
        thumbnail: finalThumbnail,
        images: finalImages,
        stock: stock ? parseInt(stock) : 0,
      };
      const updatedProducts = [...products, newProduct];
      localStorage.setItem("products", JSON.stringify(updatedProducts));
      setProducts(updatedProducts);
    }

    resetForm();
  };

  const editProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      price: product.price.toString(),
      category: product.category,
      description: product.description || "",
      thumbnail: product.thumbnail || "",
      stock: product.stock?.toString() || "",
    });
    setSelectedImage(product.thumbnail || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const removeProduct = (id: number) => {
    if (window.confirm(`¿Eliminar producto ${id}?`)) {
      const updatedProducts = products.filter((p) => p.id !== id);
      localStorage.setItem("products", JSON.stringify(updatedProducts));
      setProducts(updatedProducts);
    }
  };

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

  const renderDashboard = () => {
    const totalUsers = users.length;
    const totalProducts = products.length;
    const totalValue = products.reduce((sum, p) => sum + p.price, 0);

    return (
      <>
        <div className="admin-section-header">
          <h2>Dashboard</h2>
          <p>Resumen general del sistema</p>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon users">
              <Users size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{totalUsers}</span>
              <span className="stat-label">Usuarios</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon products">
              <Package size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{totalProducts}</span>
              <span className="stat-label">Productos</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon value">
              <Shield size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">${totalValue.toFixed(2)}</span>
              <span className="stat-label">Valor Total</span>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderUsers = () => (
    <>
      <div className="admin-section-header">
        <h2>Gestión de Usuarios</h2>
        <p>Administra los usuarios del sistema</p>
      </div>

      <div className="admin-card">
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
                <tr key={user.email}>
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
                  <td>{user.rol || "usuario"}</td>
                  <td>
                    {new Date(
                      user.createdAt || Date.now()
                    ).toLocaleDateString()}
                  </td>
                  <td className="td-actions">
                    <button
                      className="admin-btn admin-btn-danger"
                      onClick={() => removeUser(user.email)}
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
        <div className="admin-form">
          <h3>{editingProduct ? "Editar Producto" : "Añadir Producto"}</h3>
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
                  required
                >
                  <option value="" disabled>
                    Selecciona una categoría
                  </option>
                  {CATEGORIES.map((cat) => (
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
                  onClick={resetForm}
                >
                  Cancelar
                </button>
              )}
              <button type="submit" className="admin-btn admin-btn-primary">
                {editingProduct ? "Guardar" : "Agregar"}
              </button>
            </div>
          </form>
        </div>

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
                            "https://via.placeholder.com/50"
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
                    <td>{product.stock || "N/A"}</td>
                    <td className="td-actions">
                      <button
                        className="admin-btn admin-btn-secondary"
                        onClick={() => editProduct(product)}
                      >
                        <Edit2 size={16} />
                        Editar
                      </button>
                      <button
                        className="admin-btn admin-btn-danger"
                        onClick={() => removeProduct(product.id)}
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

  if (!currentUser) return null;

  return (
    <div className="container-admin">
      <aside className={`admin-sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="admin-logo">
          <Shield size={32} />
          <h1>Admin Panel</h1>
        </div>
        <nav className="admin-nav">
          <button
            className={activeTab === "dashboard" ? "active" : ""}
            onClick={() => {
              setActiveTab("dashboard");
              setIsSidebarOpen(false);
            }}
          >
            <LayoutDashboard size={20} />
            Dashboard
          </button>
          <button
            className={activeTab === "products" ? "active" : ""}
            onClick={() => {
              setActiveTab("products");
              setIsSidebarOpen(false);
            }}
          >
            <Package size={20} />
            Productos
          </button>
          <button
            className={activeTab === "users" ? "active" : ""}
            onClick={() => {
              setActiveTab("users");
              setIsSidebarOpen(false);
            }}
          >
            <Users size={20} />
            Usuarios
          </button>
        </nav>
      </aside>

      <header className="admin-header">
        <div className="admin-header-left">
          <button
            className="admin-btn admin-btn-secondary"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="breadcrumb">Panel de Administración</div>
        </div>
        <div className="admin-header-right">
          <div className="admin-user-info">
            <img
              src={`https://ui-avatars.com/api/?name=${currentUser.nombre}&background=2563eb&color=fff`}
              alt={currentUser.nombre}
            />
            <span>{currentUser.nombre}</span>
          </div>
          <button
            className="admin-btn admin-btn-secondary"
            onClick={() => navigate("/")}
          >
            Salir
          </button>
        </div>
      </header>

      <main className="admin-main">
        <div id="admin-content">
          {activeTab === "dashboard" && renderDashboard()}
          {activeTab === "users" && renderUsers()}
          {activeTab === "products" && renderProducts()}
        </div>
      </main>
    </div>
  );
};
