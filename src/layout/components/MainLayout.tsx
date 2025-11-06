import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import "./MainLayout.css";

export default function MainLayout() {
  return (
    <div className="main-layout">
      <Header />
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
