import { Link } from "react-router-dom";
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
          <span className="material-symbols-outlined">arrow_forward</span>
        </Link>
      </div>
    </section>
  );
}
