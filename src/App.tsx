import { useState } from "react";
import { useAppContext } from "./hooks/useAppContext";
import { Login } from "./features/auth";
import { Blogs } from "./features/blogs";
import { Footer } from "./features/layout";

type Page = "login" | "blogs" | "home";

function App() {
  const { currentUser, isLoading, error } = useAppContext();
  const [currentPage, setCurrentPage] = useState<Page>("login");

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: "3rem" }}>
        <h2>Cargando...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "3rem", color: "red" }}>
        <h2>Error: {error}</h2>
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case "login":
        return <Login />;
      case "blogs":
        return <Blogs />;
      case "home":
        return (
          <div style={{ padding: "3rem", textAlign: "center" }}>
            <h1>Bienvenido a StylePoint</h1>
            {currentUser && <p>Usuario: {currentUser.nombre}</p>}
          </div>
        );
      default:
        return <Login />;
    }
  };

  return (
    <>
      {/* Simple Navigation */}
      <nav
        style={{
          padding: "1rem 2rem",
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          gap: "1rem",
        }}
      >
        <button onClick={() => setCurrentPage("login")}>Login</button>
        <button onClick={() => setCurrentPage("home")}>Home</button>
        <button onClick={() => setCurrentPage("blogs")}>Blogs</button>
      </nav>

      {/* Page Content */}
      <main style={{ flex: 1 }}>{renderPage()}</main>

      {/* Footer */}
      <Footer />
    </>
  );
}

export default App;
