export function ContactInfo() {
  const contactCards = [
    {
      icon: "location_on",
      title: "Ubicación",
      content: (
        <>
          Av. Principal 123
          <br />
          Santiago, Chile 666
        </>
      ),
    },
    {
      icon: "phone",
      title: "Teléfono",
      content: (
        <>
          +56 9 1234 5678 <br />
          Lunes a Viernes 9:00 - 18:00
        </>
      ),
    },
    {
      icon: "email",
      title: "Email",
      content: (
        <>
          info@stylepoint.com
          <br />
          soporte@stylepoint.com
        </>
      ),
      className: "email-contact",
    },
    {
      icon: "schedule",
      title: "Horarios",
      content: (
        <>
          Lunes - Viernes: 9:00 - 18:00
          <br />
          Sábados: 10:00 - 16:00
        </>
      ),
    },
  ];

  return (
    <div className="contact-info">
      {contactCards.map((card, index) => (
        <div key={index} className="contact-card">
          <div className="contact-icon">
            <span className="material-symbols-outlined">{card.icon}</span>
          </div>
          <h3>{card.title}</h3>
          <p className={card.className}>{card.content}</p>
        </div>
      ))}
    </div>
  );
}
