import { Routes, Route } from "react-router-dom";

// Layout Principal
import MainLayout from "./layout/components/MainLayout";
// Pages
import HomePage from "./features/home/HomePage";
import NotFoundPage from "./layout/components/404";
import ProductsPage from "./features/products/ProductPage";
import ProductDetailPage from "./features/products/ProductDetailPage";
import CartPage from "./features/cart/CartPage";
import { AboutPage } from "./features/about/AboutPage";
import { BlogPage } from "./features/blogs/BlogPage";
import { ContactPage } from "./features/contact/ContactPage";
//AUTH
import { AdminPage } from "./features/auth/AdminPage";
import { ProtectedRoute } from "./features/auth/components/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Ruta protegida del Admin (sin Layout principal) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAdmin={true}>
            <AdminPage />
          </ProtectedRoute>
        }
      />
      {/* Layout Principal donde se renderiza el header - navbar y footer */}
      <Route path="/" element={<MainLayout />}>
        {/* La ruta "index" es la que se muestra por defecto en "/" */}
        <Route index element={<HomePage />} />

        {/* Rutas de la app */}
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/:id" element={<ProductDetailPage />} />

        <Route path="cart" element={<CartPage />} />

        <Route path="about" element={<AboutPage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="contact" element={<ContactPage />} />

        {/* Ruta  para 404 Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
