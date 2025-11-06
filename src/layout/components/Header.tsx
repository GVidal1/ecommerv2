import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CartIcon } from '../../features/cart/components/CartIcon';
import { Navbar } from './Navbar';
// Iconos
import { Menu, X, User } from 'lucide-react';

//Componentes temporales de prueba
const ProfileMenu = () => {
  return (
    <div style={{ padding: '0 10px', cursor: 'pointer' }}>
      {/* icono de Usuario */}
      <User size={24} />
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
          {/* LOGO */}
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
          {/* BARRA DE NAVEGACION CON LAS PAGES DE LA APP */}
          <Navbar />

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
