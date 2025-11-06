import type { ElementType, ReactNode } from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

interface ContactCard {
  icon: ElementType;
  title: string;
  content: ReactNode;
  className?: string;
}

export function ContactInfo() {
  const contactCards: ContactCard[] = [
    {
      icon: MapPin,
      title: 'Ubicación',
      content: (
        <>
          Av. Principal 123
          <br />
          Santiago, Chile 666
        </>
      ),
    },
    {
      icon: Phone,
      title: 'Teléfono',
      content: (
        <>
          +56 9 1234 5678 <br />
          Lunes a Viernes 9:00 - 18:00
        </>
      ),
    },
    {
      icon: Mail,
      title: 'Email',
      content: (
        <>
          info@stylepoint.com
          <br />
          soporte@stylepoint.com
        </>
      ),
      className: 'email-contact',
    },
    {
      icon: Clock,
      title: 'Horarios',
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
      {contactCards.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <div key={index} className="contact-card">
            <div className="contact-icon">
              <IconComponent size={32} />
            </div>
            <h3>{card.title}</h3>
            <p className={card.className}>{card.content}</p>
          </div>
        );
      })}
    </div>
  );
}
