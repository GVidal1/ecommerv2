import { Routes, Route } from "react-router-dom";

// Layout Principal
import MainLayout from "./layout/components/MainLayout";
// Pages
import { HomePage } from "./features/home/HomePage";
import NotFoundPage from "./layout/components/404";

function App() {
  return (
    <Routes>
      {/* Layout Principal donde se renderiza el header - navbar y footer */}
      <Route path="/" element={<MainLayout />}>
        {/* La ruta "index" es la que se muestra por defecto en "/" */}
        <Route index element={<HomePage />} />

        {/* Rutas de la app */}
        {/* <Route path="products" element={<ProductsPage />} />
        <Route path="products/:id" element={<ProductDetailPage />} /> {/* Ruta dinámica */}
        {/* <Route path="about" element={<AboutPage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="contact" element={<ContactPage />} />  */}

        {/* Ruta  para 404 Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
