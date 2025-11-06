import { User2, Link } from 'lucide-react';

// Team Section
export function TeamSection() {
  const team = [
    { name: 'Gabriel Vidal', role: 'Fundador & CEO' },
    { name: 'Raúl Fernández', role: 'Co-Fundador & CTO' },
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
                <User2 />
              </div>
              <h4>{member.name}</h4>
              <p>{member.role}</p>
              <div className="team-social">
                <a href="#" className="social-link">
                  <Link />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
