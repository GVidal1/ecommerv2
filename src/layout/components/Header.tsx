import { Link } from "react-router-dom";
import "./Header.css";

export function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-info">
          <span>📧 contacto@stylepoint.com</span>
          <span>📞 +56 9 1234 5678</span>
        </div>
        <div className="header-actions">
          <Link to="/cart" className="header-cart">
            🛒 Carrito (0)
          </Link>
        </div>
      </div>
    </header>
  );
}
