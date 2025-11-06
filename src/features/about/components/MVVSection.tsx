import type { ElementType } from 'react';
import { Flag, Eye, Diamond } from 'lucide-react';

interface MVVCard {
  type: string;
  icon: ElementType;
  title: string;
  content?: string;
  values?: {
    name: string;
    description: string;
  }[];
}

// MVV Section
export function MVVSection() {
  const cards: MVVCard[] = [
    {
      type: 'mission',
      icon: Flag,
      title: 'Misión',
      content:
        'Brindar a nuestros clientes productos de moda accesibles, de calidad y con diseños actuales, garantizando una experiencia de compra confiable, cercana y satisfactoria.',
    },
    {
      type: 'vision',
      icon: Eye,
      title: 'Visión',
      content:
        'Convertirnos en una marca reconocida en el mercado nacional por la innovación, la autenticidad y la excelencia en moda y accesorios, expandiendo nuestra presencia tanto física como digital.',
    },
    {
      type: 'values',
      icon: Diamond,
      title: 'Valores',
      values: [
        {
          name: 'Calidad',
          description: 'Seleccionamos cuidadosamente cada prenda y accesorio.',
        },
        {
          name: 'Confianza',
          description: 'Construimos relaciones sólidas con nuestros clientes.',
        },
        {
          name: 'Innovación',
          description: 'Buscamos siempre nuevas tendencias y estilos.',
        },
        {
          name: 'Compromiso',
          description: 'Trabajamos con dedicación para superar expectativas.',
        },
        {
          name: 'Pasión',
          description: 'Amamos lo que hacemos y lo reflejamos en cada detalle.',
        },
      ],
    },
  ];

  return (
    <section className="mvv-section">
      <div className="mvv-grid">
        {cards.map((card) => {
          const IconComponent = card.icon;
          return (
            <div key={card.type} className={`mvv-card ${card.type}`}>
              <div className="mvv-icon">
                <IconComponent size={32} />
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
          );
        })}
      </div>
    </section>
  );
}
