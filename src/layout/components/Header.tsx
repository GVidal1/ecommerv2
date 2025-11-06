import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import { CartIcon } from '../../features/cart/components/CartIcon';
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
        </div>
      </div>
    </header>
  );
};
