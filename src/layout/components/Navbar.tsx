import { NavLink } from 'react-router-dom';

interface NavbarProps {
  className?: string;
}

const Navbar = ({ className = '' }: NavbarProps) => {
  const getNavLinkStyle = ({ isActive }: { isActive: boolean }) => ({
    fontWeight: isActive ? 'bold' : 'normal',
    color: isActive ? 'dodgerblue' : 'black',
    textDecoration: 'none',
    margin: '0 10px',
  });

  return (
    <nav className={`navbar ${className}`}>
      <NavLink to="/" style={getNavLinkStyle}>
        Home
      </NavLink>
      <NavLink to="/products" style={getNavLinkStyle}>
        Productos
      </NavLink>
      <NavLink to="/about" style={getNavLinkStyle}>
        Nosotros
      </NavLink>
      <NavLink to="/blog" style={getNavLinkStyle}>
        Blogs
      </NavLink>
      <NavLink to="/contact" style={getNavLinkStyle}>
        Contacto
      </NavLink>
    </nav>
  );
};

export default Navbar;
