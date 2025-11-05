import { ContactHero } from "./ContactHero";
import { ContactInfo } from "./ContactInfo";
import { ContactForm } from "./ContactForm";
import "../styles/Contact.css";

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
