import { NavLink } from 'react-router-dom';

interface NavbarProps {
  isMobileMenuOpen: boolean;
  closeMobileMenu: () => void;
}

export const Navbar = ({ isMobileMenuOpen, closeMobileMenu }: NavbarProps) => {
  const getNavLinkStyle = ({ isActive }: { isActive: boolean }) => ({
    fontWeight: isActive ? 'bold' : 'normal',
    color: isActive ? 'var(--color-primario)' : undefined,
  });

  return (
    <nav className={`navbar ${isMobileMenuOpen ? 'show' : ''}`}>
      <NavLink to="/" style={getNavLinkStyle} onClick={closeMobileMenu}>
        Inicio
      </NavLink>
      <NavLink to="/products" style={getNavLinkStyle} onClick={closeMobileMenu}>
        Productos
      </NavLink>
      <NavLink to="/about" style={getNavLinkStyle} onClick={closeMobileMenu}>
        Nosotros
      </NavLink>
      <NavLink to="/blog" style={getNavLinkStyle} onClick={closeMobileMenu}>
        Blog
      </NavLink>
      <NavLink to="/contact" style={getNavLinkStyle} onClick={closeMobileMenu}>
        Contacto
      </NavLink>
    </nav>
  );
};
