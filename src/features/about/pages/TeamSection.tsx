// Team Section
export function TeamSection() {
  const team = [
    { name: "Gabriel Vidal", role: "Fundador & CEO" },
    { name: "Raúl Fernández", role: "Co-Fundador & CTO" },
  ];

  return (
    <section className="team-section">
      <div className="team-container">
        <h2>Nuestro Equipo</h2>
        <p>Conoce a las personas detrás de StylePoint</p>
        <div className="team-grid">
          {team.map((member, index) => (
            <div key={index} className="team-card">
              <div className="team-avatar">
                <span className="material-symbols-outlined">person</span>
              </div>
              <h4>{member.name}</h4>
              <p>{member.role}</p>
              <div className="team-social">
                <a href="#" className="social-link">
                  <span className="material-symbols-outlined">link</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
