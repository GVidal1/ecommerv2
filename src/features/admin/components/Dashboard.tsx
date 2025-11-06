import { useAppContext } from "../../../hooks/useAppContext";
import "./DashboardStyles.css";

export function Dashboard() {
  const { products, users } = useAppContext();

  const totalProducts = products.length;
  const totalUsers = users.length;
  const totalValue = products.reduce((sum, p) => sum + (p.price || 0), 0);

  return (
    <div className="dashboard-view">
      <div className="admin-section-header">
        <h2>Dashboard</h2>
        <p>Resumen general del sistema</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon users">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-value">{totalUsers}</span>
            <span className="stat-label">Usuarios</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon products">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M20 7L12 3L4 7M20 7L12 11M20 7V17L12 21M12 11L4 7M12 11V21M4 7V17L12 21"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-value">{totalProducts}</span>
            <span className="stat-label">Productos</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon value">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-value">${totalValue.toFixed(2)}</span>
            <span className="stat-label">Valor Total</span>
          </div>
        </div>
      </div>
    </div>
  );
}
