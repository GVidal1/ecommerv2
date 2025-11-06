import { ContactHero } from './components/ContactHero';
import { ContactInfo } from './components/ContactInfo';
import { ContactForm } from './components/ContactForm';
import './styles/Contact.css';

export function ContactPage() {
  return (
    <div className="contact-container">
      <ContactHero />

      <div className="container">
        <div className="contact-main">
          <ContactInfo />
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
