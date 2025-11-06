import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/atoms/Button/Button';
import '../styles/404.css';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">Página no encontrada</h2>
        <p className="not-found-text">
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>
        <div className="not-found-actions">
          <Button onClick={() => navigate('/')}>Ir al inicio</Button>
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Volver atrás
          </Button>
        </div>
      </div>
    </div>
  );
}
