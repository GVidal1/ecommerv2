// MVV Section
export function MVVSection() {
  const cards = [
    {
      type: "mission",
      icon: "flag",
      title: "Misión",
      content:
        "Brindar a nuestros clientes productos de moda accesibles, de calidad y con diseños actuales, garantizando una experiencia de compra confiable, cercana y satisfactoria.",
    },
    {
      type: "vision",
      icon: "visibility",
      title: "Visión",
      content:
        "Convertirnos en una marca reconocida en el mercado nacional por la innovación, la autenticidad y la excelencia en moda y accesorios, expandiendo nuestra presencia tanto física como digital.",
    },
    {
      type: "values",
      icon: "diamond",
      title: "Valores",
      values: [
        {
          name: "Calidad",
          description: "Seleccionamos cuidadosamente cada prenda y accesorio.",
        },
        {
          name: "Confianza",
          description: "Construimos relaciones sólidas con nuestros clientes.",
        },
        {
          name: "Innovación",
          description: "Buscamos siempre nuevas tendencias y estilos.",
        },
        {
          name: "Compromiso",
          description: "Trabajamos con dedicación para superar expectativas.",
        },
        {
          name: "Pasión",
          description: "Amamos lo que hacemos y lo reflejamos en cada detalle.",
        },
      ],
    },
  ];

  return (
    <section className="mvv-section">
      <div className="mvv-grid">
        {cards.map((card) => (
          <div key={card.type} className={`mvv-card ${card.type}`}>
            <div className="mvv-icon">
              <span className="material-symbols-outlined">{card.icon}</span>
            </div>
            <h3>{card.title}</h3>
            {card.content ? (
              <p>{card.content}</p>
            ) : (
              <ul>
                {card.values?.map((value, idx) => (
                  <li key={idx}>
                    <strong>{value.name}:</strong> {value.description}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
