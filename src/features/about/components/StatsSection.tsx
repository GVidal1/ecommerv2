// Stats Section
export function StatsSection() {
  const stats = [
    { number: "500+", label: "Productos únicos" },
    { number: "1000+", label: "Clientes satisfechos" },
    { number: "3", label: "Años de experiencia" },
    { number: "24/7", label: "Soporte al cliente" },
  ];

  return (
    <section className="stats-section">
      <div className="stats-container">
        <h2>Números que nos respaldan</h2>
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
