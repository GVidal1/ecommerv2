import { Link } from 'react-router-dom';
import '../styles/Footer.css';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container container">
        {/* Brand Section */}
        <div className="footer-brand">
          <h2>STYLEPOINT</h2>
          <p>
            Tu destino para las últimas tendencias en moda y estilo. Descubre
            nuestra colección exclusiva de productos de alta calidad.
          </p>
          <small>
            © {currentYear} StylePoint. Todos los derechos reservados.
          </small>
        </div>

        {/* Navigation Links */}
        <nav className="footer-nav">
          <h4>Navegación</h4>
          <ul>
            <li>
              <Link to="/">Inicio</Link>
            </li>
            <li>
              <Link to="/products">Productos</Link>
            </li>
            <li>
              <Link to="/blog">Blog</Link>
            </li>
            <li>
              <Link to="/about">Acerca de</Link>
            </li>
            <li>
              <Link to="/contact">Contacto</Link>
            </li>
          </ul>
        </nav>

        {/* Payment Methods */}
        <div className="footer-payments">
          <h4>Métodos de Pago</h4>
          <div className="payment-icons">
            <img
              src="https://cdn-icons-png.flaticon.com/512/349/349221.png"
              alt="Visa"
              loading="lazy"
            />
            <img
              src="https://cdn-icons-png.flaticon.com/512/349/349228.png"
              alt="Mastercard"
              loading="lazy"
            />
            <img
              src="https://cdn-icons-png.flaticon.com/512/349/349230.png"
              alt="American Express"
              loading="lazy"
            />
            <img
              src="https://cdn-icons-png.flaticon.com/512/888/888870.png"
              alt="PayPal"
              loading="lazy"
            />
          </div>
        </div>

        {/* Social Media */}
        <div className="footer-social">
          <h4>Síguenos</h4>
          <div className="social-icons">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook">
              <img
                src="https://cdn-icons-png.flaticon.com/512/733/733547.png"
                alt="Facebook"
                loading="lazy"
              />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram">
              <img
                src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png"
                alt="Instagram"
                loading="lazy"
              />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter">
              <img
                src="https://cdn-icons-png.flaticon.com/512/733/733579.png"
                alt="Twitter"
                loading="lazy"
              />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn">
              <img
                src="https://cdn-icons-png.flaticon.com/512/174/174857.png"
                alt="LinkedIn"
                loading="lazy"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
