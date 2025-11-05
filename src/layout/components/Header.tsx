import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
// Iconos
import { Menu, X, User, ShoppingCart } from 'lucide-react';

//Context
import { useAppContext } from '../../hooks/useAppContext';

// --- Componentes Placeholder (para el perfil y carrito) ---
// Deberías reemplazarlos con tus componentes reales cuando los crees.
const ProfileMenu = () => {
  return (
    <div style={{ padding: '0 10px', cursor: 'pointer' }}>
      {/* 2. Ícono de Usuario */}
      <User size={24} />
    </div>
  );
};

const CartIcon = () => {
  const { getTotalProductsInCart } = useAppContext(); // Ejemplo de uso
  const totalItems = getTotalProductsInCart();

  return (
    <div style={{ padding: '0 10px', cursor: 'pointer', position: 'relative' }}>
      {/* 3. Ícono de Carrito */}
      <ShoppingCart size={24} />
      {totalItems > 0 && (
        <span
          style={{
            position: 'absolute',
            top: -5,
            right: 0,
            background: 'red',
            color: 'white',
            borderRadius: '50%',
            padding: '2px 5px',
            fontSize: '10px',
          }}>
          {totalItems}
        </span>
      )}
    </div>
  );
};

export const Header = () => {
  // Logica  para manejar el menú en mbile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="header">
      <div className="container">
        <div className="flex-container">
          {/* LOGO (usa Link de React Router) */}
          <Link to="/">
            <img
              height="48px"
              width="48px"
              className="logo"
              src="/assets/logo.png"
              alt="StylePoint Logo"
            />
          </Link>

          {/* BOTÓN DE MENÚ MÓVIL */}
          <button
            id="mobile-menu-btn"
            className="mobile-menu-btn"
            onClick={toggleMobileMenu}>
            {/*Íconos de Menú/Cerrar */}
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          {/* Pasamos clase para controlar la visibilidad*/}
          <Navbar className={isMobileMenuOpen ? 'navbar-mobile-open' : ''} />

          {/* MENU DE OPCIONES USUARIO Y CARRITO */}
          <div className="menu-opciones">
            <ProfileMenu />
            <CartIcon />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
