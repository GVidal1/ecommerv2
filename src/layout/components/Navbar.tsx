import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const getNavLinkStyle = ({ isActive }: { isActive: boolean }) => ({
    fontWeight: isActive ? 'bold' : 'normal',
    color: isActive ? 'dodgerblue' : 'black',
    textDecoration: 'none',
    margin: '0 10px',
  });

  return (
    <nav
      style={{
        padding: '1rem',
        backgroundColor: '#eee',
        borderBottom: '1px solid #ccc',
      }}>
      <NavLink to="/" style={getNavLinkStyle}>
        Home
      </NavLink>
      <NavLink to="/products" style={getNavLinkStyle}>
        Products
      </NavLink>
      <NavLink to="/about" style={getNavLinkStyle}>
        About
      </NavLink>
      <NavLink to="/blog" style={getNavLinkStyle}>
        Blog
      </NavLink>
      <NavLink to="/contact" style={getNavLinkStyle}>
        Contact
      </NavLink>
    </nav>
  );
};

export default Navbar;
