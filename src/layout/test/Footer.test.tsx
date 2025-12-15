import { render, screen } from '@testing-library/react';
import { Footer } from '../components/Footer';
import { MemoryRouter } from 'react-router-dom';
import { describe, test, expect } from 'vitest';

describe('<Footer />', () => {
  test('debe renderizar correctamente la información de la marca y el año actual', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    expect(screen.getByText('STYLEPOINT')).toBeInTheDocument();

    const currentYear = new Date().getFullYear();
    expect(
      screen.getByText(new RegExp(`© ${currentYear} StylePoint`, 'i'))
    ).toBeInTheDocument();
  });

  test('debe renderizar los enlaces de navegación internos correctamente', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    const links = [
      { text: 'Inicio', path: '/' },
      { text: 'Productos', path: '/products' },
      { text: 'Blog', path: '/blog' },
      { text: 'Acerca de', path: '/about' },
      { text: 'Contacto', path: '/contact' },
    ];

    links.forEach(({ text, path }) => {
      const linkElement = screen.getByRole('link', { name: text });
      expect(linkElement).toBeInTheDocument();
      expect(linkElement).toHaveAttribute('href', path);
    });
  });

  test('debe renderizar los iconos de métodos de pago', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    const paymentAlts = ['Visa', 'Mastercard', 'American Express', 'PayPal'];

    paymentAlts.forEach((alt) => {
      const img = screen.getByAltText(alt);
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src');
    });
  });

  test('debe renderizar los enlaces a redes sociales con seguridad (target_blank)', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    const socialLinks = [
      { label: 'Facebook', url: 'https://facebook.com' },
      { label: 'Instagram', url: 'https://instagram.com' },
      { label: 'Twitter', url: 'https://twitter.com' },
      { label: 'LinkedIn', url: 'https://linkedin.com' },
    ];

    socialLinks.forEach(({ label, url }) => {
      const linkElement = screen.getByLabelText(label);

      expect(linkElement).toBeInTheDocument();
      expect(linkElement).toHaveAttribute('href', url);
      expect(linkElement).toHaveAttribute('target', '_blank');
      expect(linkElement).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });
});
