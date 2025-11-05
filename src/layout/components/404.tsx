import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div className="notFound">
    <h2>404 - Página No Encontrada</h2>
    <p>Lo sentimos, la página que buscas no existe.</p>
    <Link to="/">Volver al Home</Link>
  </div>
);

export default NotFoundPage;
