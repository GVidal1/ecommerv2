import { Link } from 'react-router-dom';
import { ArrowBigRight } from 'lucide-react';
// CTA Section
export function CTASection() {
  return (
    <section className="cta-section">
      <div className="cta-content">
        <h2>¿Listo para encontrar tu estilo?</h2>
        <p>
          Explora nuestra colección y descubre piezas únicas que reflejen tu
          personalidad.
        </p>
        <Link to="/products" className="cta-button">
          <span>Ver Productos</span>
          <ArrowBigRight />
        </Link>
      </div>
    </section>
  );
}
